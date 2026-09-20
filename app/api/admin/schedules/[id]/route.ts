import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { getIdParam } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { resolvePeriodTimes, validateSchedule } from "@/lib/schedule-conflicts";
import { asInteger, asOptionalString, asString } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid schedule id");

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

    const conflict = await validateSchedule(payload, id);
    if (conflict) return fail(conflict, 409);

    const result = await execute(
      `UPDATE schedules SET
        teacher_id=?, class_id=?, subject_id=?, day_of_week=?, period_number=?,
        start_time=?, end_time=?, room=?, academic_year=?, status=?
       WHERE id=?`,
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
        id,
      ]
    );
    if (!result.affectedRows) return fail("Schedule not found", 404);
    await logActivity(session.id, "UPDATE", "schedules", id, "Updated schedule");
    revalidatePublic();
    return ok(await queryOne("SELECT * FROM schedules WHERE id = ?", [id]), "Schedule updated successfully");
  } catch (err) {
    console.error(err);
    return fail("Unable to update schedule.", 500);
  }
}

export async function DELETE(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid schedule id");
  const result = await execute("DELETE FROM schedules WHERE id = ?", [id]);
  if (!result.affectedRows) return fail("Schedule not found", 404);
  await logActivity(session.id, "DELETE", "schedules", id, "Deleted schedule");
  revalidatePublic();
  return ok(null, "Schedule deleted successfully");
}
