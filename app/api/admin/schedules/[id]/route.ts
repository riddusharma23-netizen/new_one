import { fail, ok } from "@/lib/http";
import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { getIdParam } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { InvalidSchedulePeriodError, resolvePeriodTimes } from "@/lib/schedule-conflicts";
import { parseLegacyScheduleInput, validateLegacyScheduleReferences } from "@/lib/legacy-schedule-input";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid schedule id");

  try {
    const parsed = parseLegacyScheduleInput(await request.json());
    if (!parsed.input) return fail(parsed.error, 400);
    const payload = parsed.input;
    const referenceError = await validateLegacyScheduleReferences(payload);
    if (referenceError) return fail(referenceError, 400);
    const times = await resolvePeriodTimes(payload.period_number, payload.start_time, payload.end_time);

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
        times.start_time,
        times.end_time,
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
    if (err instanceof SyntaxError) return fail("Request body must be valid JSON.", 400);
    if (err instanceof InvalidSchedulePeriodError) return fail(err.message, 400);
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
