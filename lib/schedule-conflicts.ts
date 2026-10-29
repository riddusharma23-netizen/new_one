import { query } from "@/lib/db";
import { getSchoolTimings } from "@/lib/school-timings";

export async function resolvePeriodTimes(period: number, start?: string | null, end?: string | null) {
  const slot = (await getSchoolTimings()).find((item) => item.period_number === period && item.active);
  if (!slot) throw new Error("Selected period is unavailable in the active school timing configuration");
  return {
    start_time: start?.trim() || slot.start_time,
    end_time: end?.trim() || slot.end_time,
  };
}

export async function getScheduleGrid(filters: {
  academic_year?: string;
  class_id?: number;
  teacher_id?: number;
}) {
  const where: string[] = ["s.status = 'ACTIVE'"];
  const params: Array<string | number | boolean | null> = [];

  if (filters.academic_year) {
    where.push("s.academic_year = ?");
    params.push(filters.academic_year);
  }
  if (filters.class_id) {
    where.push("s.class_id = ?");
    params.push(filters.class_id);
  }
  if (filters.teacher_id) {
    where.push("s.teacher_id = ?");
    params.push(filters.teacher_id);
  }

  return query<{
    id: number;
    teacher_id: number;
    class_id: number;
    subject_id: number;
    day_of_week: string;
    period_number: number;
    start_time: string;
    end_time: string;
    room: string | null;
    academic_year: string;
    teacher_name: string;
    subject_name: string;
    class_name: string;
    section: string;
  }>(
    `SELECT s.*, t.name AS teacher_name, sub.subject_name,
            CONCAT(c.class_name, '-', c.section) AS class_label,
            c.class_name, c.section
     FROM schedules s
     JOIN teachers t ON t.id = s.teacher_id
     JOIN subjects sub ON sub.id = s.subject_id
     JOIN classes c ON c.id = s.class_id
     WHERE ${where.join(" AND ")}
     ORDER BY s.day_of_week, s.period_number, c.class_name, c.section`,
    params
  );
}
