"use client";

import { useEffect, useState } from "react";

type Schedule = {
  id: number;
  teacher_id: number;
  class_id: number;
  subject_id: number;
  day_of_week: string;
  period_number: number;
  room: string | null;
  academic_year: string;
  teacher_name?: string;
  subject_name?: string;
  class_label?: string;
};

type Teacher = { id: number; name: string };
type ClassRow = { id: number; class_name: string; section: string; academic_year: string };
type Subject = { id: number; subject_name: string; class_id: number };

type ApiResponse<T> = { success: boolean; message: string; data?: T };

const emptyForm = {
  teacher_id: "",
  class_id: "",
  subject_id: "",
  day_of_week: "Monday",
  period_number: "1",
  room: "",
  academic_year: "2025-26",
};

export default function AdminSchedulesPage() {
  const [items, setItems] = useState<Schedule[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [scheduleRes, teacherRes, classRes, subjectRes] = await Promise.all([
        fetch("/api/admin/schedules"),
        fetch("/api/admin/teachers"),
        fetch("/api/admin/classes"),
        fetch("/api/admin/subjects"),
      ]);

      const schedulePayload = (await scheduleRes.json()) as ApiResponse<{ items: Schedule[]; total: number }>;
      const teacherPayload = (await teacherRes.json()) as ApiResponse<{ items: Teacher[]; total: number }>;
      const classPayload = (await classRes.json()) as ApiResponse<{ items: ClassRow[]; total: number }>;
      const subjectPayload = (await subjectRes.json()) as ApiResponse<{ items: Subject[]; total: number }>;

      if (scheduleRes.ok && schedulePayload.success !== false) setItems(schedulePayload.data?.items ?? []);
      if (teacherRes.ok && teacherPayload.success !== false) setTeachers(teacherPayload.data?.items ?? []);
      if (classRes.ok && classPayload.success !== false) setClasses(classPayload.data?.items ?? []);
      if (subjectRes.ok && subjectPayload.success !== false) setSubjects(subjectPayload.data?.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load schedule data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const endpoint = editingId ? `/api/admin/schedules/${editingId}` : "/api/admin/schedules";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        teacher_id: Number(form.teacher_id),
        class_id: Number(form.class_id),
        subject_id: Number(form.subject_id),
        period_number: Number(form.period_number),
      }),
    });
    const payload = (await response.json()) as ApiResponse<Schedule>;

    if (!response.ok || payload.success === false) {
      setError(payload.message || "Unable to save schedule");
      return;
    }

    setForm(emptyForm);
    setEditingId(null);
    await loadData();
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this schedule entry?")) return;
    const response = await fetch(`/api/admin/schedules/${id}`, { method: "DELETE" });
    const payload = (await response.json()) as ApiResponse<null>;
    if (!response.ok || payload.success === false) {
      setError(payload.message || "Unable to delete schedule");
      return;
    }
    await loadData();
  }

  function editItem(row: Schedule) {
    setEditingId(row.id);
    setForm({
      teacher_id: String(row.teacher_id),
      class_id: String(row.class_id),
      subject_id: String(row.subject_id),
      day_of_week: row.day_of_week,
      period_number: String(row.period_number),
      room: row.room ?? "",
      academic_year: row.academic_year,
    });
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h1 className="mb-4 text-2xl font-black text-slate-900">Schedule Management</h1>
          <form onSubmit={submitForm} className="grid gap-4 md:grid-cols-3">
            <select value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2" required>
              <option value="">Select teacher</option>
              {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
            </select>
            <select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2" required>
              <option value="">Select class</option>
              {classes.map((row) => <option key={row.id} value={row.id}>{row.class_name}-{row.section}</option>)}
            </select>
            <select value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2" required>
              <option value="">Select subject</option>
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.subject_name}</option>)}
            </select>
            <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2">
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map((day) => <option key={day} value={day}>{day}</option>)}
            </select>
            <select value={form.period_number} onChange={(e) => setForm({ ...form, period_number: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2">
              {Array.from({ length: 6 }, (_, i) => i + 1).map((period) => <option key={period} value={String(period)}>Period {period}</option>)}
            </select>
            <input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Room" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} placeholder="Academic year" className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" required />
            <div className="md:col-span-3 flex gap-3">
              <button type="submit" className="rounded-xl bg-[#B60F17] px-4 py-2 font-semibold text-white">{editingId ? "Update schedule" : "Add schedule"}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-xl border border-slate-300 px-4 py-2">Cancel</button> : null}
            </div>
          </form>
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Schedule List</h2>
          {loading ? <p>Loading...</p> : items.length === 0 ? <p>No records found.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-700">
                    <th className="px-3 py-2">Class</th>
                    <th className="px-3 py-2">Teacher</th>
                    <th className="px-3 py-2">Subject</th>
                    <th className="px-3 py-2">Day</th>
                    <th className="px-3 py-2">Period</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id} className="border-t border-slate-200">
                      <td className="px-3 py-2 font-medium text-slate-900">{row.class_label ?? row.class_id}</td>
                      <td className="px-3 py-2">{row.teacher_name ?? row.teacher_id}</td>
                      <td className="px-3 py-2">{row.subject_name ?? row.subject_id}</td>
                      <td className="px-3 py-2">{row.day_of_week}</td>
                      <td className="px-3 py-2">{row.period_number}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button onClick={() => editItem(row)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold">Edit</button>
                          <button onClick={() => void handleDelete(row.id)} className="rounded-lg border border-red-300 px-2 py-1 text-xs font-semibold text-red-700">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
