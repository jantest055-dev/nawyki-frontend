import { createContext, useContext } from 'react'

export type AccessState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | {
      status: 'ready'
      active: boolean
      /** Początek okresu obowiązującego teraz (do liczenia dnia programu). */
      currentStartsAt: Date | null
      /** Koniec całego opłaconego dostępu (z przedłużeniami). */
      expiresAt: Date | null
    }

export type AccessContextValue = AccessState & { refresh: () => Promise<void> }

export const AccessContext = createContext<AccessContextValue | null>(null)

export function useAccess(): AccessContextValue {
  const ctx = useContext(AccessContext)
  if (!ctx) throw new Error('useAccess must be used within AccessProvider')
  return ctx
}
