import { z } from 'zod'

export const PASSWORD_MIN = 10
// Supabase Auth (bcrypt) bierze pod uwagę maks. 72 bajty hasła.
export const PASSWORD_MAX = 72

export const emailSchema = z
  .string()
  .trim()
  .min(1, { error: 'Podaj adres e-mail.' })
  .max(254, { error: 'Adres e-mail jest za długi.' })
  .pipe(z.email({ error: 'Podaj poprawny adres e-mail.' }))

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, { error: `Hasło musi mieć co najmniej ${PASSWORD_MIN} znaków.` })
  .refine((v) => new TextEncoder().encode(v).byteLength <= PASSWORD_MAX, {
    error: `Hasło może mieć maksymalnie ${PASSWORD_MAX} bajty.`,
  })

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]{3,20}$/, { error: 'Nazwa: 3–20 znaków, tylko litery a–z, cyfry i _.' })

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: 'Podaj hasło.' }).max(256),
})

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    error: 'Hasła nie są identyczne.',
    path: ['passwordConfirm'],
  })

export const forgotPasswordSchema = z.object({ email: emailSchema })

export const newPasswordSchema = z
  .object({ password: passwordSchema, passwordConfirm: z.string() })
  .refine((v) => v.password === v.passwordConfirm, {
    error: 'Hasła nie są identyczne.',
    path: ['passwordConfirm'],
  })

// ---- Kody dostępu --------------------------------------------------------
// Alfabet bez mylących znaków 0/O/1/I. Musi być zgodny z SQL i Edge Function.
export const ACCESS_CODE_LENGTH = 12
const ACCESS_CODE_PATTERN = /^[A-HJ-NP-Z2-9]{12}$/

export function normalizeAccessCode(input: string): string {
  return input.toUpperCase().replace(/[\s-]/g, '')
}

/** Formatuje wpisywany kod jako XXXX-XXXX-XXXX (dla wygody w polu tekstowym). */
export function formatAccessCodeInput(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, ACCESS_CODE_LENGTH)
  return raw.match(/.{1,4}/g)?.join('-') ?? ''
}

export const accessCodeSchema = z
  .string()
  .transform(normalizeAccessCode)
  .pipe(
    z
      .string()
      .length(ACCESS_CODE_LENGTH, { error: `Kod ma ${ACCESS_CODE_LENGTH} znaków (XXXX-XXXX-XXXX).` })
      .regex(ACCESS_CODE_PATTERN, { error: 'Kod zawiera niedozwolone znaki (kody nie zawierają 0, O, 1 ani I).' }),
  )

/** Zwraca błędy pól (pierwszy komunikat na pole) z wyniku safeParse. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_')
    if (!(key in out)) out[key] = issue.message
  }
  return out
}
