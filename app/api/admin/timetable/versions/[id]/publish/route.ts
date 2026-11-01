import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { getIdParam } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { TimetableConflictError, publishVersion } from "@/lib/timetable";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid version id");
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const canOverride = session.role === "SUPER_ADMIN" || session.role === "ADMIN";
    const published = await publishVersion(id, session.id, body.override === true, canOverride);
    revalidatePublic();
    return ok(published, "Timetable published");
  } catch (err) {
    if (err instanceof TimetableConflictError) {
      return fail(err.message, 409, { conflicts: err.conflicts });
    }
    console.error(err);
    return fail(err instanceof Error ? err.message : "Unable to publish timetable.", 500);
  }
}
