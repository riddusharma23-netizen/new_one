import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { asInteger, normalizeSchoolDay } from "@/lib/validation";
import { detectConflicts, type GroupInput } from "@/lib/timetable";

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const versionId = asInteger(body.version_id);
    const classId = asInteger(body.class_id);
    const timeSlotId = asInteger(body.time_slot_id);
    const day = normalizeSchoolDay(body.day_of_week || body.day);
    if (!versionId || !classId || !timeSlotId || !day) return fail("version_id, class_id, day and time_slot_id are required.");
    const groups = (Array.isArray(body.groups) ? body.groups : []) as GroupInput[];
    const conflicts = await detectConflicts({ versionId, classId, day, timeSlotId, groups });
    return ok({ conflicts, valid: conflicts.length === 0 });
  } catch (err) {
    console.error(err);
    return fail("Unable to validate timetable.", 500);
  }
}
