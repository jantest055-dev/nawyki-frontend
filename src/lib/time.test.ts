import { describe, expect, it } from 'vitest'
import { dayInWarsaw, daysBetween, programDay } from './time'

describe('czas polski', () => {
  it('dzień wg Europe/Warsaw, nie UTC', () => {
    // 23:30 UTC 14 stycznia = 00:30 15 stycznia w Polsce (CET, UTC+1)
    expect(dayInWarsaw(new Date('2027-01-14T23:30:00Z'))).toBe('2027-01-15')
    // 22:30 UTC 14 lipca = 00:30 15 lipca (CEST, UTC+2)
    expect(dayInWarsaw(new Date('2027-07-14T22:30:00Z'))).toBe('2027-07-15')
    expect(dayInWarsaw(new Date('2027-07-14T21:59:00Z'))).toBe('2027-07-14')
  })
  it('liczy dni przez zmianę czasu', () => {
    expect(daysBetween('2027-03-27', '2027-03-29')).toBe(2)
    expect(daysBetween('2027-10-30', '2027-11-01')).toBe(2)
  })
  it('dzień programu 1..90', () => {
    const start = new Date('2027-01-01T10:00:00Z')
    expect(programDay(start, new Date('2027-01-01T22:00:00Z'))).toBe(1)
    expect(programDay(start, new Date('2027-01-01T23:30:00Z'))).toBe(2) // po północy w PL
    expect(programDay(start, new Date('2027-12-01T10:00:00Z'))).toBe(90)
  })
})
