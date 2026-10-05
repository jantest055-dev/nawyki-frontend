-- Test bezpieczeństwa schematu (RLS, GRANT, triggery, redeem).
-- Uruchamiany na lokalnym Postgresie z atrapą Supabase: patrz supabase/tests/README.md
\set ON_ERROR_STOP 1
set client_min_messages = notice;

create schema test;
grant usage on schema test to public;
create function test.ok(cond boolean, msg text) returns void language plpgsql as $$
begin
  if not coalesce(cond, false) then raise exception 'FAIL: %', msg; end if;
  raise notice 'ok: %', msg;
end $$;
create function test.fails(q text, msg text) returns void language plpgsql as $$
begin
  begin
    execute q;
  exception when others then
    raise notice 'ok (zablokowane: %): %', sqlerrm, msg;
    return;
  end;
  raise exception 'FAIL (nie zablokowano): %', msg;
end $$;
create function test.cnt(q text) returns bigint language plpgsql as $$
declare n bigint;
begin execute 'select count(*) from (' || q || ') s' into n; return n; end $$;
create function test.as_user(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
end $$;
grant execute on all functions in schema test to public;

-- ---------------------------------------------------------------- użytkownicy
insert into auth.users (id, email, raw_user_meta_data) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'a@x.pl', '{"username":"Alpha"}'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'b@x.pl', '{"username":"bravo"}'),
  ('cccccccc-0000-0000-0000-000000000003', 'c@x.pl', '{"username":"charlie"}'),
  ('dddddddd-0000-0000-0000-000000000004', 'd@x.pl', '{}');

select test.ok((select username from public.profiles where id = 'aaaaaaaa-0000-0000-0000-000000000001') = 'alpha', 'profil tworzony triggerem, username lowercase');
select test.ok((select username from public.profiles where id = 'dddddddd-0000-0000-0000-000000000004') like 'wojownik_%', 'brak username => nazwa techniczna');
select test.fails($$insert into auth.users (email, raw_user_meta_data) values ('e@x.pl', '{"username":"zła nazwa!"}')$$, 'niepoprawny username blokuje rejestrację');
select test.fails($$insert into auth.users (email, raw_user_meta_data) values ('f@x.pl', '{"username":"bravo"}')$$, 'zajęty username blokuje rejestrację');
select test.fails($$insert into auth.users (email, raw_user_meta_data) values ('g@x.pl', '{"username":"ab"}')$$, 'username < 3 znaków');

-- ---------------------------------------------------------------- kody
create temp table codes as select * from private.generate_access_codes(5);
select test.ok((select count(*) from codes) = 5, 'wygenerowano 5 kodów');
select test.ok((select bool_and(code ~ '^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$') from codes), 'format kodów bez 0/O/1/I');
select test.ok((select count(*) from public.access_codes) = 5 and (select bool_and(code_hash ~ '^[0-9a-f]{64}$') from public.access_codes), 'w bazie tylko hashe');
select test.ok(not exists (select 1 from public.access_codes a join codes c on a.code_hash like '%' || replace(c.code, '-', '') || '%'), 'jawny kod nie występuje w bazie');
create temp table h as
  select row_number() over () as n, code, encode(extensions.digest(replace(code, '-', ''), 'sha256'), 'hex') as hash from codes;
grant select on h to public;

-- ---------------------------------------------------------------- redeem (service_role)
set role service_role;
select test.ok((select public.redeem_access_code('aaaaaaaa-0000-0000-0000-000000000001', (select hash from h where n = 1)) ->> 'status') = 'ok', 'A aktywuje kod 1');
select test.ok((select public.redeem_access_code('bbbbbbbb-0000-0000-0000-000000000002', (select hash from h where n = 1)) ->> 'status') = 'invalid', 'B nie może użyć kodu 1 ponownie (ogólny błąd)');
select test.ok((select public.redeem_access_code('bbbbbbbb-0000-0000-0000-000000000002', repeat('0', 64)) ->> 'status') = 'invalid', 'nieistniejący kod => ten sam ogólny błąd');
select test.ok((select public.redeem_access_code('bbbbbbbb-0000-0000-0000-000000000002', (select hash from h where n = 2)) ->> 'status') = 'ok', 'B aktywuje kod 2');
-- limit prób dla C
select public.redeem_access_code('cccccccc-0000-0000-0000-000000000003', null) from generate_series(1, 5);
select test.ok((select public.redeem_access_code('cccccccc-0000-0000-0000-000000000003', (select hash from h where n = 3)) ->> 'status') = 'rate_limited', '6. próba w godzinie => rate_limited, nawet z poprawnym kodem');
select test.ok((select used_at from public.access_codes where code_hash = (select hash from h where n = 3)) is null, 'kod 3 nadal nieużyty po blokadzie limitu');
-- przedłużenie: A aktywuje drugi kod przy aktywnym dostępie
-- (wynik w CTE: BETWEEN wywołałby funkcję dwukrotnie)
with r as materialized (
  select public.redeem_access_code('aaaaaaaa-0000-0000-0000-000000000001', (select hash from h where n = 4)) as res
)
select test.ok((select (res ->> 'expires_at')::timestamptz from r)
  between now() + interval '179 days' and now() + interval '181 days', 'drugi kod przedłuża dostęp (90 + 90 dni)');
select test.ok(public.has_active_access('aaaaaaaa-0000-0000-0000-000000000001'), 'service_role: has_active_access(A) = true');
select test.ok(not public.has_active_access('cccccccc-0000-0000-0000-000000000003'), 'service_role: has_active_access(C) = false');
reset role;

-- ---------------------------------------------------------------- anon
set role anon;
select test.fails('select * from public.profiles', 'anon: profiles');
select test.fails('select * from public.entitlements', 'anon: entitlements');
select test.fails('select * from public.access_codes', 'anon: access_codes');
select test.fails($$select public.has_active_access('aaaaaaaa-0000-0000-0000-000000000001')$$, 'anon: has_active_access');
select test.fails($$select public.redeem_access_code('aaaaaaaa-0000-0000-0000-000000000001', repeat('a', 64))$$, 'anon: redeem_access_code');
select test.fails('insert into public.task_completions (task_key) values (''x'')', 'anon: insert task_completions');
reset role;

-- ---------------------------------------------------------------- A (aktywny dostęp)
begin;
set local role authenticated;
select test.as_user('aaaaaaaa-0000-0000-0000-000000000001');
select test.ok(public.has_active_access('aaaaaaaa-0000-0000-0000-000000000001'), 'A: ma dostęp');
select test.ok(not public.has_active_access('bbbbbbbb-0000-0000-0000-000000000002'), 'A: nie może sprawdzić dostępu B (false)');
select test.fails('select * from public.access_codes', 'A: access_codes');
select test.fails('select * from public.code_redemption_attempts', 'A: code_redemption_attempts');
select test.fails($$select public.redeem_access_code('aaaaaaaa-0000-0000-0000-000000000001', repeat('a', 64))$$, 'A: bezpośrednie wywołanie redeem_access_code');
select test.fails('select * from private.generate_access_codes(1)', 'A: generate_access_codes');
select test.ok(test.cnt('select * from public.entitlements') = 2, 'A: widzi tylko swoje 2 entitlements');
select test.fails($$insert into public.entitlements (user_id, expires_at, source) values ('aaaaaaaa-0000-0000-0000-000000000001', now() + interval '1 year', 'admin')$$, 'A: insert entitlements');
select test.fails($$update public.entitlements set expires_at = now() + interval '10 years'$$, 'A: update entitlements');
select test.fails($$insert into public.xp_events (user_id, amount, reason) values ('aaaaaaaa-0000-0000-0000-000000000001', 1000, 'hack')$$, 'A: insert xp_events');
select test.fails($$insert into public.user_badges (user_id, badge_key) values ('aaaaaaaa-0000-0000-0000-000000000001', 'x')$$, 'A: insert user_badges');
select test.fails($$insert into public.shop_purchases (user_id, item_key, cost) values ('aaaaaaaa-0000-0000-0000-000000000001', 'x', 0)$$, 'A: insert shop_purchases');
select test.fails($$insert into public.streak_freezes (user_id, day) values ('aaaaaaaa-0000-0000-0000-000000000001', current_date)$$, 'A: insert streak_freezes');
select test.fails($$insert into public.ai_messages (user_id, role, content) values ('aaaaaaaa-0000-0000-0000-000000000001', 'assistant', 'x')$$, 'A: insert ai_messages');

-- profile
select test.ok(test.cnt('select * from public.profiles') = 1, 'A: widzi tylko swój profil');
update public.profiles set username = 'alpha_2';
select test.ok((select username from public.profiles) = 'alpha_2', 'A: zmiana username');
select test.fails($$update public.profiles set username = 'bravo'$$, 'A: zajęty username');
select test.fails($$update public.profiles set username = 'ZŁY'$$, 'A: niepoprawny username');
select test.fails($$update public.profiles set created_at = now() - interval '1 year'$$, 'A: zmiana created_at');
select test.fails($$update public.profiles set id = 'bbbbbbbb-0000-0000-0000-000000000002'$$, 'A: zmiana id');

-- zadania
insert into public.task_completions (task_key) values ('shower');
select test.ok((select day from public.task_completions) = public.current_day_pl(), 'A: domyślny dzień = dziś (Europe/Warsaw)');
select test.fails($$insert into public.task_completions (task_key, day) values ('workout', public.current_day_pl() - 1)$$, 'A: odhaczenie wczoraj');
select test.fails($$insert into public.task_completions (task_key, day) values ('workout', public.current_day_pl() + 1)$$, 'A: odhaczenie jutro');
select test.fails($$insert into public.task_completions (user_id, task_key) values ('bbbbbbbb-0000-0000-0000-000000000002', 'workout')$$, 'A: zadanie jako B');
select test.fails($$insert into public.task_completions (task_key) values ('shower')$$, 'A: duplikat zadania tego samego dnia');
select test.fails($$insert into public.task_completions (task_key) values ('<script>')$$, 'A: niepoprawny task_key');

-- lekcje
insert into public.lesson_completions (lesson_number) values (1);
select test.fails($$insert into public.lesson_completions (lesson_number) values (91)$$, 'A: lekcja poza zakresem');
select test.fails($$delete from public.lesson_completions$$, 'A: usuwanie ukończonej lekcji');

-- nawyki
select test.fails($$insert into public.habits (name, time_block) values (repeat('x', 81), 'poranek')$$, 'A: nazwa > 80 znaków');
select test.fails($$insert into public.habits (name, time_block) values (' spacja', 'poranek')$$, 'A: nazwa z białymi znakami na brzegach');
insert into public.habits (name, time_block) values ('a', 'poranek'), ('b', 'dzien'), ('c', 'wieczor'), ('d', 'poranek'), ('e', 'dzien');
select test.fails($$insert into public.habits (name, time_block) values ('f', 'poranek')$$, 'A: 6. nawyk');
select test.fails($$update public.habits set time_block = 'noc'$$, 'A: niepoprawny time_block');
select test.fails($$update public.habits set user_id = 'bbbbbbbb-0000-0000-0000-000000000002'$$, 'A: przepisanie nawyku na B');
insert into public.habit_checks (habit_id) select id from public.habits where name = 'a';
select test.fails($$insert into public.habit_checks (habit_id, day) select id, public.current_day_pl() - 3 from public.habits where name = 'b'$$, 'A: odhaczenie nawyku wstecz');

-- wdzięczność
insert into public.gratitude_entries (content) values ('Dziękuję za dziś');
update public.gratitude_entries set content = 'Zmienione';
select test.fails($$insert into public.gratitude_entries (content, day) values ('x', public.current_day_pl() - 1)$$, 'A: wpis wdzięczności wstecz');
select test.fails($$update public.gratitude_entries set content = repeat('x', 1001)$$, 'A: wpis > 1000 znaków');
commit;

-- ---------------------------------------------------------------- B nie widzi danych A
begin;
set local role authenticated;
select test.as_user('bbbbbbbb-0000-0000-0000-000000000002');
create temp table b_habit on commit drop as select 1;
insert into public.habits (name, time_block) values ('nawyk B', 'poranek');
select test.ok(test.cnt('select * from public.task_completions') = 0, 'B: nie widzi zadań A');
select test.ok(test.cnt('select * from public.habits') = 1, 'B: widzi tylko swój nawyk');
select test.ok(test.cnt('select * from public.gratitude_entries') = 0, 'B: nie widzi wdzięczności A');
select test.ok(test.cnt('select * from public.entitlements') = 1, 'B: widzi tylko swoje entitlements');
select test.ok(test.cnt('select * from public.profiles') = 1, 'B: widzi tylko swój profil');
update public.habits set name = 'przejęty' where user_id = 'aaaaaaaa-0000-0000-0000-000000000001';
delete from public.task_completions where user_id = 'aaaaaaaa-0000-0000-0000-000000000001';
delete from public.gratitude_entries where user_id = 'aaaaaaaa-0000-0000-0000-000000000001';
select test.fails($$insert into public.habit_checks (habit_id) select id from public.habits h where false union all select 'ffffffff-0000-0000-0000-000000000000'::uuid$$, 'B: odhaczenie nieistniejącego/cudzego nawyku');
commit;
select test.ok((select count(*) from public.habits where user_id = 'aaaaaaaa-0000-0000-0000-000000000001' and name = 'przejęty') = 0, 'B nie zmienił nawyku A');
select test.ok((select count(*) from public.task_completions where user_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 1, 'B nie usunął zadań A');
select test.ok((select count(*) from public.gratitude_entries where user_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 1, 'B nie usunął wdzięczności A');

-- B próbuje odhaczyć nawyk A (zna jego id)
create temp table a_habit as select id from public.habits where user_id = 'aaaaaaaa-0000-0000-0000-000000000001' limit 1;
grant select on a_habit to public;
begin;
set local role authenticated;
select test.as_user('bbbbbbbb-0000-0000-0000-000000000002');
select test.fails($$insert into public.habit_checks (habit_id) select id from a_habit$$, 'B: odhaczenie nawyku A (złożony FK)');
commit;

-- ---------------------------------------------------------------- C (bez dostępu)
begin;
set local role authenticated;
select test.as_user('cccccccc-0000-0000-0000-000000000003');
select test.ok(not public.has_active_access('cccccccc-0000-0000-0000-000000000003'), 'C: brak dostępu');
select test.ok(test.cnt('select * from public.entitlements') = 0, 'C: entitlements (puste, ale zapytanie dozwolone)');
select test.ok(test.cnt('select * from public.profiles') = 0, 'C: profil niewidoczny bez dostępu');
select test.fails($$insert into public.task_completions (task_key) values ('shower')$$, 'C: zapis zadania bez dostępu');
select test.fails($$insert into public.habits (name, time_block) values ('x', 'poranek')$$, 'C: nawyk bez dostępu');
select test.fails($$insert into public.gratitude_entries (content) values ('x')$$, 'C: wdzięczność bez dostępu');
commit;

-- ---------------------------------------------------------------- wygaśnięcie dostępu
update public.entitlements set starts_at = now() - interval '200 days', expires_at = now() - interval '1 second'
 where user_id = 'aaaaaaaa-0000-0000-0000-000000000001';
begin;
set local role authenticated;
select test.as_user('aaaaaaaa-0000-0000-0000-000000000001');
select test.ok(not public.has_active_access('aaaaaaaa-0000-0000-0000-000000000001'), 'A po wygaśnięciu: brak dostępu');
select test.ok(test.cnt('select * from public.task_completions') = 0, 'A po wygaśnięciu: dane niewidoczne');
select test.ok(test.cnt('select * from public.entitlements') = 2, 'A po wygaśnięciu: nadal widzi swoje entitlements');
select test.fails($$insert into public.task_completions (task_key) values ('walk')$$, 'A po wygaśnięciu: brak zapisu');
commit;

-- ---------------------------------------------------------------- usunięcie konta
delete from auth.users where id = 'aaaaaaaa-0000-0000-0000-000000000001';
select test.ok((select count(*) from public.profiles where id = 'aaaaaaaa-0000-0000-0000-000000000001') = 0
  and (select count(*) from public.habits where user_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 0
  and (select count(*) from public.task_completions where user_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 0
  and (select count(*) from public.entitlements where user_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 0
  and (select count(*) from public.gratitude_entries where user_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 0, 'usunięcie konta kasuje dane (cascade)');
select test.ok((select used_at is not null and used_by is null from public.access_codes where code_hash = (select hash from h where n = 1)), 'kod usuniętego użytkownika pozostaje wykorzystany');
set role service_role;
select test.ok((select public.redeem_access_code('dddddddd-0000-0000-0000-000000000004', (select hash from h where n = 1)) ->> 'status') = 'invalid', 'kod usuniętego użytkownika nie działa ponownie');
reset role;

\echo '==== WSZYSTKIE TESTY PRZESZŁY ===='
