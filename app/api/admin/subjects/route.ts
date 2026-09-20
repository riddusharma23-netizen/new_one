import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { paginate } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { asInteger, asString } from "@/lib/validation";

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const result = await paginate({
      request,
      table: "subjects",
      columns:
        "subjects.*, teachers.name AS teacher_name, CONCAT(classes.class_name, '-', classes.section) AS class_label",
      joins:
        "LEFT JOIN teachers ON teachers.id = subjects.teacher_id LEFT JOIN classes ON classes.id = subjects.class_id",
      searchColumns: ["subjects.subject_name", "subjects.subject_code"],
      orderBy: "ORDER BY subjects.subject_name ASC",
    });
    return ok(result);
  } catch (err) {
    console.error(err);
    return fail("Unable to load subjects.", 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const subject_name = asString(body.subject_name);
    const subject_code = asString(body.subject_code);
    const class_id = asInteger(body.class_id);
    if (!subject_name || !subject_code || !class_id) {
      return fail("Subject name, code and class are required");
    }

    const result = await execute(
      `INSERT INTO subjects (subject_name, subject_code, class_id, teacher_id, weekly_periods, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        subject_name,
        subject_code,
        class_id,
        asInteger(body.teacher_id),
        asInteger(body.weekly_periods) ?? 1,
        asString(body.status) === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      ]
    );
    await logActivity(session.id, "CREATE", "subjects", result.insertId, `Created subject ${subject_name}`);
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM subjects WHERE id = ?", [result.insertId]), "Subject created successfully", 201);
  } catch (err) {
    console.error(err);
    return fail("Unable to create subject. Code must be unique for the class.", 409);
  }
}
