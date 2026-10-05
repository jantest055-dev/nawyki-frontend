import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { supabase } from '../lib/supabase'
import { emailSchema } from '../lib/validation'
import { authErrorMessage } from '../lib/authErrors'
import { appUrl, ROUTES } from '../lib/routes'
import { AuthLayout } from '../components/AuthLayout'
import { Alert, Button } from '../components/ui'

export function CheckEmailPage() {
  const location = useLocation()
  const parsedEmail = emailSchema.safeParse((location.state as { email?: unknown } | null)?.email)
  const email = parsedEmail.success ? parsedEmail.data : null
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function resend() {
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: appUrl(ROUTES.authConfirm) },
    })
    setLoading(false)
    setInfo(error ? authErrorMessage(error) : 'Wysłaliśmy link ponownie.')
  }

  return (
    <AuthLayout title="Sprawdź pocztę" subtitle="Ostatni krok przed startem.">
      <div className="flex flex-col gap-4 text-sm">
        <p>
          Jeśli adres {email ? <strong className="text-white">{email}</strong> : 'e-mail'} nie był wcześniej
          zarejestrowany, wysłaliśmy na niego link potwierdzający. Kliknij go, aby aktywować konto.
        </p>
        <p className="text-muted">Nie widzisz wiadomości? Sprawdź folder spam.</p>
        {info ? <Alert tone="info">{info}</Alert> : null}
        {email ? (
          <Button variant="secondary" loading={loading} onClick={() => void resend()}>
            Wyślij ponownie
          </Button>
        ) : null}
        <Link to={ROUTES.login} className="text-center font-semibold text-gold hover:text-gold-light">
          Przejdź do logowania
        </Link>
      </div>
    </AuthLayout>
  )
}
