# Wdrożenie — Nawyki Wojownika

## 1. Supabase — baza

```bash
npx supabase login
npx supabase link --project-ref <REF_PROJEKTU>
npx supabase db push          # stosuje supabase/migrations/*.sql
```

Migracja kończy się bezpiecznikiem: jeśli jakakolwiek tabela w `public` nie ma RLS, `db push` się wywali.

## 2. Supabase — Auth (panel: Authentication)

Te ustawienia są **po stronie serwera** — walidacja na froncie jej nie zastępuje. (Nazwy pozycji w panelu Supabase mogą się nieznacznie różnić między wersjami.)

| Ustawienie | Wartość |
|---|---|
| Sign In / Providers → Email → **Confirm email** | WŁĄCZONE |
| Sign In / Providers → Email → **Minimum password length** | **10** (inaczej API przyjmie krótsze hasło z pominięciem frontu) |
| Sign In / Providers → Email → **Secure password change** | WŁĄCZONE |
| Leaked password protection | włącz, jeśli plan na to pozwala |
| URL Configuration → **Site URL** | `https://twoja-domena.pl` |
| URL Configuration → **Redirect URLs** | `https://twoja-domena.pl/**` (+ `http://localhost:5173/**` do developmentu) |
| Emails → SMTP | **własny SMTP** — wbudowany serwer Supabase ma bardzo niski limit wysyłek i nie nadaje się na produkcję |

**Szablony maili** (Emails → Templates) — wklej treść z `supabase/templates/`:
- *Confirm signup* → `confirmation.html`
- *Reset password* → `recovery.html`

Te szablony kierują na `/auth/potwierdz?token_hash=…`, co działa także wtedy, gdy link zostanie otwarty w innej przeglądarce niż ta, w której założono konto (typowe na telefonie i w zainstalowanej PWA). Domyślne szablony też zadziałają, ale są mniej odporne na to i na skanery linków w skrzynkach pocztowych.

## 3. Edge Functions

```bash
npx supabase functions deploy redeem-code
npx supabase functions deploy delete-account
npx supabase functions deploy export-data

# Originy przeglądarki, z których wolno wołać funkcje (po przecinku):
npx supabase secrets set ALLOWED_ORIGINS="https://twoja-domena.pl,http://localhost:5173"
```

`SUPABASE_URL` i `SUPABASE_SERVICE_ROLE_KEY` środowisko Edge Functions dostarcza samo. **Nie** wpisuj ich do repo ani do `.env` frontu. Przyszłe klucze AI też trafią wyłącznie do `supabase secrets set`.

Każda funkcja sama weryfikuje JWT przez serwer Auth (`auth.getUser`), niezależnie od `verify_jwt` w `config.toml`.

## 4. Frontend

```bash
cp .env.example .env.local     # uzupełnij URL, anon key, VITE_PURCHASE_URL
npm install
npm run dev
```

Na froncie są tylko `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` i `VITE_PURCHASE_URL`. Aplikacja **odmówi startu**, jeśli w `VITE_SUPABASE_ANON_KEY` znajdzie się klucz `service_role`/`sb_secret_`.

### Deploy (Vercel)

`vercel.json` ustawia rewrite SPA i nagłówki: CSP (`frame-ancestors 'none'`), `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, HSTS, `Permissions-Policy`.

Po deployu **zawęź CSP**: w `connect-src` zamień `https://*.supabase.co wss://*.supabase.co` na adres swojego projektu (`https://<ref>.supabase.co wss://<ref>.supabase.co`).

Sprawdzenie: `curl -sI https://twoja-domena.pl | grep -i -E 'content-security|x-content|referrer|x-frame'`.

Fonty są serwowane lokalnie (fontsource), bez Google Fonts — mniej transferów danych do podmiotów trzecich (RODO) i prostsze CSP.

## 5. Kody dostępu (admin)

Generowanie partii (SQL Editor w panelu, jako `postgres`):

```sql
select code from private.generate_access_codes(100);   -- 1..1000 na raz
```

- Wynik to **jedyne miejsce, gdzie widać jawne kody**. Pobierz CSV i przechowuj go bezpiecznie (np. w systemie sprzedaży). W bazie zostaje tylko SHA-256.
- Format: `XXXX-XXXX-XXXX`, alfabet 32 znaki bez `0/O/1/I`, 60 bitów entropii. Myślniki i wielkość liter są ignorowane przy aktywacji.
- Funkcja jest w schemacie `private` (niewystawionym przez API), bez uprawnień dla `anon`/`authenticated`/`service_role`.

Unieważnienie niewykorzystanego kodu:

```sql
delete from public.access_codes
where used_at is null
  and code_hash = encode(extensions.digest('ABCDEFGH2345', 'sha256'), 'hex');  -- kod bez myślników, wielkimi literami
```

Ręczne nadanie dostępu (np. reklamacja):

```sql
insert into public.entitlements (user_id, starts_at, expires_at, source)
values ('<uuid użytkownika>', now(), now() + interval '90 days', 'admin');
```

Statystyki: `select count(*) filter (where used_at is null) as wolne, count(*) filter (where used_at is not null) as uzyte from public.access_codes;`

## 6. Testy

```bash
npm run typecheck && npm run lint && npm test           # front
PGHOST=localhost PGUSER=postgres ./supabase/tests/run.sh  # RLS/uprawnienia na lokalnym Postgresie (tworzy bazę nawyki_test)
```

Test SQL używa atrapy ról i schematu `auth` Supabase (`supabase/tests/supabase_stub.sql`). Sprawdza m.in. izolację użytkowników, brak dostępu bez aktywnego entitlementu, limit prób kodu, limit 5 nawyków, blokadę zapisu „wstecz” i kaskadowe usuwanie konta.
