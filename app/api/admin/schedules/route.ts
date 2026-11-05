import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { paginate } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { InvalidSchedulePeriodError, resolvePeriodTimes } from "@/lib/schedule-conflicts";
import { parseLegacyScheduleInput, validateLegacyScheduleReferences } from "@/lib/legacy-schedule-input";
import { asInteger } from "@/lib/validation";

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);

  try {
    const url = new URL(request.url);
    const extraWhere: string[] = [];
    const extraParams: unknown[] = [];
    const classId = asInteger(url.searchParams.get("class_id"));
    const teacherId = asInteger(url.searchParams.get("teacher_id"));
    const year = url.searchParams.get("academic_year");
    if (classId) {
      extraWhere.push("schedules.class_id = ?");
      extraParams.push(classId);
    }
    if (teacherId) {
      extraWhere.push("schedules.teacher_id = ?");
      extraParams.push(teacherId);
    }
    if (year) {
      extraWhere.push("schedules.academic_year = ?");
      extraParams.push(year);
    }

    const result = await paginate({
      request,
      table: "schedules",
      columns: `schedules.*, teachers.name AS teacher_name, subjects.subject_name,
                CONCAT(classes.class_name, '-', classes.section) AS class_label`,
      joins: `JOIN teachers ON teachers.id = schedules.teacher_id
              JOIN subjects ON subjects.id = schedules.subject_id
              JOIN classes ON classes.id = schedules.class_id`,
      extraWhere,
      extraParams,
      searchColumns: ["teachers.name", "subjects.subject_name", "schedules.room"],
      orderBy: "ORDER BY schedules.day_of_week, schedules.period_number",
    });
    return ok(result);
  } catch (err) {
    console.error(err);
    return fail("Unable to load schedules.", 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);

  try {
    const parsed = parseLegacyScheduleInput(await request.json());
    if (!parsed.input) return fail(parsed.error, 400);
    const payload = parsed.input;
    const referenceError = await validateLegacyScheduleReferences(payload);
    if (referenceError) return fail(referenceError, 400);
    const times = await resolvePeriodTimes(payload.period_number, payload.start_time, payload.end_time);

    const result = await execute(
      `INSERT INTO schedules
        (teacher_id, class_id, subject_id, day_of_week, period_number, start_time, end_time, room, academic_year, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.teacher_id,
        payload.class_id,
        payload.subject_id,
        payload.day_of_week,
        payload.period_number,
        times.start_time,
        times.end_time,
        payload.room,
        payload.academic_year,
        payload.status,
      ]
    );

    await logActivity(session.id, "CREATE", "schedules", result.insertId, "Created schedule");
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM schedules WHERE id = ?", [result.insertId]), "Schedule created successfully", 201);
  } catch (err) {
    if (err instanceof SyntaxError) return fail("Request body must be valid JSON.", 400);
    if (err instanceof InvalidSchedulePeriodError) return fail(err.message, 400);
    console.error(err);
    return fail("Unable to create schedule.", 500);
  }
}
