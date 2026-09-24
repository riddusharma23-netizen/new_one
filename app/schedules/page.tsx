"use client";

import { useEffect, useMemo, useState } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const PERIODS = [1, 2, 3, 4, 5, 6];

type Schedule = {
  id: number;
  day_of_week: (typeof DAYS)[number];
  period_number: number;
  start_time: string;
  end_time: string;
  room: string | null;
  academic_year: string;
  teacher_name: string;
  subject_name: string;
  class_label: string;
};

type ApiResponse<T> = { success: boolean; message: string; data?: T };

function timeLabel(value: string) {
  return value.slice(0, 5);
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [academicYear, setAcademicYear] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (academicYear) params.set("academic_year", academicYear);
    void fetch(`/api/schedules?${params.toString()}`)
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<Schedule[]>;
        if (!response.ok || payload.success === false) throw new Error(payload.message);
        setSchedules(payload.data ?? []);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load schedules."))
      .finally(() => setLoading(false));
  }, [academicYear]);

  const classes = useMemo(() => [...new Set(schedules.map((item) => item.class_label))].sort(), [schedules]);
  const teachers = useMemo(() => [...new Set(schedules.map((item) => item.teacher_name))].sort(), [schedules]);
  const filtered = schedules.filter((item) =>
    (!classFilter || item.class_label === classFilter) &&
    (!teacherFilter || item.teacher_name === teacherFilter)
  );
  const cell = (day: string, period: number) => filtered.find(
    (item) => item.day_of_week === day && item.period_number === period
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl bg-[#B70F17] px-6 py-10 text-white shadow-xl md:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-100">Academic planning</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Weekly timetable</h1>
          <p className="mt-3 max-w-2xl text-red-100">View the current class and teacher schedule published by the school administration.</p>
        </header>

        <section className="mb-6 grid gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-3">
          <label className="text-sm font-semibold text-slate-700">
            Academic year
            <input value={academicYear} onChange={(event) => setAcademicYear(event.target.value)} placeholder="e.g. 2025-26" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Class
            <select value={classFilter} onChange={(event) => setClassFilter(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal">
              <option value="">All classes</option>
              {classes.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Teacher
            <select value={teacherFilter} onChange={(event) => setTeacherFilter(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal">
              <option value="">All teachers</option>
              {teachers.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        </section>

        <section className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {loading ? <p className="p-8 text-slate-600">Loading...</p> : error ? <p className="p-8 text-red-600">{error}</p> : filtered.length === 0 ? <p className="p-8 text-slate-600">No records found.</p> : (
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="sticky left-0 bg-slate-100 px-4 py-4">Period</th>
                  {DAYS.map((day) => <th key={day} className="px-4 py-4">{day}</th>)}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period) => (
                  <tr key={period} className="border-t border-slate-200 align-top">
                    <th className="sticky left-0 bg-white px-4 py-4 font-bold text-slate-900">Period {period}</th>
                    {DAYS.map((day) => {
                      const item = cell(day, period);
                      return <td key={day} className="min-w-32 px-4 py-4">{item ? <div className="rounded-xl bg-red-50 p-3"><p className="font-bold text-[#B70F17]">{item.subject_name}</p><p className="mt-1 text-xs text-slate-600">{item.class_label} - {item.teacher_name}</p><p className="mt-1 text-xs text-slate-500">{timeLabel(item.start_time)} - {timeLabel(item.end_time)}{item.room ? ` - Room ${item.room}` : ""}</p></div> : <span className="text-slate-400">Free</span>}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
