"use client";

import { useState } from "react";
import type { MasterTimeSlot } from "@/lib/schedule-master";

type Props = { slots: MasterTimeSlot[]; onSaved: () => void };
type Api = { success: boolean; message: string; data?: { affected_lessons?: Array<{ id: number }> } };

export default function TimingSettings({ slots, onSaved }: Props) {
  const [draft, setDraft] = useState(slots);
  const [open, setOpen] = useState(false);
  const [breaksOnly, setBreaksOnly] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (index: number, value: Partial<MasterTimeSlot>) => setDraft((all) => all.map((slot, i) => i === index ? { ...slot, ...value } : slot));
  const openEditor = (breaks: boolean) => { setDraft(slots); setBreaksOnly(breaks); setMessage(""); setOpen(true); };
  const addBreak = () => setDraft((all) => [...all, { id: 0, label: "New break", start_time: "14:00:00", end_time: "14:05:00", slot_order: all.length + 1, period_number: null, slot_type: "BREAK", is_break: true, is_lunch: false, active: true }]);
  const addPeriod = () => setDraft((all) => [...all, { id: 0, label: "New period", start_time: "14:00:00", end_time: "14:40:00", slot_order: all.length + 1, period_number: null, slot_type: "REGULAR", is_break: false, is_lunch: false, active: true }]);

  async function save(preview: boolean) {
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/admin/scheduling-settings/timings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slots: draft, preview, confirm: !preview }) });
      const payload = await response.json() as Api;
      if (!response.ok || !payload.success) throw new Error(payload.message);
      if (preview) { setMessage(`${payload.data?.affected_lessons?.length ?? 0} active lesson(s) need review.`); return; }
      setOpen(false); onSaved();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save changes."); } finally { setSaving(false); }
  }

  if (!open) return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-black text-slate-900">School timings</h2><p className="mt-1 text-xs text-slate-500">Breaks: {slots.filter((slot) => slot.slot_type === "BREAK" && slot.active).map((slot) => `${slot.label} (${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)})`).join(" | ") || "None configured"}</p></div><div className="flex gap-2"><button type="button" onClick={() => openEditor(true)} className="rounded-xl border border-amber-500 px-3 py-2 text-xs font-black uppercase text-amber-700">Manage breaks</button><button type="button" onClick={() => openEditor(false)} className="rounded-xl border border-[#B60F17] px-3 py-2 text-xs font-black uppercase text-[#B60F17]">Edit timings</button></div></div></section>;

  const visible = breaksOnly ? draft.map((slot, index) => ({ slot, index })).filter(({ slot }) => slot.slot_type === "BREAK") : draft.map((slot, index) => ({ slot, index }));
  return <section className="rounded-3xl border border-[#B60F17]/30 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.14em] text-[#B60F17]">Scheduling settings</p><h2 className="mt-1 text-xl font-black">{breaksOnly ? "Manage breaks" : "School timings"}</h2><p className="mt-1 text-xs text-slate-500">Delete disables a break safely; it does not erase history.</p></div><button type="button" onClick={() => { setDraft(slots); setOpen(false); }} className="text-sm font-bold text-slate-500">Cancel</button></div><div className="mt-4 space-y-2">{visible.map(({ slot, index }) => <div key={`${slot.id}-${index}`} className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-[1fr_120px_120px_130px_auto_auto]"><input aria-label="Timing name" value={slot.label} onChange={(event) => update(index, { label: event.target.value })} className="rounded-lg border border-slate-300 px-2 py-1 text-sm" /><input aria-label="Start time" type="time" value={slot.start_time.slice(0, 5)} onChange={(event) => update(index, { start_time: `${event.target.value}:00` })} className="rounded-lg border border-slate-300 px-2 py-1 text-sm" /><input aria-label="End time" type="time" value={slot.end_time.slice(0, 5)} onChange={(event) => update(index, { end_time: `${event.target.value}:00` })} className="rounded-lg border border-slate-300 px-2 py-1 text-sm" /><select aria-label="Timing type" value={slot.slot_type} onChange={(event) => update(index, { slot_type: event.target.value as MasterTimeSlot["slot_type"], is_break: event.target.value === "BREAK", is_lunch: event.target.value === "LUNCH" })} className="rounded-lg border border-slate-300 px-2 py-1 text-sm"><option value="REGULAR">Period</option><option value="ASSEMBLY">Prayer</option><option value="BREAK">Break</option><option value="LUNCH">Lunch</option><option value="OTHER">Other</option></select><label className="flex items-center gap-1 text-xs font-bold"><input type="checkbox" checked={slot.active} onChange={(event) => update(index, { active: event.target.checked })} /> Active</label>{slot.slot_type === "BREAK" ? <button type="button" onClick={() => update(index, { active: false })} className="text-left text-xs font-bold text-red-700 underline">Delete break</button> : <span />}</div>)}</div><div className="mt-3 flex flex-wrap items-center gap-2">{!breaksOnly ? <button type="button" onClick={addPeriod} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold">+ Add period</button> : null}<button type="button" onClick={addBreak} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold">+ Add break</button><button type="button" disabled={saving} onClick={() => void save(true)} className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white">Preview impact</button><button type="button" disabled={saving} onClick={() => void save(false)} className="rounded-xl bg-[#B60F17] px-3 py-2 text-xs font-bold text-white">{breaksOnly ? "Update breaks" : "Save timings"}</button>{message ? <p className="text-xs font-semibold text-slate-700">{message}</p> : null}</div></section>;
}
