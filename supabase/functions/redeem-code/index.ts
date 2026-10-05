// Edge Function: redeem-code
// Aktywuje dostęp (90 dni) jednorazowym kodem.
//  - wymaga zalogowanego użytkownika (JWT weryfikowany przez serwer Auth)
//  - limit 5 prób / godzinę / użytkownika (w bazie, atomowo)
//  - zajęcie kodu i utworzenie entitlement w JEDNEJ transakcji
//    (funkcja SQL public.redeem_access_code)
//  - ten sam ogólny komunikat dla kodu nieistniejącego i już wykorzystanego
import { z } from "npm:zod@4";
import { errorResponse, handlePreflightAndMethod, json, readJson } from "../_shared/http.ts";
import { adminClient, getAuthenticatedUser } from "../_shared/supabase.ts";
import { ACCESS_CODE_PATTERN, normalizeAccessCode, sha256Hex } from "../_shared/accessCode.ts";

const GENERIC_ERROR = "Nieprawidłowy kod lub kod został już wykorzystany.";

const BodySchema = z.object({ code: z.string().min(1).max(64) }).strict();

const RpcResultSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("ok"), starts_at: z.string(), expires_at: z.string() }),
  z.object({ status: z.literal("invalid") }),
  z.object({ status: z.literal("rate_limited") }),
]);

Deno.serve(async (req) => {
  const early = handlePreflightAndMethod(req);
  if (early) return early;

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return errorResponse(req, 401, "Musisz być zalogowany.");

    const parsed = BodySchema.safeParse(await readJson(req));
    if (!parsed.success) return errorResponse(req, 400, GENERIC_ERROR);

    const normalized = normalizeAccessCode(parsed.data.code);
    // Kod w złym formacie i tak liczy się jako próba (p_code_hash = null).
    const codeHash = ACCESS_CODE_PATTERN.test(normalized) ? await sha256Hex(normalized) : null;

    const { data, error } = await adminClient().rpc("redeem_access_code", {
      p_user_id: user.id,
      p_code_hash: codeHash,
    });
    if (error) {
      console.error("redeem_access_code failed", error.code);
      return errorResponse(req, 500, "Błąd serwera. Spróbuj ponownie za chwilę.");
    }

    const result = RpcResultSchema.safeParse(data);
    if (!result.success) {
      console.error("redeem_access_code: unexpected result shape");
      return errorResponse(req, 500, "Błąd serwera. Spróbuj ponownie za chwilę.");
    }

    switch (result.data.status) {
      case "ok":
        return json(req, 200, { ok: true, starts_at: result.data.starts_at, expires_at: result.data.expires_at });
      case "rate_limited":
        return errorResponse(req, 429, "Zbyt wiele prób. Spróbuj ponownie za godzinę.");
      case "invalid":
        return errorResponse(req, 400, GENERIC_ERROR);
    }
  } catch (err) {
    console.error("redeem-code unhandled error", err instanceof Error ? err.name : "unknown");
    return errorResponse(req, 500, "Błąd serwera. Spróbuj ponownie za chwilę.");
  }
});
