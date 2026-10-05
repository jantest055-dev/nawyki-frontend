# Nawyki Wojownika

90-dniowy program budowania dyscypliny i nawyków. PWA, mobile-first, interfejs po polsku, doba liczona wg Europe/Warsaw.

**Stack:** React 19 + Vite + TypeScript + Tailwind 4, Supabase (Auth, Postgres + RLS, Edge Functions), PWA (vite-plugin-pwa).

**Model:** wyłącznie płatny. Po rejestracji użytkownik aktywuje dostęp jednorazowym kodem (90 dni od aktywacji, wszystkie funkcje). Bez aktywnego dostępu widzi tylko ekran aktywacji i ustawienia (eksport/usunięcie danych).

## Struktura

```
src/
  lib/          env (zod), klient Supabase, walidacja, czas PL, wywołania Edge Functions
  auth/         sesja (AuthProvider)
  access/       stan dostępu (AccessProvider) — tylko UX, ochrona to RLS
  routes/       strażnicy tras
  pages/        logowanie, rejestracja, reset hasła, aktywacja, ustawienia (RODO), prywatność
supabase/
  migrations/   schemat, RLS, funkcje (has_active_access, redeem_access_code, generator kodów)
  functions/    redeem-code, delete-account, export-data (Deno)
  templates/    szablony maili auth
  tests/        testy RLS/uprawnień na lokalnym Postgresie
docs/
  SETUP.md      wdrożenie, ustawienia Auth, generowanie kodów
  SECURITY.md   macierz RLS i zapytania do weryfikacji
```

## Skrypty

```bash
npm run dev        # development (wymaga .env.local — patrz .env.example)
npm run build      # typecheck + build produkcyjny
npm run lint
npm test           # testy jednostkowe (vitest)
./supabase/tests/run.sh   # testy RLS (lokalny Postgres)
```

## Pozostałości starego prototypu

Nieużywane i do usunięcia: `src/App.jsx`, `src/main.jsx`, `src/App.css`, `src/assets/`, `public/icons.svg` oraz puste pliki `cd`, `dir`, `git`, `switch`, `vercel` w katalogu głównym. Treść lekcji i zadań z `src/App.jsx` może się przydać w kolejnych etapach.

Szczegóły: [docs/SETUP.md](docs/SETUP.md), [docs/SECURITY.md](docs/SECURITY.md).
