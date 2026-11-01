import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { getIdParam } from "@/lib/list";
import { revalidatePublic } from "@/lib/revalidate";
import { unpublishVersion } from "@/lib/timetable";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: Ctx) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  const id = await getIdParam(context.params);
  if (!id) return fail("Invalid version id");
  await unpublishVersion(id, session.id);
  revalidatePublic();
  return ok(null, "Timetable unpublished");
}
