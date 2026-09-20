import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { getIdParam } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asOptionalString, asString } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid event id");
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = asString(body.title);
    const event_date = asString(body.event_date);
    if (!title || !event_date) return fail("Title and event date are required");
    const status = asString(body.status) || "PUBLISHED";
    const result = await execute(
      `UPDATE events SET title=?, description=?, event_date=?, start_time=?, end_time=?, location=?, image=?, status=? WHERE id=?`,
      [
        title,
        asOptionalString(body.description),
        event_date,
        asOptionalString(body.start_time),
        asOptionalString(body.end_time),
        asOptionalString(body.location),
        asOptionalString(body.image),
        status === "DRAFT" || status === "CANCELLED" ? status : "PUBLISHED",
        id,
      ]
    );
    if (!result.affectedRows) return fail("Event not found", 404);
    await logActivity(session.id, "UPDATE", "events", id, `Updated event ${title}`);
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM events WHERE id = ?", [id]), "Event updated successfully");
  } catch (err) {
    console.error(err);
    return fail("Unable to update event.", 500);
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid event id");
  const result = await execute("DELETE FROM events WHERE id = ?", [id]);
  if (!result.affectedRows) return fail("Event not found", 404);
  await logActivity(session.id, "DELETE", "events", id, "Deleted event");
  revalidatePublic();
  return ok(null, "Event deleted successfully");
}
