"use client";

import { useEffect, useState } from "react";

type GalleryItem = {
  id: number;
  title: string;
  description: string | null;
  image: string;
  category: string;
  event_name: string | null;
  display_order: number;
  status: "PUBLISHED" | "DRAFT";
};

type ApiResponse<T> = { success: boolean; message: string; data?: T };
const categories = ["Cultural Event", "Annual Cultural Function", "Sports", "Annual Sports Meet", "Celebration", "Academic", "Achievement", "Campus", "School Event", "Activity"];

type FormState = {
  title: string;
  description: string;
  image: string;
  category: string;
  event_name: string;
  display_order: string;
  status: GalleryItem["status"];
  custom_category?: string;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  image: "",
  category: "Cultural Event",
  event_name: "",
  display_order: "0",
  status: "PUBLISHED",
  custom_category: "",
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [importing, setImporting] = useState(false);

  async function loadItems() {
    setLoading(true);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const response = await fetch(`/api/admin/gallery${query}`, { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<{ items: GalleryItem[] }>;
      if (!response.ok || payload.success === false) throw new Error(payload.message);
      setItems(payload.data?.items ?? []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load gallery.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadItems);
  }, [search]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploadingImage(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/uploads", { method: "POST", body });
      const payload = (await response.json()) as ApiResponse<{ url: string }>;
      if (!response.ok || payload.success === false || !payload.data?.url) throw new Error(payload.message || "Unable to upload image");
      updateField("image", payload.data.url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to upload image");
    } finally {
      setUploadingImage(false);
    }
  }

  async function importFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImporting(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/gallery/import", { method: "POST", body });
      const payload = (await response.json()) as ApiResponse<{ imported: number; failed: number; failures: Array<{ row: number; message: string }> }>;
      if (!response.ok || payload.success === false) throw new Error(payload.message);
      const failures = payload.data?.failures ?? [];
      setNotice(`${payload.data?.imported ?? 0} item(s) imported${failures.length ? `, ${failures.length} skipped` : ""}. ${failures.slice(0, 3).map((item) => `Row ${item.row}: ${item.message}`).join(" | ")}`);
      await loadItems();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to import gallery file");
    } finally {
      setImporting(false);
    }
  }

  function downloadTemplate() {
    const content = "title,image,category,event_name,description,display_order,status\nAnnual Sports Meet,/images/gallery/PLA1.jpg,Sports,Annual Sports Meet,Sports day memories,1,PUBLISHED\nAnnual Cultural Function,/images/gallery/PG9.jpg,Cultural Event,Annual Cultural Function,Cultural programme,2,PUBLISHED\n";
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "gallery-template.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const endpoint = editingId ? `/api/admin/gallery/${editingId}` : "/api/admin/gallery";
      const category = form.category === "__custom__" ? form.custom_category?.trim() : form.category;
      if (!category) throw new Error("Enter a category name");
      const response = await fetch(endpoint, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, category, display_order: Number(form.display_order) || 0 }),
      });
      const payload = (await response.json()) as ApiResponse<GalleryItem>;
      if (!response.ok || payload.success === false) throw new Error(payload.message);
      setForm(emptyForm);
      setEditingId(null);
      setNotice(editingId ? "Gallery item updated." : "Gallery item added.");
      await loadItems();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save gallery item.");
    } finally {
      setSaving(false);
    }
  }

  function editItem(item: GalleryItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description ?? "",
      image: item.image,
      category: categories.includes(item.category) ? item.category : "__custom__",
      event_name: item.event_name ?? "",
      display_order: String(item.display_order),
      status: item.status,
      custom_category: categories.includes(item.category) ? "" : item.category,
    });
    setNotice("");
    setError("");
  }

  async function deleteItem(id: number) {
    if (!window.confirm("Delete this gallery item?")) return;
    const response = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    const payload = (await response.json()) as ApiResponse<null>;
    if (!response.ok || payload.success === false) {
      setError(payload.message || "Unable to delete gallery item.");
      return;
    }
    setNotice("Gallery item deleted.");
    await loadItems();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B60F17]">Content management</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Gallery</h1>
            <p className="mt-1 text-sm text-slate-500">Add, arrange, publish and update the public school gallery.</p>
          </div>
          <div className="flex flex-wrap gap-2"><button type="button" onClick={downloadTemplate} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Download Excel template</button><label className="cursor-pointer rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white">{importing ? "Importing..." : "Upload Excel"}<input type="file" accept=".xlsx,.xls,.csv" onChange={(event) => void importFile(event)} disabled={importing} className="hidden" /></label><a href="/gallery1" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700">View public gallery</a></div>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-xl font-bold text-slate-900">{editingId ? "Edit gallery item" : "Add gallery item"}</h2>
          <form onSubmit={submitForm} className="grid gap-4 md:grid-cols-2">
            <input required value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="Title" className="rounded-xl border border-slate-300 px-3 py-2" />
            <div className="grid gap-2 md:grid-cols-[1fr_auto]"><input required value={form.image} onChange={(event) => updateField("image", event.target.value)} placeholder="Image path or choose a file" className="rounded-xl border border-slate-300 px-3 py-2" /><label className="cursor-pointer rounded-xl bg-slate-800 px-4 py-2 text-center font-semibold text-white">{uploadingImage ? "Uploading..." : "Choose image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void handleImageSelect(event)} disabled={uploadingImage} className="hidden" /></label>{form.image ? <img src={form.image} alt="Gallery preview" className="h-16 w-24 rounded-lg object-cover" /> : null}</div>
            <div className="space-y-2"><select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2"><option value="">Select category</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}<option value="__custom__">+ Create new category</option></select>{form.category === "__custom__" ? <input required value={form.custom_category ?? ""} onChange={(event) => updateField("custom_category", event.target.value)} placeholder="New category name" className="w-full rounded-xl border border-slate-300 px-3 py-2" /> : null}</div>
            <input value={form.event_name} onChange={(event) => updateField("event_name", event.target.value)} placeholder="Event name" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input type="number" min="0" value={form.display_order} onChange={(event) => updateField("display_order", event.target.value)} placeholder="Display order" className="rounded-xl border border-slate-300 px-3 py-2" />
            <select value={form.status} onChange={(event) => updateField("status", event.target.value as GalleryItem["status"])} className="rounded-xl border border-slate-300 px-3 py-2"><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option></select>
            <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Description" className="min-h-24 rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" />
            <div className="flex gap-3 md:col-span-2">
              <button disabled={saving} className="rounded-xl bg-[#B60F17] px-5 py-2 font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : editingId ? "Update item" : "Add item"}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-xl border border-slate-300 px-5 py-2 font-semibold text-slate-700">Cancel</button> : null}
            </div>
          </form>
          {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {notice ? <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{notice}</p> : null}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><h2 className="text-xl font-bold text-slate-900">Gallery items</h2><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search gallery" className="rounded-xl border border-slate-300 px-3 py-2" /></div>
          {loading ? <p>Loading...</p> : items.length === 0 ? <p className="text-slate-500">No records found.</p> : <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-slate-700"><tr><th className="px-3 py-3">Preview</th><th className="px-3 py-3">Title</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Order</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t border-slate-200"><td className="px-3 py-3"><img src={item.image} alt="" className="h-14 w-20 rounded-lg object-cover" /></td><td className="px-3 py-3 font-semibold">{item.title}</td><td className="px-3 py-3">{item.category}</td><td className="px-3 py-3">{item.display_order}</td><td className="px-3 py-3">{item.status}</td><td className="px-3 py-3"><div className="flex gap-2"><button onClick={() => editItem(item)} className="rounded-lg border border-slate-300 px-3 py-1 font-semibold">Edit</button><button onClick={() => void deleteItem(item.id)} className="rounded-lg border border-red-300 px-3 py-1 font-semibold text-red-700">Delete</button></div></td></tr>)}</tbody></table></div>}
        </section>
      </div>
    </main>
  );
}
