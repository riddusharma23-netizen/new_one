import { fail, ok } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const gallery = await query(
      `SELECT id, title, description, image, category, event_name, display_order
       FROM gallery
       WHERE status = 'PUBLISHED'
       ORDER BY display_order ASC, id DESC`
    );
    return ok(gallery);
  } catch (error) {
    console.error(error);
    return fail("Unable to load gallery.", 500);
  }
}
