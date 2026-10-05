// Normalizacja i hashowanie kodów dostępu.
// MUSI być zgodne z private.generate_access_codes (SQL): hash SHA-256 (hex)
// z 12 znaków, wielkie litery, bez myślników i spacji.

export const ACCESS_CODE_PATTERN = /^[A-HJ-NP-Z2-9]{12}$/;

export function normalizeAccessCode(input: string): string {
  return input.toUpperCase().replace(/[\s-]/g, "");
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
