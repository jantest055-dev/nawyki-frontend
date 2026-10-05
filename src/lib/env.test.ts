import { describe, expect, it } from 'vitest'
import { parseEnv } from './env'

const fakeJwt = (role: string) => `x.${btoa(JSON.stringify({ role })).replace(/=+$/, '')}.y`

const base = { VITE_SUPABASE_URL: 'https://abc.supabase.co', VITE_SUPABASE_ANON_KEY: fakeJwt('anon') + 'padding-padding' }

describe('parseEnv', () => {
  it('akceptuje poprawną konfigurację', () => {
    const r = parseEnv({ ...base, VITE_PURCHASE_URL: 'https://sklep.example.pl' })
    expect(r.ok && r.env.purchaseUrl).toBe('https://sklep.example.pl')
  })
  it('odrzuca klucz service_role w przeglądarce', () => {
    expect(parseEnv({ ...base, VITE_SUPABASE_ANON_KEY: fakeJwt('service_role') + 'padding-padding' }).ok).toBe(false)
    expect(parseEnv({ ...base, VITE_SUPABASE_ANON_KEY: 'sb_secret_abcdefghijklmnopqrstuvwxyz' }).ok).toBe(false)
  })
  it('wymaga https dla linku zakupu', () => {
    expect(parseEnv({ ...base, VITE_PURCHASE_URL: 'javascript:alert(1)' }).ok).toBe(false)
    expect(parseEnv({ ...base, VITE_PURCHASE_URL: 'http://sklep.example.pl' }).ok).toBe(false)
  })
  it('brak URL Supabase = błąd', () => {
    expect(parseEnv({ VITE_SUPABASE_ANON_KEY: base.VITE_SUPABASE_ANON_KEY }).ok).toBe(false)
  })
})
