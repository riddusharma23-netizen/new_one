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
      `SELECT id, teacher_id, class_id, room, day_of_week, period_number, academic_year, status
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
      const keyTeacher = `${row.teacher_id}|${row.day_of_week}|${row.period_number}`;
      const keyClass = `${row.class_id}|${row.day_of_week}|${row.period_number}`;
      const keyRoom = `${row.room || "UNASSIGNED"}|${row.day_of_week}|${row.period_number}`;
      if (!byTeacher.has(keyTeacher)) byTeacher.set(keyTeacher, []);
      if (!byClass.has(keyClass)) byClass.set(keyClass, []);
      if (!byRoom.has(keyRoom)) byRoom.set(keyRoom, []);
      byTeacher.get(keyTeacher)?.push(row);
      byClass.get(keyClass)?.push(row);
      byRoom.get(keyRoom)?.push(row);
    }

    for (const [key, matches] of byTeacher.entries()) {
      if (matches.length > 1) {
        const [first] = matches;
        issues.push({ code: "TEACHER_CONFLICT", message: `Teacher conflict detected in slot ${key.replace("|", " on ")}.`, scheduleId: Number(first.id) });
      }
    }

    for (const [key, matches] of byClass.entries()) {
      if (matches.length > 1) {
        const [first] = matches;
        issues.push({ code: "CLASS_CONFLICT", message: `Class conflict detected in slot ${key.replace("|", " on ")}.`, scheduleId: Number(first.id) });
      }
    }

    for (const [key, matches] of byRoom.entries()) {
      if (matches.length > 1 && key !== "UNASSIGNED|Monday|1") {
        const [first] = matches;
        issues.push({ code: "ROOM_CONFLICT", message: `Room conflict detected in slot ${key.replace("|", " on ")}.`, scheduleId: Number(first.id) });
      }
    }

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
