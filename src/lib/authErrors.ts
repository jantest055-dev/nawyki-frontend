import { AuthError } from '@supabase/supabase-js'

/** Mapuje błędy Supabase Auth na komunikaty po polsku (bez ujawniania szczegółów). */
export function authErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    switch (error.code) {
      case 'invalid_credentials':
        return 'Nieprawidłowy e-mail lub hasło.'
      case 'email_not_confirmed':
        return 'Najpierw potwierdź adres e-mail — sprawdź skrzynkę (także spam).'
      case 'weak_password':
        return 'Hasło jest za słabe. Użyj dłuższego, trudniejszego hasła.'
      case 'same_password':
        return 'Nowe hasło musi różnić się od obecnego.'
      case 'over_email_send_rate_limit':
      case 'over_request_rate_limit':
        return 'Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.'
      case 'otp_expired':
        return 'Link wygasł lub został już użyty. Poproś o nowy.'
      case 'signup_disabled':
        return 'Rejestracja jest obecnie wyłączona.'
      case 'user_banned':
        return 'To konto jest zablokowane.'
      case 'session_not_found':
      case 'refresh_token_not_found':
        return 'Sesja wygasła. Zaloguj się ponownie.'
      case 'unexpected_failure':
        // Trigger tworzący profil odrzucił rejestrację (najczęściej zajęta nazwa).
        if (/database error saving new user/i.test(error.message)) {
          return 'Nie udało się utworzyć konta. Ta nazwa użytkownika może być zajęta — wybierz inną.'
        }
        break
    }
    if (error.status === 429) return 'Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.'
  }
  if (error instanceof TypeError) return 'Brak połączenia z serwerem. Sprawdź internet.'
  return 'Coś poszło nie tak. Spróbuj ponownie.'
}
