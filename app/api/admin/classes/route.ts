import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { paginate } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asInteger, asOptionalString, asString } from "@/lib/validation";

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const result = await paginate({
      request,
      table: "classes",
      columns:
        "classes.*, teachers.name AS class_teacher_name, CONCAT(classes.class_name, '-', classes.section) AS label",
      joins: "LEFT JOIN teachers ON teachers.id = classes.class_teacher_id",
      searchColumns: ["classes.class_name", "classes.section", "classes.academic_year", "classes.room"],
      orderBy: "ORDER BY classes.class_name ASC, classes.section ASC",
    });
    return ok(result);
  } catch (err) {
    console.error(err);
    return fail("Unable to load classes.", 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const class_name = asString(body.class_name);
    const section = asString(body.section);
    const academic_year = asString(body.academic_year);
    if (!class_name || !section || !academic_year) {
      return fail("Class name, section and academic year are required");
    }

    const result = await execute(
      `INSERT INTO classes (class_name, section, academic_year, class_teacher_id, room, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        class_name,
        section,
        academic_year,
        asInteger(body.class_teacher_id),
        asOptionalString(body.room),
        asString(body.status) === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      ]
    );
    const created = await queryOne("SELECT * FROM classes WHERE id = ?", [result.insertId]);
    await logActivity(session.id, "CREATE", "classes", result.insertId, `Created class ${class_name}-${section}`);
    revalidatePublic();
    return ok(created, "Class created successfully", 201);
  } catch (err) {
    console.error(err);
    return fail("Unable to create class. Class, section and year must be unique.", 409);
  }
}
