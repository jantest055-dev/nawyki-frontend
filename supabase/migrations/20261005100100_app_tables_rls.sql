-- =============================================================================
-- Nawyki Wojownika — migracja 2/2: tabele aplikacji, RLS, uprawnienia
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabele aplikacji
-- -----------------------------------------------------------------------------
create table public.task_completions (
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  task_key    text not null,
  day         date not null default public.current_day_pl(),
  created_at  timestamptz not null default now(),
  constraint task_completions_pkey primary key (user_id, task_key, day),
  constraint task_completions_key_format check (task_key ~ '^[a-z0-9_]{1,40}$')
);

create table public.lesson_completions (
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  lesson_number  int not null,
  completed_at   timestamptz not null default now(),
  constraint lesson_completions_pkey primary key (user_id, lesson_number),
  constraint lesson_completions_number_range check (lesson_number between 1 and 90)
);

create table public.habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  time_block  text not null,
  created_at  timestamptz not null default now(),
  constraint habits_id_user_key unique (id, user_id),
  constraint habits_name_length check (char_length(name) between 1 and 80),
  constraint habits_name_trimmed check (name = btrim(name)),
  constraint habits_name_no_control check (name !~ '[[:cntrl:]]'),
  constraint habits_time_block check (time_block in ('poranek', 'dzien', 'wieczor'))
);
create index habits_user_idx on public.habits (user_id);

create table public.habit_checks (
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  habit_id    uuid not null,
  day         date not null default public.current_day_pl(),
  created_at  timestamptz not null default now(),
  constraint habit_checks_pkey primary key (user_id, habit_id, day),
  -- Złożony klucz obcy: nie da się odhaczyć cudzego nawyku.
  constraint habit_checks_habit_fkey foreign key (habit_id, user_id)
    references public.habits (id, user_id) on delete cascade
);

create table public.gratitude_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  day         date not null default public.current_day_pl(),
  content     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint gratitude_entries_user_day_key unique (user_id, day),
  constraint gratitude_entries_content_length check (char_length(btrim(content)) between 1 and 1000)
);

create table public.xp_events (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  amount      int not null,
  reason      text not null,
  ref         text,
  created_at  timestamptz not null default now(),
  constraint xp_events_amount_range check (amount between -100000 and 100000 and amount <> 0),
  constraint xp_events_reason_format check (reason ~ '^[a-z0-9_]{1,40}$'),
  constraint xp_events_ref_length check (ref is null or char_length(ref) <= 128)
);
create index xp_events_user_time_idx on public.xp_events (user_id, created_at desc);

create table public.user_badges (
  user_id    uuid not null references auth.users (id) on delete cascade,
  badge_key  text not null,
  earned_at  timestamptz not null default now(),
  constraint user_badges_pkey primary key (user_id, badge_key),
  constraint user_badges_key_format check (badge_key ~ '^[a-z0-9_]{1,40}$')
);

create table public.shop_purchases (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  item_key    text not null,
  cost        int not null,
  created_at  timestamptz not null default now(),
  constraint shop_purchases_item_format check (item_key ~ '^[a-z0-9_]{1,40}$'),
  constraint shop_purchases_cost_range check (cost >= 0)
);
create index shop_purchases_user_idx on public.shop_purchases (user_id, created_at desc);

create table public.streak_freezes (
  user_id     uuid not null references auth.users (id) on delete cascade,
  day         date not null,
  created_at  timestamptz not null default now(),
  constraint streak_freezes_pkey primary key (user_id, day)
);

create table public.ai_messages (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  role        text not null,
  content     text not null,
  created_at  timestamptz not null default now(),
  constraint ai_messages_role check (role in ('user', 'assistant')),
  constraint ai_messages_content_length check (char_length(content) between 1 and 8000)
);
create index ai_messages_user_time_idx on public.ai_messages (user_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Triggery walidacyjne
-- -----------------------------------------------------------------------------

-- Maksymalnie 5 nawyków na użytkownika.
create or replace function private.enforce_habit_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Blokada per użytkownik — równoległe inserty nie przekroczą limitu.
  perform pg_advisory_xact_lock(hashtextextended('habits:' || new.user_id::text, 0));

  if (select count(*) from public.habits h where h.user_id = new.user_id) >= 5 then
    raise exception 'habit_limit_reached'
      using errcode = 'P0001', hint = 'Maksymalnie 5 nawyków.';
  end if;
  return new;
end;
$$;
revoke execute on function private.enforce_habit_limit() from public, anon, authenticated;

create trigger habits_limit
  before insert on public.habits
  for each row execute function private.enforce_habit_limit();

-- updated_at dla wpisów wdzięczności.
create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke execute on function private.touch_updated_at() from public, anon, authenticated;

create trigger gratitude_entries_touch
  before update on public.gratitude_entries
  for each row execute function private.touch_updated_at();

-- -----------------------------------------------------------------------------
-- Uprawnienia (GRANT) — najpierw zero, potem minimum potrzebne klientowi.
-- RLS dodatkowo ogranicza wiersze; GRANT ogranicza operacje i kolumny.
-- -----------------------------------------------------------------------------
revoke all on table
  public.profiles, public.access_codes, public.entitlements, public.code_redemption_attempts,
  public.task_completions, public.lesson_completions, public.habits, public.habit_checks,
  public.gratitude_entries, public.xp_events, public.user_badges, public.shop_purchases,
  public.streak_freezes, public.ai_messages
from public, anon, authenticated;

grant all on table
  public.profiles, public.access_codes, public.entitlements, public.code_redemption_attempts,
  public.task_completions, public.lesson_completions, public.habits, public.habit_checks,
  public.gratitude_entries, public.xp_events, public.user_badges, public.shop_purchases,
  public.streak_freezes, public.ai_messages
to service_role;

-- Tylko odczyt (zapis: Edge Functions / SECURITY DEFINER)
grant select on table
  public.entitlements, public.xp_events, public.user_badges, public.shop_purchases,
  public.streak_freezes, public.ai_messages
to authenticated;

-- profiles: odczyt + zmiana wyłącznie kolumny username
grant select on table public.profiles to authenticated;
grant update (username) on table public.profiles to authenticated;

-- Tabele zapisywane przez klienta. Kolumny user_id / created_at NIE są
-- zapisywalne — wypełniają je wartości domyślne (auth.uid(), now()).
grant select, delete on table public.task_completions to authenticated;
grant insert (task_key, day) on table public.task_completions to authenticated;

grant select on table public.lesson_completions to authenticated;
grant insert (lesson_number) on table public.lesson_completions to authenticated;

grant select, delete on table public.habits to authenticated;
grant insert (name, time_block) on table public.habits to authenticated;
grant update (name, time_block) on table public.habits to authenticated;

grant select, delete on table public.habit_checks to authenticated;
grant insert (habit_id, day) on table public.habit_checks to authenticated;

grant select, delete on table public.gratitude_entries to authenticated;
grant insert (day, content) on table public.gratitude_entries to authenticated;
grant update (content) on table public.gratitude_entries to authenticated;

-- access_codes, code_redemption_attempts: brak jakichkolwiek uprawnień dla klienta.

-- -----------------------------------------------------------------------------
-- RLS — włączone wszędzie. Brak polityki = brak dostępu.
-- Wzorzec "(select ...)" pozwala Postgresowi policzyć wartość raz na zapytanie.
-- -----------------------------------------------------------------------------
alter table public.profiles                 enable row level security;
alter table public.access_codes             enable row level security;
alter table public.entitlements             enable row level security;
alter table public.code_redemption_attempts enable row level security;
alter table public.task_completions         enable row level security;
alter table public.lesson_completions       enable row level security;
alter table public.habits                   enable row level security;
alter table public.habit_checks             enable row level security;
alter table public.gratitude_entries        enable row level security;
alter table public.xp_events                enable row level security;
alter table public.user_badges              enable row level security;
alter table public.shop_purchases           enable row level security;
alter table public.streak_freezes           enable row level security;
alter table public.ai_messages              enable row level security;

-- access_codes, code_redemption_attempts: celowo BEZ polityk.

-- entitlements: własne wiersze, BEZ wymogu aktywnego dostępu (ekran aktywacji
-- musi wiedzieć, że dostęp wygasł / kiedy wygasa).
create policy entitlements_select_own on public.entitlements
  for select to authenticated
  using (user_id = (select auth.uid()));

-- profiles
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))))
  with check (id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

-- Tylko odczyt: xp_events, user_badges, shop_purchases, streak_freezes, ai_messages
create policy xp_events_select_own on public.xp_events
  for select to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

create policy user_badges_select_own on public.user_badges
  for select to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

create policy shop_purchases_select_own on public.shop_purchases
  for select to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

create policy streak_freezes_select_own on public.streak_freezes
  for select to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

create policy ai_messages_select_own on public.ai_messages
  for select to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

-- task_completions: odhaczanie i cofanie wyłącznie dla DZISIAJ (Europe/Warsaw)
create policy task_completions_select_own on public.task_completions
  for select to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

create policy task_completions_insert_own on public.task_completions
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (select public.has_active_access((select auth.uid())))
    and day = (select public.current_day_pl())
  );

create policy task_completions_delete_own on public.task_completions
  for delete to authenticated
  using (
    user_id = (select auth.uid())
    and (select public.has_active_access((select auth.uid())))
    and day = (select public.current_day_pl())
  );

-- lesson_completions: odczyt + dodanie (bez cofania)
create policy lesson_completions_select_own on public.lesson_completions
  for select to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

create policy lesson_completions_insert_own on public.lesson_completions
  for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

-- habits: pełny CRUD na własnych
create policy habits_select_own on public.habits
  for select to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

create policy habits_insert_own on public.habits
  for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

create policy habits_update_own on public.habits
  for update to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))))
  with check (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

create policy habits_delete_own on public.habits
  for delete to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

-- habit_checks: odhaczanie i cofanie wyłącznie dla DZISIAJ
create policy habit_checks_select_own on public.habit_checks
  for select to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

create policy habit_checks_insert_own on public.habit_checks
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (select public.has_active_access((select auth.uid())))
    and day = (select public.current_day_pl())
  );

create policy habit_checks_delete_own on public.habit_checks
  for delete to authenticated
  using (
    user_id = (select auth.uid())
    and (select public.has_active_access((select auth.uid())))
    and day = (select public.current_day_pl())
  );

-- gratitude_entries: zapis/edycja tylko dzisiejszego wpisu, odczyt i usuwanie własnych
create policy gratitude_entries_select_own on public.gratitude_entries
  for select to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

create policy gratitude_entries_insert_own on public.gratitude_entries
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (select public.has_active_access((select auth.uid())))
    and day = (select public.current_day_pl())
  );

create policy gratitude_entries_update_own on public.gratitude_entries
  for update to authenticated
  using (
    user_id = (select auth.uid())
    and (select public.has_active_access((select auth.uid())))
    and day = (select public.current_day_pl())
  )
  with check (
    user_id = (select auth.uid())
    and (select public.has_active_access((select auth.uid())))
    and day = (select public.current_day_pl())
  );

create policy gratitude_entries_delete_own on public.gratitude_entries
  for delete to authenticated
  using (user_id = (select auth.uid()) and (select public.has_active_access((select auth.uid()))));

-- -----------------------------------------------------------------------------
-- Bezpiecznik: migracja nie przejdzie, jeśli jakakolwiek tabela w public
-- nie ma włączonego RLS.
-- -----------------------------------------------------------------------------
do $$
declare
  r record;
begin
  for r in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind in ('r', 'p')
      and not c.relrowsecurity
  loop
    raise exception 'RLS is disabled on public.%', r.relname;
  end loop;
end;
$$;
