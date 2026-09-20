import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { getIdParam } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asInteger, asString } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid subject id");

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const subject_name = asString(body.subject_name);
    const subject_code = asString(body.subject_code);
    const class_id = asInteger(body.class_id);
    if (!subject_name || !subject_code || !class_id) {
      return fail("Subject name, code and class are required");
    }

    const result = await execute(
      `UPDATE subjects SET subject_name=?, subject_code=?, class_id=?, teacher_id=?, weekly_periods=?, status=? WHERE id=?`,
      [
        subject_name,
        subject_code,
        class_id,
        asInteger(body.teacher_id),
        asInteger(body.weekly_periods) ?? 1,
        asString(body.status) === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        id,
      ]
    );
    if (!result.affectedRows) return fail("Subject not found", 404);
    await logActivity(session.id, "UPDATE", "subjects", id, `Updated subject ${subject_name}`);
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM subjects WHERE id = ?", [id]), "Subject updated successfully");
  } catch (err) {
    console.error(err);
    return fail("Unable to update subject.", 409);
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid subject id");
  try {
    const result = await execute("DELETE FROM subjects WHERE id = ?", [id]);
    if (!result.affectedRows) return fail("Subject not found", 404);
    await logActivity(session.id, "DELETE", "subjects", id, "Deleted subject");
    revalidatePublic();
    return ok(null, "Subject deleted successfully");
  } catch (err) {
    console.error(err);
    return fail("Unable to delete subject. It may be used in a schedule.", 409);
  }
}
