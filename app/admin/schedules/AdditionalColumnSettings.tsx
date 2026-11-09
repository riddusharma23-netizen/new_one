"use client";

import { useEffect, useState, type FormEvent } from "react";

type ApiResponse = { success: boolean; message: string; data?: { heading: string } };

export default function AdditionalColumnSettings() {
  const [heading, setHeading] = useState("Notes");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/admin/timetable/display-settings", { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as ApiResponse;
        if (!response.ok || !payload.success) throw new Error(payload.message || "Unable to load column settings.");
        setHeading(payload.data?.heading || "Notes");
      })
      .catch((reason: unknown) => {
        if (!(reason instanceof Error && reason.name === "AbortError")) {
          setMessage(reason instanceof Error ? reason.message : "Unable to load column settings.");
        }
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/timetable/display-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heading }),
      });
      const payload = await response.json() as ApiResponse;
      if (!response.ok || !payload.success) throw new Error(payload.message || "Unable to save column settings.");
      setHeading(payload.data?.heading || heading.trim());
      setMessage("Column heading saved.");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Unable to save column settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-[#f2ddc5] bg-white p-4 shadow-sm">
      <form onSubmit={(event) => void save(event)} className="flex flex-wrap items-end gap-3">
        <label className="min-w-52 flex-1 text-sm font-bold text-slate-700">
          Additional timetable column heading
          <input required maxLength={60} value={heading} onChange={(event) => setHeading(event.target.value)} disabled={loading || saving} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        <button type="submit" disabled={loading || saving || !heading.trim()} className="rounded-lg bg-[#b60f17] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
          {saving ? "Saving…" : "Save heading"}
        </button>
        <p role="status" className="w-full text-xs text-slate-500">Column entries come from the Notes fields on each timetable assignment.</p>
        {message ? <p role="status" className="w-full text-xs text-[#694237]">{message}</p> : null}
      </form>
    </section>
  );
}