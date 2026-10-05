import { createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export type AuthState =
  | { status: 'loading'; session: null; user: null }
  | { status: 'signedOut'; session: null; user: null }
  | { status: 'signedIn'; session: Session; user: User }

export type AuthContextValue = AuthState & {
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
