import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { paginate } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asOptionalString, asString, parseJsonArray, slugify } from "@/lib/validation";

function extraJson(body: Record<string, unknown>) {
  return JSON.stringify({
    facilities: parseJsonArray(body.facilities),
    gallery: parseJsonArray(body.gallery),
    achievements: parseJsonArray(body.achievements),
    faculty: parseJsonArray(body.faculty),
    stats: parseJsonArray(body.stats),
  });
}

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    return ok(
      await paginate({
        request,
        table: "departments",
        searchColumns: ["name", "slug", "description"],
        orderBy: "ORDER BY display_order ASC, id DESC",
      })
    );
  } catch (err) {
    console.error(err);
    return fail("Unable to load departments.", 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = asString(body.name);
    if (!name) return fail("Department name is required");
    const slug = asString(body.slug) || slugify(name);
    const result = await execute(
      `INSERT INTO departments (name, slug, description, hero_image, icon_name, color, extra_json, status, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        asOptionalString(body.description),
        asOptionalString(body.hero_image),
        asOptionalString(body.icon_name),
        asOptionalString(body.color),
        extraJson(body),
        asString(body.status) === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        Number(body.display_order) || 0,
      ]
    );
    await logActivity(session.id, "CREATE", "departments", result.insertId, `Created department ${name}`);
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM departments WHERE id = ?", [result.insertId]), "Department created successfully", 201);
  } catch (err) {
    console.error(err);
    return fail("Unable to create department. Slug must be unique.", 409);
  }
}
