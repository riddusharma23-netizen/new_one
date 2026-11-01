import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { getIdParam } from "@/lib/list";
import { deleteAssignment } from "@/lib/timetable";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid assignment id");
  const deleted = await deleteAssignment(id, session.id);
  if (!deleted) return fail("Assignment not found", 404);
  return ok(null, "Assignment deleted");
}
