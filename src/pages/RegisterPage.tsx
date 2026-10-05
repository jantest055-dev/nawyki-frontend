import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'
import { fieldErrors, PASSWORD_MIN, registerSchema } from '../lib/validation'
import { authErrorMessage } from '../lib/authErrors'
import { appUrl, ROUTES } from '../lib/routes'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Button, TextField } from '../components/ui'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', passwordConfirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    const parsed = registerSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: appUrl(ROUTES.authConfirm),
          // Walidowane ponownie w bazie (trigger handle_new_user).
          data: { username: parsed.data.username },
        },
      })
      if (error) {
        setFormError(authErrorMessage(error))
        return
      }
      // Ten sam ekran niezależnie od tego, czy e-mail był już zarejestrowany
      // (Supabase celowo tego nie ujawnia).
      navigate(ROUTES.checkEmail, { state: { email: parsed.data.email } })
    } catch (err) {
      setFormError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Rejestracja" subtitle="Załóż konto i zacznij 90 dni dyscypliny.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError ? <Alert tone="error">{formError}</Alert> : null}
        <TextField
          label="Nazwa użytkownika"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={20}
          value={form.username}
          onChange={set('username')}
          error={errors.username}
          hint="3–20 znaków: a–z, 0–9, _"
        />
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={form.email}
          onChange={set('email')}
          error={errors.email}
        />
        <TextField
          label="Hasło"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          hint={`Minimum ${PASSWORD_MIN} znaków.`}
        />
        <TextField
          label="Powtórz hasło"
          type="password"
          autoComplete="new-password"
          value={form.passwordConfirm}
          onChange={set('passwordConfirm')}
          error={errors.passwordConfirm}
        />
        <p className="text-xs text-muted">
          Zakładając konto, potwierdzasz zapoznanie się z{' '}
          <Link to={ROUTES.privacy} className="text-gold underline-offset-4 hover:underline">
            polityką prywatności
          </Link>
          .
        </p>
        <Button type="submit" loading={loading}>
          Załóż konto
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        Masz już konto?{' '}
        <Link to={ROUTES.login} className="font-semibold text-gold hover:text-gold-light">
          Zaloguj się
        </Link>
      </p>
    </AuthLayout>
  )
}
