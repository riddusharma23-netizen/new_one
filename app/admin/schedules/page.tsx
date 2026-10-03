"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { MasterScheduleData } from "@/lib/schedule-master";

type ApiResponse<T> = { success: boolean; message: string; data?: T };

type ValidationState = { valid: boolean; issues: Array<{ code: string; message: string; scheduleId?: number }> };
type EntryForm = {
  id?: number;
  class_id: string;
  subject_id: string;
  teacher_id: string;
  day_of_week: string;
  period_number: string;
  room: string;
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const EMPTY_FORM: EntryForm = { class_id: "", subject_id: "", teacher_id: "", day_of_week: "Monday", period_number: "1", room: "" };

export default function AdminSchedulesPage() {
  const [data, setData] = useState<MasterScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [validation, setValidation] = useState<ValidationState | null>(null);
  const [year, setYear] = useState("2025-26");
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);
  const [form, setForm] = useState<EntryForm>(EMPTY_FORM);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const classes = useMemo(() => data?.classes ?? [], [data]);
  const teachers = useMemo(() => data?.teachers ?? [], [data]);
  const timeSlots = useMemo(() => data?.time_slots ?? [], [data]);
  const entries = useMemo(() => data?.schedule_entries ?? [], [data]);
  const formSubjects = useMemo(() => data?.subjects.filter((subject) => !form.class_id || !subject.class_id || subject.class_id === Number(form.class_id)) ?? [], [data, form.class_id]);

  function openNewEntry(classId?: number, periodNumber?: number) {
    setForm({ ...EMPTY_FORM, class_id: classId ? String(classId) : classes[0] ? String(classes[0].id) : "", period_number: periodNumber ? String(periodNumber) : "1", day_of_week: selectedDay });
    setFormOpen(true);
    setError("");
  }

  function editEntry(entry: MasterScheduleData["schedule_entries"][number]) {
    setForm({ id: entry.id, class_id: String(entry.class_id), subject_id: String(entry.subject_id ?? ""), teacher_id: String(entry.teacher_id ?? ""), day_of_week: entry.day_of_week, period_number: String(entry.period_number ?? 1), room: entry.room ?? "" });
    setFormOpen(true);
    setError("");
  }

  async function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const selectedSlot = timeSlots.find((slot) => Number(slot.period_number) === Number(form.period_number));
      const response = await fetch(form.id ? `/api/admin/schedules/${form.id}` : "/api/admin/schedules", { method: form.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, academic_year: year, class_id: Number(form.class_id), subject_id: Number(form.subject_id), teacher_id: Number(form.teacher_id), period_number: Number(form.period_number), start_time: selectedSlot?.start_time, end_time: selectedSlot?.end_time }) });
      const payload = (await response.json()) as ApiResponse<unknown>;
      if (!response.ok || payload.success === false) throw new Error(payload.message || "Unable to save timetable entry");
      setFormOpen(false);
      setForm(EMPTY_FORM);
      await loadData();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save timetable entry.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntry(id: number) {
    if (!window.confirm("Delete this timetable entry?")) return;
    try {
      const response = await fetch(`/api/admin/schedules/${id}`, { method: "DELETE" });
      const payload = (await response.json()) as ApiResponse<unknown>;
      if (!response.ok || payload.success === false) throw new Error(payload.message || "Unable to delete timetable entry");
      await loadData();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to delete timetable entry.");
    }
  }

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch(`/api/schedules/master?academic_year=${encodeURIComponent(year)}`);
      const payload = (await response.json()) as ApiResponse<MasterScheduleData>;
      if (!response.ok || payload.success === false) throw new Error(payload.message || "Unable to load timetable");
      setData(payload.data ?? null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load timetable data.");
    } finally {
      setLoading(false);
    }
  }

  async function validateTimetable() {
    try {
      const response = await fetch("/api/schedules/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ academic_year: year }),
      });
      const payload = (await response.json()) as ApiResponse<ValidationState>;
      if (!response.ok || payload.success === false) throw new Error(payload.message || "Unable to validate timetable");
      setValidation(payload.data ?? null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Validation failed.");
    }
  }

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
        setError(reason instanceof Error ? reason.message : "Unable to load timetable data.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [year]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-[#B60F17] px-6 py-8 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-red-100">Admin</p>
              <h1 className="mt-2 text-3xl font-black md:text-4xl">Timetable Builder</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => openNewEntry()} className="rounded-xl bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#B60F17]">+ Add Entry</button>
              <button type="button" onClick={validateTimetable} className="rounded-xl bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#B60F17]">Validate</button>
              <button type="button" className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">Publish</button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-4">
          <label className="text-sm font-semibold text-slate-700">
            Academic Year
            <input value={year} onChange={(event) => setYear(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>
          <div className="text-sm font-semibold text-slate-700">
            Classes
            <div className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800">{classes.length}</div>
          </div>
          <div className="text-sm font-semibold text-slate-700">
            Teachers
            <div className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800">{teachers.length}</div>
          </div>
          <div className="text-sm font-semibold text-slate-700">
            Periods
            <div className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800">{timeSlots.filter((slot) => slot.period_number != null).length}</div>
          </div>
        </section>

        {validation ? (
          <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-sm">
            <div className="font-black uppercase tracking-[0.14em]">Validation result</div>
            <div className="mt-2">{validation.valid ? "✓ Validation passed" : `✕ ${validation.issues.length} issue(s) found`}</div>
            <div className="mt-2 space-y-1 text-xs">
              {validation.issues?.length ? validation.issues.map((issue: { code: string; message: string; scheduleId?: number }, index: number) => <div key={`${issue.code}-${issue.scheduleId ?? index}`}>• {issue.message}</div>) : <div>• No conflicts detected.</div>}
            </div>
          </section>
        ) : null}

        {error ? <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

        <section className="flex flex-wrap items-center gap-2 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <span className="mr-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">Working day</span>
          {DAYS.map((day) => <button key={day} type="button" onClick={() => setSelectedDay(day)} className={`rounded-xl px-3 py-2 text-xs font-black ${selectedDay === day ? "bg-[#B60F17] text-white" : "border border-slate-300 bg-white text-slate-700"}`}>{day}</button>)}
        </section>

        {loading ? <div className="rounded-3xl bg-white p-8 text-slate-600 shadow-sm ring-1 ring-slate-200">Loading timetable builder...</div> : !data ? <div className="rounded-3xl bg-white p-8 text-slate-600 shadow-sm ring-1 ring-slate-200">No timetable available.</div> : (
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#f8fafc] text-slate-700">
                  <th className="sticky left-0 z-10 border-r border-slate-200 bg-[#f8fafc] p-3 font-black">CLASS</th>
                  {timeSlots.map((slot) => (
                    <th key={slot.id} className="min-w-[140px] border-r border-slate-200 p-3 text-center text-[11px] font-black uppercase tracking-[0.14em]">
                      {slot.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classes.map((classRow) => (
                  <tr key={classRow.id} className="border-t border-slate-200 align-top">
                    <td className="sticky left-0 z-10 border-r border-slate-200 bg-white p-3 font-black text-slate-900">{classRow.display_name ?? classRow.name}</td>
                    {timeSlots.map((slot) => {
                      const matches = entries.filter((entry) => entry.class_id === classRow.id && entry.day_of_week === selectedDay && slot.period_number != null && Number(entry.period_number ?? entry.slot_order ?? 1) === Number(slot.period_number));
                      const nonTeachingLabel = slot.slot_type === "ASSEMBLY" ? "Prayer" : slot.is_lunch ? "Lunch" : slot.is_break ? "Break" : null;
                      return (
                        <td key={`${classRow.id}-${slot.id}`} className="min-w-[140px] border-r border-slate-200 bg-white p-2 align-top">
                          <div className="space-y-2">{nonTeachingLabel ? <div className={`rounded-xl border p-2 text-[11px] font-bold ${slot.is_lunch ? "border-orange-200 bg-orange-50 text-orange-800" : slot.is_break ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{nonTeachingLabel}<div className="mt-1 text-[10px] font-medium">{slot.start_time.slice(0, 5)}–{slot.end_time.slice(0, 5)}</div></div> : matches.length ? matches.map((entry) => (
                            <div key={`${classRow.id}-${slot.id}-${entry.id}`} className="rounded-xl border border-slate-200 p-2 shadow-sm" style={{ backgroundColor: entry.color || "#f8fafc" }}>
                              <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">{entry.subject_name || "Subject"}</div>
                              <div className="mt-1 text-[11px] font-bold text-slate-900">{entry.teacher_name || "Teacher"}</div>
                              <div className="mt-1 text-[10px] text-slate-700">{entry.room || "Room"}</div>
                              <div className="mt-2 flex gap-2"><button type="button" onClick={() => editEntry(entry)} className="text-[10px] font-black uppercase text-slate-700 underline">Edit</button><button type="button" onClick={() => deleteEntry(entry.id)} className="text-[10px] font-black uppercase text-red-700 underline">Delete</button></div>
                            </div>
                          )) : <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-400">Free<button type="button" onClick={() => openNewEntry(classRow.id, slot.period_number ?? undefined)} className="mt-2 block text-[10px] font-black uppercase text-[#B60F17] underline">Add subject</button></div>}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {formOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <form onSubmit={saveEntry} className="w-full max-w-2xl space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#B60F17]">{form.id ? "Edit timetable entry" : "New timetable entry"}</p><h2 className="mt-1 text-2xl font-black text-slate-900">Class period assignment</h2></div><button type="button" onClick={() => setFormOpen(false)} className="text-2xl font-bold text-slate-400" aria-label="Close">×</button></div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-bold text-slate-700">Class<select required value={form.class_id} onChange={(event) => setForm((current) => ({ ...current, class_id: event.target.value, subject_id: "" }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"><option value="">Select class</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.display_name ?? item.name}</option>)}</select></label>
                <label className="text-sm font-bold text-slate-700">Subject<select required value={form.subject_id} onChange={(event) => setForm((current) => ({ ...current, subject_id: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"><option value="">Select subject</option>{formSubjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                <label className="text-sm font-bold text-slate-700">Teacher<select required value={form.teacher_id} onChange={(event) => setForm((current) => ({ ...current, teacher_id: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"><option value="">Select teacher</option>{teachers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                <label className="text-sm font-bold text-slate-700">Day<select required value={form.day_of_week} onChange={(event) => setForm((current) => ({ ...current, day_of_week: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2">{DAYS.map((day) => <option key={day}>{day}</option>)}</select></label>
                <label className="text-sm font-bold text-slate-700">Period<select required value={form.period_number} onChange={(event) => setForm((current) => ({ ...current, period_number: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2">{timeSlots.filter((slot) => slot.period_number != null).map((slot) => <option key={slot.id} value={slot.period_number!}>Period {slot.period_number} · {slot.start_time.slice(0, 5)}–{slot.end_time.slice(0, 5)}</option>)}</select></label>
                <label className="text-sm font-bold text-slate-700">Room <span className="font-normal text-slate-400">(optional)</span><input value={form.room} onChange={(event) => setForm((current) => ({ ...current, room: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="e.g. Room 101" /></label>
              </div>
              <div className="flex justify-end gap-3"><button type="button" onClick={() => setFormOpen(false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Cancel</button><button disabled={saving} type="submit" className="rounded-xl bg-[#B60F17] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving..." : "Save entry"}</button></div>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}
