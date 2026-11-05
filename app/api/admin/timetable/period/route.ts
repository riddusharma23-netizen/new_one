import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { asInteger, asString, normalizeSchoolDay } from "@/lib/validation";
import { TimetableConflictError, loadPeriodGroups, savePeriod, type GroupInput } from "@/lib/timetable";

function parseGroups(value: unknown): GroupInput[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const assignments = Array.isArray(row.assignments) ? row.assignments : [];
    return {
      name: asString(row.name) || "Group",
      student_group_id: asInteger(row.student_group_id),
      assignments: assignments.map((assignment) => {
        const entry = assignment && typeof assignment === "object" ? (assignment as Record<string, unknown>) : {};
        const teacherIds = Array.isArray(entry.teacher_ids)
          ? entry.teacher_ids.map((id) => asInteger(id)).filter((id): id is number => Boolean(id))
          : [];
        return {
          subject_id: asInteger(entry.subject_id),
          room_id: asInteger(entry.room_id),
          teacher_ids: teacherIds,
          notes: asString(entry.notes) || null,
        };
      }),
    };
  });
}

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const url = new URL(request.url);
  const versionId = asInteger(url.searchParams.get("version_id"));
  const classId = asInteger(url.searchParams.get("class_id"));
  const timeSlotId = asInteger(url.searchParams.get("time_slot_id"));
  const day = normalizeSchoolDay(url.searchParams.get("day"));
  if (!versionId || !classId || !timeSlotId || !day) return fail("version_id, class_id, day and time_slot_id are required.");
  return ok(await loadPeriodGroups(versionId, classId, day, timeSlotId));
}

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
    const groups = parseGroups(body.groups);
    const override = body.override === true;
    const canOverride = session.role === "SUPER_ADMIN" || session.role === "ADMIN";
    const saved = await savePeriod({
      versionId,
      classId,
      day,
      timeSlotId,
      groups,
      override,
      adminId: session.id,
      canOverride,
    });
    return ok(saved, "Period saved successfully");
  } catch (err) {
    if (err instanceof TimetableConflictError) {
      return fail(err.message, 409, { conflicts: err.conflicts });
    }
    console.error(err);
    return fail("Unable to save period schedule.", 500);
  }
}
