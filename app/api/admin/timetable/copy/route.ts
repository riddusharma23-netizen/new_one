import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { asInteger, asString, normalizeSchoolDay } from "@/lib/validation";
import { copyTimetable, TimetableConflictError } from "@/lib/timetable";

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const versionId = asInteger(body.version_id);
    const sourceClassId = asInteger(body.source_class_id);
    const sourceDay = normalizeSchoolDay(body.source_day);
    const rawTargetDays = Array.isArray(body.target_days)
      ? body.target_days
      : asString(body.target_day)
        ? [body.target_day]
        : [];
    const targetDays = rawTargetDays.map(normalizeSchoolDay);
    if (!versionId || !sourceClassId || !sourceDay || !targetDays.length) {
      return fail("version_id, source class, source day and at least one target day are required.");
    }
    if (targetDays.some((targetDay) => !targetDay)) return fail("Choose target days from Monday to Saturday.");
    const targetClassId = asInteger(body.target_class_id) || sourceClassId;
    const uniqueTargetDays = [...new Set(targetDays.filter((day): day is NonNullable<typeof day> => day !== null))];
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
