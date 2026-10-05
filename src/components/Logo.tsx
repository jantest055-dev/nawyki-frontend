type LogoProps = { size?: number; className?: string }

/** Skrzyżowane miecze — znak aplikacji. */
export function SwordsIcon({ size = 48, className }: LogoProps) {
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <defs>
        <g id="nw-sword">
          <path d="M256 62 L278 100 L278 340 L234 340 L234 100 Z" fill="#f0a500" />
          <path d="M256 74 L262 100 L262 334 L250 334 L250 100 Z" fill="#ffbe33" />
          <rect x="188" y="336" width="136" height="24" rx="8" fill="#ffbe33" />
          <rect x="243" y="360" width="26" height="72" rx="6" fill="#263646" stroke="#f0a500" strokeWidth="6" />
          <circle cx="256" cy="446" r="18" fill="#f0a500" />
        </g>
      </defs>
      <use href="#nw-sword" transform="rotate(42 256 256)" />
      <use href="#nw-sword" transform="rotate(-42 256 256)" />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <SwordsIcon size={64} />
      <p className="font-display text-4xl leading-none tracking-wider text-white">
        Nawyki <span className="text-gold">Wojownika</span>
      </p>
      <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-muted">90 dni dyscypliny</p>
    </div>
  )
}
