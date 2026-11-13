import type { PoolConnection } from "mysql2/promise";
import { query, queryOne, withTransaction } from "@/lib/db";
import { getSchoolTimings, toSeconds } from "@/lib/school-timings";
import {
  DEFAULT_DAYS,
  DEFAULT_ADDITIONAL_COLUMN_HEADING,
  getSubjectColor,
  normalizeSchoolData,
  type AssignmentType,
  type MasterScheduleData,
  type MasterScheduleEntry,
  type SchoolDay,
} from "@/lib/schedule-master";
import { auditTimetable, ensureTimetableSchema, insertId } from "@/lib/timetable-schema";

export type TimetableVersion = {
  id: number;
  academic_year: string;
  name: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  notes: string | null;
  created_by: number | null;
  published_by: number | null;
  published_at: string | null;
  restored_from_id: number | null;
  created_at: string;
  updated_at: string;
};

export type ConflictItem = {
  type: "TEACHER" | "CLASSROOM" | "STUDENT_GROUP" | "PERIOD" | "AVAILABILITY" | "VALIDATION";
  message: string;
};

export type AssignmentInput = {
  subject_id: number | null;
  assignment_type: AssignmentType;
  room_id: number | null;
  teacher_ids: number[];
  notes?: string | null;
};

export type GroupInput = {
  name: string;
  student_group_id: number | null;
  assignments: AssignmentInput[];
};

type ScheduleGroupRow = {
  id: number;
  version_id: number;
  class_id: number;
  student_group_id: number | null;
  time_slot_id: number;
  day_of_week: string;
  name: string;
  sort_order: number;
};

type ScheduleAssignmentRow = {
  id: number;
  schedule_group_id: number;
  subject_id: number | null;
  assignment_type: AssignmentType;
  room_id: number | null;
  notes: string | null;
};

type ScheduleTeacherRow = { id: number; name: string; short_name: string | null };

type LoadedScheduleGroup = ScheduleGroupRow & {
  student_group_name: string | null;
  assignments: Array<ScheduleAssignmentRow & {
    subject_name: string | null;
    room_name: string | null;
    teachers: ScheduleTeacherRow[];
  }>;
};

export class TimetableConflictError extends Error {
  conflicts: ConflictItem[];
  constructor(conflicts: ConflictItem[]) {
    super(conflicts.map((item) => item.message).join(" "));
    this.name = "TimetableConflictError";
    this.conflicts = conflicts;
  }
}

export async function prepareTimetable() {
  await ensureTimetableSchema();
}

export async function getOrCreateDraftVersion(academicYear: string, adminId: number | null) {
  await prepareTimetable();
  const existing = await queryOne<TimetableVersion>(
    "SELECT * FROM timetable_versions WHERE academic_year = ? AND status = 'DRAFT' ORDER BY id DESC LIMIT 1",
    [academicYear]
  );
  if (existing) return existing;

  const published = await queryOne<TimetableVersion>(
    "SELECT * FROM timetable_versions WHERE academic_year = ? AND status = 'PUBLISHED' ORDER BY id DESC LIMIT 1",
    [academicYear]
  );
  if (published) {
    return cloneVersion(published.id, {
      academicYear,
      name: `${academicYear} draft`,
      status: "DRAFT",
      adminId,
      restoredFromId: published.id,
    });
  }

  return withTransaction(async (connection) => {
    const id = await insertId(
      connection,
      `INSERT INTO timetable_versions (academic_year, name, status, created_by)
       VALUES (?, ?, 'DRAFT', ?)`,
      [academicYear, `${academicYear} draft`, adminId]
    );
    await migrateLegacySchedules(connection, id, academicYear);
    const row = await connection.query("SELECT * FROM timetable_versions WHERE id = ?", [id]);
    return (row[0] as TimetableVersion[])[0];
  });
}

export async function getPublishedVersion(academicYear: string) {
  await prepareTimetable();
  return queryOne<TimetableVersion>(
    "SELECT * FROM timetable_versions WHERE academic_year = ? AND status = 'PUBLISHED' ORDER BY id DESC LIMIT 1",
    [academicYear]
  );
}

export async function listVersions(academicYear: string) {
  await prepareTimetable();
  return query<TimetableVersion>(
    "SELECT * FROM timetable_versions WHERE academic_year = ? ORDER BY FIELD(status,'PUBLISHED','DRAFT','ARCHIVED'), id DESC",
    [academicYear]
  );
}

async function cloneVersion(
  sourceId: number,
  options: { academicYear: string; name: string; status: TimetableVersion["status"]; adminId: number | null; restoredFromId?: number | null }
) {
  return withTransaction(async (connection) => {
    const newId = await insertId(
      connection,
      `INSERT INTO timetable_versions (academic_year, name, status, created_by, restored_from_id)
       VALUES (?, ?, ?, ?, ?)`,
      [options.academicYear, options.name, options.status, options.adminId, options.restoredFromId ?? sourceId]
    );

    const [groups] = await connection.query(
      "SELECT * FROM schedule_groups WHERE version_id = ? ORDER BY id",
      [sourceId]
    );
    for (const group of groups as ScheduleGroupRow[]) {
      const groupId = await insertId(
        connection,
        `INSERT INTO schedule_groups (version_id, class_id, student_group_id, time_slot_id, day_of_week, name, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [newId, group.class_id, group.student_group_id, group.time_slot_id, group.day_of_week, group.name, group.sort_order]
      );
      const [assignments] = await connection.query("SELECT * FROM schedule_assignments WHERE schedule_group_id = ?", [group.id]);
      for (const assignment of assignments as ScheduleAssignmentRow[]) {
        const assignmentId = await insertId(
          connection,
          "INSERT INTO schedule_assignments (schedule_group_id, subject_id, assignment_type, room_id, notes) VALUES (?, ?, ?, ?, ?)",
          [groupId, assignment.subject_id, assignment.assignment_type, assignment.room_id, assignment.notes]
        );
        const [teachers] = await connection.query("SELECT teacher_id FROM schedule_assignment_teachers WHERE assignment_id = ?", [assignment.id]);
        for (const teacher of teachers as Array<{ teacher_id: number }>) {
          await connection.execute("INSERT INTO schedule_assignment_teachers (assignment_id, teacher_id) VALUES (?, ?)", [
            assignmentId,
            teacher.teacher_id,
          ]);
        }
      }
    }
    const [rows] = await connection.query("SELECT * FROM timetable_versions WHERE id = ?", [newId]);
    return (rows as TimetableVersion[])[0];
  });
}

async function migrateLegacySchedules(connection: PoolConnection, versionId: number, academicYear: string) {
  const [existing] = await connection.query("SELECT id FROM schedule_groups WHERE version_id = ? LIMIT 1", [versionId]);
  if ((existing as unknown[]).length) return;

  const slots = await getSchoolTimings();
  const [legacy] = await connection.query(
    `SELECT s.*, sub.subject_name
     FROM schedules s
     LEFT JOIN subjects sub ON sub.id = s.subject_id
     WHERE s.academic_year = ? AND s.status = 'ACTIVE'`,
    [academicYear]
  );

  for (const row of legacy as Array<{
    period_number: number;
    room: string | null;
    class_id: number;
    day_of_week: string;
    subject_name: string | null;
    subject_id: number;
    teacher_id: number | null;
  }>) {
    const slot = slots.find((item) => item.period_number === row.period_number && item.active);
    if (!slot) continue;
    let roomId: number | null = null;
    const roomName = row.room?.trim() || null;
    if (roomName) {
      const [found] = await connection.query("SELECT id FROM rooms WHERE name = ? LIMIT 1", [roomName]);
      const match = found as Array<{ id: number }>;
      if (match.length) roomId = match[0].id;
      else roomId = await insertId(connection, "INSERT INTO rooms (name, room_type, active) VALUES (?, 'CLASSROOM', 'ACTIVE')", [roomName]);
    }
    const groupId = await insertId(
      connection,
      `INSERT INTO schedule_groups (version_id, class_id, student_group_id, time_slot_id, day_of_week, name, sort_order)
       VALUES (?, ?, NULL, ?, ?, ?, 1)`,
      [versionId, row.class_id, slot.id, row.day_of_week, row.subject_name || "Group"]
    );
    const assignmentId = await insertId(
      connection,
      "INSERT INTO schedule_assignments (schedule_group_id, subject_id, assignment_type, room_id, notes) VALUES (?, ?, 'theory', ?, NULL)",
      [groupId, row.subject_id, roomId]
    );
    if (row.teacher_id !== null) {
      await connection.execute("INSERT INTO schedule_assignment_teachers (assignment_id, teacher_id) VALUES (?, ?)", [
        assignmentId,
        row.teacher_id,
      ]);
    }
  }
}

export async function getTimetableOptions(academicYear: string) {
  await prepareTimetable();
  const [classes, teachers, subjects, groups, rooms, versions] = await Promise.all([
    query(
      `SELECT id, class_name, section, academic_year, room, status, capacity, category,
              class_name AS name, CONCAT(class_name, IF(section IS NULL OR section='', '', CONCAT('-', section))) AS display_name
       FROM classes
       WHERE status = 'ACTIVE'
       ORDER BY CAST(class_name AS SIGNED), class_name, section`
    ),
    query(
      `SELECT id, name, short_name, teacher_code, subject, email, phone, status, staff_type, availability_notes
       FROM teachers WHERE staff_type = 'TEACHER' ORDER BY name`
    ),
    query(
      `SELECT id, subject_name AS name, subject_code AS code, class_id, teacher_id, category, status, weekly_periods
       FROM subjects ORDER BY subject_name`
    ),
    query(
      `SELECT g.id, g.name, g.class_id, g.description, g.active, c.class_name
       FROM class_groups g JOIN classes c ON c.id = g.class_id ORDER BY g.name`
    ),
    query("SELECT id, name, room_type, building, capacity, active FROM rooms ORDER BY name"),
    listVersions(academicYear),
  ]);
  const timeSlots = await getSchoolTimings();
  return { classes, teachers, subjects, groups, rooms, versions, time_slots: timeSlots, days: [...DEFAULT_DAYS] };
}

type LoadedAssignment = {
  id: number;
  version_id: number;
  class_id: number;
  class_name: string;
  group_id: number;
  group_name: string;
  student_group_id: number | null;
  student_group_name: string | null;
  subject_id: number | null;
  assignment_type: AssignmentType;
  subject_name: string | null;
  room_id: number | null;
  room: string | null;
  day_of_week: SchoolDay;
  time_slot_id: number;
  start_time: string;
  end_time: string;
  slot_order: number;
  teacher_ids: string | null;
  teacher_names: string | null;
  teacher_shorts: string | null;
  notes: string | null;
};

async function loadAssignments(versionId: number, assignmentId?: number, teacherId?: number) {
  return query<LoadedAssignment>(
    `SELECT a.id, g.version_id, g.class_id, CONCAT(c.class_name, IF(c.section IS NULL OR c.section='', '', CONCAT('-', c.section))) AS class_name,
            g.id AS group_id, g.name AS group_name, g.student_group_id, sg.name AS student_group_name,
            a.subject_id, a.assignment_type, sub.subject_name, a.room_id, r.name AS room, g.day_of_week, g.time_slot_id,
            ts.start_time, ts.end_time, ts.slot_order, a.notes,
            t.id AS teacher_ids, t.name AS teacher_names,
            COALESCE(NULLIF(t.short_name,''), t.name) AS teacher_shorts
     FROM schedule_assignments a
     JOIN schedule_groups g ON g.id = a.schedule_group_id
     JOIN classes c ON c.id = g.class_id
     JOIN time_slots ts ON ts.id = g.time_slot_id
     LEFT JOIN subjects sub ON sub.id = a.subject_id
     LEFT JOIN rooms r ON r.id = a.room_id
     LEFT JOIN class_groups sg ON sg.id = g.student_group_id
     LEFT JOIN schedule_assignment_teachers sat ON sat.assignment_id = a.id
     LEFT JOIN teachers t ON t.id = sat.teacher_id
     WHERE g.version_id = ? ${assignmentId ? "AND a.id = ?" : ""} ${teacherId ? "AND t.id = ?" : ""}
     GROUP BY a.id, t.id
     ORDER BY FIELD(g.day_of_week,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'), ts.slot_order, g.sort_order, a.id`,
    [versionId, ...(assignmentId ? [assignmentId] : []), ...(teacherId ? [teacherId] : [])]
  );
}

function toScheduleEntry(
  row: LoadedAssignment,
  academicYear: string,
  status: MasterScheduleEntry["status"],
  slots: Awaited<ReturnType<typeof getSchoolTimings>>
): MasterScheduleEntry {
  return {
    id: row.id,
    academic_year: academicYear,
    class_id: row.class_id,
    class_name: row.class_name,
    group_id: row.group_id,
    group_name: row.group_name,
    student_group_name: row.student_group_name,
    subject_id: row.subject_id,
    subject_name: row.subject_name,
    assignment_type: row.assignment_type,
    teacher_id: row.teacher_ids ? Number(row.teacher_ids) : null,
    teacher_name: row.teacher_shorts || row.teacher_names,
    teacher_names: row.teacher_names,
    room: row.room,
    room_id: row.room_id,
    day_of_week: row.day_of_week,
    start_time: row.start_time,
    end_time: row.end_time,
    slot_order: row.slot_order,
    period_number: periodNumberFromSlots(row.time_slot_id, slots),
    time_slot_id: row.time_slot_id,
    entry_type: "SUBJECT",
    display_label: row.subject_name || row.group_name,
    notes: row.notes,
    color: getSubjectColor(row.subject_name || row.group_name || "Subject"),
    status,
  };
}

function periodNumberFromSlots(slotId: number, slots: Awaited<ReturnType<typeof getSchoolTimings>>) {
  return slots.find((slot) => slot.id === slotId)?.period_number ?? null;
}

export async function buildMasterData(academicYear: string, versionId?: number | null, fallbackLegacy = true): Promise<MasterScheduleData> {
  await prepareTimetable();
  const options = await getTimetableOptions(academicYear);
  const version = versionId
    ? await queryOne<TimetableVersion>("SELECT * FROM timetable_versions WHERE id = ?", [versionId])
    : await getPublishedVersion(academicYear);
  const timeSlots = options.time_slots;
  const columnSetting = await queryOne<{ setting_value: string | null }>(
    "SELECT setting_value FROM settings WHERE setting_key = ? LIMIT 1",
    ["timetable_additional_column_heading"]
  );
  const additionalColumnHeading = columnSetting?.setting_value?.trim() || DEFAULT_ADDITIONAL_COLUMN_HEADING;

  if (version) {
    const assignments = await loadAssignments(version.id);
    const entries = assignments.map((row) => toScheduleEntry(row, academicYear, version.status, timeSlots));
    const data = normalizeSchoolData({
      classes: options.classes as Array<Record<string, unknown>>,
      teachers: options.teachers as Array<Record<string, unknown>>,
      subjects: options.subjects as Array<Record<string, unknown>>,
      entries,
      academicYear,
      timeSlots,
    });
    data.groups = (options.groups as Array<Record<string, unknown>>).map((item) => ({
      id: Number(item.id),
      name: String(item.name),
      class_id: Number(item.class_id),
      description: item.description ? String(item.description) : null,
      active: String(item.active) !== "INACTIVE",
    }));
    data.schedule_entries = data.schedule_entries.map((entry, index) => ({
      ...entry,
      time_slot_id: entries[index]?.time_slot_id ?? entry.time_slot_id ?? null,
      room_id: entries[index]?.room_id ?? null,
      group_id: entries[index]?.group_id,
      group_name: entries[index]?.group_name ?? entry.group_name,
      student_group_name: entries[index]?.student_group_name ?? null,
      teacher_names: entries[index]?.teacher_names ?? entry.teacher_name,
    }));
    data.additional_column_heading = additionalColumnHeading;
    data.version = {
      id: version.id,
      name: version.name,
      status: version.status,
      published_at: version.published_at,
    };
    return data;
  }

  if (!fallbackLegacy) {
    const data = normalizeSchoolData({
      classes: options.classes as Array<Record<string, unknown>>,
      teachers: options.teachers as Array<Record<string, unknown>>,
      subjects: options.subjects as Array<Record<string, unknown>>,
      entries: [],
      academicYear,
      timeSlots,
    });
    data.additional_column_heading = additionalColumnHeading;
    return data;
  }

  const legacy = await query<Record<string, unknown>>(
    `SELECT s.id, s.class_id, c.class_name, s.day_of_week, s.period_number, s.start_time, s.end_time,
            s.room, s.academic_year, s.status, s.teacher_id, t.name AS teacher_name,
            s.subject_id, sub.subject_name
     FROM schedules s
     LEFT JOIN classes c ON c.id = s.class_id
     LEFT JOIN teachers t ON t.id = s.teacher_id
     LEFT JOIN subjects sub ON sub.id = s.subject_id
     WHERE s.status = 'ACTIVE' AND s.academic_year = ?`,
    [academicYear]
  );
  const data = normalizeSchoolData({
    classes: options.classes as Array<Record<string, unknown>>,
    teachers: options.teachers as Array<Record<string, unknown>>,
    subjects: options.subjects as Array<Record<string, unknown>>,
    entries: legacy,
    academicYear,
    timeSlots,
  });
  data.additional_column_heading = additionalColumnHeading;
  return data;
}

export async function loadPeriodGroups(versionId: number, classId: number, day: string, timeSlotId: number) {
  const groups = await query<ScheduleGroupRow & { student_group_name: string | null }>(
    `SELECT g.*, sg.name AS student_group_name
     FROM schedule_groups g
     LEFT JOIN class_groups sg ON sg.id = g.student_group_id
     WHERE g.version_id = ? AND g.class_id = ? AND g.day_of_week = ? AND g.time_slot_id = ?
     ORDER BY g.sort_order, g.id`,
    [versionId, classId, day, timeSlotId]
  );
  const result: LoadedScheduleGroup[] = [];
  for (const group of groups) {
    const assignments = await query<ScheduleAssignmentRow & { subject_name: string | null; room_name: string | null }>(
      `SELECT a.*, sub.subject_name, r.name AS room_name
       FROM schedule_assignments a
       LEFT JOIN subjects sub ON sub.id = a.subject_id
       LEFT JOIN rooms r ON r.id = a.room_id
       WHERE a.schedule_group_id = ?`,
      [group.id]
    );
    const withTeachers: LoadedScheduleGroup["assignments"] = [];
    for (const assignment of assignments) {
      const teachers = await query<ScheduleTeacherRow>(
        `SELECT t.id, t.name, t.short_name
         FROM schedule_assignment_teachers sat JOIN teachers t ON t.id = sat.teacher_id
         WHERE sat.assignment_id = ? ORDER BY t.name`,
        [assignment.id]
      );
      withTeachers.push({ ...assignment, teachers });
    }
    result.push({ ...group, assignments: withTeachers });
  }
  return result;
}

function toGroupInputs(groups: LoadedScheduleGroup[]): GroupInput[] {
  return groups.map((group) => ({
    name: group.name,
    student_group_id: group.student_group_id,
    assignments: group.assignments.map((assignment) => ({
      subject_id: assignment.subject_id,
      assignment_type: assignment.assignment_type,
      room_id: assignment.room_id,
      teacher_ids: assignment.teachers.map((teacher) => teacher.id),
      notes: assignment.notes,
    })),
  }));
}

type OccupancyRow = {
  assignment_id: number;
  group_id: number;
  class_id: number;
  class_name: string;
  group_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  teacher_id: number | null;
  teacher_name: string | null;
  teacher_short: string | null;
  room_id: number | null;
  room_name: string | null;
  student_group_id: number | null;
  student_group_name: string | null;
};

async function occupancy(versionId: number, excludeGroupIds: number[] = [], excludeAssignmentIds: number[] = []) {
  const filters: string[] = [];
  const params: number[] = [versionId];
  if (excludeGroupIds.length) {
    filters.push(`g.id NOT IN (${excludeGroupIds.map(() => "?").join(",")})`);
    params.push(...excludeGroupIds);
  }
  if (excludeAssignmentIds.length) {
    filters.push(`a.id NOT IN (${excludeAssignmentIds.map(() => "?").join(",")})`);
    params.push(...excludeAssignmentIds);
  }
  const extra = filters.length ? `AND ${filters.join(" AND ")}` : "";
  return query<OccupancyRow>(
    `SELECT a.id AS assignment_id, g.id AS group_id, g.class_id,
            CONCAT(c.class_name, IF(c.section IS NULL OR c.section='', '', CONCAT('-', c.section))) AS class_name,
            g.name AS group_name, g.day_of_week, ts.start_time, ts.end_time,
            t.id AS teacher_id, t.name AS teacher_name, t.short_name AS teacher_short,
            r.id AS room_id, r.name AS room_name, g.student_group_id, sg.name AS student_group_name
     FROM schedule_assignments a
     JOIN schedule_groups g ON g.id = a.schedule_group_id
     JOIN classes c ON c.id = g.class_id
     JOIN time_slots ts ON ts.id = g.time_slot_id
     LEFT JOIN rooms r ON r.id = a.room_id
     LEFT JOIN class_groups sg ON sg.id = g.student_group_id
     LEFT JOIN schedule_assignment_teachers sat ON sat.assignment_id = a.id
     LEFT JOIN teachers t ON t.id = sat.teacher_id
     WHERE g.version_id = ? ${extra}`,
    params
  );
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return toSeconds(aStart) < toSeconds(bEnd) && toSeconds(bStart) < toSeconds(aEnd);
}

export async function detectConflicts(options: {
  versionId: number;
  classId: number;
  day: string;
  timeSlotId: number;
  groups: GroupInput[];
  excludeGroupIds?: number[];
  excludeAssignmentIds?: number[];
}) {
  const conflicts: ConflictItem[] = [];
  const slot = (await getSchoolTimings()).find((item) => item.id === options.timeSlotId);
  if (!slot || !slot.active) {
    conflicts.push({ type: "PERIOD", message: "The selected period is inactive or invalid." });
    return conflicts;
  }
  if (toSeconds(slot.end_time) <= toSeconds(slot.start_time)) {
    conflicts.push({ type: "PERIOD", message: "End time must be after start time." });
  }

  const occupied = await occupancy(options.versionId, options.excludeGroupIds, options.excludeAssignmentIds);
  const usedStudentGroups = new Set<number>();

  for (const group of options.groups) {
    if (group.student_group_id) {
      if (usedStudentGroups.has(group.student_group_id)) {
        conflicts.push({
          type: "STUDENT_GROUP",
          message: `Student group ${group.name} is assigned to two simultaneous sessions in this period.`,
        });
      }
      usedStudentGroups.add(group.student_group_id);
      const studentGroup = await queryOne<{ name: string; class_id: number; active: string }>(
        "SELECT name, class_id, active FROM class_groups WHERE id = ?",
        [group.student_group_id]
      );
      if (!studentGroup) {
        conflicts.push({ type: "VALIDATION", message: `Student group ${group.name} no longer exists.` });
      } else if (studentGroup.class_id !== options.classId) {
        conflicts.push({ type: "VALIDATION", message: `${studentGroup.name} belongs to a different class.` });
      } else if (studentGroup.active === "INACTIVE") {
        conflicts.push({ type: "VALIDATION", message: `${studentGroup.name} is inactive and cannot be scheduled.` });
      }
    }
    for (const assignment of group.assignments) {
      if (assignment.subject_id) {
        const subject = await queryOne<{ class_id: number; status: string; subject_name: string }>(
          "SELECT class_id, status, subject_name FROM subjects WHERE id = ?",
          [assignment.subject_id]
        );
        if (!subject) conflicts.push({ type: "VALIDATION", message: "A selected subject no longer exists." });
        else if (subject.status === "INACTIVE") conflicts.push({ type: "VALIDATION", message: `${subject.subject_name} is inactive and cannot be assigned.` });
      }
      if (assignment.room_id) {
        const room = await queryOne<{ name: string; active: string }>("SELECT name, active FROM rooms WHERE id = ?", [assignment.room_id]);
        if (!room) conflicts.push({ type: "VALIDATION", message: "A selected classroom no longer exists." });
        else if (room.active === "INACTIVE") conflicts.push({ type: "CLASSROOM", message: `${room.name} is inactive and cannot be assigned.` });
        const clash = occupied.find(
          (row) =>
            row.room_id === assignment.room_id &&
            row.day_of_week === options.day &&
            overlaps(slot.start_time, slot.end_time, row.start_time, row.end_time)
        );
        if (clash) {
          conflicts.push({
            type: "CLASSROOM",
            message: `${room?.name ?? "Room"} is already occupied during this period.`,
          });
        }
      }
      for (const teacherId of assignment.teacher_ids) {
        const teacher = await queryOne<{ name: string; short_name: string | null; status: string }>(
          "SELECT name, short_name, status FROM teachers WHERE id = ?",
          [teacherId]
        );
        if (!teacher) {
          conflicts.push({ type: "VALIDATION", message: "A selected teacher no longer exists." });
          continue;
        }
        if (teacher.status !== "ACTIVE") {
          conflicts.push({ type: "VALIDATION", message: `Teacher ${teacher.short_name || teacher.name} is inactive and cannot be assigned.` });
          continue;
        }
        const blocked = await queryOne<{ id: number }>(
          `SELECT id FROM teacher_availability
           WHERE teacher_id = ? AND day_of_week = ? AND is_available = 0
             AND (start_time IS NULL OR (start_time < ? AND end_time > ?))
           LIMIT 1`,
          [teacherId, options.day, slot.end_time, slot.start_time]
        );
        if (blocked) {
          conflicts.push({
            type: "AVAILABILITY",
            message: `Teacher ${teacher.short_name || teacher.name} is marked unavailable at this time.`,
          });
        }
        const clash = occupied.find(
          (row) =>
            row.teacher_id === teacherId &&
            row.day_of_week === options.day &&
            overlaps(slot.start_time, slot.end_time, row.start_time, row.end_time)
        );
        if (clash) {
          const label = teacher.short_name || teacher.name;
          conflicts.push({
            type: "TEACHER",
            message: `Teacher ${label} is already assigned to Class ${clash.class_name}, ${clash.group_name} on ${options.day}.`,
          });
        }
      }
    }
  }

  const unique: ConflictItem[] = [];
  for (const item of conflicts) {
    if (!unique.some((row) => row.message === item.message)) unique.push(item);
  }
  return unique;
}

export async function savePeriod(options: {
  versionId: number;
  classId: number;
  day: string;
  timeSlotId: number;
  groups: GroupInput[];
  override: boolean;
  adminId: number | null;
  canOverride: boolean;
}) {
  const existing = await query<{ id: number }>(
    "SELECT id FROM schedule_groups WHERE version_id = ? AND class_id = ? AND day_of_week = ? AND time_slot_id = ?",
    [options.versionId, options.classId, options.day, options.timeSlotId]
  );
  const conflicts = await detectConflicts({
    versionId: options.versionId,
    classId: options.classId,
    day: options.day,
    timeSlotId: options.timeSlotId,
    groups: options.groups,
    excludeGroupIds: existing.map((row) => row.id),
  });
  if (conflicts.length && !options.override) throw new TimetableConflictError(conflicts);
  if (conflicts.length && options.override && !options.canOverride) {
    throw new TimetableConflictError(conflicts);
  }

  await withTransaction(async (connection) => {
    for (const group of existing) {
      const [assignments] = await connection.query("SELECT id FROM schedule_assignments WHERE schedule_group_id = ?", [group.id]);
      for (const assignment of assignments as Array<{ id: number }>) {
        await connection.execute("DELETE FROM schedule_assignment_teachers WHERE assignment_id = ?", [assignment.id]);
      }
      await connection.execute("DELETE FROM schedule_assignments WHERE schedule_group_id = ?", [group.id]);
      await connection.execute("DELETE FROM schedule_groups WHERE id = ?", [group.id]);
    }
    let order = 1;
    for (const group of options.groups) {
      const groupId = await insertId(
        connection,
        `INSERT INTO schedule_groups (version_id, class_id, student_group_id, time_slot_id, day_of_week, name, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [options.versionId, options.classId, group.student_group_id, options.timeSlotId, options.day, group.name || `Group ${order}`, order]
      );
      for (const assignment of group.assignments) {
        const assignmentId = await insertId(
          connection,
          "INSERT INTO schedule_assignments (schedule_group_id, subject_id, assignment_type, room_id, notes) VALUES (?, ?, ?, ?, ?)",
          [groupId, assignment.subject_id, assignment.assignment_type, assignment.room_id, assignment.notes ?? null]
        );
        for (const teacherId of assignment.teacher_ids) {
          await connection.execute("INSERT INTO schedule_assignment_teachers (assignment_id, teacher_id) VALUES (?, ?)", [
            assignmentId,
            teacherId,
          ]);
        }
      }
      order += 1;
    }
  });

  await auditTimetable(
    options.adminId,
    options.override ? "OVERRIDE_SAVE" : "SAVE_PERIOD",
    options.override ? "Saved period with conflict override" : "Saved period schedule",
    options.versionId,
    { classId: options.classId, day: options.day, timeSlotId: options.timeSlotId, conflicts }
  );
  return loadPeriodGroups(options.versionId, options.classId, options.day, options.timeSlotId);
}

async function assertDraftVersion(versionId: number) {
  const version = await queryOne<TimetableVersion>("SELECT * FROM timetable_versions WHERE id = ?", [versionId]);
  if (!version) throw new Error("Timetable version not found.");
  if (version.status !== "DRAFT") throw new Error("Only a draft timetable can be edited.");
  return version;
}

function guardConflicts(conflicts: ConflictItem[], override: boolean, canOverride: boolean) {
  if (conflicts.length && !override) throw new TimetableConflictError(conflicts);
  if (conflicts.length && override && !canOverride) throw new TimetableConflictError(conflicts);
}

export async function appendAssignment(options: {
  versionId: number;
  classId: number;
  day: string;
  timeSlotId: number;
  subjectId: number;
  assignmentType: AssignmentType;
  teacherId: number;
  roomId: number | null;
  notes?: string | null;
  override: boolean;
  adminId: number | null;
  canOverride: boolean;
}) {
  const version = await assertDraftVersion(options.versionId);
  const existingGroups = await query<ScheduleGroupRow>(
    `SELECT * FROM schedule_groups
     WHERE version_id = ? AND class_id = ? AND day_of_week = ? AND time_slot_id = ?
     ORDER BY sort_order, id`,
    [options.versionId, options.classId, options.day, options.timeSlotId]
  );
  const target = existingGroups[0];
  const conflicts = await detectConflicts({
    versionId: options.versionId,
    classId: options.classId,
    day: options.day,
    timeSlotId: options.timeSlotId,
    groups: [{
      name: target?.name ?? "Class",
      student_group_id: target?.student_group_id ?? null,
      assignments: [{
        subject_id: options.subjectId,
        assignment_type: options.assignmentType,
        room_id: options.roomId,
        teacher_ids: [options.teacherId],
        notes: options.notes ?? null,
      }],
    }],
  });
  guardConflicts(conflicts, options.override, options.canOverride);

  const assignmentId = await withTransaction(async (connection) => {
    let groupId = target?.id;
    if (!groupId) {
      groupId = await insertId(
        connection,
        `INSERT INTO schedule_groups (version_id, class_id, student_group_id, time_slot_id, day_of_week, name, sort_order)
         VALUES (?, ?, NULL, ?, ?, 'Class', 1)`,
        [options.versionId, options.classId, options.timeSlotId, options.day]
      );
    }
    const createdId = await insertId(
      connection,
      "INSERT INTO schedule_assignments (schedule_group_id, subject_id, assignment_type, room_id, notes) VALUES (?, ?, ?, ?, ?)",
      [groupId, options.subjectId, options.assignmentType, options.roomId, options.notes ?? null]
    );
    await connection.execute(
      "INSERT INTO schedule_assignment_teachers (assignment_id, teacher_id) VALUES (?, ?)",
      [createdId, options.teacherId]
    );
    return createdId;
  });

  await auditTimetable(
    options.adminId,
    options.override ? "OVERRIDE_APPEND" : "APPEND_ASSIGNMENT",
    "Added a teacher to a period",
    options.versionId,
    { assignmentId, classId: options.classId, day: options.day, timeSlotId: options.timeSlotId, conflicts }
  );
  const slots = await getSchoolTimings();
  const [row] = await loadAssignments(options.versionId, assignmentId, options.teacherId);
  if (!row) throw new Error("The new assignment could not be loaded.");
  return toScheduleEntry(row, version.academic_year, version.status, slots);
}

export async function updateAssignment(options: {
  assignmentId: number;
  assignmentType?: AssignmentType;
  targetTeacherId?: number | null;
  subjectId: number;
  teacherId: number;
  roomId: number | null;
  notes?: string | null;
  override: boolean;
  adminId: number | null;
  canOverride: boolean;
}) {
  const current = await queryOne<{
    id: number;
    schedule_group_id: number;
    version_id: number;
    class_id: number;
    day_of_week: string;
    time_slot_id: number;
    group_name: string;
    student_group_id: number | null;
    notes: string | null;
    assignment_type: AssignmentType;
  }>(
    `SELECT a.id, a.schedule_group_id, a.notes, a.assignment_type, g.version_id, g.class_id, g.day_of_week, g.time_slot_id,
            g.name AS group_name, g.student_group_id
     FROM schedule_assignments a
     JOIN schedule_groups g ON g.id = a.schedule_group_id
     WHERE a.id = ?`,
    [options.assignmentId]
  );
  if (!current) return null;
  const version = await assertDraftVersion(current.version_id);
  const currentTeachers = await query<{ teacher_id: number }>(
    "SELECT teacher_id FROM schedule_assignment_teachers WHERE assignment_id = ?",
    [options.assignmentId]
  );
  const targetTeacherId = options.targetTeacherId ?? null;
  if (targetTeacherId && !currentTeachers.some((item) => item.teacher_id === targetTeacherId)) return null;
  if (
    targetTeacherId &&
    options.teacherId !== targetTeacherId &&
    currentTeachers.some((item) => item.teacher_id === options.teacherId)
  ) {
    throw new TimetableConflictError([{
      type: "TEACHER",
      message: "That teacher is already assigned to this period.",
    }]);
  }
  const shouldSplit = Boolean(
    targetTeacherId && currentTeachers.some((item) => item.teacher_id !== targetTeacherId)
  );
  const notes = options.notes === undefined ? current.notes : options.notes;
  const conflicts = await detectConflicts({
    versionId: current.version_id,
    classId: current.class_id,
    day: current.day_of_week,
    timeSlotId: current.time_slot_id,
    groups: [{
      name: current.group_name,
      student_group_id: current.student_group_id,
      assignments: [{
        subject_id: options.subjectId,
        assignment_type: options.assignmentType ?? current.assignment_type,
        room_id: options.roomId,
        teacher_ids: [options.teacherId],
        notes,
      }],
    }],
    excludeAssignmentIds: [options.assignmentId],
  });
  guardConflicts(conflicts, options.override, options.canOverride);

  const savedAssignmentId = await withTransaction(async (connection) => {
    let assignmentId = options.assignmentId;
    if (shouldSplit) {
      assignmentId = await insertId(
        connection,
        "INSERT INTO schedule_assignments (schedule_group_id, subject_id, assignment_type, room_id, notes) VALUES (?, ?, ?, ?, ?)",
        [current.schedule_group_id, options.subjectId, options.assignmentType ?? current.assignment_type, options.roomId, notes]
      );
      await connection.execute(
        "DELETE FROM schedule_assignment_teachers WHERE assignment_id = ? AND teacher_id = ?",
        [options.assignmentId, targetTeacherId]
      );
    } else {
      await connection.execute(
        "UPDATE schedule_assignments SET subject_id = ?, assignment_type = ?, room_id = ?, notes = ? WHERE id = ?",
        [options.subjectId, options.assignmentType ?? current.assignment_type, options.roomId, notes, options.assignmentId]
      );
      await connection.execute("DELETE FROM schedule_assignment_teachers WHERE assignment_id = ?", [options.assignmentId]);
    }
    await connection.execute(
      "INSERT INTO schedule_assignment_teachers (assignment_id, teacher_id) VALUES (?, ?)",
      [assignmentId, options.teacherId]
    );
    return assignmentId;
  });

  await auditTimetable(options.adminId, options.override ? "OVERRIDE_UPDATE" : "UPDATE_ASSIGNMENT", "Updated one timetable assignment", current.version_id, {
    assignmentId: options.assignmentId,
    savedAssignmentId,
    targetTeacherId,
    conflicts,
  });
  const slots = await getSchoolTimings();
  const [row] = await loadAssignments(current.version_id, savedAssignmentId, options.teacherId);
  if (!row) throw new Error("The updated assignment could not be loaded.");
  return toScheduleEntry(row, version.academic_year, version.status, slots);
}

export async function deleteAssignment(assignmentId: number, adminId: number | null, teacherId?: number | null) {
  const row = await queryOne<{ schedule_group_id: number; version_id: number }>(
    `SELECT a.schedule_group_id, g.version_id
     FROM schedule_assignments a JOIN schedule_groups g ON g.id = a.schedule_group_id WHERE a.id = ?`,
    [assignmentId]
  );
  if (!row) return false;
  await assertDraftVersion(row.version_id);
  if (teacherId) {
    const teacher = await queryOne<{ teacher_id: number }>(
      "SELECT teacher_id FROM schedule_assignment_teachers WHERE assignment_id = ? AND teacher_id = ?",
      [assignmentId, teacherId]
    );
    if (!teacher) return false;
  }
  await withTransaction(async (connection) => {
    if (teacherId) {
      await connection.execute(
        "DELETE FROM schedule_assignment_teachers WHERE assignment_id = ? AND teacher_id = ?",
        [assignmentId, teacherId]
      );
      const [teachers] = await connection.query(
        "SELECT teacher_id FROM schedule_assignment_teachers WHERE assignment_id = ?",
        [assignmentId]
      );
      if (!(teachers as unknown[]).length) {
        await connection.execute("DELETE FROM schedule_assignments WHERE id = ?", [assignmentId]);
      }
    } else {
      await connection.execute("DELETE FROM schedule_assignment_teachers WHERE assignment_id = ?", [assignmentId]);
      await connection.execute("DELETE FROM schedule_assignments WHERE id = ?", [assignmentId]);
    }
    const [left] = await connection.query("SELECT id FROM schedule_assignments WHERE schedule_group_id = ?", [row.schedule_group_id]);
    if (!(left as unknown[]).length) {
      await connection.execute("DELETE FROM schedule_groups WHERE id = ?", [row.schedule_group_id]);
    }
  });
  await auditTimetable(adminId, teacherId ? "DELETE_TEACHER_ASSIGNMENT" : "DELETE_ASSIGNMENT", "Deleted timetable assignment", row.version_id, { assignmentId, teacherId: teacherId ?? null });
  return true;
}

export async function copyTimetable(options: {
  versionId: number;
  sourceClassId: number;
  sourceDay: string;
  targetClassId: number;
  targetDays: string[];
  adminId: number | null;
  override: boolean;
  canOverride: boolean;
}) {
  const sourceGroups = await query<ScheduleGroupRow>(
    "SELECT * FROM schedule_groups WHERE version_id = ? AND class_id = ? AND day_of_week = ? ORDER BY time_slot_id, sort_order",
    [options.versionId, options.sourceClassId, options.sourceDay]
  );
  const targetDays = [...new Set(options.targetDays)];
  const sourceSlots = [...new Set(sourceGroups.map((group) => group.time_slot_id))];
  for (const targetDay of targetDays) {
    for (const timeSlotId of sourceSlots) {
      const sourcePeriodGroups = await loadPeriodGroups(
        options.versionId,
        options.sourceClassId,
        options.sourceDay,
        timeSlotId
      );
      const existing = await query<{ id: number }>(
        `SELECT id FROM schedule_groups
         WHERE version_id = ? AND class_id = ? AND day_of_week = ? AND time_slot_id = ?`,
        [options.versionId, options.targetClassId, targetDay, timeSlotId]
      );
      const conflicts = await detectConflicts({
        versionId: options.versionId,
        classId: options.targetClassId,
        day: targetDay,
        timeSlotId,
        groups: toGroupInputs(sourcePeriodGroups).map((group) => ({
          ...group,
          student_group_id: options.sourceClassId === options.targetClassId ? group.student_group_id : null,
        })),
        excludeGroupIds: existing.map((group) => group.id),
      });
      if (conflicts.length && !(options.override && options.canOverride)) {
        throw new TimetableConflictError(conflicts);
      }
    }
  }

  await withTransaction(async (connection) => {
    for (const day of targetDays) {
      const [existing] = await connection.query(
        "SELECT id FROM schedule_groups WHERE version_id = ? AND class_id = ? AND day_of_week = ?",
        [options.versionId, options.targetClassId, day]
      );
      for (const group of existing as Array<{ id: number }>) {
        const [assignments] = await connection.query("SELECT id FROM schedule_assignments WHERE schedule_group_id = ?", [group.id]);
        for (const assignment of assignments as Array<{ id: number }>) {
          await connection.execute("DELETE FROM schedule_assignment_teachers WHERE assignment_id = ?", [assignment.id]);
        }
        await connection.execute("DELETE FROM schedule_assignments WHERE schedule_group_id = ?", [group.id]);
        await connection.execute("DELETE FROM schedule_groups WHERE id = ?", [group.id]);
      }
      for (const group of sourceGroups) {
        const groupId = await insertId(
          connection,
          `INSERT INTO schedule_groups (version_id, class_id, student_group_id, time_slot_id, day_of_week, name, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            options.versionId,
            options.targetClassId,
            options.sourceClassId === options.targetClassId ? group.student_group_id : null,
            group.time_slot_id,
            day,
            group.name,
            group.sort_order,
          ]
        );
        const [assignments] = await connection.query("SELECT * FROM schedule_assignments WHERE schedule_group_id = ?", [group.id]);
        for (const assignment of assignments as ScheduleAssignmentRow[]) {
          const assignmentId = await insertId(
            connection,
            "INSERT INTO schedule_assignments (schedule_group_id, subject_id, assignment_type, room_id, notes) VALUES (?, ?, ?, ?, ?)",
            [groupId, assignment.subject_id, assignment.assignment_type, assignment.room_id, assignment.notes]
          );
          const [teachers] = await connection.query("SELECT teacher_id FROM schedule_assignment_teachers WHERE assignment_id = ?", [
            assignment.id,
          ]);
          for (const teacher of teachers as Array<{ teacher_id: number }>) {
            await connection.execute("INSERT INTO schedule_assignment_teachers (assignment_id, teacher_id) VALUES (?, ?)", [
              assignmentId,
              teacher.teacher_id,
            ]);
          }
        }
      }
    }
  });
  await auditTimetable(
    options.adminId,
    options.override ? "COPY_OVERRIDE" : "COPY",
    `Copied timetable from class ${options.sourceClassId} ${options.sourceDay}`,
    options.versionId,
    options
  );
}

export async function publishVersion(versionId: number, adminId: number | null, override = false, canOverride = false) {
  const version = await queryOne<TimetableVersion>("SELECT * FROM timetable_versions WHERE id = ?", [versionId]);
  if (!version) throw new Error("Timetable version not found");
  const groups = await query<{ id: number; class_id: number; day_of_week: string; time_slot_id: number }>(
    "SELECT id, class_id, day_of_week, time_slot_id FROM schedule_groups WHERE version_id = ?",
    [versionId]
  );
  const allConflicts: ConflictItem[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    const key = `${group.class_id}-${group.day_of_week}-${group.time_slot_id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const periodGroups = await loadPeriodGroups(versionId, group.class_id, group.day_of_week, group.time_slot_id);
    const conflicts = await detectConflicts({
      versionId,
      classId: group.class_id,
      day: group.day_of_week,
      timeSlotId: group.time_slot_id,
      groups: toGroupInputs(periodGroups),
      excludeGroupIds: periodGroups.map((item) => Number(item.id)),
    });
    allConflicts.push(...conflicts);
  }
  const unique: ConflictItem[] = [];
  for (const item of allConflicts) {
    if (!unique.some((row) => row.message === item.message)) unique.push(item);
  }
  if (unique.length && !(override && canOverride)) throw new TimetableConflictError(unique);

  await withTransaction(async (connection) => {
    await connection.execute(
      "UPDATE timetable_versions SET status = 'ARCHIVED' WHERE academic_year = ? AND status = 'PUBLISHED' AND id <> ?",
      [version.academic_year, versionId]
    );
    await connection.execute(
      "UPDATE timetable_versions SET status = 'PUBLISHED', published_by = ?, published_at = NOW() WHERE id = ?",
      [adminId, versionId]
    );
  });
  await auditTimetable(adminId, override ? "PUBLISH_OVERRIDE" : "PUBLISH", "Published timetable", versionId, { conflicts: unique });
  return queryOne<TimetableVersion>("SELECT * FROM timetable_versions WHERE id = ?", [versionId]);
}

export async function unpublishVersion(versionId: number, adminId: number | null) {
  await query("UPDATE timetable_versions SET status = 'ARCHIVED' WHERE id = ? AND status = 'PUBLISHED'", [versionId]);
  await auditTimetable(adminId, "UNPUBLISH", "Unpublished timetable", versionId);
}

export async function restoreVersion(sourceId: number, adminId: number | null) {
  const source = await queryOne<TimetableVersion>("SELECT * FROM timetable_versions WHERE id = ?", [sourceId]);
  if (!source) throw new Error("Version not found");
  const currentDraft = await queryOne<TimetableVersion>(
    "SELECT * FROM timetable_versions WHERE academic_year = ? AND status = 'DRAFT' LIMIT 1",
    [source.academic_year]
  );
  if (currentDraft) {
    await query("UPDATE timetable_versions SET status = 'ARCHIVED' WHERE id = ?", [currentDraft.id]);
  }
  const restored = await cloneVersion(sourceId, {
    academicYear: source.academic_year,
    name: `Restored from ${source.name}`,
    status: "DRAFT",
    adminId,
    restoredFromId: sourceId,
  });
  await auditTimetable(adminId, "RESTORE", `Restored version ${sourceId}`, restored.id);
  return restored;
}

export async function timetableOverview(academicYear: string) {
  await prepareTimetable();
  const [classes, subjects, teachers, rooms, drafts, published, sessions] = await Promise.all([
    queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM classes WHERE status = 'ACTIVE'"),
    queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM subjects WHERE status = 'ACTIVE'"),
    queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM teachers WHERE status = 'ACTIVE' AND staff_type = 'TEACHER'"),
    queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM rooms WHERE active = 'ACTIVE'"),
    queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM timetable_versions WHERE academic_year = ? AND status = 'DRAFT'", [academicYear]),
    queryOne<TimetableVersion>(
      "SELECT * FROM timetable_versions WHERE academic_year = ? AND status = 'PUBLISHED' ORDER BY published_at DESC LIMIT 1",
      [academicYear]
    ),
    queryOne<{ total: number }>(
      `SELECT COUNT(*) AS total FROM schedule_assignments a
       JOIN schedule_groups g ON g.id = a.schedule_group_id
       JOIN timetable_versions v ON v.id = g.version_id
       WHERE v.academic_year = ? AND v.status IN ('DRAFT','PUBLISHED')`,
      [academicYear]
    ),
  ]);
  return {
    totals: {
      classes: Number(classes?.total ?? 0),
      subjects: Number(subjects?.total ?? 0),
      teachers: Number(teachers?.total ?? 0),
      classrooms: Number(rooms?.total ?? 0),
      sessions: Number(sessions?.total ?? 0),
      drafts: Number(drafts?.total ?? 0),
    },
    last_published: published,
  };
}
