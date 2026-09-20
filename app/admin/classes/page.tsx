"use client";

import { useEffect, useState } from "react";

type ClassRow = {
  id: number;
  class_name: string;
  section: string;
  academic_year: string;
  class_teacher_id: number | null;
  room: string | null;
  status: "ACTIVE" | "INACTIVE";
  class_teacher_name?: string | null;
};

type ApiResponse<T> = { success: boolean; message: string; data?: T };

const emptyForm = {
  class_name: "",
  section: "",
  academic_year: "2025-26",
  class_teacher_id: "",
  room: "",
  status: "ACTIVE",
};

export default function AdminClassesPage() {
  const [items, setItems] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadClasses() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/classes");
      const payload = (await response.json()) as ApiResponse<{ items: ClassRow[]; total: number }>;
      if (!response.ok || payload.success === false) throw new Error(payload.message || "Unable to load classes");
      setItems(payload.data?.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load classes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadClasses();
  }, []);

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const endpoint = editingId ? `/api/admin/classes/${editingId}` : "/api/admin/classes";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, class_teacher_id: form.class_teacher_id ? Number(form.class_teacher_id) : null }),
    });
    const payload = (await response.json()) as ApiResponse<ClassRow>;

    if (!response.ok || payload.success === false) {
      setError(payload.message || "Unable to save class");
      return;
    }

    setForm(emptyForm);
    setEditingId(null);
    await loadClasses();
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this class?")) return;
    const response = await fetch(`/api/admin/classes/${id}`, { method: "DELETE" });
    const payload = (await response.json()) as ApiResponse<null>;
    if (!response.ok || payload.success === false) {
      setError(payload.message || "Unable to delete class");
      return;
    }
    await loadClasses();
  }

  function editClass(row: ClassRow) {
    setEditingId(row.id);
    setForm({
      class_name: row.class_name,
      section: row.section,
      academic_year: row.academic_year,
      class_teacher_id: row.class_teacher_id ? String(row.class_teacher_id) : "",
      room: row.room ?? "",
      status: row.status,
    });
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h1 className="mb-4 text-2xl font-black text-slate-900">Class Management</h1>
          <form onSubmit={submitForm} className="grid gap-4 md:grid-cols-2">
            <input value={form.class_name} onChange={(e) => setForm({ ...form, class_name: e.target.value })} placeholder="Class name" className="rounded-xl border border-slate-300 px-3 py-2" required />
            <input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} placeholder="Section" className="rounded-xl border border-slate-300 px-3 py-2" required />
            <input value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} placeholder="Academic year" className="rounded-xl border border-slate-300 px-3 py-2" required />
            <input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Room" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.class_teacher_id} onChange={(e) => setForm({ ...form, class_teacher_id: e.target.value })} placeholder="Teacher ID" type="number" className="rounded-xl border border-slate-300 px-3 py-2" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "ACTIVE" | "INACTIVE" })} className="rounded-xl border border-slate-300 px-3 py-2">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="rounded-xl bg-[#B60F17] px-4 py-2 font-semibold text-white">{editingId ? "Update class" : "Add class"}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-xl border border-slate-300 px-4 py-2">Cancel</button> : null}
            </div>
          </form>
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Class List</h2>
          {loading ? <p>Loading...</p> : items.length === 0 ? <p>No records found.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-700">
                    <th className="px-3 py-2">Class</th>
                    <th className="px-3 py-2">Teacher</th>
                    <th className="px-3 py-2">Room</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id} className="border-t border-slate-200">
                      <td className="px-3 py-2 font-medium text-slate-900">{row.class_name}-{row.section}</td>
                      <td className="px-3 py-2">{row.class_teacher_name ?? "—"}</td>
                      <td className="px-3 py-2">{row.room ?? "—"}</td>
                      <td className="px-3 py-2">{row.status}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button onClick={() => editClass(row)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold">Edit</button>
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
