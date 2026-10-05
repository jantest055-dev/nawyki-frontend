// Edge Function: delete-account (RODO — prawo do usunięcia danych)
// Usuwa konto auth użytkownika. Wszystkie tabele z danymi mają
// ON DELETE CASCADE do auth.users, więc dane znikają razem z kontem.
// Wykorzystany kod dostępu pozostaje oznaczony jako użyty (used_by = null).
import { z } from "npm:zod@4";
import { errorResponse, handlePreflightAndMethod, json, readJson } from "../_shared/http.ts";
import { adminClient, getAuthenticatedUser } from "../_shared/supabase.ts";

const DELETE_CONFIRMATION = "USUŃ KONTO";

const BodySchema = z.object({ confirm: z.literal(DELETE_CONFIRMATION) }).strict();

Deno.serve(async (req) => {
  const early = handlePreflightAndMethod(req);
  if (early) return early;

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return errorResponse(req, 401, "Musisz być zalogowany.");

    const parsed = BodySchema.safeParse(await readJson(req));
    if (!parsed.success) {
      return errorResponse(req, 400, `Aby potwierdzić, wpisz dokładnie: ${DELETE_CONFIRMATION}`);
    }

    // Twarde usunięcie (shouldSoftDelete = false).
    const { error } = await adminClient().auth.admin.deleteUser(user.id, false);
    if (error) {
      console.error("deleteUser failed", error.status ?? "unknown");
      return errorResponse(req, 500, "Nie udało się usunąć konta. Spróbuj ponownie lub skontaktuj się z nami.");
    }

    return json(req, 200, { ok: true });
  } catch (err) {
    console.error("delete-account unhandled error", err instanceof Error ? err.name : "unknown");
    return errorResponse(req, 500, "Nie udało się usunąć konta. Spróbuj ponownie lub skontaktuj się z nami.");
  }
});
