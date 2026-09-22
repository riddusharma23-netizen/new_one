import { fail, ok } from "@/lib/http";
import { query } from "@/lib/db";
import { asInteger } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const classId = asInteger(url.searchParams.get("class_id"));
    const teacherId = asInteger(url.searchParams.get("teacher_id"));
    const academicYear = url.searchParams.get("academic_year")?.trim();
    const where = ["s.status = 'ACTIVE'"];
    const params: Array<string | number> = [];

    if (classId) {
      where.push("s.class_id = ?");
      params.push(classId);
    }
    if (teacherId) {
      where.push("s.teacher_id = ?");
      params.push(teacherId);
    }
    if (academicYear) {
      where.push("s.academic_year = ?");
      params.push(academicYear);
    }

    const schedules = await query(
      `SELECT s.id, s.teacher_id, s.class_id, s.subject_id, s.day_of_week,
              s.period_number, s.start_time, s.end_time, s.room, s.academic_year,
              t.name AS teacher_name, sub.subject_name,
              CONCAT(c.class_name, '-', c.section) AS class_label
       FROM schedules s
       JOIN teachers t ON t.id = s.teacher_id AND t.status = 'ACTIVE'
       JOIN subjects sub ON sub.id = s.subject_id AND sub.status = 'ACTIVE'
       JOIN classes c ON c.id = s.class_id AND c.status = 'ACTIVE'
       WHERE ${where.join(" AND ")}
       ORDER BY s.period_number ASC,
                FIELD(s.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')`,
      params
    );
    return ok(schedules);
  } catch (error) {
    console.error(error);
    return fail("Unable to load schedules.", 500);
  }
}
