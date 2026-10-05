import { createClient, type SupabaseClient, type User } from "npm:@supabase/supabase-js@2";

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

let admin: SupabaseClient | null = null;

/**
 * Klient z kluczem service_role — omija RLS. Używać WYŁĄCZNIE po
 * zweryfikowaniu użytkownika i zawsze filtrować po jego user.id.
 * SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY są dostarczane automatycznie
 * przez środowisko Edge Functions — nie trzymaj ich w repo.
 */
export function adminClient(): SupabaseClient {
  if (!admin) {
    admin = createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return admin;
}

/**
 * Weryfikuje JWT z nagłówka Authorization przez serwer Auth (sprawdza podpis,
 * wygaśnięcie i to, że użytkownik nadal istnieje). Zwraca null, gdy brak/zły token.
 */
export async function getAuthenticatedUser(req: Request): Promise<User | null> {
  const header = req.headers.get("Authorization") ?? "";
  const match = /^Bearer\s+([A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+)$/.exec(header);
  if (!match) return null;
  const { data, error } = await adminClient().auth.getUser(match[1]);
  if (error || !data.user) return null;
  return data.user;
}
