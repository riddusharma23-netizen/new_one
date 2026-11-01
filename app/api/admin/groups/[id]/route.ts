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
  if (!id) return fail("Invalid group id");
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = asString(body.name);
    const classId = asInteger(body.class_id);
    if (!name || !classId) return fail("Group name and class are required.");
    const result = await execute("UPDATE class_groups SET name=?, class_id=?, description=?, active=? WHERE id=?", [
      name,
      classId,
      asOptionalString(body.description),
      asString(body.active) === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      id,
    ]);
    if (!result.affectedRows) return fail("Group not found", 404);
    if (Array.isArray(body.subject_ids)) {
      await execute("DELETE FROM group_subjects WHERE group_id = ?", [id]);
      for (const subjectId of body.subject_ids.map((value) => asInteger(value)).filter((value): value is number => Boolean(value))) {
        await execute("INSERT IGNORE INTO group_subjects (group_id, subject_id) VALUES (?, ?)", [id, subjectId]);
      }
    }
    await logActivity(session.id, "UPDATE", "groups", id, `Updated student group ${name}`);
    return ok(await queryOne("SELECT * FROM class_groups WHERE id = ?", [id]), "Student group updated");
  } catch (err) {
    console.error(err);
    return fail("Unable to update student group.", 500);
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid group id");
  await execute("DELETE FROM group_subjects WHERE group_id = ?", [id]);
  const result = await execute("DELETE FROM class_groups WHERE id = ?", [id]);
  if (!result.affectedRows) return fail("Group not found", 404);
  await logActivity(session.id, "DELETE", "groups", id, "Deleted student group");
  return ok(null, "Student group deleted");
}
