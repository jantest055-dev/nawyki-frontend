import { createClient } from '@supabase/supabase-js'
import { parseEnv } from './env'

const result = parseEnv()
if (!result.ok) {
  // main.tsx sprawdza konfigurację przed załadowaniem tego modułu.
  throw new Error('Invalid environment configuration')
}

export const env = result.env

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // implicit: linki z domyślnych szablonów maili działają także, gdy zostaną
    // otwarte w innej przeglądarce niż ta, w której zaczęto rejestrację.
    // Zalecane szablony (token_hash) obsługuje /auth/potwierdz.
    flowType: 'implicit',
  },
})
