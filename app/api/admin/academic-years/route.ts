import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, query, queryOne } from "@/lib/db";
import { fail, ok } from "@/lib/http";
import { prepareTimetable } from "@/lib/timetable";
import { asOptionalString, asString } from "@/lib/validation";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  await prepareTimetable();
  return ok(await query("SELECT * FROM academic_years ORDER BY name DESC"));
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  await prepareTimetable();
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = asString(body.name);
    if (!name) return fail("Academic year name is required.");
    const result = await execute(
      "INSERT INTO academic_years (name, start_date, end_date, status) VALUES (?, ?, ?, ?)",
      [name, asOptionalString(body.start_date), asOptionalString(body.end_date), asString(body.status) === "INACTIVE" ? "INACTIVE" : "ACTIVE"]
    );
    await logActivity(session.id, "CREATE", "academic_years", result.insertId, `Created academic year ${name}`);
    return ok(await queryOne("SELECT * FROM academic_years WHERE id = ?", [result.insertId]), "Academic year created", 201);
  } catch (err) {
    console.error(err);
    return fail("Unable to create academic year.", 500);
  }
}
