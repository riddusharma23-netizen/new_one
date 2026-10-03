export const SCHOOL_NAME = "Smt. Champi Devi Inter College";
export const DEFAULT_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export type SchoolDay = (typeof DEFAULT_DAYS)[number];

export type MasterTimeSlot = {
  id: number;
  label: string;
  start_time: string;
  end_time: string;
  slot_order: number;
  period_number?: number | null;
  slot_type: "REGULAR" | "BREAK" | "LUNCH" | "ASSEMBLY" | "OTHER";
  is_break: boolean;
  is_lunch: boolean;
  active: boolean;
};

export type MasterClassRow = {
  id: number;
  name: string;
  display_name: string;
  section: string;
  category?: string | null;
  active: boolean;
};

export type MasterTeacher = {
  id: number;
  name: string;
  short_name?: string | null;
  status?: string | null;
};

export type MasterSubject = {
  id: number;
  class_id?: number;
  name: string;
  short_name?: string | null;
  code?: string | null;
  color?: string | null;
  active: boolean;
};

export type MasterGroup = {
  id: number;
  name: string;
  class_id: number;
  description?: string | null;
  active: boolean;
};

export type MasterScheduleEntry = {
  id: number;
  academic_year: string;
  class_id: number;
  class_name: string;
  group_name?: string | null;
  subject_id?: number | null;
  subject_name?: string | null;
  teacher_id?: number | null;
  teacher_name?: string | null;
  room?: string | null;
  day_of_week: SchoolDay;
  start_time?: string | null;
  end_time?: string | null;
  slot_order?: number;
  period_number?: number | null;
  entry_type: "SUBJECT" | "BREAK" | "LUNCH" | "ACTIVITY" | "ASSEMBLY" | "FREE" | "OTHER";
  display_label?: string | null;
  notes?: string | null;
  color: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "ACTIVE" | "INACTIVE";
};

export type MasterScheduleData = {
  school: {
    name: string;
    academic_year: string;
    title: string;
  };
  academic_year: string;
  classes: MasterClassRow[];
  time_slots: MasterTimeSlot[];
  breaks: MasterTimeSlot[];
  groups: MasterGroup[];
  teachers: MasterTeacher[];
  subjects: MasterSubject[];
  schedule_entries: MasterScheduleEntry[];
};

export const DEFAULT_TIME_SLOTS: MasterTimeSlot[] = [
  { id: 1, label: "Prayer · 7:30–7:45 AM", start_time: "07:30:00", end_time: "07:45:00", slot_order: 1, period_number: null, slot_type: "ASSEMBLY", is_break: false, is_lunch: false, active: true },
  { id: 2, label: "Period 1 · 7:45–8:25 AM", start_time: "07:45:00", end_time: "08:25:00", slot_order: 2, period_number: 1, slot_type: "REGULAR", is_break: false, is_lunch: false, active: true },
  { id: 3, label: "Period 2 · 8:25–9:05 AM", start_time: "08:25:00", end_time: "09:05:00", slot_order: 3, period_number: 2, slot_type: "REGULAR", is_break: false, is_lunch: false, active: true },
  { id: 4, label: "Period 3 · 9:05–9:45 AM", start_time: "09:05:00", end_time: "09:45:00", slot_order: 4, period_number: 3, slot_type: "REGULAR", is_break: false, is_lunch: false, active: true },
  { id: 5, label: "Break · 9:45–10:00 AM", start_time: "09:45:00", end_time: "10:00:00", slot_order: 5, period_number: null, slot_type: "BREAK", is_break: true, is_lunch: false, active: true },
  { id: 6, label: "Period 4 · 10:00–10:40 AM", start_time: "10:00:00", end_time: "10:40:00", slot_order: 6, period_number: 4, slot_type: "REGULAR", is_break: false, is_lunch: false, active: true },
  { id: 7, label: "Period 5 · 10:40–11:20 AM", start_time: "10:40:00", end_time: "11:20:00", slot_order: 7, period_number: 5, slot_type: "REGULAR", is_break: false, is_lunch: false, active: true },
  { id: 8, label: "Lunch · 11:20–11:50 AM", start_time: "11:20:00", end_time: "11:50:00", slot_order: 8, period_number: null, slot_type: "LUNCH", is_break: false, is_lunch: true, active: true },
  { id: 9, label: "Period 6 · 11:50 AM–12:30 PM", start_time: "11:50:00", end_time: "12:30:00", slot_order: 9, period_number: 6, slot_type: "REGULAR", is_break: false, is_lunch: false, active: true },
  { id: 10, label: "Period 7 · 12:30–1:10 PM", start_time: "12:30:00", end_time: "13:10:00", slot_order: 10, period_number: 7, slot_type: "REGULAR", is_break: false, is_lunch: false, active: true },
  { id: 11, label: "Period 8 · 1:10–1:50 PM", start_time: "13:10:00", end_time: "13:50:00", slot_order: 11, period_number: 8, slot_type: "REGULAR", is_break: false, is_lunch: false, active: true },
];

export function getSubjectColor(name: string) {
  const palette = [
    "#dbeafe",
    "#dcfce7",
    "#fef3c7",
    "#fee2e2",
    "#ede9fe",
    "#fae8ff",
    "#d1fae5",
    "#bfdbfe",
    "#fed7aa",
    "#fecdd3",
    "#ddd6fe",
    "#f5d0fe",
    "#d9f99d",
    "#fcd34d",
    "#93c5fd",
  ];

  const value = name.toLowerCase().split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return palette[value % palette.length] ?? "#e2e8f0";
}

export function normalizeTimeLabel(value?: string | null) {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.length <= 5) return trimmed;
  const [hour, minute] = trimmed.split(":");
  if (!hour || !minute) return trimmed;
  const parsedHour = Number(hour);
  if (!Number.isFinite(parsedHour)) return trimmed;
  const suffix = parsedHour >= 12 ? "PM" : "AM";
  const displayHour = parsedHour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
}

function textValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function normalizeSchoolData(input: {
  classes: Array<Record<string, unknown>>;
  teachers: Array<Record<string, unknown>>;
  subjects: Array<Record<string, unknown>>;
  entries: Array<Record<string, unknown>>;
  academicYear: string;
  timeSlots?: MasterTimeSlot[];
}) {
  const classes = (input.classes ?? []).map((item) => ({
    id: Number(item.id),
    name: textValue(item.name ?? item.class_name, "Class"),
    display_name: textValue(item.display_name, `${textValue(item.name ?? item.class_name, "Class")}${textValue(item.section, "") ? ` ${textValue(item.section, "")}` : ""}`),
    section: textValue(item.section, ""),
    category: typeof item.category === "string" ? item.category : null,
    active: typeof item.active === "boolean" ? item.active : true,
  }));

  const subjects = (input.subjects ?? []).map((item) => ({
    id: Number(item.id),
    class_id: item.class_id ? Number(item.class_id) : undefined,
    name: textValue(item.name ?? item.subject_name, "Subject"),
    short_name: textValue(item.short_name, textValue(item.name ?? item.subject_name, "SUB").slice(0, 3).toUpperCase()),
    code: textValue(item.code ?? item.subject_code, `${textValue(item.name ?? item.subject_name, "SUB").slice(0, 3).toUpperCase()}-${Number(item.id)}`),
    color: textValue(item.color, getSubjectColor(textValue(item.name ?? item.subject_name, "Subject"))),
    active: typeof item.active === "boolean" ? item.active : item.status !== "INACTIVE",
  }));

  const teachers = (input.teachers ?? []).map((item) => ({
    id: Number(item.id),
    name: textValue(item.name, "Teacher"),
    short_name: textValue(item.short_name, textValue(item.name, "T").split(" ").map((part) => part[0]).join("").slice(0, 3).toUpperCase()),
    status: typeof item.status === "string" ? item.status : "ACTIVE",
  }));

  const effectiveTimeSlots = (input.timeSlots ?? DEFAULT_TIME_SLOTS).map((slot, index) => ({
    ...slot,
    id: Number(slot.id ?? index + 1),
    slot_order: Number(slot.slot_order ?? index + 1),
    active: slot.active ?? true,
  }));

  const entries = (input.entries ?? []).map((entry, index) => {
    const subjectName = String(entry.subject_name ?? subjects.find((item) => item.id === Number(entry.subject_id))?.name ?? "Subject");
    const teacherName = String(entry.teacher_name ?? teachers.find((item) => item.id === Number(entry.teacher_id))?.name ?? "Teacher");
    const className = String(entry.class_name ?? classes.find((item) => item.id === Number(entry.class_id))?.display_name ?? "Class");
    const color = String(entry.color ?? subjects.find((item) => item.id === Number(entry.subject_id))?.color ?? getSubjectColor(subjectName));

    return {
      id: Number(entry.id ?? index + 1),
      academic_year: String(entry.academic_year ?? input.academicYear),
      class_id: Number(entry.class_id),
      class_name: className,
      group_name: entry.group_name ? String(entry.group_name) : null,
      subject_id: entry.subject_id ? Number(entry.subject_id) : null,
      subject_name: subjectName,
      teacher_id: entry.teacher_id ? Number(entry.teacher_id) : null,
      teacher_name: teacherName,
      room: entry.room ? String(entry.room) : null,
      day_of_week: String(entry.day_of_week ?? "Monday") as MasterScheduleEntry["day_of_week"],
      start_time: entry.start_time ? String(entry.start_time) : null,
      end_time: entry.end_time ? String(entry.end_time) : null,
      slot_order: Number(entry.slot_order ?? entry.period_number ?? 1),
      period_number: Number(entry.period_number ?? entry.slot_order ?? 1),
      entry_type: String(entry.entry_type ?? "SUBJECT") as MasterScheduleEntry["entry_type"],
      display_label: entry.display_label ? String(entry.display_label) : subjectName,
      notes: entry.notes ? String(entry.notes) : null,
      color,
      status: String(entry.status ?? "PUBLISHED") as MasterScheduleEntry["status"],
    };
  });

  return {
    school: {
      name: SCHOOL_NAME,
      academic_year: input.academicYear,
      title: "Timetable",
    },
    academic_year: input.academicYear,
    classes,
    time_slots: effectiveTimeSlots,
    breaks: effectiveTimeSlots.filter((slot) => slot.is_break || slot.is_lunch || slot.slot_type === "BREAK" || slot.slot_type === "LUNCH"),
    groups: [],
    teachers,
    subjects,
    schedule_entries: entries,
  } satisfies MasterScheduleData;
}
