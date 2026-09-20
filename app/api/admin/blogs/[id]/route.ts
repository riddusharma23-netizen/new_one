import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { getIdParam } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asOptionalString, asString, slugify } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid blog id");
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = asString(body.title);
    if (!title) return fail("Title is required");
    const slug = asString(body.slug) || slugify(title);
    const status = asString(body.status) === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
    const published_at =
      status === "PUBLISHED"
        ? asOptionalString(body.published_at) || new Date().toISOString().slice(0, 19).replace("T", " ")
        : asOptionalString(body.published_at);

    const result = await execute(
      `UPDATE blogs SET
        title=?, slug=?, excerpt=?, content=?, featured_image=?, author=?, category=?,
        status=?, published_at=?, seo_title=?, seo_description=?
       WHERE id=?`,
      [
        title,
        slug,
        asOptionalString(body.excerpt),
        asOptionalString(body.content),
        asOptionalString(body.featured_image),
        asOptionalString(body.author),
        asOptionalString(body.category),
        status,
        published_at,
        asOptionalString(body.seo_title),
        asOptionalString(body.seo_description),
        id,
      ]
    );
    if (!result.affectedRows) return fail("Blog not found", 404);
    await logActivity(session.id, "UPDATE", "blogs", id, `Updated blog ${title}`);
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM blogs WHERE id = ?", [id]), "Blog updated successfully");
  } catch (err) {
    console.error(err);
    return fail("Unable to update blog. Slug must be unique.", 409);
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid blog id");
  const result = await execute("DELETE FROM blogs WHERE id = ?", [id]);
  if (!result.affectedRows) return fail("Blog not found", 404);
  await logActivity(session.id, "DELETE", "blogs", id, "Deleted blog");
  revalidatePublic();
  return ok(null, "Blog deleted successfully");
}
