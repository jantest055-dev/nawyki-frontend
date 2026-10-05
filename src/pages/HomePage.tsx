import { useAccess } from '../access/AccessContext'
import { useAuth } from '../auth/AuthContext'
import { formatDatePl, PROGRAM_DAYS, programDay } from '../lib/time'
import { AppShell } from '../components/AppShell'
import { Button, Card } from '../components/ui'

export function HomePage() {
  const access = useAccess()
  const auth = useAuth()
  const ready = access.status === 'ready' ? access : null
  const day = ready?.currentStartsAt ? programDay(ready.currentStartsAt) : 1
  const progress = Math.round((day / PROGRAM_DAYS) * 100)

  return (
    <AppShell>
      <Card className="border-gold/30">
        <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-gold">Twoja misja</p>
        <p className="mt-1 font-display text-6xl leading-none text-white">
          Dzień {day}
          <span className="text-3xl text-muted"> / {PROGRAM_DAYS}</span>
        </p>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-layer-3"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={PROGRAM_DAYS}
          aria-valuenow={day}
          aria-label="Postęp programu"
        >
          <div className="h-full rounded-full bg-gold" style={{ width: `${progress}%` }} />
        </div>
        {ready?.expiresAt ? (
          <p className="mt-3 text-sm text-muted">Dostęp aktywny do {formatDatePl(ready.expiresAt)}.</p>
        ) : null}
      </Card>

      <Card>
        <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-muted">Wkrótce</p>
        <p className="mt-2 text-sm">
          Zadania dnia, lekcje, nawyki i dziennik wdzięczności pojawią się tutaj w kolejnym etapie.
        </p>
      </Card>

      <div className="mt-auto pt-6">
        <Button variant="ghost" onClick={() => void auth.signOut()}>
          Wyloguj
        </Button>
      </div>
    </AppShell>
  )
}
