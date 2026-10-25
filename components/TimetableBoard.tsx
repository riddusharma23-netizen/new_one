"use client";

import { useMemo, useState } from "react";
import { BookOpen, Coffee, Pencil, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import type { MasterScheduleData, MasterScheduleEntry, MasterTimeSlot } from "@/lib/schedule-master";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const CELL_COLOURS = ["#fff1e8", "#fff7d6", "#fce8e6", "#fff0de", "#fef3c7", "#f9e8df", "#fff5eb"];

type Props = {
  data: MasterScheduleData;
  editable?: boolean;
  onAdd?: (classId: number, day: string, periodNumber: number) => void;
  onEdit?: (entry: MasterScheduleEntry) => void;
  onDelete?: (id: number) => void;
};

function displayTime(value: string) {
  const [rawHours, minutes = "00"] = value.split(":");
  const hours = Number(rawHours);
  return Number.isFinite(hours) ? `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}` : value;
}

function subjectColour(subject: string) {
  const total = subject.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return CELL_COLOURS[total % CELL_COLOURS.length];
}

function BreakItem({ slot }: { slot: MasterTimeSlot }) {
  const Icon = slot.slot_type === "ASSEMBLY" ? BookOpen : slot.is_lunch ? UtensilsCrossed : Coffee;
  const label = slot.slot_type === "ASSEMBLY" ? "Prayer" : slot.is_lunch ? "Lunch Break" : slot.label;
  return (
    <div className="flex min-w-[190px] flex-1 items-center gap-3 px-5 py-2.5 text-[#9b251e] sm:min-w-0">
      <Icon size={24} strokeWidth={2.4} aria-hidden="true" />
      <div>
        <p className="text-xs font-extrabold">{label}</p>
        <p className="mt-0.5 text-xs font-semibold">{displayTime(slot.start_time)} – {displayTime(slot.end_time)}</p>
      </div>
    </div>
  );
}

export default function TimetableBoard({ data, editable = false, onAdd, onEdit, onDelete }: Props) {
  const [selectedClassId, setSelectedClassId] = useState("");
  const classes = useMemo(
    () => [...data.classes].sort((a, b) => a.display_name.localeCompare(b.display_name, undefined, { numeric: true })),
    [data.classes],
  );
  const slots = useMemo(
    () => [...data.time_slots].filter((slot) => slot.active).sort((a, b) => a.slot_order - b.slot_order),
    [data.time_slots],
  );
  const periods = slots.filter((slot) => slot.period_number != null);
  const breaks = slots.filter((slot) => slot.period_number == null);
  const currentClass = classes.find((item) => String(item.id) === selectedClassId) ?? classes[0];
  const entries = data.schedule_entries.filter((entry) => entry.class_id === currentClass?.id);
  const start = periods[0]?.start_time;
  const end = periods.at(-1)?.end_time;

  function entriesFor(day: (typeof DAYS)[number], slot: MasterTimeSlot) {
    return entries.filter(
      (entry) => entry.day_of_week === day && Number(entry.period_number) === Number(slot.period_number),
    );
  }

  function cellContent(day: (typeof DAYS)[number], slot: MasterTimeSlot) {
    const items = entriesFor(day, slot);
    const subject = items.map((entry) => entry.subject_name || entry.display_label).join(" / ");
    const teacher = items.map((entry) => entry.teacher_name).filter(Boolean).join(" · ");
    return { items, subject, teacher };
  }

  if (!classes.length) {
    return <div className="rounded-lg border border-[#f2ddc5] bg-white p-8 text-center text-sm text-[#80594d]">No classes are available for this timetable.</div>;
  }

  return (
    <>
      <div className="mb-2 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Choose a class">
        {classes.map((classRow) => {
          const active = currentClass?.id === classRow.id;
          return (
            <button
              key={classRow.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedClassId(String(classRow.id))}
              className={`min-w-24 shrink-0 rounded-md border px-4 py-2 text-xs font-bold transition ${
                active
                  ? "border-[#b60f17] bg-[#b60f17] text-white shadow-sm"
                  : "border-[#f2ddc5] bg-[#fff7ef] text-[#8e3a14] hover:border-[#f4c15a] hover:bg-[#fff0de]"
              }`}
            >
              {classRow.display_name}
            </button>
          );
        })}
      </div>

      {breaks.length ? (
        <section
          aria-label="Break times"
          className="mb-2 flex divide-x divide-[#f2ddc5] overflow-x-auto rounded-lg border border-[#f4c15a] bg-[linear-gradient(90deg,#fffaf5,#fff0de)]"
        >
          {breaks.map((slot) => <BreakItem key={slot.id} slot={slot} />)}
        </section>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-[#f2c78e] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[linear-gradient(90deg,#b60f17,#df5b00)] px-3 py-2 text-white">
          <h2 className="text-base font-extrabold">{currentClass?.display_name} Timetable</h2>
          <div className="flex items-center gap-2 text-xs font-medium">
            <span>{periods.length} Periods</span>
            {start && end ? <><span className="opacity-60">|</span><span>{displayTime(start)} – {displayTime(end)}</span></> : null}
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-[1080px] w-full border-collapse text-center text-[#542b24]">
            <thead>
              <tr className="bg-[#fff3e8]">
                <th className="w-[110px] border-b border-r border-[#f2ddc5] px-3 py-2 text-xs font-extrabold">Day</th>
                {periods.map((slot) => (
                  <th key={slot.id} className="min-w-[130px] border-b border-r border-[#f2ddc5] px-2 py-2 text-xs font-extrabold last:border-r-0">
                    <p>Period {slot.period_number}</p>
                    <p className="mt-1 text-[10px] font-medium">{displayTime(slot.start_time)} – {displayTime(slot.end_time)}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day}>
                  <th scope="row" className="border-b border-r border-[#f2ddc5] bg-white px-3 py-2 text-left text-xs font-extrabold">{day}</th>
                  {periods.map((slot) => {
                    const { items, subject, teacher } = cellContent(day, slot);
                    return (
                      <td
                        key={`${day}-${slot.id}`}
                        className="h-[66px] border-b border-r border-[#f2ddc5] px-2 py-1.5 last:border-r-0"
                        style={{ backgroundColor: items.length ? subjectColour(subject) : "#fffdfb" }}
                      >
                        {items.length ? (
                          <div>
                            <p className="text-[10px] font-extrabold uppercase">{subject}</p>
                            <p className="mt-0.5 text-[10px] font-medium">({teacher || "—"})</p>
                            {editable ? (
                              <div className="mt-1 flex justify-center gap-2">
                                {onEdit ? <button type="button" onClick={() => onEdit(items[0])} aria-label={`Edit ${subject} on ${day}`} className="text-[10px] font-bold text-[#9b251e] underline"><Pencil size={11} className="inline" /> Edit</button> : null}
                                {onDelete ? <button type="button" onClick={() => onDelete(items[0].id)} aria-label={`Delete ${subject} on ${day}`} className="text-[10px] font-bold text-red-700 underline"><Trash2 size={11} className="inline" /> Delete</button> : null}
                              </div>
                            ) : null}
                          </div>
                        ) : editable && currentClass && onAdd ? (
                          <button
                            type="button"
                            onClick={() => onAdd(currentClass.id, day, Number(slot.period_number))}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#80594d] hover:text-[#9b251e]"
                          >
                            <Plus size={12} /> Assign
                          </button>
                        ) : <span className="text-xs text-[#a78a7a]">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2 p-2 md:hidden">
          {DAYS.map((day) => (
            <article key={day} className="overflow-hidden rounded-md border border-[#f2ddc5]">
              <h3 className="bg-[#fff3e8] px-3 py-1.5 text-xs font-extrabold">{day}</h3>
              {periods.map((slot) => {
                const { items, subject, teacher } = cellContent(day, slot);
                return (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between gap-2 border-t border-[#f2ddc5] px-2 py-1.5 text-xs"
                    style={{ backgroundColor: items.length ? subjectColour(subject) : "#ffffff" }}
                  >
                    <span className="shrink-0 text-[10px] font-semibold">P{slot.period_number} · {displayTime(slot.start_time)}</span>
                    <div className="min-w-0 text-right">
                      <p className="truncate font-bold">{subject || "Free"}</p>
                      {items.length ? <p className="truncate text-[10px]">{teacher || "—"}</p> : null}
                      {editable ? (
                        items.length ? (
                          <div className="flex justify-end gap-2">
                            {onEdit ? <button type="button" onClick={() => onEdit(items[0])} className="text-[10px] font-bold underline">Edit</button> : null}
                            {onDelete ? <button type="button" onClick={() => onDelete(items[0].id)} className="text-[10px] font-bold text-red-700 underline">Delete</button> : null}
                          </div>
                        ) : currentClass && onAdd ? (
                          <button type="button" onClick={() => onAdd(currentClass.id, day, Number(slot.period_number))} className="text-[10px] font-bold text-[#9b251e] underline">Assign</button>
                        ) : null
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
