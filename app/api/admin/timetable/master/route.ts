import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { asInteger } from "@/lib/validation";
import { buildMasterData, getOrCreateDraftVersion } from "@/lib/timetable";

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    const url = new URL(request.url);
    const academicYear = url.searchParams.get("academic_year")?.trim() || "2025-26";
    const versionId = asInteger(url.searchParams.get("version_id"));
    const draft = versionId ? null : await getOrCreateDraftVersion(academicYear, session.id);
    const data = await buildMasterData(academicYear, versionId ?? draft?.id, false);
    return ok(data);
  } catch (err) {
    console.error(err);
    return fail("Unable to load admin timetable.", 500);
  }
}
