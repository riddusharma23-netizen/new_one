import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { getOrCreateDraftVersion, getTimetableOptions } from "@/lib/timetable";

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const academicYear = new URL(request.url).searchParams.get("academic_year")?.trim() || "2025-26";
    const draft = await getOrCreateDraftVersion(academicYear, session.id);
    const options = await getTimetableOptions(academicYear);
    return ok({ ...options, draft });
  } catch (err) {
    console.error(err);
    return fail("Unable to load timetable options.", 500);
  }
}
