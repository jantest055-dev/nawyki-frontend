import { describe, expect, it } from 'vitest'
import {
  accessCodeSchema,
  formatAccessCodeInput,
  normalizeAccessCode,
  passwordSchema,
  registerSchema,
  usernameSchema,
} from './validation'

describe('kody dostępu', () => {
  it('normalizuje wielkość liter, spacje i myślniki', () => {
    expect(normalizeAccessCode(' abcd-efgh jkmn ')).toBe('ABCDEFGHJKMN')
  })
  it('formatuje wpisywany kod jako XXXX-XXXX-XXXX', () => {
    expect(formatAccessCodeInput('abcdefghjkmnpq')).toBe('ABCD-EFGH-JKMN')
    expect(formatAccessCodeInput('ab')).toBe('AB')
    expect(formatAccessCodeInput('')).toBe('')
  })
  it('akceptuje poprawny kod', () => {
    expect(accessCodeSchema.parse('abcd-efgh-2345')).toBe('ABCDEFGH2345')
  })
  it.each(['ABCD-EFGH-JKM0', 'ABCD-EFGH-JKMO', 'ABCD-EFGH-JKM1', 'ABCD-EFGH-JKMI', 'ABCD-EFGH', 'ABCD-EFGH-JKMNP'])(
    'odrzuca %s',
    (code) => {
      expect(accessCodeSchema.safeParse(code).success).toBe(false)
    },
  )
})

describe('hasło', () => {
  it('wymaga min. 10 znaków', () => {
    expect(passwordSchema.safeParse('123456789').success).toBe(false)
    expect(passwordSchema.safeParse('1234567890').success).toBe(true)
  })
  it('odrzuca hasło > 72 bajty (limit bcrypt)', () => {
    expect(passwordSchema.safeParse('ą'.repeat(37)).success).toBe(false)
    expect(passwordSchema.safeParse('a'.repeat(72)).success).toBe(true)
  })
})

describe('nazwa użytkownika', () => {
  it('akceptuje [a-z0-9_]{3,20} i zamienia na małe litery', () => {
    expect(usernameSchema.parse(' Jan_99 ')).toBe('jan_99')
  })
  it.each(['ab', 'a'.repeat(21), 'jan kowalski', 'żółw', 'jan-k', '<script>'])('odrzuca %s', (u) => {
    expect(usernameSchema.safeParse(u).success).toBe(false)
  })
})

describe('rejestracja', () => {
  it('wymaga zgodnych haseł', () => {
    const r = registerSchema.safeParse({
      username: 'jan',
      email: 'jan@example.com',
      password: 'bardzodlugie1',
      passwordConfirm: 'bardzodlugie2',
    })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0]?.path).toEqual(['passwordConfirm'])
  })
  it('odrzuca niepoprawny e-mail', () => {
    const r = registerSchema.safeParse({ username: 'jan', email: 'nie-email', password: 'x'.repeat(10), passwordConfirm: 'x'.repeat(10) })
    expect(r.success).toBe(false)
  })
})
