"use client";

import { useEffect, useState } from "react";

type Teacher = {
  id: number;
  name: string;
  designation: string;
  department: string | null;
  subject: string | null;
  qualification: string | null;
  experience: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  bio: string | null;
  status: "ACTIVE" | "INACTIVE";
  display_order?: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

const emptyForm = {
  name: "",
  designation: "",
  department: "",
  subject: "",
  qualification: "",
  experience: "",
  email: "",
  phone: "",
  image: "",
  bio: "",
  status: "ACTIVE",
  display_order: "0",
};

export default function AdminTeachersPage() {
  const [items, setItems] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadTeachers() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/teachers");
      const payload = (await response.json()) as ApiResponse<{ items: Teacher[]; total: number }>;
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || "Unable to load teachers");
      }
      setItems(payload.data?.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load teachers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTeachers();
  }, []);

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const method = editingId ? "PATCH" : "POST";
    const endpoint = editingId ? `/api/admin/teachers/${editingId}` : "/api/admin/teachers";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        display_order: Number(form.display_order) || 0,
      }),
    });
    const payload = (await response.json()) as ApiResponse<Teacher>;

    if (!response.ok || payload.success === false) {
      setError(payload.message || "Unable to save teacher");
      return;
    }

    setForm(emptyForm);
    setEditingId(null);
    await loadTeachers();
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this teacher?")) return;
    const response = await fetch(`/api/admin/teachers/${id}`, { method: "DELETE" });
    const payload = (await response.json()) as ApiResponse<null>;
    if (!response.ok || payload.success === false) {
      setError(payload.message || "Unable to delete teacher");
      return;
    }
    await loadTeachers();
  }

  function editTeacher(teacher: Teacher) {
    setEditingId(teacher.id);
    setForm({
      name: teacher.name,
      designation: teacher.designation,
      department: teacher.department ?? "",
      subject: teacher.subject ?? "",
      qualification: teacher.qualification ?? "",
      experience: teacher.experience ?? "",
      email: teacher.email ?? "",
      phone: teacher.phone ?? "",
      image: teacher.image ?? "",
      bio: teacher.bio ?? "",
      status: teacher.status,
      display_order: String(teacher.display_order ?? 0),
    });
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900">Teacher Management</h1>
          </div>

          <form onSubmit={submitForm} className="grid gap-4 md:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="rounded-xl border border-slate-300 px-3 py-2" required />
            <input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Designation" className="rounded-xl border border-slate-300 px-3 py-2" required />
            <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Department" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} placeholder="Qualification" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Experience" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.email} type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image path" className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" />
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" className="min-h-24 rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "ACTIVE" | "INACTIVE" })} className="rounded-xl border border-slate-300 px-3 py-2">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} placeholder="Display order" className="rounded-xl border border-slate-300 px-3 py-2" />

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="rounded-xl bg-[#B60F17] px-4 py-2 font-semibold text-white">{editingId ? "Update teacher" : "Add teacher"}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700">Cancel</button> : null}
            </div>
          </form>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Teacher List</h2>
          {loading ? <p>Loading...</p> : items.length === 0 ? <p>No records found.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-700">
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Designation</th>
                    <th className="px-3 py-2">Department</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((teacher) => (
                    <tr key={teacher.id} className="border-t border-slate-200">
                      <td className="px-3 py-2 font-medium text-slate-900">{teacher.name}</td>
                      <td className="px-3 py-2">{teacher.designation}</td>
                      <td className="px-3 py-2">{teacher.department || "—"}</td>
                      <td className="px-3 py-2">{teacher.status}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button onClick={() => editTeacher(teacher)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold">Edit</button>
                          <button onClick={() => void handleDelete(teacher.id)} className="rounded-lg border border-red-300 px-2 py-1 text-xs font-semibold text-red-700">Delete</button>
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
