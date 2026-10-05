import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { SwordsIcon } from './Logo'
import { ROUTES } from '../lib/routes'

export function AppShell({ children, homeTo = ROUTES.home }: { children: ReactNode; homeTo?: string }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between py-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <Link to={homeTo} className="flex items-center gap-2" aria-label="Strona główna">
          <SwordsIcon size={32} />
          <span className="font-display text-2xl tracking-wider text-white">
            Nawyki <span className="text-gold">Wojownika</span>
          </span>
        </Link>
        <Link
          to={ROUTES.settings}
          className="font-label text-xs font-bold uppercase tracking-[0.2em] text-muted hover:text-white"
        >
          Ustawienia
        </Link>
      </header>
      <main className="flex flex-1 flex-col gap-4">{children}</main>
    </div>
  )
}
