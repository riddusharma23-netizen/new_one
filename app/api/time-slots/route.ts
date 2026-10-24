import { fail, ok } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { getSchoolTimings, normalizeTimingSlots, replaceSchoolTimings } from "@/lib/school-timings";
import { revalidatePublic } from "@/lib/revalidate";

// Public read endpoint and admin-only write endpoint share the same timing source.
export async function GET() {
  try {
    return ok(await getSchoolTimings(), "Time slots loaded successfully");
  } catch {
    return fail("Unable to load time slots.", 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  if (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN") return fail("Only an authorized administrator can change school timings.", 403);
  try {
    const body = await request.json() as Record<string, unknown>;
    const { slots, errors } = normalizeTimingSlots(body.slots);
    if (errors.length) return fail(errors.join(" "), 422);
    await replaceSchoolTimings(slots);
    revalidatePublic();
    return ok(await getSchoolTimings(), "Time slots saved successfully");
  } catch (error) {
    console.error(error);
    return fail("Unable to save time slots.", 500);
  }
}
