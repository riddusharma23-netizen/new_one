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
  if (!id) return fail("Invalid gallery id");
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = asString(body.title);
    const image = asString(body.image);
    if (!title || !image) return fail("Title and image are required");
    const result = await execute(
      `UPDATE gallery SET title=?, description=?, image=?, category=?, event_name=?, display_order=?, status=? WHERE id=?`,
      [
        title,
        asOptionalString(body.description),
        image,
        asString(body.category) || "General",
        asOptionalString(body.event_name),
        Number(body.display_order) || 0,
        asString(body.status) === "DRAFT" ? "DRAFT" : "PUBLISHED",
        id,
      ]
    );
    if (!result.affectedRows) return fail("Gallery item not found", 404);
    await logActivity(session.id, "UPDATE", "gallery", id, `Updated gallery item ${title}`);
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM gallery WHERE id = ?", [id]), "Gallery item updated successfully");
  } catch (err) {
    console.error(err);
    return fail("Unable to update gallery item.", 500);
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid gallery id");
  const result = await execute("DELETE FROM gallery WHERE id = ?", [id]);
  if (!result.affectedRows) return fail("Gallery item not found", 404);
  await logActivity(session.id, "DELETE", "gallery", id, "Deleted gallery item");
  revalidatePublic();
  return ok(null, "Gallery item deleted successfully");
}
