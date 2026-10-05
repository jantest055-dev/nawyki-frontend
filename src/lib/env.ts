import { z } from 'zod'

const EnvSchema = z.object({
  VITE_SUPABASE_URL: z.url({ protocol: /^https?$/, error: 'VITE_SUPABASE_URL musi być adresem URL.' }),
  VITE_SUPABASE_ANON_KEY: z
    .string({ error: 'VITE_SUPABASE_ANON_KEY jest wymagany.' })
    .min(20, { error: 'VITE_SUPABASE_ANON_KEY jest za krótki.' }),
  VITE_PURCHASE_URL: z
    .union([z.url({ protocol: /^https$/, error: 'VITE_PURCHASE_URL musi być adresem https.' }), z.literal('')])
    .optional(),
})

export type AppEnv = {
  supabaseUrl: string
  supabaseAnonKey: string
  purchaseUrl: string | null
}

/** Odczytuje rolę z JWT bez weryfikacji podpisu — tylko jako bezpiecznik konfiguracji. */
function jwtRole(token: string): string | null {
  const payload = token.split('.')[1]
  if (!payload) return null
  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const role: unknown = JSON.parse(json)?.role
    return typeof role === 'string' ? role : null
  } catch {
    return null
  }
}

export type EnvResult = { ok: true; env: AppEnv } | { ok: false; errors: string[] }

export function parseEnv(raw: Record<string, unknown> = import.meta.env): EnvResult {
  const parsed = EnvSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.issues.map((i) => i.message) }
  }
  const key = parsed.data.VITE_SUPABASE_ANON_KEY
  // Bezpiecznik: klucz z uprawnieniami admina nie może trafić do przeglądarki.
  if (key.startsWith('sb_secret_') || jwtRole(key) === 'service_role') {
    return {
      ok: false,
      errors: ['VITE_SUPABASE_ANON_KEY zawiera klucz service_role/secret. Użyj klucza anon (publishable).'],
    }
  }
  return {
    ok: true,
    env: {
      supabaseUrl: parsed.data.VITE_SUPABASE_URL,
      supabaseAnonKey: key,
      purchaseUrl: parsed.data.VITE_PURCHASE_URL || null,
    },
  }
}
