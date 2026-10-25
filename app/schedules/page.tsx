"use client";

import { useEffect, useState } from "react";
import { BookOpen, Coffee, Clock3 } from "lucide-react";
import TimetableBoard from "@/components/TimetableBoard";
import type { MasterScheduleData } from "@/lib/schedule-master";

type ApiResponse<T> = { success: boolean; message: string; data?: T };
const DEFAULT_YEAR = "2025-26";

export default function SchedulesPage() {
  const [data, setData] = useState<MasterScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/schedules/master?academic_year=${encodeURIComponent(DEFAULT_YEAR)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as ApiResponse<MasterScheduleData>;
        if (!response.ok || !payload.success) throw new Error(payload.message || "Unable to load timetable.");
        setData(payload.data ?? null);
      })
      .catch((reason: unknown) => {
        if (!(reason instanceof Error && reason.name === "AbortError")) {
          setError(reason instanceof Error ? reason.message : "Unable to load timetable.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const classNames = [...new Set((data?.classes ?? []).map((classRow) => classRow.display_name.split("-")[0]))];
  const classRange = classNames.length ? `Classes (${classNames[0]}–${classNames.at(-1)})` : "All Classes";

  return (
    <main className="min-h-screen bg-[#fffaf5] pb-8 text-[#542b24]">
      <header className="bg-[linear-gradient(112deg,#951c12,#b60f17,#df5b00)] px-4 py-3.5 text-white shadow-lg sm:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <BookOpen size={42} strokeWidth={2} aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-extrabold leading-none tracking-tight sm:text-3xl">School Timetable</h1>
              <p className="mt-1 text-xs text-orange-100 sm:text-sm">Weekly Class Schedule | {classRange}</p>
            </div>
          </div>
          <p className="hidden text-xs font-medium tracking-wide text-orange-100 sm:block">Learn <span className="px-1">•</span> Grow <span className="px-1">•</span> Succeed</p>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1500px] px-4 pt-3 sm:px-8">
        {loading ? <div className="rounded-lg border border-[#f2ddc5] bg-white p-8 text-center text-sm shadow-sm">Loading timetable…</div> : null}
        {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</div> : null}

        {!loading && !error && data?.classes.length ? (
          <>
            <TimetableBoard data={data} />
            <section className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-lg border border-[#f2ddc5] bg-white p-3">
                <Clock3 className="mt-0.5 shrink-0 text-[#b60f17]" size={20} aria-hidden="true" />
                <div><h3 className="text-xs font-extrabold">Weekly schedule</h3><p className="mt-1 text-[11px] text-[#80594d]">Select a class above to see its complete weekly timetable.</p></div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-[#f2ddc5] bg-white p-3">
                <BookOpen className="mt-0.5 shrink-0 text-[#b60f17]" size={20} aria-hidden="true" />
                <div><h3 className="text-xs font-extrabold">Subject & teacher</h3><p className="mt-1 text-[11px] text-[#80594d]">Each period shows the subject and its assigned teacher.</p></div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-[#f2ddc5] bg-white p-3">
                <Coffee className="mt-0.5 shrink-0 text-[#b60f17]" size={20} aria-hidden="true" />
                <div><h3 className="text-xs font-extrabold">Breaks included</h3><p className="mt-1 text-[11px] text-[#80594d]">Prayer, break and lunch timings are shown above the timetable.</p></div>
              </div>
            </section>
            <p className="mt-3 text-center text-[11px] text-[#80594d]">Timetable is updated by the school administration. Please check with your class teacher for changes.</p>
          </>
        ) : null}

        {!loading && !error && (!data || !data.classes.length) ? (
          <div className="rounded-lg border border-[#f2ddc5] bg-white p-8 text-center text-sm text-[#80594d]">No timetable has been published for this academic year.</div>
        ) : null}
      </section>
    </main>
  );
}
