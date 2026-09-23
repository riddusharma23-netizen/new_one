import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { getIdParam } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asOptionalString, asString, parseJsonArray, slugify } from "@/lib/validation";
import { execute as dbExecute, queryOne as dbQueryOne } from "@/lib/db";

type Context = { params: Promise<{ id: string }> };

function extraJson(body: Record<string, unknown>) {
  return JSON.stringify({
    facilities: parseJsonArray(body.facilities),
    gallery: parseJsonArray(body.gallery),
    achievements: parseJsonArray(body.achievements),
    faculty: parseJsonArray(body.faculty),
    stats: parseJsonArray(body.stats),
  });
}

export async function PATCH(request: Request, context: Context) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid department id");
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = asString(body.name);
    if (!name) return fail("Department name is required");
    const result = await dbExecute(
      `UPDATE departments SET name=?, slug=?, description=?, hero_image=?, icon_name=?, color=?, extra_json=?, status=?, display_order=? WHERE id=?`,
      [name, asString(body.slug) || slugify(name), asOptionalString(body.description), asOptionalString(body.hero_image), asOptionalString(body.icon_name), asOptionalString(body.color), extraJson(body), asString(body.status) === "INACTIVE" ? "INACTIVE" : "ACTIVE", Number(body.display_order) || 0, id]
    );
    if (!result.affectedRows) return fail("Department not found", 404);
    await logActivity(session.id, "UPDATE", "departments", id, `Updated department ${name}`);
    revalidatePublic();
    return ok(await dbQueryOne("SELECT * FROM departments WHERE id = ?", [id]), "Department updated successfully");
  } catch (err) {
    console.error(err);
    return fail("Unable to update department. Slug must be unique.", 409);
  }
}

export async function DELETE(_request: Request, context: Context) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid department id");
  const result = await dbExecute("DELETE FROM departments WHERE id = ?", [id]);
  if (!result.affectedRows) return fail("Department not found", 404);
  await logActivity(session.id, "DELETE", "departments", id, "Deleted department");
  revalidatePublic();
  return ok(null, "Department deleted successfully");
}
