"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Coffee, Clock3, UtensilsCrossed } from "lucide-react";
import type { MasterScheduleData, MasterTimeSlot } from "@/lib/schedule-master";

type ApiResponse<T> = { success: boolean; message: string; data?: T };

const DEFAULT_YEAR = "2025-26";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

function displayTime(value: string) {
  const [rawHours, minutes = "00"] = value.split(":");
  const hours = Number(rawHours);
  if (!Number.isFinite(hours)) return value;
  return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
}

function ScheduleBreak({ slot }: { slot: MasterTimeSlot }) {
  const Icon = slot.slot_type === "ASSEMBLY" ? BookOpen : slot.is_lunch ? UtensilsCrossed : Coffee;
  const label = slot.slot_type === "ASSEMBLY" ? "Prayer" : slot.is_lunch ? "Lunch break" : "Short break";
  return <div className="flex min-h-[72px] flex-col items-center justify-center gap-1 bg-[#fff8e8] px-3 text-center text-[#8c5f14]"><Icon size={18} strokeWidth={2.2} /><span className="text-[11px] font-bold">{label}</span><span className="text-[10px] font-medium">{displayTime(slot.start_time)} – {displayTime(slot.end_time)}</span></div>;
}

export default function SchedulesPage() {
  const [data, setData] = useState<MasterScheduleData | null>(null);
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/schedules/master?academic_year=${encodeURIComponent(year)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<MasterScheduleData>;
        if (!response.ok || !payload.success) throw new Error(payload.message || "Unable to load timetable.");
        setData(payload.data ?? null);
        setSelectedClass((current) => current || String(payload.data?.classes[0]?.id ?? ""));
      })
      .catch((reason: unknown) => { if (!(reason instanceof Error && reason.name === "AbortError")) setError(reason instanceof Error ? reason.message : "Unable to load timetable."); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [year]);

  const classes = useMemo(() => [...(data?.classes ?? [])].sort((a, b) => a.display_name.localeCompare(b.display_name, undefined, { numeric: true })), [data]);
  const slots = useMemo(() => [...(data?.time_slots ?? [])].filter((slot) => slot.active).sort((a, b) => a.slot_order - b.slot_order), [data]);
  const currentClass = useMemo(() => classes.find((item) => String(item.id) === selectedClass) ?? classes[0], [classes, selectedClass]);
  const entries = useMemo(() => (data?.schedule_entries ?? []).filter((entry) => entry.class_id === currentClass?.id), [data, currentClass]);
  const entryFor = (day: (typeof DAYS)[number], slot: MasterTimeSlot) => slot.period_number == null ? [] : entries.filter((entry) => entry.day_of_week === day && Number(entry.period_number) === Number(slot.period_number));

  return <main className="min-h-screen bg-[#f8f5f2] py-10 sm:py-14"><section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
    <header className="overflow-hidden rounded-[26px] bg-[#B60F17] px-6 py-7 text-white shadow-lg sm:px-9 sm:py-8"><div className="flex flex-wrap items-center justify-between gap-6"><div className="flex items-center gap-4"><div className="grid size-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25"><BookOpen size={31} /></div><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-100">Academic year {year}</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">School Timetable</h1><p className="mt-1 text-sm text-red-100">Weekly class schedule</p></div></div><label className="text-sm font-semibold text-red-50">Session<input value={year} onChange={(event) => { setLoading(true); setError(""); setYear(event.target.value); }} className="ml-3 w-24 rounded-lg border border-white/30 bg-white/10 px-2 py-1 text-center font-bold text-white outline-none" aria-label="Academic year" /></label></div></header>
    {loading ? <div className="mt-6 rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm">Loading timetable…</div> : null}
    {error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">{error}</div> : null}
    {!loading && !error && data && classes.length ? <><nav className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Choose a class">{classes.map((classRow) => { const active = currentClass?.id === classRow.id; return <button key={classRow.id} type="button" onClick={() => setSelectedClass(String(classRow.id))} className={`shrink-0 rounded-xl border px-5 py-2.5 text-sm font-bold transition ${active ? "border-[#B60F17] bg-[#B60F17] text-white shadow-sm" : "border-[#eaded9] bg-white text-[#65262a] hover:border-[#B60F17]/50"}`}>{classRow.display_name}</button>; })}</nav>
      <section className="mt-4 overflow-hidden rounded-2xl border border-[#eaded9] bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eaded9] bg-[#fffafa] px-5 py-4"><div><h2 className="text-xl font-extrabold text-[#5d1d23]">{currentClass?.display_name} Timetable</h2><p className="mt-0.5 text-sm text-slate-500">Day-wise schedule for the complete school week</p></div><div className="flex items-center gap-2 rounded-lg bg-[#fff0f1] px-3 py-2 text-xs font-bold text-[#9d1018]"><Clock3 size={15} /> {slots.filter((slot) => slot.period_number != null).length} periods</div></div>
        <div className="overflow-x-auto"><table className="min-w-[1120px] w-full border-collapse text-center"><thead><tr className="bg-[#fff7f7] text-[#6f1e25]"><th className="sticky left-0 z-20 min-w-28 border-b border-r border-[#eaded9] bg-[#fff7f7] px-4 py-4 text-sm font-extrabold">Day</th>{slots.map((slot) => <th key={slot.id} className="min-w-36 border-b border-r border-[#eaded9] px-3 py-3 last:border-r-0"><div className="text-sm font-extrabold">{slot.period_number ? `Period ${slot.period_number}` : slot.label}</div><div className="mt-1 text-[11px] font-medium text-[#9a6265]">{displayTime(slot.start_time)} – {displayTime(slot.end_time)}</div></th>)}</tr></thead><tbody>{DAYS.map((day) => <tr key={day} className="align-stretch"><th scope="row" className="sticky left-0 z-10 border-b border-r border-[#eaded9] bg-white px-4 py-4 text-left text-sm font-extrabold text-[#6f1e25]">{day}</th>{slots.map((slot) => { const dayEntries = entryFor(day, slot); return <td key={`${day}-${slot.id}`} className="border-b border-r border-[#eaded9] p-0 last:border-r-0">{slot.period_number == null ? <ScheduleBreak slot={slot} /> : dayEntries.length ? <div className="flex min-h-[72px] flex-col justify-center bg-white px-3 py-2"><span className="text-xs font-extrabold uppercase tracking-wide text-[#501a20]">{dayEntries.map((entry) => entry.subject_name || entry.display_label).join(" / ")}</span><span className="mt-1 text-[11px] font-medium text-[#9d4e54]">{dayEntries.map((entry) => entry.teacher_name).filter(Boolean).join(" · ") || "—"}</span></div> : <div className="flex min-h-[72px] items-center justify-center bg-[#fcfbfb] text-xs font-medium text-slate-400">—</div>}</td>; })}</tr>)}</tbody></table></div>
      </section><p className="mt-4 text-center text-xs text-slate-500">Timetable is updated by the school administration. Please check with your class teacher for changes.</p></> : null}
    {!loading && !error && (!data || !classes.length) ? <div className="mt-6 rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm">No timetable has been published for this academic year.</div> : null}
  </section></main>;
}
