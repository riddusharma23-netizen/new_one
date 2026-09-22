import { fail, ok } from "@/lib/http";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const events = await query(
      `SELECT id, title, description, event_date, start_time, end_time, location, image
       FROM events
       WHERE status = 'PUBLISHED' AND event_date >= CURDATE()
       ORDER BY event_date ASC, start_time ASC`
    );
    return ok(events);
  } catch (error) {
    console.error(error);
    return fail("Unable to load events.", 500);
  }
}
