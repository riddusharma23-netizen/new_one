"use client";

import { useEffect, useState } from "react";

type Subject = {
  id: number;
  subject_name: string;
  subject_code: string;
  class_id: number;
  teacher_id: number | null;
  weekly_periods: number;
  status: "ACTIVE" | "INACTIVE";
  teacher_name?: string | null;
  class_label?: string | null;
};

type ApiResponse<T> = { success: boolean; message: string; data?: T };

const emptyForm = {
  subject_name: "",
  subject_code: "",
  class_id: "",
  teacher_id: "",
  weekly_periods: "1",
  status: "ACTIVE",
};

export default function AdminSubjectsPage() {
  const [items, setItems] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadSubjects() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/subjects");
      const payload = (await response.json()) as ApiResponse<{ items: Subject[]; total: number }>;
      if (!response.ok || payload.success === false) throw new Error(payload.message || "Unable to load subjects");
      setItems(payload.data?.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load subjects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSubjects();
  }, []);

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const endpoint = editingId ? `/api/admin/subjects/${editingId}` : "/api/admin/subjects";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        class_id: Number(form.class_id),
        teacher_id: form.teacher_id ? Number(form.teacher_id) : null,
        weekly_periods: Number(form.weekly_periods) || 1,
      }),
    });
    const payload = (await response.json()) as ApiResponse<Subject>;

    if (!response.ok || payload.success === false) {
      setError(payload.message || "Unable to save subject");
      return;
    }

    setForm(emptyForm);
    setEditingId(null);
    await loadSubjects();
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this subject?")) return;
    const response = await fetch(`/api/admin/subjects/${id}`, { method: "DELETE" });
    const payload = (await response.json()) as ApiResponse<null>;
    if (!response.ok || payload.success === false) {
      setError(payload.message || "Unable to delete subject");
      return;
    }
    await loadSubjects();
  }

  function editItem(item: Subject) {
    setEditingId(item.id);
    setForm({
      subject_name: item.subject_name,
      subject_code: item.subject_code,
      class_id: String(item.class_id),
      teacher_id: item.teacher_id ? String(item.teacher_id) : "",
      weekly_periods: String(item.weekly_periods),
      status: item.status,
    });
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h1 className="mb-4 text-2xl font-black text-slate-900">Subject Management</h1>
          <form onSubmit={submitForm} className="grid gap-4 md:grid-cols-2">
            <input value={form.subject_name} onChange={(e) => setForm({ ...form, subject_name: e.target.value })} placeholder="Subject name" className="rounded-xl border border-slate-300 px-3 py-2" required />
            <input value={form.subject_code} onChange={(e) => setForm({ ...form, subject_code: e.target.value })} placeholder="Subject code" className="rounded-xl border border-slate-300 px-3 py-2" required />
            <input value={form.class_id} type="number" onChange={(e) => setForm({ ...form, class_id: e.target.value })} placeholder="Class ID" className="rounded-xl border border-slate-300 px-3 py-2" required />
            <input value={form.teacher_id} type="number" onChange={(e) => setForm({ ...form, teacher_id: e.target.value })} placeholder="Teacher ID" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.weekly_periods} type="number" onChange={(e) => setForm({ ...form, weekly_periods: e.target.value })} placeholder="Weekly periods" className="rounded-xl border border-slate-300 px-3 py-2" min={1} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "ACTIVE" | "INACTIVE" })} className="rounded-xl border border-slate-300 px-3 py-2">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="rounded-xl bg-[#B60F17] px-4 py-2 font-semibold text-white">{editingId ? "Update subject" : "Add subject"}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-xl border border-slate-300 px-4 py-2">Cancel</button> : null}
            </div>
          </form>
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Subject List</h2>
          {loading ? <p>Loading...</p> : items.length === 0 ? <p>No records found.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-700">
                    <th className="px-3 py-2">Subject</th>
                    <th className="px-3 py-2">Class</th>
                    <th className="px-3 py-2">Teacher</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id} className="border-t border-slate-200">
                      <td className="px-3 py-2 font-medium text-slate-900">{row.subject_name} ({row.subject_code})</td>
                      <td className="px-3 py-2">{row.class_label ?? row.class_id}</td>
                      <td className="px-3 py-2">{row.teacher_name ?? "—"}</td>
                      <td className="px-3 py-2">{row.status}</td>
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
