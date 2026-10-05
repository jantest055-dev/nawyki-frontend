import { Link } from 'react-router'
import { ROUTES } from '../lib/routes'
import { SwordsIcon } from '../components/Logo'

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <SwordsIcon size={56} />
      <p className="font-display text-5xl text-white">404</p>
      <p className="text-sm text-muted">Nie ma takiej strony.</p>
      <Link to={ROUTES.home} className="font-semibold text-gold hover:text-gold-light">
        Wróć na start
      </Link>
    </main>
  )
}
