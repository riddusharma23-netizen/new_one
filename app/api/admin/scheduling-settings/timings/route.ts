import { logActivity, requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { query } from "@/lib/db";
import { getSchoolTimings, normalizeTimingSlots, replaceSchoolTimings } from "@/lib/school-timings";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  return ok({ slots: await getSchoolTimings() });
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  if (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN") return fail("Only an authorized administrator can change school timings.", 403);
  try {
    const body = await request.json() as Record<string, unknown>;
    const { slots, errors } = normalizeTimingSlots(body.slots);
    if (errors.length) return fail(errors.join(" "), 422);
    const existing = await getSchoolTimings();
    const changedPeriods = slots.filter((slot) => slot.period_number && existing.find((old) => old.period_number === slot.period_number && (old.start_time !== slot.start_time || old.end_time !== slot.end_time || !slot.active))).map((slot) => slot.period_number!);
    const affected = changedPeriods.length ? await query<{ id: number; day_of_week: string; period_number: number }>(`SELECT id, day_of_week, period_number FROM schedules WHERE status = 'ACTIVE' AND period_number IN (${changedPeriods.map(() => "?").join(",")})`, changedPeriods) : [];
    const preview = { previous: existing, proposed: slots, affected_lessons: affected, manual_correction_required: affected.length };
    if (body.preview === true) return ok(preview, "Timing change preview ready.");
    if (body.confirm !== true) return fail("Review the affected lessons and explicitly confirm this timing change.", 409);
    await replaceSchoolTimings(slots);
    await logActivity(session.id, "UPDATE", "time_slots", null, `Updated school timings; ${affected.length} active lesson(s) need review`);
    return ok({ ...preview, slots: await getSchoolTimings() }, "School timings saved. Existing lesson times were preserved for review.");
  } catch (error) { console.error(error); return fail("Unable to save school timings.", 500); }
}
