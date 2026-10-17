import { getPool, query } from "@/lib/db";
import { DEFAULT_TIME_SLOTS, type MasterTimeSlot } from "@/lib/schedule-master";

export type EditableTimeSlot = Omit<MasterTimeSlot, "id"> & { id?: number };

const TYPES = new Set<EditableTimeSlot["slot_type"]>(["REGULAR", "BREAK", "LUNCH", "ASSEMBLY", "OTHER"]);

export function toSeconds(value: string) {
  const [hours = "", minutes = "", seconds = "0"] = value.split(":");
  const h = Number(hours); const m = Number(minutes); const s = Number(seconds);
  return Number.isInteger(h) && Number.isInteger(m) && Number.isInteger(s) && h >= 0 && h < 24 && m >= 0 && m < 60 && s >= 0 && s < 60
    ? h * 3600 + m * 60 + s : Number.NaN;
}

export function formatSlotLabel(slot: Pick<EditableTimeSlot, "label" | "period_number" | "slot_type" | "start_time" | "end_time">) {
  const prefix = slot.period_number ? `Period ${slot.period_number}` : slot.slot_type === "ASSEMBLY" ? "Prayer" : slot.slot_type === "LUNCH" ? "Lunch" : slot.slot_type === "BREAK" ? "Break" : slot.label || "Activity";
  return `${prefix} · ${slot.start_time.slice(0, 5)}–${slot.end_time.slice(0, 5)}`;
}

export function normalizeTimingSlots(input: unknown): { slots: EditableTimeSlot[]; errors: string[] } {
  if (!Array.isArray(input)) return { slots: [], errors: ["A list of timing slots is required."] };
  const errors: string[] = [];
  const slots: EditableTimeSlot[] = input.map((raw, index): EditableTimeSlot => {
    const row = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
    const slot_type = typeof row.slot_type === "string" && TYPES.has(row.slot_type as EditableTimeSlot["slot_type"])
      ? row.slot_type as EditableTimeSlot["slot_type"] : "REGULAR";
    const active = row.active !== false && row.active !== "INACTIVE";
    const start_time = typeof row.start_time === "string" ? row.start_time.trim() : "";
    const end_time = typeof row.end_time === "string" ? row.end_time.trim() : "";
    const label = typeof row.label === "string" ? row.label.trim().slice(0, 120) : "";
    const id = Number(row.id);
    return { id: Number.isInteger(id) && id > 0 ? id : undefined, label, start_time, end_time, slot_order: index + 1, period_number: null, slot_type, is_break: slot_type === "BREAK", is_lunch: slot_type === "LUNCH", active };
  });
  let period = 0;
  for (const slot of slots) {
    if (!slot.label) errors.push(`Slot ${slot.slot_order} needs a label.`);
    const start = toSeconds(slot.start_time); const end = toSeconds(slot.end_time);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) errors.push(`${slot.label || `Slot ${slot.slot_order}`} must have a valid end time after its start time.`);
    if (slot.slot_type === "REGULAR" && slot.active) slot.period_number = ++period;
  }
  if (!period) errors.push("At least one active teaching period is required.");
  const activeSlots = slots.filter((slot) => slot.active).sort((a, b) => toSeconds(a.start_time) - toSeconds(b.start_time));
  for (let index = 1; index < activeSlots.length; index += 1) {
    if (toSeconds(activeSlots[index].start_time) < toSeconds(activeSlots[index - 1].end_time)) errors.push(`${activeSlots[index - 1].label} overlaps ${activeSlots[index].label}.`);
  }
  return { slots, errors };
}

export async function getSchoolTimings(): Promise<MasterTimeSlot[]> {
  try {
    const rows = await query<Record<string, unknown>>(`SELECT id, label, start_time, end_time, slot_order, slot_type, is_break, is_lunch, active FROM time_slots ORDER BY slot_order, id`);
    if (!rows.length) return DEFAULT_TIME_SLOTS;
    let period = 0;
    return rows.map((row) => {
      const type = String(row.slot_type || "REGULAR") as MasterTimeSlot["slot_type"];
      const active = String(row.active) !== "INACTIVE" && row.active !== false;
      return { id: Number(row.id), label: String(row.label), start_time: String(row.start_time), end_time: String(row.end_time), slot_order: Number(row.slot_order), period_number: type === "REGULAR" && active ? ++period : null, slot_type: type, is_break: Boolean(row.is_break), is_lunch: Boolean(row.is_lunch), active };
    });
  } catch { return DEFAULT_TIME_SLOTS; }
}

export async function replaceSchoolTimings(slots: EditableTimeSlot[]) {
  const pool = getPool(); const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const ids = slots.filter((slot) => slot.id).map((slot) => slot.id!);
    if (ids.length) await connection.execute(`UPDATE time_slots SET active = 'INACTIVE' WHERE id NOT IN (${ids.map(() => "?").join(",")})`, ids);
    else await connection.execute("UPDATE time_slots SET active = 'INACTIVE'");
    for (const slot of slots) {
      const values = [slot.label, slot.start_time, slot.end_time, slot.slot_order, slot.slot_type, slot.is_break ? 1 : 0, slot.is_lunch ? 1 : 0, slot.active ? "ACTIVE" : "INACTIVE"];
      if (slot.id) {
        const [result] = await connection.execute("UPDATE time_slots SET label=?, start_time=?, end_time=?, slot_order=?, slot_type=?, is_break=?, is_lunch=?, active=? WHERE id=?", [...values, slot.id]);
        if ((result as { affectedRows?: number }).affectedRows) continue;
      }
      await connection.execute("INSERT INTO time_slots (label, start_time, end_time, slot_order, slot_type, is_break, is_lunch, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", values);
    }
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}
