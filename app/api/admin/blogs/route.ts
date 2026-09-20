import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { paginate } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asOptionalString, asString, slugify } from "@/lib/validation";

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    return ok(
      await paginate({
        request,
        table: "blogs",
        searchColumns: ["title", "slug", "author", "category"],
        orderBy: "ORDER BY COALESCE(published_at, created_at) DESC",
      })
    );
  } catch (err) {
    console.error(err);
    return fail("Unable to load blogs.", 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = asString(body.title);
    if (!title) return fail("Title is required");
    const slug = asString(body.slug) || slugify(title);
    const status = asString(body.status) === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
    const published_at = status === "PUBLISHED" ? asOptionalString(body.published_at) || new Date().toISOString().slice(0, 19).replace("T", " ") : asOptionalString(body.published_at);

    const result = await execute(
      `INSERT INTO blogs
        (title, slug, excerpt, content, featured_image, author, category, status, published_at, seo_title, seo_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        asOptionalString(body.excerpt),
        asOptionalString(body.content),
        asOptionalString(body.featured_image),
        asOptionalString(body.author) || session.name,
        asOptionalString(body.category),
        status,
        published_at,
        asOptionalString(body.seo_title),
        asOptionalString(body.seo_description),
      ]
    );
    await logActivity(session.id, "CREATE", "blogs", result.insertId, `Created blog ${title}`);
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM blogs WHERE id = ?", [result.insertId]), "Blog created successfully", 201);
  } catch (err) {
    console.error(err);
    return fail("Unable to create blog. Slug must be unique.", 409);
  }
}
