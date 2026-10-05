import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { useAccess } from '../access/AccessContext'
import { Button, FullScreenLoader } from '../components/ui'
import { ROUTES } from '../lib/routes'

// UWAGA: strażnicy to tylko UX. Dane chroni RLS w bazie.

/** Bez sesji → logowanie. */
export function RequireSession() {
  const auth = useAuth()
  const location = useLocation()
  if (auth.status === 'loading') return <FullScreenLoader />
  if (auth.status === 'signedOut') {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

/** Bez aktywnego dostępu → ekran aktywacji. */
export function RequireAccess() {
  const access = useAccess()
  if (access.status === 'idle' || access.status === 'loading') return <FullScreenLoader label="Sprawdzam dostęp…" />
  if (access.status === 'error') return <AccessErrorScreen onRetry={() => void access.refresh()} />
  if (!access.active) return <Navigate to={ROUTES.activate} replace />
  return <Outlet />
}

/** Strony dla niezalogowanych (logowanie, rejestracja…) — zalogowanych przekierowuje. */
export function GuestOnly() {
  const auth = useAuth()
  const location = useLocation()
  if (auth.status === 'loading') return <FullScreenLoader />
  if (auth.status === 'signedIn') {
    const from = (location.state as { from?: unknown } | null)?.from
    // Tylko ścieżki wewnętrzne (ochrona przed open redirect).
    const target = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : ROUTES.home
    return <Navigate to={target} replace />
  }
  return <Outlet />
}

function AccessErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-3xl uppercase text-white">Brak połączenia</p>
      <p className="text-sm text-muted">Nie udało się sprawdzić Twojego dostępu. Sprawdź internet i spróbuj ponownie.</p>
      <Button onClick={onRetry}>Spróbuj ponownie</Button>
    </main>
  )
}
