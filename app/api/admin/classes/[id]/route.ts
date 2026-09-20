import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { getIdParam } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asInteger, asOptionalString, asString } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid class id");

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const class_name = asString(body.class_name);
    const section = asString(body.section);
    const academic_year = asString(body.academic_year);
    if (!class_name || !section || !academic_year) {
      return fail("Class name, section and academic year are required");
    }

    const result = await execute(
      `UPDATE classes SET class_name=?, section=?, academic_year=?, class_teacher_id=?, room=?, status=? WHERE id=?`,
      [
        class_name,
        section,
        academic_year,
        asInteger(body.class_teacher_id),
        asOptionalString(body.room),
        asString(body.status) === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        id,
      ]
    );
    if (!result.affectedRows) return fail("Class not found", 404);
    await logActivity(session.id, "UPDATE", "classes", id, `Updated class ${class_name}-${section}`);
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM classes WHERE id = ?", [id]), "Class updated successfully");
  } catch (err) {
    console.error(err);
    return fail("Unable to update class.", 409);
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid class id");
  try {
    const result = await execute("DELETE FROM classes WHERE id = ?", [id]);
    if (!result.affectedRows) return fail("Class not found", 404);
    await logActivity(session.id, "DELETE", "classes", id, "Deleted class");
    revalidatePublic();
    return ok(null, "Class deleted successfully");
  } catch (err) {
    console.error(err);
    return fail("Unable to delete class. It may have subjects or schedules.", 409);
  }
}
