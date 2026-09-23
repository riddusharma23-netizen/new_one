import { fail, ok } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query<Record<string, unknown>>(
      `SELECT id, name, slug, description, hero_image, icon_name, color, extra_json, display_order
       FROM departments WHERE status = 'ACTIVE' ORDER BY display_order ASC, id ASC`
    );
    return ok(rows.map((row) => {
      let extra: Record<string, unknown> = {};
      try { extra = typeof row.extra_json === "string" ? JSON.parse(row.extra_json) : (row.extra_json as Record<string, unknown> | null) ?? {}; } catch { extra = {}; }
      return { ...row, ...extra, title: row.name, banner: row.hero_image };
    }));
  } catch (error) {
    console.error(error);
    return fail("Unable to load departments.", 500);
  }
}
