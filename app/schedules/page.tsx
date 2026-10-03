"use client";

import { useEffect, useMemo, useState } from "react";
import type { MasterScheduleData } from "@/lib/schedule-master";

type ApiResponse<T> = { success: boolean; message: string; data?: T };
type ViewMode = "master" | "class" | "teacher";

const DEFAULT_YEAR = "2025-26";

export default function SchedulesPage() {
  const [data, setData] = useState<MasterScheduleData | null>(null);
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [view, setView] = useState<ViewMode>("master");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void fetch(`/api/schedules/master?academic_year=${encodeURIComponent(year)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<MasterScheduleData>;
        if (!response.ok || payload.success === false) throw new Error(payload.message || "Unable to load timetable");
        setData(payload.data ?? null);
      })
      .catch((reason: unknown) => {
        if (reason instanceof Error && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Unable to load timetable.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [year]);

  const classes = useMemo(() => data?.classes ?? [], [data]);
  const teachers = useMemo(() => data?.teachers ?? [], [data]);
  const timeSlots = useMemo(() => data?.time_slots ?? [], [data]);
  const entries = useMemo(() => data?.schedule_entries ?? [], [data]);

  const filteredClasses = useMemo(() => {
    if (!data) return [];
    return selectedClass === "all" ? data.classes : data.classes.filter((item) => String(item.id) === selectedClass);
  }, [data, selectedClass]);

  const filteredTeachers = useMemo(() => {
    if (!data) return [];
    return selectedTeacher === "all" ? data.teachers : data.teachers.filter((item) => String(item.id) === selectedTeacher);
  }, [data, selectedTeacher]);

  const getEntriesForClass = (classId: number) => entries.filter((item) => item.class_id === classId);

  const renderEntry = (entry: MasterScheduleData["schedule_entries"][number]) => (
    <div key={entry.id} className="rounded-md border border-slate-200 bg-white/80 p-2 text-left shadow-sm" style={{ backgroundColor: entry.color || "#f8fafc" }}>
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-700">{entry.group_name || "Main"}</div>
      <div className="mt-1 text-[11px] font-black text-slate-900">{entry.subject_name || entry.display_label || "Free"}</div>
      <div className="mt-1 text-[10px] text-slate-700">{entry.teacher_name || "Teacher"}</div>
      {entry.room ? <div className="mt-1 text-[10px] text-slate-600">{entry.room}</div> : null}
    </div>
  );

  const renderMasterGrid = () => (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[900px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-[#f8fafc] text-slate-700">
            <th className="sticky left-0 z-10 border-r border-slate-200 bg-[#f8fafc] p-3 font-bold">Class</th>
            {timeSlots.map((slot) => (
              <th key={slot.id} className="min-w-[120px] border-r border-slate-200 p-3 text-center text-[11px] font-black uppercase tracking-[0.14em]">
                {slot.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredClasses.map((classRow) => (
            <tr key={classRow.id} className="border-t border-slate-200 align-top">
              <td className="sticky left-0 z-10 border-r border-slate-200 bg-white p-3 font-black text-slate-900">{classRow.display_name}</td>
              {timeSlots.map((slot) => {
                const matches = getEntriesForClass(classRow.id).filter((item) => slot.period_number != null && Number(item.period_number ?? item.slot_order ?? item.id) === Number(slot.period_number));
                return (
                  <td key={`${classRow.id}-${slot.id}`} className="min-w-[120px] border-r border-slate-200 bg-white p-2 align-top">
                    <div className="space-y-2">{slot.slot_type === "ASSEMBLY" || slot.is_break || slot.is_lunch ? <div className={`rounded-md border p-2 text-[11px] font-bold ${slot.is_lunch ? "border-orange-200 bg-orange-50 text-orange-800" : slot.is_break ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{slot.slot_type === "ASSEMBLY" ? "Prayer" : slot.is_lunch ? "Lunch" : "Break"}<div className="mt-1 text-[10px] font-medium">{slot.start_time.slice(0, 5)}–{slot.end_time.slice(0, 5)}</div></div> : matches.length ? matches.map(renderEntry) : <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-400">Free</div>}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderClassView = () => (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Teacher</th>
            <th className="px-4 py-3">Group</th>
            <th className="px-4 py-3">Room</th>
          </tr>
        </thead>
        <tbody>
          {filteredClasses.flatMap((classRow) =>
            timeSlots.map((slot) => {
              if (slot.period_number == null) {
                return <tr key={`${classRow.id}-${slot.id}`} className="border-t border-slate-200 bg-slate-50"><td className="px-4 py-3 font-medium text-slate-700">{slot.label}</td><td colSpan={4} className="px-4 py-3 font-bold text-slate-600">{slot.slot_type === "ASSEMBLY" ? "Prayer" : slot.is_lunch ? "Lunch" : "Break"}</td></tr>;
              }
              const matches = getEntriesForClass(classRow.id).filter((item) => Number(item.period_number ?? item.slot_order ?? item.id) === Number(slot.period_number));
              if (!matches.length) return null;
              return matches.map((entry) => (
                <tr key={`${classRow.id}-${slot.id}-${entry.id}`} className="border-t border-slate-200 align-top">
                  <td className="px-4 py-3 font-medium text-slate-700">{slot.label}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{entry.subject_name || "N/A"}</td>
                  <td className="px-4 py-3 text-slate-700">{entry.teacher_name || "N/A"}</td>
                  <td className="px-4 py-3 text-slate-700">{entry.group_name || "Main"}</td>
                  <td className="px-4 py-3 text-slate-700">{entry.room || "—"}</td>
                </tr>
              ));
            })
          )}
        </tbody>
      </table>
    </div>
  );

  const renderTeacherView = () => (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Class</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Group</th>
            <th className="px-4 py-3">Room</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.flatMap((teacher) =>
            entries.filter((entry) => entry.teacher_id === teacher.id).map((entry) => {
              const matchingSlot = timeSlots.find((slot) => Number(slot.period_number) === Number(entry.period_number ?? entry.slot_order ?? 1));
              return (
                <tr key={`${teacher.id}-${entry.id}`} className="border-t border-slate-200 align-top">
                  <td className="px-4 py-3 font-medium text-slate-700">{matchingSlot?.label ?? entry.start_time ?? "Period"}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{entry.class_name}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{entry.subject_name || "N/A"}</td>
                  <td className="px-4 py-3 text-slate-700">{entry.group_name || "Main"}</td>
                  <td className="px-4 py-3 text-slate-700">{entry.room || "—"}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-[28px] bg-[#B60F17] px-6 py-8 text-white shadow-xl md:px-10">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-red-100">Academic year {year}</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">{data?.school?.name ?? "School Timetable"}</h1>
          <p className="mt-3 max-w-2xl text-red-50">Master timetable • class-wise • teacher-wise • print-ready</p>
        </header>

        <section className="mb-6 grid gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-4">
          <label className="text-sm font-semibold text-slate-700">
            Academic year
            <input value={year} onChange={(event) => {
              setLoading(true);
              setError("");
              setYear(event.target.value);
            }} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Class
            <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal">
              <option value="all">All classes</option>
              {classes.map((item) => <option key={item.id} value={String(item.id)}>{item.display_name}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Teacher
            <select value={selectedTeacher} onChange={(event) => setSelectedTeacher(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal">
              <option value="all">All teachers</option>
              {teachers.map((item) => <option key={item.id} value={String(item.id)}>{item.name}</option>)}
            </select>
          </label>
          <div className="text-sm font-semibold text-slate-700">
            View
            <div className="mt-2 flex flex-wrap gap-2">
              {(["master", "class", "teacher"] as const).map((item) => (
                <button key={item} type="button" onClick={() => setView(item)} className={`rounded-xl px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${view === item ? "bg-[#B60F17] text-white" : "border border-slate-300 bg-white text-slate-700"}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-600">{data ? `${data.classes.length} classes • ${data.time_slots.filter((slot) => slot.period_number != null).length} periods • ${entries.length} schedule entries` : "Loading timetable..."}</div>
          <button type="button" onClick={() => window.print()} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">Print timetable</button>
        </div>

        {loading ? <div className="rounded-3xl bg-white p-8 text-slate-600 shadow-sm ring-1 ring-slate-200">Loading timetable...</div> : error ? <div className="rounded-3xl bg-red-50 p-8 text-red-700 shadow-sm ring-1 ring-red-200">{error}</div> : !data || !data.classes.length ? <div className="rounded-3xl bg-white p-8 text-slate-600 shadow-sm ring-1 ring-slate-200">No schedule has been published for this academic year.</div> : (
          <>
            {view === "master" && renderMasterGrid()}
            {view === "class" && renderClassView()}
            {view === "teacher" && renderTeacherView()}
          </>
        )}
      </div>
    </main>
  );
}
