import { logActivity, requireAdmin } from "@/lib/auth";
import { execute, queryOne } from "@/lib/db";
import { fail, ok } from "@/lib/http";
import { revalidatePublic } from "@/lib/revalidate";
import { DEFAULT_ADDITIONAL_COLUMN_HEADING } from "@/lib/schedule-master";
import { prepareTimetable } from "@/lib/timetable";

const SETTING_KEY = "timetable_additional_column_heading";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  try {
    await prepareTimetable();
    const setting = await queryOne<{ setting_value: string | null }>(
      "SELECT setting_value FROM settings WHERE setting_key = ? LIMIT 1",
      [SETTING_KEY]
    );
    return ok({ heading: setting?.setting_value?.trim() || DEFAULT_ADDITIONAL_COLUMN_HEADING });
  } catch (reason) {
    console.error(reason);
    return fail("Unable to load timetable display settings.", 500);
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);
  if (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN") {
    return fail("Only an authorized administrator can change timetable display settings.", 403);
  }

  try {
    const body = await request.json() as { heading?: unknown };
    const heading = typeof body.heading === "string" ? body.heading.trim() : "";
    if (!heading || heading.length > 60) return fail("Enter a heading between 1 and 60 characters.", 422);

    await prepareTimetable();
    await execute(
      `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [SETTING_KEY, heading]
    );
    await logActivity(session.id, "UPDATE", "settings", null, `Updated timetable additional column heading to ${heading}`);
    revalidatePublic();
    return ok({ heading }, "Timetable column heading saved.");
  } catch (reason) {
    console.error(reason);
    return fail("Unable to save timetable display settings.", 500);
  }
}