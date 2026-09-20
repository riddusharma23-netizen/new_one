import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { paginate } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { resolvePeriodTimes, validateSchedule } from "@/lib/schedule-conflicts";
import { asInteger, asOptionalString, asString } from "@/lib/validation";

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
    const body = (await request.json()) as Record<string, unknown>;
    const teacher_id = asInteger(body.teacher_id);
    const class_id = asInteger(body.class_id);
    const subject_id = asInteger(body.subject_id);
    const period_number = asInteger(body.period_number);
    const day_of_week = asString(body.day_of_week);
    const academic_year = asString(body.academic_year);

    if (!teacher_id || !class_id || !subject_id || !period_number || !day_of_week || !academic_year) {
      return fail("Teacher, class, subject, day, period and academic year are required");
    }

    const times = resolvePeriodTimes(period_number, asOptionalString(body.start_time), asOptionalString(body.end_time));
    const payload = {
      teacher_id,
      class_id,
      subject_id,
      day_of_week,
      period_number,
      start_time: times.start_time,
      end_time: times.end_time,
      room: asOptionalString(body.room),
      academic_year,
      status: asString(body.status) === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    };

    const conflict = await validateSchedule(payload);
    if (conflict) return fail(conflict, 409);

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
        payload.start_time,
        payload.end_time,
        payload.room,
        payload.academic_year,
        payload.status,
      ]
    );

    await logActivity(session.id, "CREATE", "schedules", result.insertId, "Created schedule");
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM schedules WHERE id = ?", [result.insertId]), "Schedule created successfully", 201);
  } catch (err) {
    console.error(err);
    return fail("Unable to create schedule.", 500);
  }
}
