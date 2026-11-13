import { requireAdmin } from "@/lib/auth";
import { queryOne } from "@/lib/db";
import { fail, ok } from "@/lib/http";
import { asInteger, asString, normalizeSchoolDay } from "@/lib/validation";
import { parseAssignmentType } from "@/lib/schedule-master";
import { appendAssignment, TimetableConflictError } from "@/lib/timetable";

function assignmentError(err: unknown) {
  if (err instanceof TimetableConflictError) return fail(err.message, 409, { conflicts: err.conflicts });
  if (err instanceof Error && /draft timetable|version not found/i.test(err.message)) return fail(err.message, 400);
  console.error(err);
  return fail("Unable to save this assignment.", 500);
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
    const subjectId = asInteger(body.subject_id);
    const assignmentType = parseAssignmentType(body.assignment_type);
    const teacherId = asInteger(body.teacher_id);
    const roomId = asInteger(body.room_id);
    if (!assignmentType) return fail("assignment_type must be 'theory' or 'practical'.");
    if (!versionId || !classId || !timeSlotId || !day || !subjectId || !teacherId) {
      return fail("version_id, class_id, day, time_slot_id, subject_id and teacher_id are required.");
    }
    const version = await queryOne<{ id: number }>("SELECT id FROM timetable_versions WHERE id = ?", [versionId]);
    if (!version) return fail("Timetable version not found.", 404);
    const saved = await appendAssignment({
      versionId,
      classId,
      day,
      timeSlotId,
      subjectId,
      assignmentType,
      teacherId,
      roomId,
      notes: asString(body.notes) || null,
      override: body.override === true,
      adminId: session.id,
      canOverride: session.role === "SUPER_ADMIN" || session.role === "ADMIN",
    });
    return ok(saved, "Assignment added", 201);
  } catch (err) {
    if (err instanceof SyntaxError) return fail("Request body must be valid JSON.", 400);
    return assignmentError(err);
  }
}
