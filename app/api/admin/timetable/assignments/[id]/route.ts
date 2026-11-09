import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { getIdParam } from "@/lib/list";
import { asInteger, asString } from "@/lib/validation";
import { deleteAssignment, TimetableConflictError, updateAssignment } from "@/lib/timetable";

type Ctx = { params: Promise<{ id: string }> };

function assignmentError(err: unknown) {
  if (err instanceof TimetableConflictError) return fail(err.message, 409, { conflicts: err.conflicts });
  if (err instanceof Error && /draft timetable|version not found/i.test(err.message)) return fail(err.message, 400);
  console.error(err);
  return fail("Unable to update this assignment.", 500);
}

export async function PUT(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid assignment id");
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const subjectId = asInteger(body.subject_id);
    const teacherId = asInteger(body.teacher_id);
    if (!subjectId || !teacherId) return fail("subject_id and teacher_id are required.");
    const saved = await updateAssignment({
      assignmentId: id,
      targetTeacherId: asInteger(body.target_teacher_id),
      subjectId,
      teacherId,
      roomId: asInteger(body.room_id),
      notes: body.notes === undefined ? undefined : asString(body.notes) || null,
      override: body.override === true,
      adminId: session.id,
      canOverride: session.role === "SUPER_ADMIN" || session.role === "ADMIN",
    });
    if (!saved) return fail("Assignment not found", 404);
    return ok(saved, "Assignment updated");
  } catch (err) {
    if (err instanceof SyntaxError) return fail("Request body must be valid JSON.", 400);
    return assignmentError(err);
  }
}

export async function DELETE(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid assignment id");
  try {
    const teacherId = asInteger(new URL(request.url).searchParams.get("teacher_id"));
    const deleted = await deleteAssignment(id, session.id, teacherId);
    if (!deleted) return fail("Assignment not found", 404);
    return ok(null, "Assignment deleted");
  } catch (err) {
    return assignmentError(err);
  }
}
