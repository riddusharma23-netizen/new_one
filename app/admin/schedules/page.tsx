"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import TimetableBoard from "@/components/TimetableBoard";
import { isTimetableGrade, type MasterScheduleData } from "@/lib/schedule-master";
import TimingSettings from "./TimingSettings";

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
  const [importMessage, setImportMessage] = useState("");
  const [importing, setImporting] = useState(false);
  const [validation, setValidation] = useState<ValidationState | null>(null);
  const [year, setYear] = useState("2025-26");
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);
  const [form, setForm] = useState<EntryForm>(EMPTY_FORM);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const classes = useMemo(() => data?.classes.filter(isTimetableGrade) ?? [], [data]);
  const teachers = useMemo(() => data?.teachers ?? [], [data]);
  const timeSlots = useMemo(() => data?.time_slots ?? [], [data]);
  const formSubjects = useMemo(() => data?.subjects.filter((subject) => !form.class_id || !subject.class_id || subject.class_id === Number(form.class_id)) ?? [], [data, form.class_id]);

  function openNewEntry(classId?: number, periodNumber?: number, day = selectedDay) {
    setForm({ ...EMPTY_FORM, class_id: classId ? String(classId) : classes[0] ? String(classes[0].id) : "", period_number: periodNumber ? String(periodNumber) : "1", day_of_week: day });
    setSelectedDay(day);
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
      setNotice(form.id ? "Timetable entry updated successfully." : "New timetable entry added successfully.");
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
      setNotice("Timetable entry deleted successfully.");
      await loadData();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to delete timetable entry.");
    }
  }

  const loadData = useCallback(async () => {
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
  }, [year]);

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
    void loadData();
  }, [loadData]);

  async function importFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImporting(true);
    setError("");
    setImportMessage("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/schedules/import", { method: "POST", body });
      const payload = (await response.json()) as ApiResponse<{ imported: number; failed: number; failures: Array<{ row: number; message: string }> }>;
      if (!response.ok || payload.success === false) throw new Error(payload.message);
      const failures = payload.data?.failures ?? [];
      setImportMessage(`${payload.data?.imported ?? 0} row(s) imported${failures.length ? `, ${failures.length} skipped` : ""}. ${failures.slice(0, 3).map((item) => `Row ${item.row}: ${item.message}`).join(" | ")}`);
      await loadData();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to import schedule file");
    } finally {
      setImporting(false);
    }
  }

  function downloadTemplate() {
    const content = "teacher,class,section,subject,day,period,room,academic_year,start_time,end_time,status\nBhagwati Prasad,6,A,English,Monday,1,101,2025-26,08:00:00,08:45:00,ACTIVE\n";
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "schedule-template.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-6 text-[#542b24] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-lg bg-[linear-gradient(112deg,#951c12,#b60f17,#df5b00)] px-6 py-5 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-orange-100">School administration · Classes 6–12</p>
              <h1 className="mt-1 text-2xl font-black md:text-3xl">Timetable management</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={!classes.length} onClick={() => openNewEntry()} className="rounded-lg bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#b60f17] disabled:cursor-not-allowed disabled:opacity-50">+ Add Entry</button>
              <button type="button" onClick={validateTimetable} className="rounded-lg bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#b60f17]">Validate</button>
              <a href="/schedules" target="_blank" rel="noreferrer" className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white">View live</a>
            </div>
          </div>
        </header>

        {data ? <TimingSettings slots={timeSlots} onSaved={() => { void loadData(); }} /> : null}

        <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f2ddc5] bg-white p-4 shadow-sm">
          <div>
            <h2 className="font-bold text-slate-900">Bulk schedule import</h2>
            <p className="text-xs text-slate-500">Upload .xlsx, .xls, or .csv using teacher, class, section, and subject names or IDs.</p>
            {importMessage ? <p className="mt-2 text-sm text-green-700">{importMessage}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={downloadTemplate} className="rounded-lg border border-[#f2ddc5] px-3 py-2 text-xs font-semibold text-[#b60f17]">Download template</button>
            <label className="cursor-pointer rounded-lg bg-[#b60f17] px-3 py-2 text-xs font-semibold text-white">
              {importing ? "Importing..." : "Upload Excel"}
              <input type="file" accept=".xlsx,.xls,.csv" onChange={(event) => void importFile(event)} disabled={importing} className="hidden" />
            </label>
          </div>
        </section>

        <section className="grid gap-4 rounded-lg border border-[#f2ddc5] bg-white p-4 shadow-sm md:grid-cols-4">
          <label className="text-sm font-semibold text-slate-700">
            Academic Year
            <input value={year} onChange={(event) => setYear(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>
          <div className="text-sm font-semibold text-slate-700">
            Classes
            <div className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800">{classes.length} sections (grades 6–12)</div>
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
        {notice ? <div className="flex items-center justify-between gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"><span>{notice}</span><button type="button" onClick={() => setNotice("")} className="text-xs font-black uppercase underline">Dismiss</button></div> : null}

        {loading ? <div className="rounded-lg border border-[#f2ddc5] bg-white p-8 text-center text-sm text-[#80594d]">Loading timetable...</div> : !data ? <div className="rounded-lg border border-[#f2ddc5] bg-white p-8 text-center text-sm text-[#80594d]">No timetable available.</div> : !classes.length ? <div className="rounded-lg border border-[#f2ddc5] bg-white p-8 text-center text-sm text-[#80594d]">No classes from grades 6–12 are configured for this academic year. Add these class sections in Classes to start scheduling.</div> : (
          <TimetableBoard
            data={data}
            editable
            onAdd={(classId, day, periodNumber) => openNewEntry(classId, periodNumber, day)}
            onEdit={editEntry}
            onDelete={(id) => void deleteEntry(id)}
          />
        )}

        {formOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <form onSubmit={saveEntry} className="w-full max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#b60f17]">{form.id ? "Edit timetable entry" : "New timetable entry"}</p><h2 className="mt-1 text-2xl font-black text-slate-900">Class period assignment</h2></div><button type="button" onClick={() => setFormOpen(false)} className="text-2xl font-bold text-slate-400" aria-label="Close">×</button></div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-bold text-slate-700">Class<select required value={form.class_id} onChange={(event) => setForm((current) => ({ ...current, class_id: event.target.value, subject_id: "" }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"><option value="">Select class</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.display_name ?? item.name}</option>)}</select></label>
                <label className="text-sm font-bold text-slate-700">Subject<select required value={form.subject_id} onChange={(event) => setForm((current) => ({ ...current, subject_id: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"><option value="">Select subject</option>{formSubjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                <label className="text-sm font-bold text-slate-700">Teacher<select required value={form.teacher_id} onChange={(event) => setForm((current) => ({ ...current, teacher_id: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"><option value="">Select teacher</option>{teachers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                <label className="text-sm font-bold text-slate-700">Day<select required value={form.day_of_week} onChange={(event) => setForm((current) => ({ ...current, day_of_week: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2">{DAYS.map((day) => <option key={day}>{day}</option>)}</select></label>
                <label className="text-sm font-bold text-slate-700">Period<select required value={form.period_number} onChange={(event) => setForm((current) => ({ ...current, period_number: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2">{timeSlots.filter((slot) => slot.period_number != null).map((slot) => <option key={slot.id} value={slot.period_number!}>Period {slot.period_number} · {slot.start_time.slice(0, 5)}–{slot.end_time.slice(0, 5)}</option>)}</select></label>
                <label className="text-sm font-bold text-slate-700">Room <span className="font-normal text-slate-400">(optional)</span><input value={form.room} onChange={(event) => setForm((current) => ({ ...current, room: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="e.g. Room 101" /></label>
              </div>
              <div className="flex justify-end gap-3"><button type="button" onClick={() => setFormOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Cancel</button><button disabled={saving} type="submit" className="rounded-lg bg-[#b60f17] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving..." : "Save entry"}</button></div>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}
