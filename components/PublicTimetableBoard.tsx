"use client";

import { useMemo, useState } from "react";
import { BookOpen, Coffee, Printer, UtensilsCrossed } from "lucide-react";
import { isTimetableGrade, type MasterClassRow, type MasterScheduleData, type MasterScheduleEntry, type MasterTimeSlot } from "@/lib/schedule-master";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
type Filter = "all" | "middle" | "junior" | "senior";

function classBand(classRow: MasterClassRow): Exclude<Filter, "all"> | null {
  const name = `${classRow.name} ${classRow.display_name}`.toLowerCase();
  if (name.includes("junior extra")) return "junior";
  const grade = Number.parseInt(classRow.name.match(/\d+/)?.[0] ?? classRow.display_name.match(/\d+/)?.[0] ?? "", 10);
  if (grade >= 6 && grade <= 8) return "middle";
  if (grade >= 9 && grade <= 10) return "junior";
  if (grade >= 11 && grade <= 12) return "senior";
  return null;
}

function displayTime(value: string) {
  const [hoursText, minutes = "00"] = value.split(":");
  const hours = Number(hoursText);
  return Number.isFinite(hours) ? `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}` : value;
}

function cellGroups(entries: MasterScheduleEntry[]) {
  const groups = new Map<string, { name: string; entries: MasterScheduleEntry[] }>();
  for (const entry of entries) {
    const key = String(entry.group_id ?? `entry-${entry.id}`);
    const group = groups.get(key);
    if (group) group.entries.push(entry);
    else groups.set(key, {
      name: entry.group_name || entry.student_group_name || "Class lesson",
      entries: [entry],
    });
  }
  return [...groups.values()];
}

function TimetableCell({
  classId,
  slot,
  entries,
  dayFilter,
  senior,
}: {
  classId: number;
  slot: MasterTimeSlot;
  entries: MasterScheduleEntry[];
  dayFilter: string;
  senior: boolean;
}) {
  const lessons = entries.filter((entry) =>
    entry.class_id === classId &&
    (entry.time_slot_id != null
      ? entry.time_slot_id === slot.id
      : Number(entry.period_number) === Number(slot.period_number)) &&
    (dayFilter === "all" || entry.day_of_week === dayFilter)
  );
  const groups = cellGroups(lessons);

  if (!groups.length) return <span className="text-sm text-[#bd9e8c]">—</span>;

  return (
    <div className="space-y-2">
      {groups.map((group, groupIndex) => (
        <article key={`${group.entries[0]?.id}-${groupIndex}`} className={`rounded-lg border border-[#f1d8c6] bg-white p-2.5 text-left shadow-sm ${senior ? "min-w-[190px]" : "min-w-[140px]"}`}>
          <p className="mb-1.5 inline-flex max-w-full rounded-md bg-[#fff0e5] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#a62d20]">
            <span className="truncate">{group.name}</span>
          </p>
          <div className="space-y-1.5">
            {group.entries.map((entry) => (
              <div key={entry.id} className="border-t border-[#f8eee7] pt-1.5 first:border-0 first:pt-0">
                <p className="text-xs font-bold leading-snug text-[#542b24]">{entry.subject_name || entry.display_label || "Session"}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] text-[#80594d]">
                  <span>{entry.teacher_names || entry.teacher_name || "Teacher unassigned"}</span>
                  {entry.room ? <span className="rounded bg-[#f7f2eb] px-1.5 py-0.5">Room {entry.room}</span> : null}
                  {dayFilter === "all" ? <span className="rounded bg-[#fce8e4] px-1.5 py-0.5 text-[#a62d20]">{entry.day_of_week.slice(0, 3)}</span> : null}
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function BreakStrip({ slots }: { slots: MasterTimeSlot[] }) {
  if (!slots.length) return null;
  return (
    <section aria-label="Prayer and break timings" className="mb-5 flex flex-wrap gap-2">
      {slots.map((slot) => {
        const prayer = slot.slot_type === "ASSEMBLY";
        const lunch = slot.slot_type === "LUNCH" || slot.is_lunch;
        const Icon = prayer ? BookOpen : lunch ? UtensilsCrossed : Coffee;
        const label = prayer ? "Prayer" : lunch ? "Lunch" : slot.label;
        return (
          <div key={slot.id} className="flex items-center gap-2 rounded-xl border border-[#f1d8c6] bg-white px-3 py-2 shadow-sm">
            <Icon size={17} className="text-[#b60f17]" aria-hidden="true" />
            <div>
              <p className="text-xs font-extrabold text-[#542b24]">{label}</p>
              <p className="text-[10px] text-[#80594d]">{displayTime(slot.start_time)}–{displayTime(slot.end_time)}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default function PublicTimetableBoard({ data }: { data: MasterScheduleData }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [dayFilter, setDayFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const classes = useMemo(
    () => data.classes.filter(isTimetableGrade).sort((a, b) => a.display_name.localeCompare(b.display_name, undefined, { numeric: true })),
    [data.classes]
  );
  const activeSlots = useMemo(
    () => data.time_slots.filter((slot) => slot.active).sort((a, b) => a.slot_order - b.slot_order),
    [data.time_slots]
  );
  const periods = activeSlots.filter((slot) => slot.period_number != null);
  const breaks = activeSlots.filter((slot) => slot.period_number == null && (slot.is_break || slot.is_lunch || slot.slot_type !== "REGULAR"));
  const visibleClasses = classes.filter((item) => {
    const band = classBand(item);
    return band && (filter === "all" || band === filter) && (classFilter === "all" || String(item.id) === classFilter);
  });
  const middleClasses = visibleClasses.filter((item) => classBand(item) !== "senior");
  const seniorClasses = visibleClasses.filter((item) => classBand(item) === "senior");
  const filters: Array<{ value: Filter; label: string }> = [
    { value: "all", label: "All Classes" },
    { value: "middle", label: "Classes 6–8 · Middle" },
    { value: "junior", label: "Classes 9–10 · Junior" },
    { value: "senior", label: "Classes 11–12 · Senior" },
  ];

  function scheduleTable(rows: MasterClassRow[], senior: boolean) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#fff3e8] text-[10px] uppercase tracking-wide text-[#694237]">
              <th className={`sticky left-0 z-10 border-b border-r border-[#f2ddc5] bg-[#fff3e8] px-3 py-3 text-center font-extrabold ${senior ? "min-w-[125px]" : "min-w-[112px]"}`}>Class</th>
              {periods.map((slot) => (
                <th key={slot.id} className={`border-b border-r border-[#f2ddc5] px-3 py-3 font-extrabold last:border-r-0 ${senior ? "min-w-[220px]" : "min-w-[155px]"}`}>
                  <p>{slot.label}</p>
                  <p className="mt-1 text-[10px] font-medium normal-case tracking-normal text-[#80594d]">{displayTime(slot.start_time)}–{displayTime(slot.end_time)}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((classRow) => (
              <tr key={classRow.id} className="align-top even:bg-[#fffdfb] hover:bg-[#fff8f1]">
                <th scope="row" className="sticky left-0 z-[1] border-b border-r border-[#f2ddc5] bg-white px-3 py-4 text-center text-xs font-extrabold text-[#a62d20]">
                  {classRow.display_name}
                </th>
                {periods.map((slot) => (
                  <td key={`${classRow.id}-${slot.id}`} className="border-b border-r border-[#f2ddc5] p-2 align-top last:border-r-0">
                    <TimetableCell classId={classRow.id} slot={slot} entries={data.schedule_entries} dayFilter={dayFilter} senior={senior} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-2xl border border-[#f1d8c6] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-extrabold text-[#542b24]">Filter timetable</p>
          <p className="mt-1 text-xs text-[#80594d]">Choose a class group or day; entries come from the published school schedule.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((item) => (
            <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => { setFilter(item.value); setClassFilter("all"); }} className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${filter === item.value ? "border-[#b60f17] bg-[#b60f17] text-white shadow-sm" : "border-[#f1d8c6] bg-white text-[#694237] hover:bg-[#fff5eb]"}`}>
              {item.label}
            </button>
          ))}
          <select aria-label="Filter by day" value={dayFilter} onChange={(event) => setDayFilter(event.target.value)} className="rounded-lg border border-[#f1d8c6] bg-white px-3 py-2 text-xs font-bold text-[#694237]">
            <option value="all">All days</option>
            {DAYS.map((day) => <option key={day} value={day}>{day}</option>)}
          </select>
          <select aria-label="Filter by class" value={classFilter} onChange={(event) => setClassFilter(event.target.value)} className="rounded-lg border border-[#f1d8c6] bg-white px-3 py-2 text-xs font-bold text-[#694237]">
            <option value="all">All selected classes</option>
            {classes.filter((item) => filter === "all" || classBand(item) === filter).map((item) => <option key={item.id} value={item.id}>{item.display_name}</option>)}
          </select>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border border-[#f1d8c6] px-3 py-2 text-xs font-bold text-[#694237] hover:bg-[#fff5eb]">
            <Printer size={14} aria-hidden="true" /> Print
          </button>
        </div>
      </section>

      <BreakStrip slots={breaks} />

      {middleClasses.length ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="border-l-4 border-[#c91520] pl-3 text-lg font-black text-[#542b24]">Classes 6–10 Weekly Grid</h2>
            <span className="rounded-full border border-[#f1d8c6] bg-white px-3 py-1 text-[10px] font-bold text-[#80594d]">Standard and split sessions</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#f1d8c6] bg-white shadow-sm">{scheduleTable(middleClasses, false)}</div>
        </section>
      ) : null}

      {seniorClasses.length ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="border-l-4 border-[#df5b00] pl-3 text-lg font-black text-[#542b24]">Senior Classes · Separate Timetables</h2>
            <span className="rounded-full border border-[#f1d8c6] bg-white px-3 py-1 text-[10px] font-bold text-[#80594d]">Each class is managed independently</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#f1d8c6] bg-white shadow-sm">{scheduleTable(seniorClasses, true)}</div>
        </section>
      ) : null}

      {!visibleClasses.length ? (
        <div className="rounded-2xl border border-[#f1d8c6] bg-white p-8 text-center text-sm text-[#80594d]">
          No classes match this filter. Ask the school administrator to add the class and publish its timetable.
        </div>
      ) : null}
    </div>
  );
}
