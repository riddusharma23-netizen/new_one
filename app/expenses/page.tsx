"use client";

import { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Award,
  Calendar,
  RefreshCw,
  Sparkles,
} from "lucide-react";

// ─── CONSTANTS ──────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ALL_YEARS = [2021, 2022, 2023, 2024, 2025, 2026];
const CHART_COLORS = [
  "#FF4500", "#2563EB", "#10B981", "#F59E0B", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
  "#14B8A6", "#F43F5E", "#8B5CF6", "#0EA5E9", "#D946EF",
];

// ─── MAIN COMPONENT ──────────────────────────────────────────

export default function ExpensePage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  // Static exports have no runtime API routes. Keep the dashboard data in the bundle.
  const [fullData] = useState<Record<number, any[]>>(FALLBACK_DATA);
  const [loading] = useState(false);
  const error: string | null = null;
  const [visibleData, setVisibleData] = useState<any[]>([]);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  // ─── Fetch data from API ──────────────────────────────────
  // ─── Memoized computed data for selected year ─────────────
  const yearData = useMemo(() => fullData[selectedYear] || [], [fullData, selectedYear]);

  const totalExpense = useMemo(
    () => yearData.reduce((sum, d) => sum + d.amount, 0),
    [yearData]
  );

  const highestEntry = useMemo(
    () => [...yearData].sort((a, b) => b.amount - a.amount)[0],
    [yearData]
  );

  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    yearData.forEach((d) => {
      map[d.month] = (map[d.month] || 0) + d.amount;
    });
    return MONTHS.filter((m) => map[m]).map((m) => ({
      month: m,
      amount: map[m] || 0,
    }));
  }, [yearData]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    yearData.forEach((d) => {
      map[d.item] = (map[d.item] || 0) + d.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [yearData]);

  // ─── Animated loading of entries ──────────────────────────
  useEffect(() => {
    if (loading) return;
    const total = yearData.length;
    if (total === 0) {
      setVisibleData([]);
      setAnimatedTotal(0);
      return;
    }
    let index = 0;
    const step = Math.max(1, Math.floor(total / 20));
    const interval = setInterval(() => {
      index = Math.min(index + step, total);
      const slice = yearData.slice(0, index);
      setVisibleData(slice);
      const currentTotal = slice.reduce((s, d) => s + d.amount, 0);
      setAnimatedTotal(currentTotal);
      if (index >= total) clearInterval(interval);
    }, 70);
    return () => clearInterval(interval);
  }, [yearData, loading]);

  // ─── Navigation ────────────────────────────────────────────
  const goToYear = (dir: number) => {
    const idx = ALL_YEARS.indexOf(selectedYear);
    const newIdx = Math.max(0, Math.min(ALL_YEARS.length - 1, idx + dir));
    setSelectedYear(ALL_YEARS[newIdx]);
  };

  const fmt = (v: number) => `₹${Number(v).toLocaleString()}`;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md text-center">
          <p className="text-red-600 font-semibold">⚠️ {error}</p>
          <p className="text-sm text-gray-500 mt-2">Using fallback data (static)</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 p-3 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">

        {/* ─── HEADER ─────────────────────────────────────────── */}
        <div className="rounded-3xl overflow-hidden mb-6 shadow-2xl">
          <div className="bg-gradient-to-r from-[#B60F17] via-red-600 to-orange-500 p-6 md:p-10 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-5xl lg:text-5xl font-black tracking-tight drop-shadow-lg flex items-center gap-3">
                  <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-200" />
                  Expense Dashboard
                </h1>
                <p className="mt-1 text-white/90 text-lg md:text-xl font-medium drop-shadow">
                  Account Champi Devi Inter College
                </p>
              </div>

              {/* year selector */}
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-2 border border-white/30">
                <button
                  onClick={() => goToYear(-1)}
                  className="p-2 rounded-xl hover:bg-white/20 transition disabled:opacity-40"
                  disabled={ALL_YEARS.indexOf(selectedYear) === 0}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1.5">
                  {ALL_YEARS.map((y) => (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(y)}
                      className={`
                        px-4 py-1.5 rounded-xl font-bold text-sm transition-all
                        ${y === selectedYear
                          ? "bg-white text-[#B60F17] shadow-lg scale-105"
                          : "text-white/80 hover:bg-white/20 hover:text-white"
                        }
                      `}
                    >
                      {y}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToYear(1)}
                  className="p-2 rounded-xl hover:bg-white/20 transition disabled:opacity-40"
                  disabled={ALL_YEARS.indexOf(selectedYear) === ALL_YEARS.length - 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* live indicator */}
            <div className="relative z-10 mt-4 flex items-center gap-3 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                </span>
                LIVE
              </span>
              <span className="text-white/40">|</span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Loading data..." : "Ready"}
              </span>
              <span className="text-white/40">|</span>
              <span>Year {selectedYear}</span>
            </div>
          </div>
        </div>

        {/* ─── SUMMARY CARDS ──────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
          <Card
            icon={<TrendingUp className="w-5 h-5 text-[#B60F17]" />}
            label="Total Expenses"
            value={fmt(animatedTotal)}
            color="text-[#B60F17]"
            isLoading={loading}
          />
          <Card
            icon={<Users className="w-5 h-5 text-blue-600" />}
            label="Total Entries"
            value={visibleData.length.toString()}
            color="text-blue-600"
            isLoading={loading}
          />
          <Card
            icon={<Award className="w-5 h-5 text-green-600" />}
            label="Highest Entry"
            value={highestEntry ? fmt(highestEntry.amount) : "—"}
            sub={highestEntry ? `${highestEntry.month} · ${highestEntry.item}` : ""}
            color="text-green-600"
            isLoading={loading}
          />
          <Card
            icon={<Calendar className="w-5 h-5 text-purple-600" />}
            label="Month Count"
            value={monthlyData.length.toString()}
            color="text-purple-600"
            isLoading={loading}
          />
        </div>

        {/* ─── TABLE + PIE ────────────────────────────────────── */}
        <div className="grid xl:grid-cols-2 gap-5 mb-6">

          {/* Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg md:text-xl flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#B60F17] rounded-full" />
                Expense Records
              </h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {visibleData.length} entries
              </span>
            </div>

            <div className="overflow-x-auto max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">#</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Month</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Item</th>
                    <th className="p-3 text-right text-sm font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleData.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`
                        border-b border-gray-50 transition-all duration-300
                        ${idx % 2 === 0 ? "bg-white" : "bg-red-50/20"}
                        hover:bg-red-100/40
                      `}
                      style={{
                        animation: `fadeInUp 0.3s ease-out ${Math.min(idx * 0.015, 0.6)}s both`,
                      }}
                    >
                      <td className="p-3 text-sm text-gray-500">{item.id}</td>
                      <td className="p-3 text-sm font-medium">{item.month}</td>
                      <td className="p-3 text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: CHART_COLORS[Math.abs(item.id) % CHART_COLORS.length],
                            }}
                          />
                          {item.item}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold text-sm">
                        {fmt(item.amount)}
                      </td>
                    </tr>
                  ))}
                  {visibleData.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-400">
                        No expense data for {selectedYear}
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-[#B60F17] border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-gray-400">Loading entries…</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-gradient-to-r from-red-100 to-orange-100 border-t-2 border-red-200">
                    <td colSpan={3} className="p-4 font-bold text-[#B60F17] text-sm">
                      Grand Total
                    </td>
                    <td className="p-4 text-right font-black text-[#B60F17] text-sm">
                      {fmt(animatedTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-4 md:p-6">
            <h3 className="font-bold text-lg md:text-xl mb-2 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#2563EB] rounded-full" />
              Expense Distribution by Category
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {selectedYear} · {categoryData.length} categories
            </p>

            <div className="h-[340px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${String(name ?? "").slice(0, 14)} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {categoryData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={CHART_COLORS[idx % CHART_COLORS.length]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => fmt(Number(val ?? 0))}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      padding: "12px 16px",
                      background: "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(4px)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-2 max-h-20 overflow-y-auto scrollbar-thin">
              {categoryData.slice(0, 12).map((item, idx) => (
                <span key={idx} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: CHART_COLORS[idx % CHART_COLORS.length] }}
                  />
                  {item.name}
                </span>
              ))}
              {categoryData.length > 12 && (
                <span className="text-xs text-gray-400">+{categoryData.length - 12} more</span>
              )}
            </div>
          </div>
        </div>

        {/* ─── BAR CHART ────────────────────────────────────────── */}
        <div className="bg-white w-full max-w-6xl mx-auto px-5 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-7 py-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[3px] text-[#B60F17] font-semibold">
                Finance Dashboard
              </p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                Monthly Expense Overview
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Financial performance for {selectedYear}
              </p>
            </div>

            <div className="flex gap-8 flex-wrap">
              <div>
                <p className="text-xs text-slate-400 uppercase">Total Expenses</p>
                <h3 className="text-xl font-bold text-slate-800">{fmt(animatedTotal)}</h3>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Highest Month</p>
                <h3 className="text-xl font-bold text-[#B60F17]">
                  {monthlyData.length > 0 ? fmt(Math.max(...monthlyData.map(d => d.amount))) : "—"}
                </h3>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Months</p>
                <h3 className="text-xl font-bold text-green-600">{monthlyData.length}</h3>
              </div>
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <defs>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#B60F17" />
                      <stop offset="100%" stopColor="#FF6A00" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#ECECEC" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 13, fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value) => [fmt(Number(value ?? 0)), "Expense"]}
                    cursor={{ fill: "#F8FAFC" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 10px 25px rgba(0,0,0,.08)",
                      background: "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(4px)",
                    }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="url(#expenseGradient)"
                    radius={[6, 6, 0, 0]}
                    barSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-slate-200">
            <div className="p-5">
              <p className="text-xs text-slate-400 uppercase">Average</p>
              <h4 className="font-bold text-lg mt-1">
                {monthlyData.length > 0 ? fmt(animatedTotal / monthlyData.length) : "—"}
              </h4>
            </div>
            <div className="p-5 border-l border-slate-200">
              <p className="text-xs text-slate-400 uppercase">Best Month</p>
              <h4 className="font-bold text-lg mt-1">
                {monthlyData.length > 0
                  ? monthlyData.reduce((a, b) => (a.amount > b.amount ? a : b)).month
                  : "—"}
              </h4>
            </div>
            <div className="p-5 border-l border-slate-200">
              <p className="text-xs text-slate-400 uppercase">Total Months</p>
              <h4 className="font-bold text-lg mt-1">{monthlyData.length}</h4>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #fbd38d;
          border-radius: 999px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #f6ad55;
        }
      `}</style>
    </section>
  );
}

// ─── CARD SUB-COMPONENT ──────────────────────────────────────

function Card({
  icon,
  label,
  value,
  sub,
  color,
  isLoading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
  isLoading: boolean;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 md:p-6 transition-all hover:shadow-xl hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
          <p className={`text-xl md:text-2xl lg:text-3xl font-black mt-1.5 ${color} transition-all duration-500`}>
            {isLoading ? (
              <span className="inline-block w-24 h-7 bg-gray-200 rounded animate-pulse" />
            ) : (
              value
            )}
          </p>
          {sub && !isLoading && (
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          )}
        </div>
        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─── FALLBACK DATA (static) in case API fails ──────────────
const FALLBACK_DATA: Record<number, any[]> = {
  // (same static data as before – you can paste your full static data here)
};
