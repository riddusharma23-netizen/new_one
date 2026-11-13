"use client";

import { useMemo, useState } from "react";
import { BookOpen, Coffee, Printer, UtensilsCrossed } from "lucide-react";
import { isTimetableGrade, type MasterScheduleData, type MasterScheduleEntry, type MasterTimeSlot } from "@/lib/schedule-master";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

function displayTime(value: string) {
  const [hoursText, minutes = "00"] = value.split(":");
  const hours = Number(hoursText);
  return Number.isFinite(hours) ? `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}` : value;
}

function TimetableCell({
  classId,
  slot,
  entries,
  day,
}: {
  classId: number;
  slot: MasterTimeSlot;
  entries: MasterScheduleEntry[] | MasterScheduleEntry;
  day: string;
}) {
  const allEntries = Array.isArray(entries) ? entries : [entries];
  const lessons = allEntries.filter((entry) =>
    entry.class_id === classId &&
    entry.day_of_week === day &&
    (entry.time_slot_id != null
      ? entry.time_slot_id === slot.id
      : Number(entry.period_number) === Number(slot.period_number))
  );
  if (!lessons.length) return <span className="text-sm text-[#bd9e8c]" aria-label="No class scheduled">—</span>;

  const cards = lessons.flatMap((entry) => {
    const teacherNames = entry.teacher_names?.split(" · ").map((name) => name.trim()).filter(Boolean) ?? [];
    if (teacherNames.length <= 1) {
      return [{
        entry,
        key: `${entry.id}:${entry.teacher_id ?? "unassigned"}`,
        teacherName: entry.teacher_name || teacherNames[0] || "Teacher unassigned",
      }];
    }

    const shortNames = entry.teacher_name?.split(", ").map((name) => name.trim()) ?? [];
    return teacherNames.map((teacherName, index) => ({
      entry,
      key: `${entry.id}:${entry.teacher_id ?? "legacy"}:${index}`,
      teacherName: shortNames[index] || teacherName,
    }));
  });

  return (
    <div className="space-y-1">
      {cards.map(({ entry, key, teacherName }) => (
        <article key={key} className="w-full min-w-0 rounded-md border border-white/70 p-2 text-center shadow-sm" style={{ backgroundColor: entry.color }}>
          {entry.student_group_name || entry.group_name ? <p className="mb-1 break-words text-[9px] font-bold text-[#694237]">{entry.student_group_name || entry.group_name}</p> : null}
          <p className={`mb-1 inline-flex rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide ${
            entry.assignment_type === "practical" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
          }`}>
            {entry.assignment_type === "practical" ? "Practical" : "Theory"}
          </p>
          <p className="break-words text-[10px] font-extrabold uppercase leading-snug text-[#542b24]">{entry.subject_name || entry.display_label || "Session"}</p>
          <p className="mt-1 break-words text-[10px] leading-snug text-[#694237]">({teacherName})</p>
          {entry.room ? <p className="mt-1 text-[9px] text-[#694237]">Location: {entry.room}</p> : null}
        </article>
      ))}
    </div>
  );
}

function AdditionalColumnCell({ classId, entries, day }: {
  classId: number;
  entries: MasterScheduleEntry[];
  day: string;
}) {
  const seen = new Set<number>();
  const notedLessons = entries.filter((entry) => {
    if (entry.class_id !== classId || entry.day_of_week !== day || !entry.notes?.trim() || seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });

  if (!notedLessons.length) return <span className="text-sm text-[#bd9e8c]">—</span>;

  return (
    <div className="space-y-1">
      {notedLessons.map((entry) => (
        <article key={entry.id} className="w-full min-w-0 rounded-md border border-[#f1d8c6] bg-white p-2 text-left">
          <p className="break-words text-[10px] font-bold text-[#542b24]">{entry.subject_name || entry.display_label || "Lesson"}</p>
          <p className="mt-1 break-words text-[10px] leading-snug text-[#80594d]">{entry.notes}</p>
        </article>
      ))}
    </div>
  );
}

function BreakStrip({ slots }: { slots: MasterTimeSlot[] }) {
  if (!slots.length) return null;
  return (
    <section aria-label="Prayer and break timings" className="grid grid-cols-2 overflow-hidden rounded-lg border border-[#ead28d] bg-[#fff8e6] sm:grid-cols-4">
      {slots.map((slot) => {
        const prayer = slot.slot_type === "ASSEMBLY";
        const lunch = slot.slot_type === "LUNCH" || slot.is_lunch;
        const Icon = prayer ? BookOpen : lunch ? UtensilsCrossed : Coffee;
        const label = prayer ? "Prayer" : lunch ? "Lunch" : slot.label;
        return (
          <div key={slot.id} className="flex min-w-0 items-center gap-2 border-b border-r border-[#ead28d] px-3 py-2 sm:border-b-0">
            <Icon size={17} className="text-[#b60f17]" aria-hidden="true" />
            <div>
              <p className="text-xs font-extrabold text-[#8f281b]">{label}</p>
              <p className="text-[10px] text-[#80594d]">{displayTime(slot.start_time)}–{displayTime(slot.end_time)}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default function PublicTimetableBoard({ data }: { data: MasterScheduleData }) {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
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
  const selectedClass = classes.find((item) => item.id === selectedClassId) ?? classes[0];
  const firstPeriod = periods[0];
  const lastPeriod = periods[periods.length - 1];

  function renderTimetable() {
    if (!selectedClass) return null;
    const hasNotes = data.schedule_entries.some((entry) =>
      entry.class_id === selectedClass.id &&
      entry.notes?.trim()
    );
    const periodWidth = `${(hasNotes ? 78 : 91) / Math.max(periods.length, 1)}%`;

    return (
      <section className="overflow-hidden rounded-lg border border-[#f1d8c6] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[linear-gradient(112deg,#b60f17,#df5b00)] px-3 py-2 text-white">
          <h2 className="text-sm font-extrabold">{selectedClass.display_name} Timetable</h2>
          <p className="text-[10px] font-semibold">{periods.length} Periods{firstPeriod && lastPeriod ? `  |  ${displayTime(firstPeriod.start_time)} – ${displayTime(lastPeriod.end_time)}` : ""}</p>
        </div>
        <div className="overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[1050px] table-fixed border-collapse text-left">
            <caption className="sr-only">{selectedClass.display_name} weekly timetable for academic year {data.academic_year}</caption>
            <colgroup>
              <col style={{ width: "9%" }} />
              {periods.map((slot) => <col key={slot.id} style={{ width: periodWidth }} />)}
              {hasNotes ? <col style={{ width: "13%" }} /> : null}
            </colgroup>
            <thead>
              <tr className="bg-[#fff3e8] text-[10px] text-[#694237]">
                <th scope="col" className="border-b border-r border-[#f2ddc5] px-3 py-2 text-center font-extrabold">Day</th>
                {periods.map((slot, index) => (
                  <th key={slot.id} scope="col" className="border-b border-r border-[#f2ddc5] px-2 py-2 text-center font-extrabold">
                    <p>Period {slot.period_number ?? index + 1}</p>
                    <p className="mt-1 text-[9px] font-medium text-[#80594d]">{displayTime(slot.start_time)} – {displayTime(slot.end_time)}</p>
                  </th>
                ))}
                {hasNotes ? <th scope="col" className="border-b border-r border-[#f2ddc5] px-2 py-2 text-center font-extrabold">{data.additional_column_heading || "Notes"}</th> : null}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day} className="align-middle even:bg-[#fffdfb] hover:bg-[#fff8f1]">
                  <th scope="row" className="border-b border-r border-[#f2ddc5] bg-white px-3 py-3 text-center text-xs font-extrabold text-[#694237]">{day}</th>
                  {periods.map((slot) => (
                    <td key={`${day}-${slot.id}`} className="border-b border-r border-[#f2ddc5] p-1 align-middle">
                      <TimetableCell
                        classId={selectedClass.id}
                        slot={slot}
                        entries={data.schedule_entries}
                        day={day}
                      />
                    </td>
                  ))}
                  {hasNotes ? (
                    <td className="border-b border-r border-[#f2ddc5] p-1 align-middle">
                      <AdditionalColumnCell
                        classId={selectedClass.id}
                        entries={data.schedule_entries}
                        day={day}
                      />
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-3">
      <section aria-label="Timetable overview" className="grid grid-cols-2 gap-2 rounded-lg border border-[#f1d8c6] bg-white p-3 shadow-sm sm:grid-cols-4">
        {[
          { label: "Academic Year", value: data.academic_year },
          { label: "Classes", value: `${classes.length} sections (grades 6–12)` },
          { label: "Teachers", value: data.teachers.length },
          { label: "Periods", value: periods.length },
        ].map((item) => (
          <div key={item.label} className="min-w-0">
            <p className="mb-1 text-[11px] font-bold text-[#694237]">{item.label}</p>
            <p className="truncate rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">{item.value}</p>
          </div>
        ))}
      </section>

      <nav aria-label="Choose a class" className="flex gap-2 overflow-x-auto pb-0.5">
        {classes.map((classRow) => (
          <button
            key={classRow.id}
            type="button"
            aria-pressed={selectedClass?.id === classRow.id}
            onClick={() => setSelectedClassId(classRow.id)}
            className={`shrink-0 rounded-md border px-4 py-2 text-xs font-bold transition ${selectedClass?.id === classRow.id ? "border-[#b60f17] bg-[#b60f17] text-white" : "border-[#f1d8c6] bg-white text-[#694237] hover:bg-[#fff5eb]"}`}
          >
            {classRow.display_name}
          </button>
        ))}
      </nav>

      <BreakStrip slots={breaks} />

      <div className="space-y-4">
        {renderTimetable()}
      </div>

      {!selectedClass ? <p className="rounded-lg border border-[#f1d8c6] bg-white p-8 text-center text-sm text-[#80594d]">No classes are available for this academic year.</p> : null}

      <div className="flex justify-end">
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border border-[#f1d8c6] bg-white px-3 py-2 text-xs font-bold text-[#694237] hover:bg-[#fff5eb]">
          <Printer size={14} aria-hidden="true" /> Print timetable
        </button>
      </div>
    </div>
  );
}
