import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gold text-bg hover:bg-gold-light disabled:bg-layer-3 disabled:text-muted',
  secondary: 'border border-layer-3 bg-layer-2 text-white hover:border-gold/50 disabled:text-muted',
  danger: 'bg-red text-white hover:brightness-110 disabled:bg-layer-3 disabled:text-muted',
  ghost: 'text-muted hover:text-white disabled:opacity-50',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean }

export function Button({ variant = 'primary', loading = false, className = '', children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 font-label text-base font-bold uppercase tracking-[0.15em] transition disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading ? <Spinner small /> : null}
      {children}
    </button>
  )
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string
  error?: string
  hint?: ReactNode
}

export function TextField({ label, error, hint, className = '', ...rest }: TextFieldProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-label text-xs font-bold uppercase tracking-[0.2em] text-muted">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`min-h-12 rounded-xl border bg-layer-1 px-4 text-base text-white placeholder:text-muted/60 focus:border-gold focus:outline-none ${
          error ? 'border-red' : 'border-layer-3'
        } ${className}`}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

type AlertTone = 'error' | 'success' | 'info'
const tones: Record<AlertTone, string> = {
  error: 'border-red/40 bg-red/10 text-red',
  success: 'border-green/40 bg-green/10 text-green',
  info: 'border-blue/40 bg-blue/10 text-blue',
}

export function Alert({ tone, children }: { tone: AlertTone; children: ReactNode }) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}>
      {children}
    </div>
  )
}

export function Spinner({ small = false }: { small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${small ? 'h-4 w-4' : 'h-8 w-8 text-gold'}`}
    />
  )
}

export function FullScreenLoader({ label = 'Ładowanie…' }: { label?: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4" role="status">
      <Spinner />
      <span className="font-label text-sm uppercase tracking-[0.2em] text-muted">{label}</span>
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-layer-3 bg-layer-1 p-5 ${className}`}>{children}</section>
}

export function Heading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h1 className={`font-display text-4xl uppercase leading-none tracking-wide text-white ${className}`}>{children}</h1>
}
