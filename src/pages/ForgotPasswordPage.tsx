import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabase'
import { fieldErrors, forgotPasswordSchema } from '../lib/validation'
import { authErrorMessage } from '../lib/authErrors'
import { appUrl, ROUTES } from '../lib/routes'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Button, TextField } from '../components/ui'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [formError, setFormError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    const parsed = forgotPasswordSchema.safeParse({ email })
    if (!parsed.success) {
      setError(fieldErrors(parsed.error).email)
      return
    }
    setError(undefined)
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
        redirectTo: appUrl(ROUTES.newPassword),
      })
      // Nie ujawniamy, czy konto istnieje — pokazujemy błąd tylko przy limitach/sieci.
      if (err && err.status === 429) setFormError(authErrorMessage(err))
      else setSent(true)
    } catch (err) {
      setFormError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset hasła" subtitle="Wyślemy Ci link do ustawienia nowego hasła.">
      {sent ? (
        <div className="flex flex-col gap-4">
          <Alert tone="success">
            Jeśli konto z tym adresem istnieje, wysłaliśmy na nie link do zmiany hasła. Link jest ważny przez
            ograniczony czas.
          </Alert>
          <Link to={ROUTES.login} className="text-center font-semibold text-gold hover:text-gold-light">
            Wróć do logowania
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          {formError ? <Alert tone="error">{formError}</Alert> : null}
          <TextField
            label="E-mail"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          <Button type="submit" loading={loading}>
            Wyślij link
          </Button>
          <Link to={ROUTES.login} className="text-center text-sm text-muted hover:text-white">
            Wróć do logowania
          </Link>
        </form>
      )}
    </AuthLayout>
  )
}
