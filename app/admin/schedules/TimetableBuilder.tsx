"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import TimetableBoard from "@/components/TimetableBoard";
import type { MasterScheduleData, MasterScheduleEntry, MasterTimeSlot } from "@/lib/schedule-master";
import AdditionalColumnSettings from "./AdditionalColumnSettings";
import TimingSettings from "./TimingSettings";

type ApiPayload<T> = {
  success: boolean;
  message: string;
  data?: T;
};

type Conflict = { type: string; message: string };
type TimetableVersion = { id: number; name: string; status: string; published_at?: string | null };
type TimetableClass = { id: number; class_name: string; section: string; academic_year: string; display_name: string };
type Teacher = { id: number; name: string; short_name?: string | null; status: string };
type Subject = { id: number; name: string; class_id: number; status: string };
type StudentGroup = { id: number; name: string; class_id: number; active: string };
type Room = { id: number; name: string; active: string };
type BuilderOptions = {
  classes: TimetableClass[];
  teachers: Teacher[];
  subjects: Subject[];
  groups: StudentGroup[];
  rooms: Room[];
  versions: TimetableVersion[];
  time_slots: MasterTimeSlot[];
  days: string[];
  draft: TimetableVersion;
};
type SlotDraft = {
  mode: "create" | "edit";
  assignmentId?: number;
  originalTeacherId?: number | null;
  classId: number;
  day: string;
  periodNumber: number;
  timeSlotId: number;
  subjectId: string;
  teacherId: string;
  roomId: string;
  notes: string;
};
type Assignment = { subject_id: string; teacher_ids: string[]; room_id: string; notes: string };
type ScheduleGroup = { name: string; student_group_id: string; assignments: Assignment[] };
type LoadedGroup = {
  name: string;
  student_group_id: number | null;
  assignments: Array<{
    subject_id: number | null;
    room_id: number | null;
    notes: string | null;
    teachers: Array<{ id: number }>;
  }>;
};

class ApiRequestError extends Error {
  conflicts: Conflict[];

  constructor(message: string, conflicts: Conflict[] = []) {
    super(message);
    this.conflicts = conflicts;
  }
}

async function requestData<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response.json()) as ApiPayload<T> & { data?: T | { conflicts?: Conflict[] } };
  if (!response.ok || !payload.success) {
    const data = payload.data as { conflicts?: Conflict[] } | undefined;
    throw new ApiRequestError(payload.message || "The request could not be completed.", data?.conflicts ?? []);
  }
  return payload.data as T;
}

function emptyAssignment(): Assignment {
  return { subject_id: "", teacher_ids: [], room_id: "", notes: "" };
}

function emptyGroup(number: number): ScheduleGroup {
  return { name: `Group ${number}`, student_group_id: "", assignments: [emptyAssignment()] };
}

function formatTime(value: string) {
  return value.slice(0, 5);
}

export default function TimetableBuilder({ onLegacy }: { onLegacy: () => void }) {
  const [academicYear, setAcademicYear] = useState("2025-26");
  const [yearInput, setYearInput] = useState("2025-26");
  const [options, setOptions] = useState<BuilderOptions | null>(null);
  const [masterData, setMasterData] = useState<MasterScheduleData | null>(null);
  const [classId, setClassId] = useState("");
  const [day, setDay] = useState("Monday");
  const [timeSlotId, setTimeSlotId] = useState("");
  const [groups, setGroups] = useState<ScheduleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [masterLoading, setMasterLoading] = useState(false);
  const [periodLoading, setPeriodLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newGroupName, setNewGroupName] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [copyClassId, setCopyClassId] = useState("");
  const [copyDay, setCopyDay] = useState("");
  const [slotDraft, setSlotDraft] = useState<SlotDraft | null>(null);

  const loadOptions = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    try {
      const data = await requestData<BuilderOptions>(
        `/api/admin/timetable/options?academic_year=${encodeURIComponent(academicYear)}`,
        { signal }
      );
      setOptions(data);
      setClassId((current) => data.classes.some((item) => String(item.id) === current && item.academic_year === academicYear)
        ? current
        : String(data.classes.find((item) => item.academic_year === academicYear)?.id ?? ""));
      if (!data.classes.some((item) => item.academic_year === academicYear)) {
        setGroups([]);
        setDirty(false);
      }
      setTimeSlotId((current) => data.time_slots.some((item) => String(item.id) === current && item.active && item.period_number != null)
        ? current
        : String(data.time_slots.find((item) => item.active && item.period_number != null)?.id ?? ""));
      setDay((current) => data.days.includes(current) ? current : data.days[0] ?? "Monday");
    } catch (reason) {
      if (!(reason instanceof Error && reason.name === "AbortError")) {
        setError(reason instanceof Error ? reason.message : "Unable to load timetable options.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [academicYear]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void loadOptions(controller.signal), 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadOptions]);

  useEffect(() => {
    if (!options?.draft.id) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setMasterLoading(true);
      void requestData<MasterScheduleData>(
        `/api/admin/timetable/master?academic_year=${encodeURIComponent(academicYear)}&version_id=${options.draft.id}`,
        { signal: controller.signal }
      )
        .then(setMasterData)
        .catch((reason: unknown) => {
          if (!(reason instanceof Error && reason.name === "AbortError")) {
            setError(reason instanceof Error ? reason.message : "Unable to load the timetable grid.");
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setMasterLoading(false);
        });
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [academicYear, options?.draft.id, refreshKey]);

  useEffect(() => {
    if (!editorOpen || !options?.draft.id || !classId || !timeSlotId || !day) return;
    const controller = new AbortController();
    const params = new URLSearchParams({
      version_id: String(options.draft.id),
      class_id: classId,
      day,
      time_slot_id: timeSlotId,
    });
    const timer = window.setTimeout(() => {
      setPeriodLoading(true);
      setError("");
      void requestData<LoadedGroup[]>(`/api/admin/timetable/period?${params}`, { signal: controller.signal })
        .then((rows) => {
          setGroups(rows.map((group) => ({
            name: group.name,
            student_group_id: group.student_group_id ? String(group.student_group_id) : "",
            assignments: group.assignments.map((assignment) => ({
              subject_id: assignment.subject_id ? String(assignment.subject_id) : "",
              teacher_ids: assignment.teachers.map((teacher) => String(teacher.id)),
              room_id: assignment.room_id ? String(assignment.room_id) : "",
              notes: assignment.notes ?? "",
            })),
          })));
          setDirty(false);
        })
        .catch((reason: unknown) => {
          if (!(reason instanceof Error && reason.name === "AbortError")) {
            setError(reason instanceof Error ? reason.message : "Unable to load this period.");
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setPeriodLoading(false);
        });
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [editorOpen, options?.draft.id, classId, day, timeSlotId, refreshKey]);

  const currentClass = useMemo(
    () => options?.classes.find((item) => String(item.id) === classId),
    [options, classId]
  );
  const currentSlot = useMemo(
    () => options?.time_slots.find((item) => String(item.id) === timeSlotId),
    [options, timeSlotId]
  );
  const classGroups = useMemo(
    () => options?.groups.filter((item) => String(item.class_id) === classId && item.active !== "INACTIVE") ?? [],
    [options, classId]
  );
  const classSubjects = useMemo(
    () => options?.subjects.filter((item) => item.status !== "INACTIVE") ?? [],
    [options]
  );
  const activeRooms = options?.rooms.filter((item) => item.active !== "INACTIVE") ?? [];
  const activeTeachers = options?.teachers.filter((item) => item.status === "ACTIVE") ?? [];
  const regularSlots = options?.time_slots.filter((item) => item.active && item.period_number != null) ?? [];

  function confirmDiscard() {
    if (!dirty) return true;
    const discard = window.confirm("Discard unsaved changes to this period?");
    if (discard) setDirty(false);
    return discard;
  }

  function openAssign(targetClassId: number, targetDay: string, periodNumber: number) {
    const slot = options?.time_slots.find((item) => item.active && Number(item.period_number) === periodNumber);
    if (!slot) {
      setError("That period is not available.");
      return;
    }
    setClassId(String(targetClassId));
    setDay(targetDay);
    setTimeSlotId(String(slot.id));
    setError("");
    setSlotDraft({
      mode: "create",
      classId: targetClassId,
      day: targetDay,
      periodNumber,
      timeSlotId: slot.id,
      subjectId: "",
      teacherId: "",
      roomId: "",
      notes: "",
    });
  }

  function openSlotEditor(entry: MasterScheduleEntry) {
    const slot = options?.time_slots.find((item) => item.id === entry.time_slot_id)
      ?? options?.time_slots.find((item) => item.active && Number(item.period_number) === Number(entry.period_number));
    if (!slot) {
      setError("That period is not available.");
      return;
    }
    setError("");
    setSlotDraft({
      mode: "edit",
      assignmentId: entry.id,
      originalTeacherId: entry.teacher_id ?? null,
      classId: entry.class_id,
      day: entry.day_of_week,
      periodNumber: Number(entry.period_number ?? slot.period_number ?? 0),
      timeSlotId: slot.id,
      subjectId: entry.subject_id ? String(entry.subject_id) : "",
      teacherId: entry.teacher_id ? String(entry.teacher_id) : "",
      roomId: entry.room_id ? String(entry.room_id) : "",
      notes: entry.notes ?? "",
    });
  }

  function mergeSavedEntry(saved: MasterScheduleEntry, draft: SlotDraft) {
    setMasterData((current) => {
      if (!current) return current;
      const next = { ...saved, academic_year: saved.academic_year || academicYear };
      const entries = current.schedule_entries.filter((item) => !(
        draft.mode === "edit" &&
        item.id === draft.assignmentId &&
        (item.teacher_id ?? null) === (draft.originalTeacherId ?? null)
      ));
      return { ...current, schedule_entries: [...entries, next] };
    });
  }

  async function saveSlot(override = false) {
    if (!options || !slotDraft) return;
    if (!slotDraft.subjectId || !slotDraft.teacherId) {
      setError("Choose a subject and a teacher.");
      return;
    }
    const payload = {
      subject_id: Number(slotDraft.subjectId),
      teacher_id: Number(slotDraft.teacherId),
      room_id: slotDraft.roomId ? Number(slotDraft.roomId) : null,
      notes: slotDraft.notes.trim() || null,
      override,
      ...(slotDraft.mode === "edit" ? { target_teacher_id: slotDraft.originalTeacherId } : {}),
    };
    setSaving(true);
    setError("");
    try {
      const saved = slotDraft.mode === "edit" && slotDraft.assignmentId
        ? await requestData<MasterScheduleEntry>(`/api/admin/timetable/assignments/${slotDraft.assignmentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        : await requestData<MasterScheduleEntry>("/api/admin/timetable/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            version_id: options.draft.id,
            class_id: slotDraft.classId,
            day_of_week: slotDraft.day,
            time_slot_id: slotDraft.timeSlotId,
          }),
        });
      mergeSavedEntry(saved, slotDraft);
      setSlotDraft(null);
      const published = await publishSavedChanges();
      if (published) {
        setNotice(slotDraft.mode === "edit" ? "Assignment updated and published to the website." : "Teacher added and published to the website.");
      }
      setRefreshKey((value) => value + 1);
    } catch (reason) {
      if (reason instanceof ApiRequestError && reason.conflicts.length && !override) {
        const detail = reason.conflicts.map((item) => item.message).join("\n");
        if (window.confirm(`${reason.message}\n\n${detail}\n\nSave anyway with an audited conflict override?`)) {
          await saveSlot(true);
          return;
        }
      } else {
        setError(reason instanceof Error ? reason.message : "Unable to save this assignment.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteSlot(entry: MasterScheduleEntry) {
    if (!window.confirm("Remove this teacher from the period? Other assignments in the same period stay in place.")) return;
    setSaving(true);
    setError("");
    try {
      const query = entry.teacher_id == null ? "" : `?teacher_id=${entry.teacher_id}`;
      await requestData(`/api/admin/timetable/assignments/${entry.id}${query}`, { method: "DELETE" });
      setMasterData((current) => current
        ? {
          ...current,
          schedule_entries: current.schedule_entries.filter((item) =>
            item.id !== entry.id || (entry.teacher_id != null && item.teacher_id !== entry.teacher_id)
          ),
        }
        : current);
      const published = await publishSavedChanges();
      if (published) setNotice("Assignment removed and published to the website.");
      setRefreshKey((value) => value + 1);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to delete this assignment.");
    } finally {
      setSaving(false);
    }
  }

  function updateGroup(index: number, patch: Partial<ScheduleGroup>) {
    setGroups((current) => current.map((group, itemIndex) => itemIndex === index ? { ...group, ...patch } : group));
    setDirty(true);
  }

  function updateAssignment(groupIndex: number, assignmentIndex: number, patch: Partial<Assignment>) {
    setGroups((current) => current.map((group, itemIndex) => itemIndex === groupIndex
      ? { ...group, assignments: group.assignments.map((assignment, entryIndex) => entryIndex === assignmentIndex ? { ...assignment, ...patch } : assignment) }
      : group));
    setDirty(true);
  }

  async function savePeriod(override = false) {
    if (!options || !currentSlot || !classId) return;
    if (groups.some((group) => group.assignments.some((assignment) => !assignment.subject_id))) {
      setError("Choose a subject for each assignment before saving.");
      return;
    }
    const body = {
      version_id: options.draft.id,
      class_id: Number(classId),
      day_of_week: day,
      time_slot_id: currentSlot.id,
      override,
      groups: groups.map((group) => ({
        name: group.name.trim(),
        student_group_id: group.student_group_id ? Number(group.student_group_id) : null,
        assignments: group.assignments.map((assignment) => ({
          subject_id: Number(assignment.subject_id),
          teacher_ids: assignment.teacher_ids.map(Number),
          room_id: assignment.room_id ? Number(assignment.room_id) : null,
          notes: assignment.notes.trim() || null,
        })),
      })),
    };
    setSaving(true);
    setError("");
    try {
      await requestData("/api/admin/timetable/period", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setDirty(false);
      setEditorOpen(false);
      const published = await publishSavedChanges();
      if (published) setNotice("Period saved and published to the website.");
      setRefreshKey((value) => value + 1);
    } catch (reason) {
      if (reason instanceof ApiRequestError && reason.conflicts.length && !override) {
        const detail = reason.conflicts.map((item) => item.message).join("\n");
        if (window.confirm(`${reason.message}\n\n${detail}\n\nSave anyway with an audited conflict override?`)) {
          await savePeriod(true);
          return;
        }
      } else {
        setError(reason instanceof Error ? reason.message : "Unable to save this period.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function publish(override = false) {
    if (!options) return;
    if (dirty) {
      setError("Save your draft changes before publishing.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await requestData(`/api/admin/timetable/versions/${options.draft.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ override }),
      });
      setNotice("Timetable published to the public website.");
      await loadOptions();
    } catch (reason) {
      if (reason instanceof ApiRequestError && reason.conflicts.length && !override) {
        const detail = reason.conflicts.map((item) => item.message).join("\n");
        if (window.confirm(`${reason.message}\n\n${detail}\n\nPublish anyway with an audited conflict override?`)) {
          await publish(true);
          return;
        }
      } else {
        setError(reason instanceof Error ? reason.message : "Unable to publish timetable.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function publishSavedChanges(override = false): Promise<boolean> {
    if (!options) return false;
    try {
      await requestData(`/api/admin/timetable/versions/${options.draft.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ override }),
      });
    } catch (reason) {
      if (reason instanceof ApiRequestError && reason.conflicts.length && !override) {
        const detail = reason.conflicts.map((item) => item.message).join("\n");
        if (window.confirm(`${reason.message}\n\n${detail}\n\nPublish anyway with an audited conflict override?`)) {
          return publishSavedChanges(true);
        }
      }
      setError(reason instanceof Error ? `Saved as a draft, but could not publish: ${reason.message}` : "Saved as a draft, but could not publish.");
      setNotice("This change is not visible on the public timetable yet.");
      return false;
    }

    await loadOptions();
    return true;
  }

  async function copySchedule(targetClassId: string, targetDay: string, override = false) {
    if (!options || !classId || !targetClassId || !targetDay) return;
    if (!override && !window.confirm(`Replace ${targetDay} for ${options.classes.find((item) => String(item.id) === targetClassId)?.display_name ?? "the selected class"} with ${day} from ${currentClass?.display_name ?? "the selected class"}? An empty source day will clear the target day.`)) return;
    setSaving(true);
    setError("");
    try {
      await requestData("/api/admin/timetable/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version_id: options.draft.id,
          source_class_id: Number(classId),
          target_class_id: Number(targetClassId),
          source_day: day,
          target_day: targetDay,
          override,
        }),
      });
      setDirty(false);
      const published = await publishSavedChanges();
      if (published) setNotice(`Copied ${day} to ${targetDay} and published to the website.`);
      setRefreshKey((value) => value + 1);
    } catch (reason) {
      if (reason instanceof ApiRequestError && reason.conflicts.length && !override) {
        const detail = reason.conflicts.map((item) => item.message).join("\n");
        if (window.confirm(`${reason.message}\n\n${detail}\n\nCopy anyway with an audited conflict override?`)) {
          await copySchedule(targetClassId, targetDay, true);
          return;
        }
      } else {
        setError(reason instanceof Error ? reason.message : "Unable to copy the timetable.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function createStudentGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!classId || !newGroupName.trim()) return;
    setError("");
    try {
      await requestData("/api/admin/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGroupName.trim(), class_id: Number(classId) }),
      });
      setNewGroupName("");
      setNotice("Student group created.");
      await loadOptions();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to create student group.");
    }
  }

  async function createRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newRoomName.trim()) return;
    setError("");
    try {
      await requestData("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRoomName.trim(), room_type: "CLASSROOM" }),
      });
      setNewRoomName("");
      setNotice("Classroom created.");
      await loadOptions();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to create classroom.");
    }
  }

  async function restoreVersion(versionId: string) {
    if (!versionId || !confirmDiscard() || !window.confirm("Restore this timetable version into a new draft?")) return;
    setError("");
    try {
      await requestData(`/api/admin/timetable/versions/${versionId}/restore`, { method: "POST" });
      setNotice("Previous version restored as a draft.");
      await loadOptions();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to restore timetable version.");
    }
  }

  return (
    <section className="mx-auto max-w-7xl space-y-5 px-4 py-6 md:px-8">
      <header className="rounded-2xl bg-[linear-gradient(112deg,#951c12,#b60f17,#df5b00)] p-5 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">Admin · Draft builder</p>
            <h1 className="mt-1 text-2xl font-black md:text-3xl">Timetable management</h1>
            <p className="mt-1 text-sm text-orange-50">Add multiple subject-and-teacher assignments to a period, split students into groups, then publish.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/schedules" target="_blank" rel="noreferrer" className="rounded-lg border border-white/40 px-3 py-2 text-sm font-bold">View public timetable</a>
            <button type="button" onClick={onLegacy} className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#a51d18]">Legacy schedule tools</button>
          </div>
        </div>
      </header>

      {error ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}
      {notice ? <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</div> : null}
      {loading ? <div className="rounded-xl border border-[#f2ddc5] bg-white p-8 text-center">Loading timetable options…</div> : null}
      {!loading && !options ? <div className="rounded-xl border border-[#f2ddc5] bg-white p-8 text-center">Timetable options could not be loaded.</div> : null}

      {options ? (
        <>
          <section className="grid gap-3 rounded-xl border border-[#f2ddc5] bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-bold text-slate-700">Academic year
              <span className="mt-1 flex gap-2">
                <input value={yearInput} onChange={(event) => setYearInput(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2" />
                <button type="button" disabled={!yearInput.trim() || yearInput.trim() === academicYear} onClick={() => { if (confirmDiscard()) setAcademicYear(yearInput.trim()); }} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold disabled:opacity-50">Load</button>
              </span>
            </label>
            <div className="text-sm font-bold text-slate-700">Classes
              <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">{options.classes.filter((item) => item.academic_year === academicYear).length} sections · grades 6–12</p>
            </div>
            <div className="text-sm font-bold text-slate-700">Teachers
              <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">{activeTeachers.length} active</p>
            </div>
            <div className="flex items-end justify-between gap-2">
              <div>
                <span className="text-xs text-slate-500">{options.draft.name} · {options.draft.status}</span>
                <p className="mt-1 max-w-48 text-[10px] leading-snug text-slate-500">Draft edits are private until you publish them.</p>
              </div>
              <button type="button" disabled={saving || dirty || options.draft.status !== "DRAFT"} onClick={() => void publish()} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Publish to website</button>
            </div>
          </section>

          {masterLoading ? <p className="rounded-lg border border-[#f2ddc5] bg-white p-5 text-center text-sm text-slate-500">Loading timetable…</p> : null}
          {masterData ? (
            <TimetableBoard
              key={academicYear}
              data={masterData}
              editable
              onClassChange={(id) => setClassId(String(id))}
              onAdd={openAssign}
              onEdit={openSlotEditor}
              onDelete={(id) => void deleteSlot(id)}
            />
          ) : null}

          <details className="rounded-xl border border-[#f2ddc5] bg-white p-4 shadow-sm">
            <summary className="cursor-pointer text-sm font-bold text-slate-800">More timetable settings and tools</summary>
            <div className="mt-4 space-y-4">
              <TimingSettings slots={options.time_slots} onSaved={() => { setRefreshKey((value) => value + 1); void loadOptions(); }} />
              <AdditionalColumnSettings />
              <div className="grid gap-3 rounded-xl border border-[#f2ddc5] bg-white p-4 shadow-sm md:grid-cols-4">
                <label className="text-sm font-bold text-slate-700">Class
                  <select value={classId} onChange={(event) => { if (!confirmDiscard()) return; setClassId(event.target.value); if (!event.target.value) setGroups([]); }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Select class</option>
                    {options.classes.filter((item) => item.academic_year === academicYear).map((item) => <option key={item.id} value={item.id}>{item.display_name}</option>)}
                  </select>
                </label>
                <label className="text-sm font-bold text-slate-700">Day
                  <select value={day} onChange={(event) => { if (confirmDiscard()) setDay(event.target.value); }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                    {options.days.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="text-sm font-bold text-slate-700">Period
                  <select value={timeSlotId} onChange={(event) => { if (confirmDiscard()) setTimeSlotId(event.target.value); }} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                    {regularSlots.map((item) => <option key={item.id} value={item.id}>{item.label} · {formatTime(item.start_time)}–{formatTime(item.end_time)}</option>)}
                  </select>
                </label>
                <div className="flex items-end">
                  <button type="button" disabled={saving || periodLoading || !classId || !currentSlot} onClick={() => { setPeriodLoading(true); setEditorOpen(true); }} className="rounded-lg border border-[#b60f17] px-4 py-2 text-sm font-bold text-[#b60f17] disabled:opacity-50">Edit selected period</button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border border-[#f2ddc5] p-4">
                  <h3 className="text-sm font-bold text-slate-800">Create student group for {currentClass?.display_name ?? "selected class"}</h3>
                  <form onSubmit={(event) => void createStudentGroup(event)} className="mt-3 flex flex-wrap gap-2">
                    <input required value={newGroupName} onChange={(event) => setNewGroupName(event.target.value)} placeholder="e.g. Biology Group" className="min-w-52 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    <button disabled={!classId} className="rounded-lg bg-[#b60f17] px-3 py-2 text-sm font-bold text-white disabled:opacity-50">Add group</button>
                  </form>
                </section>
                <section className="rounded-xl border border-[#f2ddc5] p-4">
                  <h3 className="text-sm font-bold text-slate-800">Add classroom</h3>
                  <form onSubmit={(event) => void createRoom(event)} className="mt-3 flex flex-wrap gap-2">
                    <input required value={newRoomName} onChange={(event) => setNewRoomName(event.target.value)} placeholder="e.g. Room 101" className="min-w-52 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    <button className="rounded-lg bg-[#b60f17] px-3 py-2 text-sm font-bold text-white">Add room</button>
                  </form>
                </section>
              </div>

          <section className="space-y-4 rounded-xl border border-[#f2ddc5] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-black text-slate-900">{currentClass?.display_name ?? "Select a class"} · {currentSlot?.label ?? "Select a period"}</h2>
                {currentSlot ? <p className="text-xs text-slate-500">{formatTime(currentSlot.start_time)}–{formatTime(currentSlot.end_time)} · {day}</p> : null}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2 text-right">
                <button type="button" disabled={saving || periodLoading || !dirty || !classId || !currentSlot} onClick={() => void savePeriod()} className="rounded-lg bg-[#b60f17] px-3 py-2 text-sm font-bold text-white disabled:opacity-50">Save period</button>
                <button type="button" disabled={!classId || !currentSlot} onClick={() => { setGroups((current) => [...current, emptyGroup(current.length + 1)]); setDirty(true); }} className="rounded-lg border border-[#b60f17] px-3 py-2 text-sm font-bold text-[#b60f17] disabled:opacity-50">+ Add split group</button>
                <p className="max-w-xs text-[11px] text-slate-500">Use another group when different students need different subjects in this period. Saving replaces this period with the groups shown here.</p>
              </div>
            </div>

            {periodLoading ? <p className="py-6 text-center text-sm text-slate-500">Loading period…</p> : null}
            {!periodLoading && !groups.length ? <p className="rounded-lg bg-slate-50 p-5 text-center text-sm text-slate-600">No groups in this period yet. Add one to start scheduling.</p> : null}
            {!periodLoading ? groups.map((group, groupIndex) => (
              <article key={groupIndex} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <label className="text-xs font-bold text-slate-700">Schedule group name
                    <input value={group.name} onChange={(event) => updateGroup(groupIndex, { name: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
                  </label>
                  <label className="text-xs font-bold text-slate-700">Student group / class split
                    <select value={group.student_group_id} onChange={(event) => updateGroup(groupIndex, { student_group_id: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                      <option value="">Whole class / unassigned</option>
                      {classGroups.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                  </label>
                  <button type="button" onClick={() => { setGroups((current) => current.filter((_, index) => index !== groupIndex)); setDirty(true); }} className="self-end rounded-lg px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Remove group</button>
                </div>
                <p className="text-xs text-slate-500">Add subject-and-teacher assignments below. Use a different student group when this period is split between students.</p>

                {group.assignments.map((assignment, assignmentIndex) => {
                  const assignmentKey = `${groupIndex}-${assignmentIndex}`;
                  return (
                    <fieldset key={assignmentIndex} className="grid gap-3 rounded-lg border border-white bg-white p-3 md:grid-cols-2 xl:grid-cols-[1fr_1.4fr_0.8fr_1fr_auto]">
                      <legend className="px-1 text-xs font-extrabold text-slate-700">Subject + teacher {assignmentIndex + 1}</legend>
                      <label className="text-xs font-bold text-slate-700">Subject
                        <select required value={assignment.subject_id} onChange={(event) => updateAssignment(groupIndex, assignmentIndex, { subject_id: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                          <option value="">Select subject</option>
                          {classSubjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                        </select>
                      </label>
                      <fieldset className="min-w-0 text-xs font-bold text-slate-700">
                        <legend>Teacher(s)</legend>
                        <div className="mt-1 max-h-28 overflow-y-auto rounded-lg border border-slate-300 p-2">
                          {activeTeachers.length ? activeTeachers.map((teacher) => {
                            const teacherId = String(teacher.id);
                            const inputId = `teacher-${assignmentKey}-${teacher.id}`;
                            const selected = assignment.teacher_ids.includes(teacherId);
                            return (
                              <label key={teacher.id} htmlFor={inputId} className="flex cursor-pointer items-center gap-2 py-1 font-normal">
                                <input
                                  id={inputId}
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => updateAssignment(groupIndex, assignmentIndex, {
                                    teacher_ids: selected
                                      ? assignment.teacher_ids.filter((id) => id !== teacherId)
                                      : [...assignment.teacher_ids, teacherId],
                                  })}
                                  className="accent-[#b60f17]"
                                />
                                <span>{teacher.short_name || teacher.name}</span>
                              </label>
                            );
                          }) : <p className="font-normal text-slate-500">No active teachers available.</p>}
                        </div>
                        <span className="font-normal text-slate-500">Select one or more teachers for this subject.</span>
                      </fieldset>
                      <label className="text-xs font-bold text-slate-700">Classroom
                        <select value={assignment.room_id} onChange={(event) => updateAssignment(groupIndex, assignmentIndex, { room_id: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                          <option value="">Unassigned</option>
                          {activeRooms.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                        </select>
                      </label>
                      <label className="text-xs font-bold text-slate-700">Notes
                        <input value={assignment.notes} onChange={(event) => updateAssignment(groupIndex, assignmentIndex, { notes: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                      </label>
                      <button type="button" disabled={group.assignments.length <= 1} onClick={() => { updateGroup(groupIndex, { assignments: group.assignments.filter((_, index) => index !== assignmentIndex) }); }} className="self-end rounded-lg px-2 py-2 text-xs font-semibold text-red-700 disabled:opacity-40">Remove assignment</button>
                    </fieldset>
                  );
                })}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button type="button" onClick={() => updateGroup(groupIndex, { assignments: [...group.assignments, emptyAssignment()] })} className="rounded-lg border border-[#b60f17] px-3 py-2 text-sm font-bold text-[#b60f17]">+ Add subject + teacher</button>
                  <span className="text-xs text-slate-500">Each added assignment appears in the same period on the public timetable.</span>
                </div>
              </article>
            )) : null}
            {!periodLoading && !groups.length ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <p className="text-sm font-semibold text-slate-700">Add the first subject and teacher for this period.</p>
                <button type="button" onClick={() => { setGroups([emptyGroup(1)]); setDirty(true); }} className="mt-3 rounded-lg bg-[#b60f17] px-4 py-2 text-sm font-bold text-white">+ Add subject + teacher</button>
              </div>
            ) : null}
          </section>

          <section className="flex flex-wrap items-center gap-3 rounded-xl border border-[#f2ddc5] bg-white p-4 shadow-sm">
            <label className="text-sm font-bold text-slate-700">Copy this day to
              <select value={copyClassId || classId} onChange={(event) => setCopyClassId(event.target.value)} className="ml-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                {options.classes.filter((item) => item.academic_year === academicYear).map((item) => <option key={item.id} value={item.id}>{item.display_name}</option>)}
              </select>
              <select value={copyDay} onChange={(event) => setCopyDay(event.target.value)} className="ml-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="">Select day…</option>
                {options.days.filter((item) => item !== day).map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <button type="button" disabled={saving || dirty || !classId || !copyDay} onClick={() => void copySchedule(copyClassId || classId, copyDay)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold disabled:opacity-50">Copy day</button>
            <span className="text-xs text-slate-500">The target day is replaced in the draft; conflicts are checked first.</span>
          </section>

          <section className="flex flex-wrap items-center gap-3 rounded-xl border border-[#f2ddc5] bg-white p-4 shadow-sm">
            <label className="text-sm font-bold text-slate-700">Restore a previous version
              <select defaultValue="" onChange={(event) => void restoreVersion(event.target.value)} className="ml-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="">Choose version…</option>
                {options.versions.filter((version) => version.status === "ARCHIVED").map((version) => <option key={version.id} value={version.id}>{version.name} · {version.status}</option>)}
              </select>
            </label>
            <span className="text-xs text-slate-500">Restoring creates a new editable draft; published history remains unchanged.</span>
          </section>
            </div>
          </details>
        </>
      ) : null}

      {slotDraft && options ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <form
            onSubmit={(event) => { event.preventDefault(); void saveSlot(); }}
            className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b60f17]">{slotDraft.mode === "edit" ? "Edit assignment" : "Add assignment"}</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">{slotDraft.day} · Period {slotDraft.periodNumber}</h2>
                <p className="mt-1 text-xs text-slate-500">{slotDraft.mode === "edit" ? "Updates this teacher only. Other cards in the period stay as they are." : "Adds another teacher to this period without replacing the ones already there."}</p>
              </div>
              <button type="button" onClick={() => setSlotDraft(null)} className="text-2xl font-bold text-slate-400" aria-label="Close">×</button>
            </div>
            <label className="block text-sm font-bold text-slate-700">Subject
              <select required value={slotDraft.subjectId} onChange={(event) => setSlotDraft({ ...slotDraft, subjectId: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="">Select subject</option>
                {options.subjects.filter((item) => item.status !== "INACTIVE").map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-bold text-slate-700">Teacher
              <select required value={slotDraft.teacherId} onChange={(event) => setSlotDraft({ ...slotDraft, teacherId: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="">Select teacher</option>
                {activeTeachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.short_name || teacher.name}</option>)}
              </select>
            </label>
            <label className="block text-sm font-bold text-slate-700">Classroom <span className="font-normal text-slate-400">(optional)</span>
              <select value={slotDraft.roomId} onChange={(event) => setSlotDraft({ ...slotDraft, roomId: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="">Unassigned</option>
                {activeRooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setSlotDraft(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Cancel</button>
              <button disabled={saving} type="submit" className="rounded-lg bg-[#b60f17] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving..." : slotDraft.mode === "edit" ? "Update entry" : "Add teacher"}</button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
