import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { ROUTES } from '../lib/routes'
import { AuthContext, type AuthContextValue, type AuthState } from './AuthContext'

function toState(session: Session | null): AuthState {
  return session
    ? { status: 'signedIn', session, user: session.user }
    : { status: 'signedOut', session: null, user: null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', session: null, user: null })
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active) setState(toState(data.session))
    })

    // Uwaga: w tym callbacku nie wolno czekać (await) na inne wywołania supabase.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setState(toState(session))
      if (event === 'PASSWORD_RECOVERY') {
        navigate(ROUTES.newPassword, { replace: true })
      }
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [navigate])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    navigate(ROUTES.login, { replace: true })
  }, [navigate])

  const value = useMemo<AuthContextValue>(() => ({ ...state, signOut }), [state, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
