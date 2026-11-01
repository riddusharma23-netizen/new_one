import { fail, ok } from "@/lib/http";
import { buildMasterData, getPublishedVersion, prepareTimetable } from "@/lib/timetable";

export async function GET(request: Request) {
  try {
    const academicYear = new URL(request.url).searchParams.get("academic_year")?.trim() || "2025-26";
    await prepareTimetable();
    const published = await getPublishedVersion(academicYear);
    const data = await buildMasterData(academicYear, published?.id ?? null, !published);
    if (published) {
      data.schedule_entries = data.schedule_entries.filter((entry) => entry.status === "PUBLISHED" || entry.status === "ACTIVE");
    }
    return ok(data, "Master timetable loaded successfully");
  } catch (error) {
    console.error(error);
    return fail("Unable to load the master timetable.", 500);
  }
}
