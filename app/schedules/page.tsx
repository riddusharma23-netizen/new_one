"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import PublicTimetableBoard from "@/components/PublicTimetableBoard";
import { SCHOOL_NAME, isTimetableGrade, type MasterScheduleData } from "@/lib/schedule-master";

type ApiResponse<T> = { success: boolean; message: string; data?: T };
const DEFAULT_YEAR = "2025-26";

export default function SchedulesPage() {
  const [data, setData] = useState<MasterScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let requestPending = false;
    const loadTimetable = async (showLoading = false) => {
      if (requestPending) return;
      requestPending = true;
      if (showLoading) setLoading(true);
      try {
        const response = await fetch(`/api/schedules/master?academic_year=${encodeURIComponent(DEFAULT_YEAR)}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const payload = await response.json() as ApiResponse<MasterScheduleData>;
        if (!response.ok || !payload.success) throw new Error(payload.message || "Unable to load timetable.");
        setData(payload.data ?? null);
        setError("");
      } catch (reason) {
        if (!(reason instanceof Error && reason.name === "AbortError")) {
          setError(reason instanceof Error ? reason.message : "Unable to load timetable.");
        }
      } finally {
        requestPending = false;
        if (showLoading && !controller.signal.aborted) setLoading(false);
      }
    };

    void loadTimetable(true);
    const refreshTimer = window.setInterval(() => void loadTimetable(), 15_000);
    return () => {
      window.clearInterval(refreshTimer);
      controller.abort();
    };
  }, [refreshKey]);

  const hasGradeClasses = (data?.classes ?? []).some(isTimetableGrade);

  return (
    <main className="min-h-screen bg-[#fffaf5] pb-8 text-[#542b24]">
      <header className="bg-[linear-gradient(112deg,#951c12,#b60f17,#df5b00)] px-4 py-3.5 text-white shadow-lg sm:px-8">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <BookOpen size={42} strokeWidth={2} aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-extrabold leading-none tracking-tight sm:text-3xl">School Timetable</h1>
              <p className="mt-1 text-xs text-orange-100 sm:text-sm">{SCHOOL_NAME} · Classes 6–12</p>
            </div>
          </div>
          <p className="hidden text-xs font-medium tracking-wide text-orange-100 sm:block">Learn <span className="px-1">•</span> Grow <span className="px-1">•</span> Succeed</p>
        </div>
      </header>

      <section className="w-full px-3 pt-3 sm:px-5 lg:px-7">
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError("");
              setRefreshKey((current) => current + 1);
            }}
            disabled={loading}
            className="rounded-lg border border-[#f1d8c6] bg-white px-3 py-2 text-xs font-bold text-[#694237] shadow-sm hover:bg-[#fff5eb] disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Refreshing…" : "Refresh timetable"}
          </button>
        </div>
        {loading ? <div className="rounded-lg border border-[#f2ddc5] bg-white p-8 text-center text-sm shadow-sm">Loading timetable…</div> : null}
        {error ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</div> : null}

        {!loading && !error && data?.classes.length ? (
          <PublicTimetableBoard data={data} />
        ) : null}

        {!loading && !error && !hasGradeClasses ? (
          <div className="rounded-lg border border-[#f2ddc5] bg-white p-8 text-center text-sm text-[#80594d]">No timetable is available for classes 6–12 yet. Ask school administration to configure these classes.</div>
        ) : null}
      </section>
    </main>
  );
}
