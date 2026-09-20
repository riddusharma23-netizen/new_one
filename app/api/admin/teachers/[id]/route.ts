import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { getIdParam } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asOptionalString, asString } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid teacher id", 400);
  const row = await queryOne("SELECT * FROM teachers WHERE id = ?", [id]);
  if (!row) return fail("Teacher not found", 404);
  return ok(row);
}

export async function PATCH(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid teacher id", 400);

  const existing = await queryOne("SELECT id FROM teachers WHERE id = ?", [id]);
  if (!existing) return fail("Teacher not found", 404);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = asString(body.name);
    const designation = asString(body.designation);
    if (!name || !designation) {
      return fail("Name and designation are required");
    }

    await execute(
      `UPDATE teachers SET
        name=?, designation=?, department=?, subject=?, qualification=?, experience=?,
        email=?, phone=?, image=?, bio=?, staff_type=?, status=?, display_order=?
       WHERE id=?`,
      [
        name,
        designation,
        asOptionalString(body.department),
        asOptionalString(body.subject),
        asOptionalString(body.qualification),
        asOptionalString(body.experience),
        asOptionalString(body.email),
        asOptionalString(body.phone),
        asOptionalString(body.image),
        asOptionalString(body.bio),
        asString(body.staff_type) === "SUPPORT" ? "SUPPORT" : "TEACHER",
        asString(body.status) === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        Number(body.display_order) || 0,
        id,
      ]
    );

    const updated = await queryOne("SELECT * FROM teachers WHERE id = ?", [id]);
    await logActivity(session.id, "UPDATE", "teachers", id, `Updated teacher ${name}`);
    revalidatePublic();
    return ok(updated, "Teacher updated successfully");
  } catch (err) {
    console.error(err);
    return fail("Unable to update teacher.", 500);
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid teacher id", 400);

  try {
    const result = await execute("DELETE FROM teachers WHERE id = ?", [id]);
    if (!result.affectedRows) return fail("Teacher not found", 404);
    await logActivity(session.id, "DELETE", "teachers", id, "Deleted teacher");
    revalidatePublic();
    return ok(null, "Teacher deleted successfully");
  } catch (err) {
    console.error(err);
    return fail("Unable to delete teacher. They may be assigned to a class or schedule.", 409);
  }
}
