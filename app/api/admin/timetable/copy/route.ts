import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { asInteger, asString, isDayOfWeek } from "@/lib/validation";
import { copyTimetable, TimetableConflictError } from "@/lib/timetable";

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const versionId = asInteger(body.version_id);
    const sourceClassId = asInteger(body.source_class_id);
    const sourceDay = asString(body.source_day);
    const targetDays = Array.isArray(body.target_days)
      ? body.target_days.map((day) => asString(day)).filter(Boolean)
      : asString(body.target_day)
        ? [asString(body.target_day)]
        : [];
    if (!versionId || !sourceClassId || !isDayOfWeek(sourceDay) || !targetDays.length) {
      return fail("version_id, source class, source day and at least one target day are required.");
    }
    if (targetDays.some((targetDay) => !isDayOfWeek(targetDay))) return fail("One or more target days are invalid.");
    const targetClassId = asInteger(body.target_class_id) || sourceClassId;
    const uniqueTargetDays = [...new Set(targetDays)];
    const canOverride = session.role === "SUPER_ADMIN" || session.role === "ADMIN";
    await copyTimetable({
      versionId,
      sourceClassId,
      sourceDay,
      targetClassId,
      targetDays: uniqueTargetDays,
      adminId: session.id,
      override: body.override === true,
      canOverride,
    });
    return ok(null, "Timetable copied successfully");
  } catch (err) {
    if (err instanceof TimetableConflictError) {
      return fail(err.message, 409, { conflicts: err.conflicts });
    }
    console.error(err);
    return fail("Unable to copy timetable.", 500);
  }
}
