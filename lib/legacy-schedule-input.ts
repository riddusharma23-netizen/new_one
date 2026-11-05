import { queryOne } from "@/lib/db";
import { asInteger, asOptionalString, asString, normalizeSchoolDay } from "@/lib/validation";

export type LegacyScheduleInput = {
  teacher_id: number;
  class_id: number;
  subject_id: number;
  day_of_week: NonNullable<ReturnType<typeof normalizeSchoolDay>>;
  period_number: number;
  start_time: string | null;
  end_time: string | null;
  room: string | null;
  academic_year: string;
  status: "ACTIVE" | "INACTIVE";
};

export function parseLegacyScheduleInput(value: unknown):
  | { input: LegacyScheduleInput; error?: never }
  | { input?: never; error: string } {
  const body = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const teacher_id = asInteger(body.teacher_id);
  const class_id = asInteger(body.class_id);
  const subject_id = asInteger(body.subject_id);
  const period_number = asInteger(body.period_number);
  const day_of_week = normalizeSchoolDay(body.day_of_week);
  const academic_year = asString(body.academic_year);

  if (!class_id || class_id < 1) return { error: "Select a class." };
  if (!subject_id || subject_id < 1) return { error: "Select a subject for this class." };
  if (!teacher_id || teacher_id < 1) return { error: "Select a teacher." };
  if (!day_of_week) return { error: "Choose a day from Monday to Saturday." };
  if (!period_number || period_number < 1 || period_number > 255) return { error: "Select a valid period." };
  if (!academic_year || academic_year.length > 20) return { error: "Enter a valid academic year." };

  return {
    input: {
      teacher_id,
      class_id,
      subject_id,
      period_number,
      day_of_week,
      academic_year,
      start_time: asOptionalString(body.start_time),
      end_time: asOptionalString(body.end_time),
      room: asOptionalString(body.room),
      status: asString(body.status) === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    },
  };
}

export async function validateLegacyScheduleReferences(input: LegacyScheduleInput) {
  const [teacher, classRow, subject] = await Promise.all([
    queryOne<{ id: number }>("SELECT id FROM teachers WHERE id = ?", [input.teacher_id]),
    queryOne<{ id: number; academic_year: string }>("SELECT id, academic_year FROM classes WHERE id = ?", [input.class_id]),
    queryOne<{ id: number }>("SELECT id FROM subjects WHERE id = ?", [input.subject_id]),
  ]);

  if (!teacher || !classRow || !subject) {
    return "One of the selected class, subject, or teacher no longer exists. Refresh the page and choose again.";
  }
  if (classRow.academic_year !== input.academic_year) {
    return "The selected class does not belong to this academic year.";
  }
  return null;
}
