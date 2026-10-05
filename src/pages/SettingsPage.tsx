import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import { useAccess } from '../access/AccessContext'
import { DELETE_CONFIRMATION, invokeFunction } from '../lib/functions'
import { dayInWarsaw, formatDatePl } from '../lib/time'
import { ROUTES } from '../lib/routes'
import { AppShell } from '../components/AppShell'
import { Alert, Button, Card, Heading, TextField } from '../components/ui'

const ExportSchema = z.object({ format: z.string(), data: z.record(z.string(), z.unknown()) }).loose()
const DeleteSchema = z.object({ ok: z.literal(true) })

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function SettingsPage() {
  const auth = useAuth()
  const access = useAccess()
  const navigate = useNavigate()
  const hasAccess = access.status === 'ready' && access.active

  const [exporting, setExporting] = useState(false)
  const [exportMsg, setExportMsg] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)

  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function onExport() {
    setExporting(true)
    setExportMsg(null)
    const result = await invokeFunction('export-data', {}, ExportSchema)
    setExporting(false)
    if (!result.ok) {
      setExportMsg({ tone: 'error', text: result.message })
      return
    }
    downloadJson(`nawyki-wojownika-dane-${dayInWarsaw()}.json`, result.data)
    setExportMsg({ tone: 'success', text: 'Plik z Twoimi danymi został pobrany.' })
  }

  async function onDelete() {
    if (confirmText !== DELETE_CONFIRMATION) return
    setDeleting(true)
    setDeleteError(null)
    const result = await invokeFunction('delete-account', { confirm: confirmText }, DeleteSchema)
    if (!result.ok) {
      setDeleting(false)
      setDeleteError(result.message)
      return
    }
    // Konto już nie istnieje — czyścimy tylko lokalną sesję.
    await supabase.auth.signOut({ scope: 'local' })
    navigate(ROUTES.login, { replace: true, state: { flash: 'Twoje konto i wszystkie dane zostały usunięte.' } })
  }

  return (
    <AppShell homeTo={hasAccess ? ROUTES.home : ROUTES.activate}>
      <Heading>Ustawienia</Heading>

      <Card>
        <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-muted">Konto</p>
        <p className="mt-2 break-all text-white">{auth.user?.email}</p>
        <p className="mt-1 text-sm text-muted">
          {access.status === 'ready' && access.expiresAt
            ? access.active
              ? `Dostęp aktywny do ${formatDatePl(access.expiresAt)}.`
              : `Dostęp wygasł ${formatDatePl(access.expiresAt)}.`
            : 'Brak aktywnego dostępu.'}
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {!hasAccess ? (
            <Link
              to={ROUTES.activate}
              className="text-center font-label text-sm font-bold uppercase tracking-[0.2em] text-gold"
            >
              Aktywuj dostęp
            </Link>
          ) : null}
          <Button variant="secondary" onClick={() => void auth.signOut()}>
            Wyloguj
          </Button>
        </div>
      </Card>

      <Card>
        <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-muted">Twoje dane (RODO)</p>
        <p className="mt-2 text-sm">
          Możesz pobrać kopię wszystkich danych powiązanych z kontem w formacie JSON. Szczegóły w{' '}
          <Link to={ROUTES.privacy} className="text-gold underline-offset-4 hover:underline">
            polityce prywatności
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {exportMsg ? <Alert tone={exportMsg.tone}>{exportMsg.text}</Alert> : null}
          <Button variant="secondary" loading={exporting} onClick={() => void onExport()}>
            Pobierz moje dane
          </Button>
        </div>
      </Card>

      <Card className="border-red/40">
        <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-red">Strefa niebezpieczna</p>
        <p className="mt-2 text-sm">
          Usunięcie konta jest <strong className="text-white">nieodwracalne</strong>. Skasujemy konto i wszystkie
          dane: postępy, nawyki, wpisy, XP i historię. Niewykorzystany czas dostępu przepada.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {deleteError ? <Alert tone="error">{deleteError}</Alert> : null}
          <TextField
            label={`Aby potwierdzić, wpisz: ${DELETE_CONFIRMATION}`}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
          <Button
            variant="danger"
            loading={deleting}
            disabled={confirmText !== DELETE_CONFIRMATION}
            onClick={() => void onDelete()}
          >
            Usuń konto i dane
          </Button>
        </div>
      </Card>
    </AppShell>
  )
}
