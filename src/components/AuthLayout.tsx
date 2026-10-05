import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Wordmark } from './Logo'
import { ROUTES } from '../lib/routes'

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Wordmark className="mb-8" />
      <div className="rounded-2xl border border-layer-3 bg-layer-1 p-5 sm:p-6">
        <h1 className="mb-1 font-display text-3xl uppercase tracking-wide text-white">{title}</h1>
        {subtitle ? <p className="mb-5 text-sm text-muted">{subtitle}</p> : <div className="mb-5" />}
        {children}
      </div>
      <footer className="mt-auto pt-8 text-center text-xs text-muted">
        <Link to={ROUTES.privacy} className="underline-offset-4 hover:text-white hover:underline">
          Polityka prywatności
        </Link>
      </footer>
    </main>
  )
}
