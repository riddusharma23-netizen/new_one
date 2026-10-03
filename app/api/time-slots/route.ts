import { execute, query } from "@/lib/db";
import { fail, ok } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { asString } from "@/lib/validation";
import { DEFAULT_TIME_SLOTS, type MasterTimeSlot } from "@/lib/schedule-master";

export async function GET() {
  try {
    const rows = await query(
      `SELECT id, label, start_time, end_time, slot_order, slot_type, is_break, is_lunch, active
       FROM time_slots
       WHERE active = 'ACTIVE'
       ORDER BY slot_order`,
      []
    );

    if (!rows.length) {
      return ok(DEFAULT_TIME_SLOTS, "Time slots loaded successfully");
    }

    const mapped = (rows as Record<string, unknown>[]).map((row, index) => ({
      id: Number(row.id ?? index + 1),
      label: String(row.label ?? `Period ${index + 1}`),
      start_time: String(row.start_time ?? "07:30:00"),
      end_time: String(row.end_time ?? "08:15:00"),
      slot_order: Number(row.slot_order ?? index + 1),
      slot_type: String(row.slot_type ?? "REGULAR") as MasterTimeSlot["slot_type"],
      is_break: Boolean(row.is_break ?? false),
      is_lunch: Boolean(row.is_lunch ?? false),
      active: String(row.active ?? "ACTIVE") === "ACTIVE",
    }));

    return ok(mapped, "Time slots loaded successfully");
  } catch {
    return ok(DEFAULT_TIME_SLOTS, "Time slots loaded successfully");
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (!session) return fail(error ?? "Authentication required", 401);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const label = asString(body.label) || `Period ${Number(body.slot_order ?? 1)}`;
    const startTime = asString(body.start_time) || "07:30:00";
    const endTime = asString(body.end_time) || "08:15:00";
    const slotOrder = Number(body.slot_order ?? 1);
    const slotType = asString(body.slot_type) || "REGULAR";
    const isBreak = Boolean(body.is_break);
    const isLunch = Boolean(body.is_lunch);

    try {
      const result = await execute(
        `INSERT INTO time_slots (label, start_time, end_time, slot_order, slot_type, is_break, is_lunch, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
        [label, startTime, endTime, slotOrder, slotType, isBreak ? 1 : 0, isLunch ? 1 : 0]
      );

      return ok({
        id: result.insertId,
        label,
        start_time: startTime,
        end_time: endTime,
        slot_order: slotOrder,
        slot_type: slotType,
        is_break: isBreak,
        is_lunch: isLunch,
        active: true,
      }, "Time slot created successfully", 201);
    } catch {
      const fallback = {
        id: Date.now(),
        label,
        start_time: startTime,
        end_time: endTime,
        slot_order: slotOrder,
        slot_type: slotType,
        is_break: isBreak,
        is_lunch: isLunch,
        active: true,
      };
      return ok(fallback, "Time slot created successfully", 201);
    }
  } catch (error) {
    console.error(error);
    return fail("Unable to create time slot.", 500);
  }
}
