import { query } from "@/lib/db";
import { fail, ok } from "@/lib/http";
import { asString, asInteger } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const academicYear = asString(body.academic_year) || "2025-26";
    const classId = asInteger(body.class_id);
    const teacherId = asInteger(body.teacher_id);

    const rows = (await query(
      `SELECT id, teacher_id, class_id, room, day_of_week, period_number, start_time, end_time, academic_year, status
       FROM schedules
       WHERE academic_year = ? AND status = 'ACTIVE'${classId ? " AND class_id = ?" : ""}${teacherId ? " AND teacher_id = ?" : ""}
       ORDER BY day_of_week, period_number`,
      [academicYear, ...(classId ? [classId] : []), ...(teacherId ? [teacherId] : [])]
    )) as Array<Record<string, unknown>>;

    const issues: Array<{ code: string; message: string; scheduleId?: number }> = [];
    const byTeacher = new Map<string, Record<string, unknown>[]>();
    const byClass = new Map<string, Record<string, unknown>[]>();
    const byRoom = new Map<string, Record<string, unknown>[]>();

    for (const row of rows as Record<string, unknown>[]) {
      const keyTeacher = `${row.teacher_id}|${row.day_of_week}`;
      const keyClass = `${row.class_id}|${row.day_of_week}`;
      const keyRoom = row.room ? `${row.room}|${row.day_of_week}` : "";
      if (!byTeacher.has(keyTeacher)) byTeacher.set(keyTeacher, []);
      if (!byClass.has(keyClass)) byClass.set(keyClass, []);
      if (keyRoom && !byRoom.has(keyRoom)) byRoom.set(keyRoom, []);
      byTeacher.get(keyTeacher)?.push(row);
      byClass.get(keyClass)?.push(row);
      if (keyRoom) byRoom.get(keyRoom)?.push(row);
    }

    const addOverlaps = (sets: Map<string, Record<string, unknown>[]>, code: string, label: string) => sets.forEach((matches, key) => {
      for (let index = 0; index < matches.length; index += 1) for (let other = index + 1; other < matches.length; other += 1) {
        const a = matches[index]; const b = matches[other];
        if (String(a.start_time) < String(b.end_time) && String(a.end_time) > String(b.start_time)) issues.push({ code, message: `${label} conflict detected for ${key.replace("|", " on ")}.`, scheduleId: Number(a.id) });
      }
    });
    addOverlaps(byTeacher, "TEACHER_CONFLICT", "Teacher");
    addOverlaps(byClass, "CLASS_CONFLICT", "Class");
    addOverlaps(byRoom, "ROOM_CONFLICT", "Room");

    const duplicates = rows.filter((row, index, record) =>
      record.findIndex((item) =>
        item.teacher_id === row.teacher_id && item.class_id === row.class_id && item.day_of_week === row.day_of_week && item.period_number === row.period_number && item.academic_year === row.academic_year
      ) !== index
    );
    for (const item of duplicates) {
      issues.push({ code: "DUPLICATE_ENTRY", message: `Duplicate schedule entry found for class ${item.class_id} during ${item.day_of_week}.`, scheduleId: Number(item.id) });
    }

    return ok({
      academic_year: academicYear,
      teacher_conflicts: issues.filter((issue) => issue.code === "TEACHER_CONFLICT").length,
      class_conflicts: issues.filter((issue) => issue.code === "CLASS_CONFLICT").length,
      room_conflicts: issues.filter((issue) => issue.code === "ROOM_CONFLICT").length,
      group_conflicts: 0,
      duplicate_entries: issues.filter((issue) => issue.code === "DUPLICATE_ENTRY").length,
      issues,
      valid: issues.length === 0,
    }, issues.length ? "Validation found schedule issues." : "Validation passed successfully.");
  } catch (error) {
    console.error(error);
    return fail("Unable to validate timetable.", 500);
  }
}
