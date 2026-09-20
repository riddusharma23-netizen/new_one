export function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function asOptionalString(value: unknown) {
  const text = asString(value);
  return text.length ? text : null;
}

export function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

export function asInteger(value: unknown) {
  const parsed = asNumber(value);
  if (parsed === null) return null;
  return Math.trunc(parsed);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

export function parseJsonArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.split("\n").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export function isDayOfWeek(value: string): value is DayOfWeek {
  return (DAYS_OF_WEEK as readonly string[]).includes(value);
}

export const PERIOD_TIMES: Record<number, { start: string; end: string }> = {
  1: { start: "08:00:00", end: "08:45:00" },
  2: { start: "08:45:00", end: "09:30:00" },
  3: { start: "09:45:00", end: "10:30:00" },
  4: { start: "10:30:00", end: "11:15:00" },
  5: { start: "11:15:00", end: "12:00:00" },
  6: { start: "12:00:00", end: "12:45:00" },
};
