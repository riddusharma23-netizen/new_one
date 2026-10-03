import { query } from "@/lib/db";
import { fail, ok } from "@/lib/http";
import { DEFAULT_TIME_SLOTS, normalizeSchoolData, type MasterTimeSlot } from "@/lib/schedule-master";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const academicYear = url.searchParams.get("academic_year")?.trim() || "2025-26";

    let classes: Record<string, unknown>[] = [];
    let teachers: Record<string, unknown>[] = [];
    let subjects: Record<string, unknown>[] = [];
    let entries: Record<string, unknown>[] = [];
    const timeSlots: MasterTimeSlot[] = DEFAULT_TIME_SLOTS;

    try {
      classes = await query(
        `SELECT id, class_name, section, room, status, class_name AS name, CONCAT(class_name, '-', section) AS display_name
         FROM classes
         WHERE status = 'ACTIVE'
         ORDER BY CAST(class_name AS SIGNED), section`,
        []
      );
    } catch {
      classes = [];
    }

    try {
      teachers = await query(
        `SELECT id, name, status FROM teachers WHERE status = 'ACTIVE' ORDER BY name`,
        []
      );
    } catch {
      teachers = [];
    }

    try {
      subjects = await query(
        `SELECT id, subject_name AS name, subject_code AS code, class_id, status FROM subjects WHERE status = 'ACTIVE' ORDER BY subject_name`,
        []
      );
    } catch {
      subjects = [];
    }

    try {
      entries = await query(
        `SELECT s.id, s.class_id, c.class_name, s.day_of_week, s.period_number, s.start_time, s.end_time,
                s.room, s.academic_year, s.status, s.teacher_id, t.name AS teacher_name,
                s.subject_id, sub.subject_name, sub.subject_code AS code
         FROM schedules s
         LEFT JOIN classes c ON c.id = s.class_id
         LEFT JOIN teachers t ON t.id = s.teacher_id
         LEFT JOIN subjects sub ON sub.id = s.subject_id
         WHERE s.status = 'ACTIVE' AND s.academic_year = ?
         ORDER BY FIELD(s.day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), s.period_number`,
        [academicYear]
      );
    } catch {
      entries = [];
    }

    const payload = normalizeSchoolData({
      classes,
      teachers,
      subjects,
      entries,
      academicYear,
      timeSlots,
    });

    return ok(payload, "Master timetable loaded successfully");
  } catch (error) {
    console.error(error);
    return fail("Unable to load the master timetable.", 500);
  }
}
