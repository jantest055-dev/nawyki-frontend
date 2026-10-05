import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { z } from 'zod'
import { env } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import { useAccess } from '../access/AccessContext'
import { invokeFunction } from '../lib/functions'
import { accessCodeSchema, formatAccessCodeInput } from '../lib/validation'
import { formatDatePl } from '../lib/time'
import { ROUTES } from '../lib/routes'
import { SwordsIcon } from '../components/Logo'
import { Alert, Button, Card, FullScreenLoader, Heading, TextField } from '../components/ui'

const RedeemResponseSchema = z.object({ ok: z.literal(true), expires_at: z.string() })

export function ActivatePage() {
  const auth = useAuth()
  const access = useAccess()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [fieldError, setFieldError] = useState<string | undefined>()
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (access.status === 'idle' || access.status === 'loading') return <FullScreenLoader label="Sprawdzam dostęp…" />
  if (access.status === 'ready' && access.active) return <Navigate to={ROUTES.home} replace />

  // Tu dostęp nie jest aktywny, więc istniejąca data końca oznacza wygaśnięcie.
  const expiredAt = access.status === 'ready' ? access.expiresAt : null

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    const parsed = accessCodeSchema.safeParse(code)
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message)
      return
    }
    setFieldError(undefined)
    setLoading(true)
    const result = await invokeFunction('redeem-code', { code: parsed.data }, RedeemResponseSchema)
    if (!result.ok) {
      setLoading(false)
      setFormError(result.message)
      return
    }
    await access.refresh()
    setLoading(false)
    navigate(ROUTES.home, { replace: true })
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <SwordsIcon size={72} />
        <p className="font-label text-xs font-bold uppercase tracking-[0.35em] text-gold">Dostęp do programu</p>
        <Heading>Aktywuj dostęp</Heading>
        <p className="text-sm text-muted">
          Wpisz jednorazowy kod, aby odblokować pełny 90-dniowy program — wszystkie funkcje, łącznie z premium.
        </p>
      </div>

      <Card>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          {expiredAt ? <Alert tone="info">Twój dostęp wygasł {formatDatePl(expiredAt)}.</Alert> : null}
          {access.status === 'error' ? (
            <Alert tone="error">Nie udało się sprawdzić statusu dostępu. Spróbuj odświeżyć stronę.</Alert>
          ) : null}
          {formError ? <Alert tone="error">{formError}</Alert> : null}
          <TextField
            label="Kod dostępu"
            placeholder="XXXX-XXXX-XXXX"
            autoComplete="one-time-code"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            maxLength={14}
            className="text-center font-label text-2xl font-bold tracking-[0.25em]"
            value={code}
            onChange={(e) => setCode(formatAccessCodeInput(e.target.value))}
            error={fieldError}
          />
          <Button type="submit" loading={loading} disabled={code.length === 0}>
            Aktywuj
          </Button>
        </form>
      </Card>

      {env.purchaseUrl ? (
        <a
          href={env.purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 rounded-xl border border-gold/40 px-4 py-3 text-center font-label text-sm font-bold uppercase tracking-[0.2em] text-gold hover:bg-gold/10"
        >
          Nie masz kodu? Kup dostęp
        </a>
      ) : null}

      <div className="mt-auto flex items-center justify-between pt-8 text-sm text-muted">
        <span className="truncate pr-2">{auth.user?.email}</span>
        <div className="flex shrink-0 gap-4">
          <Link to={ROUTES.settings} className="hover:text-white">
            Ustawienia
          </Link>
          <button type="button" className="hover:text-white" onClick={() => void auth.signOut()}>
            Wyloguj
          </button>
        </div>
      </div>
    </main>
  )
}
