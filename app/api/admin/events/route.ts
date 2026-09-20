import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { paginate } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asOptionalString, asString } from "@/lib/validation";

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    return ok(
      await paginate({
        request,
        table: "events",
        searchColumns: ["title", "location", "description"],
        orderBy: "ORDER BY event_date DESC",
      })
    );
  } catch (err) {
    console.error(err);
    return fail("Unable to load events.", 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = asString(body.title);
    const event_date = asString(body.event_date);
    if (!title || !event_date) return fail("Title and event date are required");
    const status = asString(body.status) || "PUBLISHED";
    const result = await execute(
      `INSERT INTO events (title, description, event_date, start_time, end_time, location, image, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        asOptionalString(body.description),
        event_date,
        asOptionalString(body.start_time),
        asOptionalString(body.end_time),
        asOptionalString(body.location),
        asOptionalString(body.image),
        status === "DRAFT" || status === "CANCELLED" ? status : "PUBLISHED",
      ]
    );
    await logActivity(session.id, "CREATE", "events", result.insertId, `Created event ${title}`);
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM events WHERE id = ?", [result.insertId]), "Event created successfully", 201);
  } catch (err) {
    console.error(err);
    return fail("Unable to create event.", 500);
  }
}
