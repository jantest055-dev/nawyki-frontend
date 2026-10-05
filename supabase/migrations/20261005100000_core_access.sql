-- =============================================================================
-- Nawyki Wojownika — migracja 1/2: fundamenty, profile, kody dostępu, uprawnienia
-- =============================================================================
-- Zasady obowiązujące w całym schemacie:
--   * RLS włączone na KAŻDEJ tabeli w schemacie public (sprawdzane na końcu migracji 2).
--   * Domyślnie brak dostępu: odbieramy role anon/authenticated wszystkie
--     uprawnienia i nadajemy wyłącznie to, czego klient potrzebuje.
--   * Funkcje SECURITY DEFINER mają pusty search_path i w pełni kwalifikowane nazwy.
--   * Dzień aplikacji = doba wg strefy Europe/Warsaw.
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;

-- Schemat "private" nie jest wystawiony przez API (PostgREST), trzymamy tu
-- funkcje wewnętrzne i triggery.
create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon, authenticated;

-- -----------------------------------------------------------------------------
-- Dzień wg czasu polskiego
-- -----------------------------------------------------------------------------
create or replace function public.current_day_pl()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'Europe/Warsaw')::date;
$$;

revoke execute on function public.current_day_pl() from public, anon;
grant execute on function public.current_day_pl() to authenticated, service_role;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text not null,
  created_at  timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,20}$')
);
create unique index profiles_username_key on public.profiles (username);

-- Profil zakładany automatycznie przy rejestracji. Nazwa użytkownika przychodzi
-- w metadanych rejestracji (options.data.username) i jest walidowana tutaj,
-- niezależnie od walidacji na froncie.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_username text := lower(btrim(coalesce(new.raw_user_meta_data ->> 'username', '')));
begin
  if v_username = '' then
    -- Konto utworzone bez nazwy (np. przez admina w panelu) — nazwa techniczna.
    v_username := 'wojownik_' || substr(replace(new.id::text, '-', ''), 1, 11);
  end if;

  if v_username !~ '^[a-z0-9_]{3,20}$' then
    raise exception 'invalid_username' using errcode = '22023';
  end if;

  -- unique_violation przerywa rejestrację (nazwa zajęta) — konto nie powstaje.
  insert into public.profiles (id, username) values (new.id, v_username);
  return new;
end;
$$;

revoke execute on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- -----------------------------------------------------------------------------
-- access_codes — kody jednorazowe, wyłącznie jako hash SHA-256 (hex)
-- -----------------------------------------------------------------------------
create table public.access_codes (
  id          uuid primary key default gen_random_uuid(),
  code_hash   text not null unique,
  -- on delete set null: po usunięciu konta kod NADAL jest wykorzystany
  -- (o wykorzystaniu decyduje used_at, nie used_by).
  used_by     uuid references auth.users (id) on delete set null,
  used_at     timestamptz,
  created_at  timestamptz not null default now(),
  constraint access_codes_hash_format check (code_hash ~ '^[0-9a-f]{64}$'),
  constraint access_codes_used_consistency check (used_by is null or used_at is not null)
);

-- -----------------------------------------------------------------------------
-- entitlements — okresy dostępu
-- -----------------------------------------------------------------------------
create table public.entitlements (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  starts_at   timestamptz not null default now(),
  expires_at  timestamptz not null,
  source      text not null,
  code_id     uuid unique references public.access_codes (id) on delete set null,
  created_at  timestamptz not null default now(),
  constraint entitlements_source check (source in ('code', 'admin')),
  constraint entitlements_period check (expires_at > starts_at)
);
create index entitlements_user_expires_idx on public.entitlements (user_id, expires_at desc);

-- -----------------------------------------------------------------------------
-- code_redemption_attempts — limit prób aktywacji
-- -----------------------------------------------------------------------------
create table public.code_redemption_attempts (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references auth.users (id) on delete cascade,
  attempted_at  timestamptz not null default now()
);
create index code_redemption_attempts_user_time_idx
  on public.code_redemption_attempts (user_id, attempted_at desc);

-- -----------------------------------------------------------------------------
-- has_active_access(uid)
-- -----------------------------------------------------------------------------
-- SECURITY INVOKER celowo: zapytanie przechodzi przez RLS tabeli entitlements,
-- więc zalogowany użytkownik może sprawdzić tylko SIEBIE (dla cudzego uid
-- zawsze false). service_role omija RLS, więc Edge Functions mogą sprawdzić
-- dowolnego użytkownika.
create or replace function public.has_active_access(uid uuid)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.entitlements e
    where e.user_id = uid
      and e.starts_at <= now()
      and e.expires_at > now()
  );
$$;

revoke execute on function public.has_active_access(uuid) from public, anon;
grant execute on function public.has_active_access(uuid) to authenticated, service_role;

-- -----------------------------------------------------------------------------
-- redeem_access_code — wywoływana WYŁĄCZNIE przez Edge Function "redeem-code"
-- (service_role). Całość wykonuje się w jednej transakcji.
-- Zwraca: {"status":"ok","expires_at":...} | {"status":"invalid"} | {"status":"rate_limited"}
-- -----------------------------------------------------------------------------
create or replace function public.redeem_access_code(p_user_id uuid, p_code_hash text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  c_max_attempts constant int := 5;
  v_attempts     int;
  v_code_id      uuid;
  v_starts_at    timestamptz;
  v_expires_at   timestamptz;
begin
  if p_user_id is null then
    raise exception 'p_user_id is required' using errcode = '22004';
  end if;

  -- Serializacja prób jednego użytkownika — równoległe żądania nie obejdą limitu.
  perform pg_advisory_xact_lock(hashtextextended('redeem:' || p_user_id::text, 0));

  select count(*) into v_attempts
  from public.code_redemption_attempts a
  where a.user_id = p_user_id
    and a.attempted_at > now() - interval '1 hour';

  if v_attempts >= c_max_attempts then
    return jsonb_build_object('status', 'rate_limited');
  end if;

  insert into public.code_redemption_attempts (user_id) values (p_user_id);

  -- Sprzątanie starych wpisów tego użytkownika.
  delete from public.code_redemption_attempts a
  where a.user_id = p_user_id
    and a.attempted_at < now() - interval '1 day';

  if p_code_hash is null or p_code_hash !~ '^[0-9a-f]{64}$' then
    return jsonb_build_object('status', 'invalid');
  end if;

  -- Atomowe "zajęcie" kodu: przy wyścigu dwóch żądań drugie po zwolnieniu
  -- blokady wiersza zobaczy used_at IS NOT NULL i nic nie zaktualizuje.
  update public.access_codes c
     set used_by = p_user_id,
         used_at = now()
   where c.code_hash = p_code_hash
     and c.used_at is null
  returning c.id into v_code_id;

  if v_code_id is null then
    -- Ten sam wynik dla "nie istnieje" i "już użyty".
    return jsonb_build_object('status', 'invalid');
  end if;

  -- 90 dni od aktywacji. Jeśli użytkownik ma jeszcze aktywny dostęp,
  -- nowy okres zaczyna się po zakończeniu obecnego (nie traci opłaconych dni).
  select greatest(now(), coalesce(max(e.expires_at), now()))
    into v_starts_at
  from public.entitlements e
  where e.user_id = p_user_id;

  v_expires_at := v_starts_at + interval '90 days';

  insert into public.entitlements (user_id, starts_at, expires_at, source, code_id)
  values (p_user_id, v_starts_at, v_expires_at, 'code', v_code_id);

  return jsonb_build_object('status', 'ok', 'starts_at', v_starts_at, 'expires_at', v_expires_at);
end;
$$;

revoke execute on function public.redeem_access_code(uuid, text) from public, anon, authenticated;
grant execute on function public.redeem_access_code(uuid, text) to service_role;

-- -----------------------------------------------------------------------------
-- Generowanie partii kodów (TYLKO admin, SQL Editor jako postgres).
-- Zwraca jawne kody JEDEN raz; do bazy trafia wyłącznie hash.
-- Alfabet: 32 znaki, bez 0/O/1/I. Kod: 12 znaków (60 bitów entropii),
-- wyświetlany jako XXXX-XXXX-XXXX. Hash liczony z 12 znaków bez myślników.
-- -----------------------------------------------------------------------------
create or replace function private.generate_access_codes(p_count int)
returns table (code text)
language plpgsql
volatile
set search_path = ''
as $$
declare
  c_alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_bytes    bytea;
  v_raw      text;
  i          int;
  j          int;
begin
  if p_count is null or p_count < 1 or p_count > 1000 then
    raise exception 'p_count must be between 1 and 1000';
  end if;

  for i in 1..p_count loop
    loop
      v_bytes := extensions.gen_random_bytes(12);
      v_raw := '';
      for j in 0..11 loop
        -- 256 jest wielokrotnością 32, więc modulo nie wprowadza obciążenia.
        v_raw := v_raw || substr(c_alphabet, (get_byte(v_bytes, j) % 32) + 1, 1);
      end loop;

      begin
        insert into public.access_codes (code_hash)
        values (encode(extensions.digest(v_raw, 'sha256'), 'hex'));
        exit;
      exception when unique_violation then
        -- Kolizja (praktycznie niemożliwa) — losujemy ponownie.
      end;
    end loop;

    code := substr(v_raw, 1, 4) || '-' || substr(v_raw, 5, 4) || '-' || substr(v_raw, 9, 4);
    return next;
  end loop;
end;
$$;

revoke execute on function private.generate_access_codes(int) from public, anon, authenticated, service_role;
