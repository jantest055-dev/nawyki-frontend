// Edge Function: export-data (RODO — prawo dostępu i przenoszenia danych)
// Zwraca wszystkie dane użytkownika jako JSON. Działa także bez aktywnego
// dostępu (service_role omija RLS, ale filtrujemy ZAWSZE po user.id).
import { errorResponse, handlePreflightAndMethod, json } from "../_shared/http.ts";
import { adminClient, getAuthenticatedUser } from "../_shared/supabase.ts";

const PAGE_SIZE = 1000;

// tabela -> [kolumna z id użytkownika, kolumna sortowania, kolumny eksportu]
const TABLES: Record<string, { userColumn: string; orderBy: string; columns: string }> = {
  profiles: { userColumn: "id", orderBy: "id", columns: "username, created_at" },
  entitlements: { userColumn: "user_id", orderBy: "starts_at", columns: "starts_at, expires_at, source, created_at" },
  code_redemption_attempts: { userColumn: "user_id", orderBy: "attempted_at", columns: "attempted_at" },
  access_codes: { userColumn: "used_by", orderBy: "used_at", columns: "used_at" },
  task_completions: { userColumn: "user_id", orderBy: "day", columns: "task_key, day, created_at" },
  lesson_completions: { userColumn: "user_id", orderBy: "lesson_number", columns: "lesson_number, completed_at" },
  habits: { userColumn: "user_id", orderBy: "created_at", columns: "id, name, time_block, created_at" },
  habit_checks: { userColumn: "user_id", orderBy: "day", columns: "habit_id, day, created_at" },
  gratitude_entries: { userColumn: "user_id", orderBy: "day", columns: "day, content, created_at, updated_at" },
  xp_events: { userColumn: "user_id", orderBy: "id", columns: "amount, reason, ref, created_at" },
  user_badges: { userColumn: "user_id", orderBy: "earned_at", columns: "badge_key, earned_at" },
  shop_purchases: { userColumn: "user_id", orderBy: "created_at", columns: "item_key, cost, created_at" },
  streak_freezes: { userColumn: "user_id", orderBy: "day", columns: "day, created_at" },
  ai_messages: { userColumn: "user_id", orderBy: "id", columns: "role, content, created_at" },
};

async function fetchAll(table: string, userId: string): Promise<unknown[]> {
  const { userColumn, orderBy, columns } = TABLES[table];
  const rows: unknown[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await adminClient()
      .from(table)
      .select(columns)
      .eq(userColumn, userId)
      .order(orderBy, { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`export failed for ${table}: ${error.code}`);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) return rows;
  }
}

Deno.serve(async (req) => {
  const early = handlePreflightAndMethod(req);
  if (early) return early;

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return errorResponse(req, 401, "Musisz być zalogowany.");

    const data: Record<string, unknown[]> = {};
    for (const table of Object.keys(TABLES)) {
      data[table] = await fetchAll(table, user.id);
    }

    return json(req, 200, {
      format: "nawyki-wojownika-export/v1",
      exported_at: new Date().toISOString(),
      account: {
        id: user.id,
        email: user.email ?? null,
        created_at: user.created_at,
        email_confirmed_at: user.email_confirmed_at ?? null,
        last_sign_in_at: user.last_sign_in_at ?? null,
      },
      data,
    });
  } catch (err) {
    console.error("export-data error", err instanceof Error ? err.message : "unknown");
    return errorResponse(req, 500, "Nie udało się przygotować eksportu. Spróbuj ponownie.");
  }
});
