"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DashboardData = {
  totals: {
    students: number;
    teachers: number;
    classes: number;
    subjects: number;
    gallery: number;
    blogs: number;
  };
  upcomingEvents: Array<{ id: number; title: string; event_date: string; location: string }>; 
  todaySchedule: Array<{ id: number; period_number: number; start_time: string; end_time: string; room: string; teacher_name: string; subject_name: string; class_label: string }>;
  recentActivity: Array<{ id: number; action: string; entity: string; message: string; created_at: string }>;
  today: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/admin/stats", { cache: "no-store" });
        const payload = (await response.json()) as { success?: boolean; message?: string; data?: DashboardData };

        if (!response.ok || payload.success === false) {
          if (response.status === 401) {
            router.push("/admin/login");
            return;
          }
          setError(payload.message || "Unable to load dashboard");
          return;
        }

        setData(payload.data || null);
      } catch {
        setError("Unable to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-lg font-semibold text-slate-700">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center text-red-600">{error}</div>;
  }

  if (!data) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">No records found.</div>;
  }

  const cards = [
    { label: "Students", value: data.totals.students },
    { label: "Teachers", value: data.totals.teachers },
    { label: "Classes", value: data.totals.classes },
    { label: "Subjects", value: data.totals.subjects },
    { label: "Gallery", value: data.totals.gallery },
    { label: "Blogs", value: data.totals.blogs },
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B60F17]">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Dashboard</h1>
          </div>
          <p className="text-sm font-semibold text-slate-500">Manage school content from the sidebar.</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-4 text-3xl font-black text-slate-900">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Upcoming Events</h2>
            <div className="mt-4 space-y-3">
              {data.upcomingEvents.length ? data.upcomingEvents.map((event) => (
                <div key={event.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">{event.title}</p>
                  <p className="text-sm text-slate-600">{event.event_date} • {event.location}</p>
                </div>
              )) : <p className="text-sm text-slate-500">No upcoming events.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Today&apos;s Schedule</h2>
            <div className="mt-4 space-y-3">
              {data.todaySchedule.length ? data.todaySchedule.map((slot) => (
                <div key={slot.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">Period {slot.period_number}: {slot.subject_name}</p>
                  <p className="text-sm text-slate-600">{slot.class_label} • {slot.teacher_name} • {slot.start_time} - {slot.end_time} • Room {slot.room}</p>
                </div>
              )) : <p className="text-sm text-slate-500">No classes scheduled for {data.today}.</p>}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Recent activity</h2>
          <div className="mt-4 space-y-3">
            {data.recentActivity.length ? data.recentActivity.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex justify-between gap-4">
                  <p className="font-semibold text-slate-900">{item.action} • {item.entity}</p>
                  <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.message}</p>
              </div>
            )) : <p className="text-sm text-slate-500">No recent activity.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
