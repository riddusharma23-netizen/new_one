import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { paginate } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asOptionalString, asString } from "@/lib/validation";

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    return ok(
      await paginate({
        request,
        table: "gallery",
        searchColumns: ["title", "category", "event_name", "description"],
        orderBy: "ORDER BY display_order ASC, id DESC",
      })
    );
  } catch (err) {
    console.error(err);
    return fail("Unable to load gallery.", 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = asString(body.title);
    const image = asString(body.image);
    if (!title || !image) return fail("Title and image are required");

    const result = await execute(
      `INSERT INTO gallery (title, description, image, category, event_name, display_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        asOptionalString(body.description),
        image,
        asString(body.category) || "General",
        asOptionalString(body.event_name),
        Number(body.display_order) || 0,
        asString(body.status) === "DRAFT" ? "DRAFT" : "PUBLISHED",
      ]
    );
    await logActivity(session.id, "CREATE", "gallery", result.insertId, `Added gallery image ${title}`);
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM gallery WHERE id = ?", [result.insertId]), "Gallery item created successfully", 201);
  } catch (err) {
    console.error(err);
    return fail("Unable to create gallery item.", 500);
  }
}
