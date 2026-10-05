import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import { AccessContext, type AccessContextValue, type AccessState } from './AccessContext'

const EntitlementsSchema = z.array(
  z.object({ starts_at: z.coerce.date(), expires_at: z.coerce.date() }),
)

// setTimeout przyjmuje maks. ~24,8 dnia.
const MAX_TIMEOUT_MS = 2_147_483_647

/**
 * Stan dostępu dla UI. To tylko wygoda — faktyczną ochronę danych
 * zapewnia RLS w bazie (has_active_access).
 */
export function AccessProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const userId = auth.user?.id ?? null
  // Wynik jest przypięty do użytkownika — po zmianie konta stary wynik jest ignorowany.
  const [result, setResult] = useState<{ userId: string; state: AccessState } | null>(null)
  const state = useMemo<AccessState>(() => {
    if (!userId) return { status: 'idle' }
    return result?.userId === userId ? result.state : { status: 'loading' }
  }, [userId, result])

  const load = useCallback(async () => {
    if (!userId) return
    const setState = (next: AccessState) => setResult({ userId, state: next })
    let accessRes, entRes
    try {
      ;[accessRes, entRes] = await Promise.all([
        supabase.rpc('has_active_access', { uid: userId }),
        supabase.from('entitlements').select('starts_at, expires_at').order('starts_at', { ascending: true }),
      ])
    } catch {
      setState({ status: 'error' })
      return
    }
    const active = z.boolean().safeParse(accessRes.data)
    const entitlements = EntitlementsSchema.safeParse(entRes.data)
    if (accessRes.error || entRes.error || !active.success || !entitlements.success) {
      setState({ status: 'error' })
      return
    }
    const now = Date.now()
    const current = entitlements.data.find((e) => e.starts_at.getTime() <= now && e.expires_at.getTime() > now)
    const expiresAt = entitlements.data.reduce<Date | null>(
      (max, e) => (!max || e.expires_at > max ? e.expires_at : max),
      null,
    )
    setState({ status: 'ready', active: active.data, currentStartsAt: current?.starts_at ?? null, expiresAt })
  }, [userId])

  useEffect(() => {
    void load()
  }, [load])

  // Ponowne sprawdzenie po powrocie do aplikacji (PWA bywa otwarta tygodniami).
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') void load()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [load])

  // Ponowne sprawdzenie w momencie wygaśnięcia dostępu.
  const expiresAtMs = state.status === 'ready' && state.expiresAt ? state.expiresAt.getTime() : null
  useEffect(() => {
    if (expiresAtMs === null) return
    const delay = expiresAtMs - Date.now() + 1000
    if (delay <= 0 || delay > MAX_TIMEOUT_MS) return
    const t = window.setTimeout(() => void load(), delay)
    return () => window.clearTimeout(t)
  }, [expiresAtMs, load])

  const value = useMemo<AccessContextValue>(() => ({ ...state, refresh: load }), [state, load])
  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
}
