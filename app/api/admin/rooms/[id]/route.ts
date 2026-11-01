import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { fail, ok } from "@/lib/http";
import { getIdParam } from "@/lib/list";
import { asInteger, asOptionalString, asString } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid room id");
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = asString(body.name);
    if (!name) return fail("Room name is required.");
    const result = await execute("UPDATE rooms SET name=?, room_type=?, building=?, capacity=?, active=? WHERE id=?", [
      name,
      asString(body.room_type) || "CLASSROOM",
      asOptionalString(body.building),
      asInteger(body.capacity),
      asString(body.active) === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      id,
    ]);
    if (!result.affectedRows) return fail("Classroom not found", 404);
    await logActivity(session.id, "UPDATE", "rooms", id, `Updated classroom ${name}`);
    return ok(await queryOne("SELECT * FROM rooms WHERE id = ?", [id]), "Classroom updated");
  } catch (err) {
    console.error(err);
    return fail("Unable to update classroom.", 500);
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid room id");
  const result = await execute("DELETE FROM rooms WHERE id = ?", [id]);
  if (!result.affectedRows) return fail("Classroom not found", 404);
  await logActivity(session.id, "DELETE", "rooms", id, "Deleted classroom");
  return ok(null, "Classroom deleted");
}
