# Model bezpieczeństwa — macierz RLS i uprawnień

Zasada: RLS włączone na każdej tabeli `public`, wszystkie uprawnienia `anon`/`authenticated` odebrane i nadane z powrotem tylko tam, gdzie trzeba (także per kolumna). `service_role` (Edge Functions) omija RLS.

`A` = `has_active_access(auth.uid())` — istnieje entitlement z `starts_at <= now() < expires_at`.
`DZIŚ` = `day = current_day_pl()` (doba wg Europe/Warsaw).

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | własny + A | — (trigger przy rejestracji) | tylko `username`, własny + A | — |
| access_codes | — | — | — | — |
| code_redemption_attempts | — | — | — | — |
| entitlements | własne (**bez** wymogu A) | — | — | — |
| task_completions | własne + A | `task_key, day`; własne + A + DZIŚ | — | własne + A + DZIŚ |
| lesson_completions | własne + A | `lesson_number`; własne + A | — | — |
| habits | własne + A | `name, time_block`; własne + A; maks. 5 (trigger) | `name, time_block`; własne + A | własne + A |
| habit_checks | własne + A | `habit_id, day`; własne + A + DZIŚ; FK (habit_id, user_id) | — | własne + A + DZIŚ |
| gratitude_entries | własne + A | `day, content`; własne + A + DZIŚ | `content`; własne + A + DZIŚ | własne + A |
| xp_events | własne + A | — | — | — |
| user_badges | własne + A | — | — | — |
| shop_purchases | własne + A | — | — | — |
| streak_freezes | własne + A | — | — | — |
| ai_messages | własne + A | — | — | — |

„—” = brak uprawnienia GRANT i/lub brak polityki → odmowa.

Kolumny `user_id` i `created_at` nie są zapisywalne przez klienta — wypełniają je wartości domyślne (`auth.uid()`, `now()`), a polityka i tak sprawdza `user_id = auth.uid()`.

## Funkcje

| Funkcja | Kto może wywołać | Uwagi |
|---|---|---|
| `public.has_active_access(uuid)` | authenticated, service_role | SECURITY INVOKER — przez RLS na `entitlements` użytkownik sprawdzi tylko siebie |
| `public.current_day_pl()` | authenticated, service_role | dzień wg Europe/Warsaw |
| `public.redeem_access_code(uuid, text)` | **tylko service_role** | SECURITY DEFINER; limit 5 prób/h (advisory lock), atomowe zajęcie kodu + entitlement w jednej transakcji |
| `private.generate_access_codes(int)` | tylko postgres (admin) | schemat niewystawiony przez API |
| `private.handle_new_user()` | trigger | waliduje username, tworzy profil |
| `private.enforce_habit_limit()` | trigger | maks. 5 nawyków |

## Weryfikacja na żywej bazie (SQL Editor)

```sql
-- 1) RLS na wszystkich tabelach (oczekiwane: 0 wierszy)
select relname from pg_class
where relnamespace = 'public'::regnamespace and relkind in ('r','p') and not relrowsecurity;

-- 2) Wszystkie polityki
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public' order by tablename, policyname;

-- 3) Uprawnienia klienta (anon nie powinien mieć żadnych)
select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon', 'authenticated')
order by table_name, grantee, privilege_type;

select table_name, column_name, grantee, privilege_type
from information_schema.column_privileges
where table_schema = 'public' and grantee = 'authenticated' and privilege_type in ('INSERT','UPDATE')
order by table_name, privilege_type, column_name;

-- 4) Kto może wywołać funkcje
select p.proname, r.rolname
from pg_proc p cross join pg_roles r
where p.pronamespace = 'public'::regnamespace
  and r.rolname in ('anon', 'authenticated', 'service_role')
  and has_function_privilege(r.oid, p.oid, 'execute')
order by 1, 2;
```

## Inne zabezpieczenia

- Edge Functions: JWT weryfikowany przez serwer Auth, ciało żądania walidowane zod (limit 4 KB), CORS tylko dla `ALLOWED_ORIGINS`, ogólne komunikaty błędów, brak logowania danych osobowych.
- Front: zod na wszystkich formularzach, zakaz `dangerouslySetInnerHTML`/`innerHTML` wymuszony regułą ESLint, open-redirect zablokowany w przekierowaniu po logowaniu, link zakupu tylko `https`.
- Service worker cache'uje wyłącznie pliki aplikacji, nigdy odpowiedzi API.
