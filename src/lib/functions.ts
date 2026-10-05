import { FunctionsFetchError, FunctionsHttpError } from '@supabase/supabase-js'
import { z } from 'zod'
import { supabase } from './supabase'

export type FunctionResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string }

const ErrorBodySchema = z.object({ error: z.string().max(500) })

/** Wywołuje Edge Function i waliduje odpowiedź schematem zod. */
export async function invokeFunction<T>(
  name: 'redeem-code' | 'delete-account' | 'export-data',
  body: Record<string, unknown>,
  schema: z.ZodType<T>,
): Promise<FunctionResult<T>> {
  const { data, error } = await supabase.functions.invoke<unknown>(name, { body })

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const response = error.context as Response
      const parsed = ErrorBodySchema.safeParse(await response.json().catch(() => null))
      return {
        ok: false,
        status: response.status,
        message: parsed.success ? parsed.data.error : 'Coś poszło nie tak. Spróbuj ponownie.',
      }
    }
    if (error instanceof FunctionsFetchError) {
      return { ok: false, status: 0, message: 'Brak połączenia z serwerem. Sprawdź internet.' }
    }
    return { ok: false, status: 0, message: 'Coś poszło nie tak. Spróbuj ponownie.' }
  }

  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return { ok: false, status: 0, message: 'Nieoczekiwana odpowiedź serwera.' }
  }
  return { ok: true, data: parsed.data }
}

export const DELETE_CONFIRMATION = 'USUŃ KONTO'
