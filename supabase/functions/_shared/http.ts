// Wspólne odpowiedzi HTTP + CORS dla Edge Functions.
//
// CORS: dozwolone originy podajesz w sekrecie ALLOWED_ORIGINS (lista po przecinku),
// np. "https://nawyki.example.pl,http://localhost:5173". Brak sekretu = żaden
// origin przeglądarkowy nie jest dozwolony (domyślnie brak dostępu).

const allowedOrigins = new Set(
  (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
);

export function corsHeaders(req: Request): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  const origin = req.headers.get("Origin");
  if (origin && allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

export function json(req: Request, status: number, body: unknown, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(req),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extra,
    },
  });
}

export function errorResponse(req: Request, status: number, message: string): Response {
  return json(req, status, { error: message });
}

/** Wspólna obsługa preflight i metody. Zwraca Response, jeśli żądanie jest już obsłużone. */
export function handlePreflightAndMethod(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }
  if (req.method !== "POST") {
    return errorResponse(req, 405, "Metoda niedozwolona.");
  }
  return null;
}

const MAX_BODY_BYTES = 4096;

/** Czyta ciało JSON z limitem rozmiaru. Zwraca undefined przy błędzie. */
export async function readJson(req: Request): Promise<unknown | undefined> {
  const declared = Number(req.headers.get("Content-Length") ?? "0");
  if (declared > MAX_BODY_BYTES) return undefined;
  const text = await req.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
