import { query, queryOne } from "@/lib/db";
import { PERIOD_TIMES, isDayOfWeek } from "@/lib/validation";

export type ScheduleInput = {
  teacher_id: number;
  class_id: number;
  subject_id: number;
  day_of_week: string;
  period_number: number;
  start_time?: string | null;
  end_time?: string | null;
  room?: string | null;
  academic_year: string;
  status?: string;
};

type ExistingId = { id: number };

export async function validateSchedule(input: ScheduleInput, excludeId?: number) {
  if (!isDayOfWeek(input.day_of_week)) {
    return "Day must be Monday through Saturday";
  }

  if (input.period_number < 1 || input.period_number > 6) {
    return "Period must be between 1 and 6";
  }

  if (!input.academic_year.trim()) {
    return "Academic year is required";
  }

  const teacher = await queryOne<ExistingId>(
    "SELECT id FROM teachers WHERE id = ? AND status = 'ACTIVE' LIMIT 1",
    [input.teacher_id]
  );
  if (!teacher) return "Teacher does not exist or is inactive";

  const classRow = await queryOne<ExistingId>(
    "SELECT id FROM classes WHERE id = ? AND status = 'ACTIVE' LIMIT 1",
    [input.class_id]
  );
  if (!classRow) return "Class does not exist or is inactive";

  const subject = await queryOne<{ id: number; class_id: number }>(
    "SELECT id, class_id FROM subjects WHERE id = ? AND status = 'ACTIVE' LIMIT 1",
    [input.subject_id]
  );
  if (!subject) return "Subject does not exist or is inactive";
  if (subject.class_id !== input.class_id) {
    return "Subject does not belong to the selected class";
  }

  const excludeSql = excludeId ? " AND id <> ?" : "";
  const excludeParams = excludeId ? [excludeId] : [];

  const teacherClash = await queryOne<ExistingId>(
    `SELECT id FROM schedules
     WHERE teacher_id = ? AND day_of_week = ? AND period_number = ?
       AND academic_year = ? AND status = 'ACTIVE'${excludeSql}
     LIMIT 1`,
    [input.teacher_id, input.day_of_week, input.period_number, input.academic_year, ...excludeParams]
  );
  if (teacherClash) {
    return "Teacher already has a schedule during this period";
  }

  const classClash = await queryOne<ExistingId>(
    `SELECT id FROM schedules
     WHERE class_id = ? AND day_of_week = ? AND period_number = ?
       AND academic_year = ? AND status = 'ACTIVE'${excludeSql}
     LIMIT 1`,
    [input.class_id, input.day_of_week, input.period_number, input.academic_year, ...excludeParams]
  );
  if (classClash) {
    return "This class already has a subject during this period";
  }

  const room = input.room?.trim() || null;
  if (room) {
    const roomClash = await queryOne<ExistingId>(
      `SELECT id FROM schedules
       WHERE room = ? AND day_of_week = ? AND period_number = ?
         AND academic_year = ? AND status = 'ACTIVE'${excludeSql}
       LIMIT 1`,
      [room, input.day_of_week, input.period_number, input.academic_year, ...excludeParams]
    );
    if (roomClash) {
      return "This room is already assigned during this period";
    }
  }

  const duplicate = await queryOne<ExistingId>(
    `SELECT id FROM schedules
     WHERE teacher_id = ? AND class_id = ? AND subject_id = ? AND day_of_week = ?
       AND period_number = ? AND academic_year = ?${excludeSql}
     LIMIT 1`,
    [
      input.teacher_id,
      input.class_id,
      input.subject_id,
      input.day_of_week,
      input.period_number,
      input.academic_year,
      ...excludeParams,
    ]
  );
  if (duplicate) {
    return "This schedule entry already exists";
  }

  return null;
}

export function resolvePeriodTimes(period: number, start?: string | null, end?: string | null) {
  const fallback = PERIOD_TIMES[period] ?? PERIOD_TIMES[1];
  return {
    start_time: start?.trim() || fallback.start,
    end_time: end?.trim() || fallback.end,
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
