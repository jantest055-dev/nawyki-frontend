import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import { authErrorMessage } from '../lib/authErrors'
import { ROUTES } from '../lib/routes'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, FullScreenLoader } from '../components/ui'

// Obsługa linków z maili:
//  1) zalecane szablony: /auth/potwierdz?token_hash=...&type=email|recovery
//  2) domyślne szablony Supabase: tokeny/błąd we fragmencie URL (#...),
//     które przetwarza sam klient supabase (detectSessionInUrl).
const ParamsSchema = z.object({
  token_hash: z.string().regex(/^[A-Za-z0-9_-]{10,512}$/),
  type: z.enum(['email', 'signup', 'recovery', 'email_change']),
})

type Status = { kind: 'verifying' } | { kind: 'fallback' } | { kind: 'error'; message: string }

function initialStatus(params: URLSearchParams): Status {
  const hash = new URLSearchParams(window.location.hash.slice(1))
  if (hash.get('error') || hash.get('error_code')) {
    return {
      kind: 'error',
      message:
        hash.get('error_code') === 'otp_expired'
          ? 'Link wygasł lub został już użyty. Poproś o nowy.'
          : 'Nie udało się potwierdzić linku.',
    }
  }
  return ParamsSchema.safeParse(Object.fromEntries(params)).success ? { kind: 'verifying' } : { kind: 'fallback' }
}

export function AuthConfirmPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const auth = useAuth()
  const [status, setStatus] = useState<Status>(() => initialStatus(params))
  const started = useRef(false)

  useEffect(() => {
    if (status.kind !== 'verifying' || started.current) return
    started.current = true
    const parsed = ParamsSchema.parse(Object.fromEntries(params))
    supabase.auth
      .verifyOtp({ token_hash: parsed.token_hash, type: parsed.type })
      .then(({ error }) => {
        if (error) {
          setStatus({ kind: 'error', message: authErrorMessage(error) })
          return
        }
        navigate(parsed.type === 'recovery' ? ROUTES.newPassword : ROUTES.home, { replace: true })
      })
      .catch((err: unknown) => setStatus({ kind: 'error', message: authErrorMessage(err) }))
  }, [status.kind, params, navigate])

  if (status.kind === 'error') {
    return (
      <AuthLayout title="Potwierdzenie">
        <div className="flex flex-col gap-4">
          <Alert tone="error">{status.message}</Alert>
          <Link to={ROUTES.login} className="text-center font-semibold text-gold hover:text-gold-light">
            Przejdź do logowania
          </Link>
        </div>
      </AuthLayout>
    )
  }

  if (status.kind === 'fallback') {
    if (auth.status === 'loading') return <FullScreenLoader label="Potwierdzam…" />
    if (auth.status === 'signedIn') return <Navigate to={ROUTES.home} replace />
    return <Navigate to={ROUTES.login} replace state={{ flash: 'Jeśli konto zostało potwierdzone, zaloguj się.' }} />
  }

  return <FullScreenLoader label="Potwierdzam…" />
}
