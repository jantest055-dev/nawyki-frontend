import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { emailSchema, fieldErrors, loginSchema } from '../lib/validation'
import { authErrorMessage } from '../lib/authErrors'
import { appUrl, ROUTES } from '../lib/routes'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Button, TextField } from '../components/ui'

export function LoginPage() {
  const location = useLocation()
  const flash = (location.state as { flash?: unknown } | null)?.flash
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setInfo(null)
    setNeedsConfirmation(false)
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword(parsed.data)
      if (error) {
        setFormError(authErrorMessage(error))
        setNeedsConfirmation(error instanceof AuthError && error.code === 'email_not_confirmed')
      }
      // Sukces: GuestOnly przekieruje po zmianie sesji.
    } catch (err) {
      setFormError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function resendConfirmation() {
    const parsed = emailSchema.safeParse(email)
    if (!parsed.success) return
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: parsed.data,
      options: { emailRedirectTo: appUrl(ROUTES.authConfirm) },
    })
    setInfo(error ? authErrorMessage(error) : 'Wysłaliśmy ponownie link potwierdzający.')
  }

  return (
    <AuthLayout title="Logowanie" subtitle="Wróć do swojej misji.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {typeof flash === 'string' ? <Alert tone="success">{flash}</Alert> : null}
        {formError ? <Alert tone="error">{formError}</Alert> : null}
        {info ? <Alert tone="info">{info}</Alert> : null}
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <TextField
          label="Hasło"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" loading={loading}>
          Zaloguj
        </Button>
        {needsConfirmation ? (
          <Button type="button" variant="secondary" onClick={() => void resendConfirmation()}>
            Wyślij link ponownie
          </Button>
        ) : null}
      </form>
      <div className="mt-5 flex flex-col items-center gap-3 text-sm">
        <Link to={ROUTES.forgotPassword} className="text-muted hover:text-white">
          Nie pamiętasz hasła?
        </Link>
        <p className="text-muted">
          Nie masz konta?{' '}
          <Link to={ROUTES.register} className="font-semibold text-gold hover:text-gold-light">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
