import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { getIdParam } from "@/lib/list";
import { restoreVersion } from "@/lib/timetable";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid version id");
  try {
    return ok(await restoreVersion(id, session.id), "Version restored as a new draft");
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Unable to restore version.", 500);
  }
}
