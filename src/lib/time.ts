export const APP_TIME_ZONE = 'Europe/Warsaw'
export const PROGRAM_DAYS = 90

/** Data (YYYY-MM-DD) w strefie Europe/Warsaw dla podanej chwili. */
export function dayInWarsaw(date: Date = new Date()): string {
  // en-CA formatuje jako YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** Liczba dni kalendarzowych między dwiema datami YYYY-MM-DD (b - a). */
export function daysBetween(a: string, b: string): number {
  const toUtc = (d: string) => {
    const [y, m, day] = d.split('-').map(Number)
    return Date.UTC(y ?? 0, (m ?? 1) - 1, day ?? 1)
  }
  return Math.round((toUtc(b) - toUtc(a)) / 86_400_000)
}

/** Dzień programu (1..90) liczony od daty startu dostępu wg czasu polskiego. */
export function programDay(startedAt: Date, now: Date = new Date()): number {
  const day = daysBetween(dayInWarsaw(startedAt), dayInWarsaw(now)) + 1
  return Math.min(Math.max(day, 1), PROGRAM_DAYS)
}

export function formatDatePl(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', { timeZone: APP_TIME_ZONE, dateStyle: 'long' }).format(date)
}
