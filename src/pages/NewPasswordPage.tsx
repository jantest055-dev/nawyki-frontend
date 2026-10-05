import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import { fieldErrors, newPasswordSchema, PASSWORD_MIN } from '../lib/validation'
import { authErrorMessage } from '../lib/authErrors'
import { ROUTES } from '../lib/routes'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Button, FullScreenLoader, TextField } from '../components/ui'

export function NewPasswordPage() {
  const auth = useAuth()
  const [form, setForm] = useState({ password: '', passwordConfirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  if (auth.status === 'loading') return <FullScreenLoader />

  if (auth.status === 'signedOut') {
    return (
      <AuthLayout title="Link nieaktywny">
        <div className="flex flex-col gap-4">
          <Alert tone="error">Link do zmiany hasła wygasł lub został już użyty.</Alert>
          <Link to={ROUTES.forgotPassword} className="text-center font-semibold text-gold hover:text-gold-light">
            Wyślij nowy link
          </Link>
        </div>
      </AuthLayout>
    )
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    const parsed = newPasswordSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
      if (error) setFormError(authErrorMessage(error))
      else setDone(true)
    } catch (err) {
      setFormError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Nowe hasło" subtitle={`Ustaw nowe hasło (min. ${PASSWORD_MIN} znaków).`}>
      {done ? (
        <div className="flex flex-col gap-4">
          <Alert tone="success">Hasło zostało zmienione.</Alert>
          <Link to={ROUTES.home} className="text-center font-semibold text-gold hover:text-gold-light">
            Przejdź do aplikacji
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          {formError ? <Alert tone="error">{formError}</Alert> : null}
          <TextField
            label="Nowe hasło"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            error={errors.password}
          />
          <TextField
            label="Powtórz hasło"
            type="password"
            autoComplete="new-password"
            value={form.passwordConfirm}
            onChange={(e) => setForm((f) => ({ ...f, passwordConfirm: e.target.value }))}
            error={errors.passwordConfirm}
          />
          <Button type="submit" loading={loading}>
            Zapisz hasło
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
