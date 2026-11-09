"use client";

import { useMemo, useState } from "react";
import { BookOpen, Coffee, Pencil, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { getSubjectColor, isTimetableGrade, type MasterScheduleData, type MasterScheduleEntry, type MasterTimeSlot } from "@/lib/schedule-master";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

type PeriodSlot = {
  id: string;
  subject: string;
  teacherName: string;
  roomId?: string;
  entry: MasterScheduleEntry;
};

type Props = {
  data: MasterScheduleData;
  editable?: boolean;
  onClassChange?: (classId: number) => void;
  onAdd?: (classId: number, day: string, periodNumber: number) => void;
  onEdit?: (entry: MasterScheduleEntry) => void;
  onDelete?: (entry: MasterScheduleEntry) => void;
};

function displayTime(value: string) {
  const [rawHours, minutes = "00"] = value.split(":");
  const hours = Number(rawHours);
  return Number.isFinite(hours) ? `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}` : value;
}

function periodsForDay(entries: MasterScheduleEntry[], day: string) {
  const periods: { [periodId: number]: PeriodSlot[] } = {};
  for (const entry of entries) {
    if (entry.day_of_week !== day) continue;
    const periodId = Number(entry.period_number);
    if (!Number.isFinite(periodId) || periodId <= 0) continue;
    const subject = entry.subject_name || entry.display_label || "Session";
    const slot: PeriodSlot = {
      id: `${entry.id}:${entry.teacher_id ?? "unassigned"}`,
      subject,
      teacherName: entry.teacher_names || entry.teacher_name || "Teacher unassigned",
      roomId: entry.room_id != null ? String(entry.room_id) : undefined,
      entry,
    };
    periods[periodId] = [...(periods[periodId] ?? []), slot];
  }
  return periods;
}

function slotsForColumn(periods: { [periodId: number]: PeriodSlot[] }, slot: MasterTimeSlot) {
  const periodId = Number(slot.period_number);
  return (periods[periodId] ?? []).filter((item) => item.entry.time_slot_id == null || item.entry.time_slot_id === slot.id);
}

function AssignmentCard({
  slot,
  day,
  editable,
  onEdit,
  onDelete,
}: {
  slot: PeriodSlot;
  day: string;
  editable: boolean;
  onEdit?: (entry: MasterScheduleEntry) => void;
  onDelete?: (entry: MasterScheduleEntry) => void;
}) {
  const background = slot.entry.color || getSubjectColor(slot.subject);
  const groupLabel = slot.entry.student_group_name || (slot.entry.group_name && slot.entry.group_name !== "Class" ? slot.entry.group_name : "");
  return (
    <article className="w-full min-w-0 rounded-md border border-white/70 p-2 text-center shadow-sm" style={{ backgroundColor: background }}>
      {groupLabel ? <p className="mb-1 break-words text-[9px] font-bold text-[#694237]">{groupLabel}</p> : null}
      <p className="break-words text-[10px] font-extrabold uppercase leading-snug text-[#542b24]">{slot.subject}</p>
      <p className="mt-1 break-words text-[10px] leading-snug text-[#694237]">({slot.teacherName})</p>
      {slot.entry.room ? <p className="mt-1 text-[9px] text-[#694237]">Room {slot.entry.room}</p> : null}
      {editable ? (
        <div className="mt-1.5 flex items-center justify-center gap-1">
          {onEdit ? (
            <button type="button" onClick={() => onEdit(slot.entry)} aria-label={`Edit ${slot.subject} on ${day}`} className="inline-flex items-center gap-0.5 rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-bold text-[#9b251e] hover:bg-white">
              <Pencil size={10} aria-hidden="true" /> Edit
            </button>
          ) : null}
          {onDelete ? (
            <button type="button" onClick={() => onDelete(slot.entry)} aria-label={`Delete ${slot.subject} on ${day}`} className="inline-flex items-center gap-0.5 rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-bold text-red-700 hover:bg-white">
              <Trash2 size={10} aria-hidden="true" /> Delete
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function AssignButton({ hasItems, onClick }: { hasItems: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-1 flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-[#e7cbb8] bg-white/80 px-1 py-1 text-[10px] font-bold text-[#9b251e] hover:bg-[#fff5eb]"
    >
      <Plus size={11} aria-hidden="true" /> {hasItems ? "Add" : "Assign"}
    </button>
  );
}

function BreakItem({ slot }: { slot: MasterTimeSlot }) {
  const Icon = slot.slot_type === "ASSEMBLY" ? BookOpen : slot.is_lunch ? UtensilsCrossed : Coffee;
  const label = slot.slot_type === "ASSEMBLY" ? "Prayer" : slot.is_lunch ? "Lunch Break" : slot.label;
  return (
    <div className="flex min-w-[190px] flex-1 items-center gap-3 px-5 py-2.5 text-[#a83213] sm:min-w-0">
      <Icon size={24} strokeWidth={2.4} aria-hidden="true" />
      <div>
        <p className="text-xs font-extrabold">{label}</p>
        <p className="mt-0.5 text-xs font-semibold">{displayTime(slot.start_time)} – {displayTime(slot.end_time)}</p>
      </div>
    </div>
  );
}

export default function TimetableBoard({ data, editable = false, onClassChange, onAdd, onEdit, onDelete }: Props) {
  const [selectedClassId, setSelectedClassId] = useState("");
  const classes = useMemo(
    () => data.classes.filter(isTimetableGrade).sort((a, b) => a.display_name.localeCompare(b.display_name, undefined, { numeric: true })),
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

  const periodsByDay = useMemo(() => {
    const days: { [day: string]: { periods: { [periodId: number]: PeriodSlot[] } } } = {};
    for (const day of DAYS) days[day] = { periods: periodsForDay(entries, day) };
    return days;
  }, [entries]);

  function cellSlots(day: (typeof DAYS)[number], slot: MasterTimeSlot) {
    return slotsForColumn(periodsByDay[day]?.periods ?? {}, slot);
  }

  if (!classes.length) {
    return <div className="rounded-lg border border-[#f2d7be] bg-white p-8 text-center text-sm text-[#80594d]">No classes from grades 6–12 are available for this timetable yet.</div>;
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
              onClick={() => {
                setSelectedClassId(String(classRow.id));
                onClassChange?.(classRow.id);
              }}
              className={`min-w-24 shrink-0 rounded-md border px-4 py-2 text-xs font-bold transition ${
                active
                  ? "border-[#b60f17] bg-[#b60f17] text-white shadow-sm"
                  : "border-[#f2d7be] bg-white text-[#803313] hover:border-[#f4c15a] hover:bg-[#fff3e8]"
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
          className="mb-2 flex divide-x divide-[#f2d7be] overflow-x-auto rounded-lg border border-[#f4c15a] bg-[linear-gradient(90deg,#fffaf5,#fff0de)]"
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
                    const items = cellSlots(day, slot);
                    return (
                      <td
                        key={`${day}-${slot.id}`}
                        className="border-b border-r border-[#f2ddc5] p-1 align-top last:border-r-0"
                      >
                        {items.length ? (
                          <div className="space-y-1">
                            {items.map((item) => (
                              <AssignmentCard key={item.id} slot={item} day={day} editable={editable} onEdit={onEdit} onDelete={onDelete} />
                            ))}
                          </div>
                        ) : editable ? null : <span className="text-sm text-[#bd9e8c]" aria-label="No class scheduled">—</span>}
                        {editable && currentClass && onAdd ? (
                          <AssignButton hasItems={items.length > 0} onClick={() => onAdd(currentClass.id, day, Number(slot.period_number))} />
                        ) : null}
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
                const items = cellSlots(day, slot);
                return (
                  <div
                    key={slot.id}
                    className="border-t border-[#f2ddc5] px-2 py-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="shrink-0 text-[10px] font-semibold">P{slot.period_number} · {displayTime(slot.start_time)}</span>
                      {!items.length && !editable ? <p className="text-[10px] text-[#bd9e8c]">—</p> : null}
                    </div>
                    {items.length ? (
                      <div className="mt-1 space-y-1">
                        {items.map((item) => (
                          <AssignmentCard key={item.id} slot={item} day={day} editable={editable} onEdit={onEdit} onDelete={onDelete} />
                        ))}
                      </div>
                    ) : null}
                    {editable && currentClass && onAdd ? (
                      <AssignButton hasItems={items.length > 0} onClick={() => onAdd(currentClass.id, day, Number(slot.period_number))} />
                    ) : null}
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
