import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { timetableOverview } from "@/lib/timetable";

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const academicYear = new URL(request.url).searchParams.get("academic_year")?.trim() || "2025-26";
    return ok(await timetableOverview(academicYear));
  } catch (err) {
    console.error(err);
    return fail("Unable to load timetable overview.", 500);
  }
}
