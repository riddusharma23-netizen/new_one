import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { logActivity, requireAdmin } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { revalidatePublic } from "@/lib/revalidate";
import { resolvePeriodTimes } from "@/lib/schedule-conflicts";
import { asInteger, asOptionalString, asString, isDayOfWeek } from "@/lib/validation";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_ROWS = 500;
const allowedExtensions = new Set(["xlsx", "xls", "csv"]);

type ImportRow = Record<string, unknown>;

type ResolvedRow = {
  teacherId: number;
  classId: number;
  subjectId: number;
  day: string;
  period: number;
  room: string | null;
  academicYear: string;
  startTime: string | null;
  endTime: string | null;
  status: "ACTIVE" | "INACTIVE";
};

function value(row: ImportRow, ...names: string[]) {
  const entries = Object.entries(row);
  const found = entries.find(([key]) => names.includes(key.trim().toLowerCase().replace(/\s+/g, "_")));
  return found?.[1];
}

function text(row: ImportRow, ...names: string[]) {
  return asString(value(row, ...names));
}

function number(row: ImportRow, ...names: string[]) {
  return asInteger(value(row, ...names));
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, message: error ?? "Authentication required" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ success: false, message: "Please choose an Excel file" }, { status: 400 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ success: false, message: "File must be smaller than 5 MB" }, { status: 400 });

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!allowedExtensions.has(extension)) return NextResponse.json({ success: false, message: "Use .xlsx, .xls, or .csv files" }, { status: 400 });

  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: false });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<ImportRow>(firstSheet, { defval: "" });
    if (!rows.length) return NextResponse.json({ success: false, message: "The sheet has no data rows" }, { status: 400 });
    if (rows.length > MAX_ROWS) return NextResponse.json({ success: false, message: `Import up to ${MAX_ROWS} rows at a time` }, { status: 400 });

    const connection = await getPool().getConnection();
    const failures: Array<{ row: number; message: string }> = [];
    let imported = 0;
    try {
      await connection.beginTransaction();
      const resolved: ResolvedRow[] = [];
      const teacherSlots = new Set<string>();
      const classSlots = new Set<string>();
      const roomSlots = new Set<string>();

      for (const [index, row] of rows.entries()) {
        const rowNumber = index + 2;
        const teacherId = number(row, "teacher_id");
        const classId = number(row, "class_id");
        const subjectId = number(row, "subject_id");
        const teacherName = text(row, "teacher", "teacher_name");
        const className = text(row, "class", "class_name");
        const section = text(row, "section");
        const subjectName = text(row, "subject", "subject_name");
        const day = text(row, "day", "day_of_week");
        const period = number(row, "period", "period_number");
        const academicYear = text(row, "academic_year", "year");
        const room = asOptionalString(value(row, "room"));

        const [teacherRows] = teacherId
          ? await connection.execute("SELECT id FROM teachers WHERE id = ? AND status = 'ACTIVE'", [teacherId])
          : await connection.execute("SELECT id FROM teachers WHERE name = ? AND status = 'ACTIVE' LIMIT 1", [teacherName]);
        const [classRows] = classId
          ? await connection.execute("SELECT id FROM classes WHERE id = ? AND status = 'ACTIVE'", [classId])
          : await connection.execute("SELECT id FROM classes WHERE class_name = ? AND section = ? AND academic_year = ? AND status = 'ACTIVE' LIMIT 1", [className, section, academicYear]);
        const selectedClass = (classRows as Array<{ id: number }>)[0];
        const selectedClassId = classId || selectedClass?.id;
        const [subjectRows] = subjectId
          ? await connection.execute("SELECT id, class_id FROM subjects WHERE id = ? AND status = 'ACTIVE'", [subjectId])
          : await connection.execute("SELECT id, class_id FROM subjects WHERE subject_name = ? AND class_id = ? AND status = 'ACTIVE' LIMIT 1", [subjectName, selectedClassId || 0]);

        const teacher = (teacherRows as Array<{ id: number }>)[0];
        const subject = (subjectRows as Array<{ id: number; class_id: number }>)[0];
        if (!teacher || !selectedClass || !subject) {
          failures.push({ row: rowNumber, message: "Teacher, class, or subject was not found" });
          continue;
        }
        if (!day || !isDayOfWeek(day) || !period || period < 1 || period > 6 || !academicYear) {
          failures.push({ row: rowNumber, message: "Day, period (1-6), and academic year are required" });
          continue;
        }
        if (subject.class_id !== selectedClassId) {
          failures.push({ row: rowNumber, message: "Subject does not belong to the selected class" });
          continue;
        }

        const slot = `${day}|${period}|${academicYear}`;
        if (teacherSlots.has(`${teacher.id}|${slot}`)) {
          failures.push({ row: rowNumber, message: "Teacher is assigned twice in this upload period" });
          continue;
        }
        if (classSlots.has(`${selectedClassId}|${slot}`)) {
          failures.push({ row: rowNumber, message: "Class is assigned twice in this upload period" });
          continue;
        }
        if (room && roomSlots.has(`${room}|${slot}`)) {
          failures.push({ row: rowNumber, message: "Room is assigned twice in this upload period" });
          continue;
        }

        const conflictParams = [teacher.id, day, period, academicYear, selectedClassId, room];
        const [teacherClash] = await connection.execute("SELECT id FROM schedules WHERE teacher_id = ? AND day_of_week = ? AND period_number = ? AND academic_year = ? AND status = 'ACTIVE' LIMIT 1", conflictParams.slice(0, 4));
        const [classClash] = await connection.execute("SELECT id FROM schedules WHERE class_id = ? AND day_of_week = ? AND period_number = ? AND academic_year = ? AND status = 'ACTIVE' LIMIT 1", [selectedClassId, day, period, academicYear]);
        const [roomClash] = room ? await connection.execute("SELECT id FROM schedules WHERE room = ? AND day_of_week = ? AND period_number = ? AND academic_year = ? AND status = 'ACTIVE' LIMIT 1", [room, day, period, academicYear]) : [[]];
        if ((teacherClash as unknown[]).length || (classClash as unknown[]).length || (roomClash as unknown[]).length) {
          failures.push({ row: rowNumber, message: "Teacher, class, or room has a conflict in this period" });
          continue;
        }
        teacherSlots.add(`${teacher.id}|${slot}`);
        classSlots.add(`${selectedClassId}|${slot}`);
        if (room) roomSlots.add(`${room}|${slot}`);
        resolved.push({ teacherId: teacher.id, classId: selectedClassId, subjectId: subject.id, day, period, room, academicYear, startTime: asOptionalString(value(row, "start_time")), endTime: asOptionalString(value(row, "end_time")), status: text(row, "status") === "INACTIVE" ? "INACTIVE" : "ACTIVE" });
      }

      for (const item of resolved) {
        const times = resolvePeriodTimes(item.period, item.startTime, item.endTime);
        await connection.execute("INSERT INTO schedules (teacher_id, class_id, subject_id, day_of_week, period_number, start_time, end_time, room, academic_year, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [item.teacherId, item.classId, item.subjectId, item.day, item.period, times.start_time, times.end_time, item.room, item.academicYear, item.status]);
        imported += 1;
      }
      await connection.commit();
    } catch (transactionError) {
      await connection.rollback();
      throw transactionError;
    } finally {
      connection.release();
    }

    await logActivity(session.id, "IMPORT", "schedules", null, `Imported ${imported} schedules`);
    revalidatePublic();
    return NextResponse.json({ success: true, message: `Imported ${imported} schedule row(s)`, data: { imported, failed: failures.length, failures } });
  } catch (importError) {
    console.error(importError);
    return NextResponse.json({ success: false, message: "Unable to import schedule file. Check the column names and file format." }, { status: 500 });
  }
}
