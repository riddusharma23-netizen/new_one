"use client";

import { useState, useMemo } from "react";
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
import { ChevronLeft, ChevronRight, TrendingUp, Award, RefreshCw, Sparkles, Stethoscope, Pill } from "lucide-react";

interface ClinicRecord {
    id: number;
    year: number;
    month: string;
    type: "Clinic Income" | "Expenses" | "Doctors Fees";
    amount: number;
}

// ─── DATA GENERATION (2021-2026) ─────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

// Base amounts for each year (increases over time)
const BASE_AMOUNTS = {
    "2021": { clinicIncome: 180000, expenses: 90000 ,  doctorFees: 70000,},
    "2022": { clinicIncome: 210000, expenses: 105000  , doctorFees: 70000,},
    "2023": { clinicIncome: 245000, expenses: 120000, doctorFees: 70000, },
    "2024": { clinicIncome: 280000, expenses: 138000 , doctorFees: 70000,},
    "2025": { clinicIncome: 320000, expenses: 155000 , doctorFees: 70000,},
    "2026": { clinicIncome: 360000, expenses: 175000 , doctorFees: 70000,},
};

// Generate data for a specific year
function generateYearData(year: number): ClinicRecord[] {
    const base = BASE_AMOUNTS[String(year) as keyof typeof BASE_AMOUNTS];
    const entries: ClinicRecord[] = [];
    let id = 1;

    MONTHS.forEach((month, mi) => {
        // Seasonal variation
        let seasonal = 1;
        if (mi >= 4 && mi <= 7) seasonal = 1.4 + Math.random() * 0.4; // Higher in May-Aug
        else if (mi >= 8 && mi <= 10) seasonal = 0.9 + Math.random() * 0.2;
        else seasonal = 0.6 + Math.random() * 0.3;

        // Monthly variation
        const variation = 0.85 + Math.random() * 0.3;

        // Calculate monthly amounts
        const monthlyClinicIncome = Math.round((base.clinicIncome / 12) * seasonal * variation);
        const monthlyExpenses = Math.round((base.expenses / 12) * seasonal * variation);
const monthlyDoctorFees = Math.round(
  (base.doctorFees / 12) * seasonal * variation
);
        // Add Clinic Income
        entries.push({
            id: id++,
            year,
            month,
            type: "Clinic Income",
            amount: monthlyClinicIncome,
        });

        // Add Expenses
        entries.push({
            id: id++,
            year,
            month,
            type: "Expenses",
            amount: monthlyExpenses,
        });

    entries.push({
  id: id++,
  year,
  month,
  type: "Doctors Fees",
  amount: monthlyDoctorFees,
});
    });

    return entries;
}

// Generate data for all years
const ALL_DATA: Record<number, ClinicRecord[]> = {};
YEARS.forEach((y) => {
    ALL_DATA[y] = generateYearData(y);
});

// ************ COLOR PALETTE ****************************************

const CHART_COLORS = [
    "#FF4500",
    "#2563EB",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
];

const TYPE_COLORS = {
    "Clinic Income": "#FF4500",
    "Expenses": "#2563EB",
};

// ************ COMPONENT ************************************************************

export default function ClinicIncomePage() {
    const [selectedYear, setSelectedYear] = useState(2025);
    const [activeTab, setActiveTab] = useState<"all" | "income" | "expenses">("all");

    const yearData = useMemo(() => 
        ALL_DATA[selectedYear] || [],
        [selectedYear]
    );

    // Filter data based on active tab
    const filteredData = useMemo(() => {
        if (activeTab === "all") return yearData;
        if (activeTab === "income") return yearData.filter(d => d.type === "Clinic Income");
        if (activeTab === "expenses") return yearData.filter(d => d.type === "Expenses");
        return yearData;
    }, [yearData, activeTab]);

    const totalIncome = useMemo(
        () => filteredData.reduce((sum, d) => sum + d.amount, 0),
        [filteredData]
    );

    // Totals by type
    const typeTotals = useMemo(() => {
        const map: Record<string, number> = {};
        yearData.forEach((d) => {
            map[d.type] = (map[d.type] || 0) + d.amount;
        });
        return map;
    }, [yearData]);

    const highestEntry = useMemo(
        () => [...filteredData].sort((a, b) => b.amount - a.amount)[0],
        [filteredData]
    );

    const monthlyData = useMemo(() => {
        const map: Record<string, number> = {};
        filteredData.forEach((d) => {
            const shortMonth = d.month.slice(0, 3);
            map[shortMonth] = (map[shortMonth] || 0) + d.amount;
        });
        return MONTHS.filter((m) => map[m]).map((m) => ({
            month: m,
            amount: map[m] || 0,
        }));
    }, [filteredData]);

    const typeData = useMemo(() => {
        const map: Record<string, number> = {};
        filteredData.forEach((d) => {
            map[d.type] = (map[d.type] || 0) + d.amount;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [filteredData]);

    const isLoading = false;
    const progress = 100;
    const visibleData = filteredData;
    const animatedTotal = totalIncome;

    // ─── YEAR NAVIGATION ─────────────────────────────────────────────────

    const goToYear = (dir: number) => {
        const idx = YEARS.indexOf(selectedYear);
        const newIdx = Math.max(0, Math.min(YEARS.length - 1, idx + dir));
        setSelectedYear(YEARS[newIdx]);
    };

    // ─── RENDER *************************************************************************************

    return (
        <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 p-3 md:p-6 lg:p-8">
            <div className="max-w-[1600px] mx-auto">

                {/* heade ************************************************************/}

                <div className="rounded-3xl overflow-hidden mb-6 shadow-2xl">
                    <div className="bg-gradient-to-r from-[#FF4500] via-orange-500 to-yellow-400 p-6 md:p-10 text-white relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-5xl lg:text-5xl font-black tracking-tight drop-shadow-lg flex items-center gap-3">
                                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-200" />
                                    Clinic Income Dashboard
                                </h1>
                                <p className="mt-1 text-white/90 text-lg md:text-xl font-medium drop-shadow">
                                    Champi Devi Inter College · Clinic
                                </p>
                            </div>

                            {/* year selector */}
                            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-2 border border-white/30">
                                <button
                                    onClick={() => goToYear(-1)}
                                    className="p-2 rounded-xl hover:bg-white/20 transition disabled:opacity-40"
                                    disabled={YEARS.indexOf(selectedYear) === 0}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex gap-1.5">
                                    {YEARS.map((y) => (
                                        <button
                                            key={y}
                                            onClick={() => setSelectedYear(y)}
                                            className={`
                                                px-4 py-1.5 rounded-xl font-bold text-sm transition-all
                                                ${y === selectedYear
                                                    ? "bg-white text-[#B70F17] shadow-lg scale-105"
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
                                    disabled={YEARS.indexOf(selectedYear) === YEARS.length - 1}
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
                                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                                {isLoading ? `Loading ${progress}%` : "Ready"}
                            </span>
                            <span className="text-white/40">|</span>
                            <span>Year {selectedYear}</span>
                        </div>
                    </div>
                </div>

                {/* ─── SUMMARY CARDS  ******************************************************************* */}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">

                    <Card
                        icon={<TrendingUp className="w-5 h-5 text-[#B70F17]" />}
                        label="Total Income"
                        value={`₹${animatedTotal.toLocaleString()}`}
                        color="text-[#FF4500]"
                        isLoading={isLoading}
                    />

                    <Card
                        icon={<Stethoscope className="w-5 h-5 text-green-600" />}
                        label="Clinic Income"
                        value={`₹${(typeTotals["Clinic Income"] || 0).toLocaleString()}`}
                        color="text-[#FF4500]"
                        isLoading={isLoading}
                    />

                    <Card
                        icon={<Pill className="w-5 h-5 text-blue-600" />}
                        label="Expenses"
                        value={`₹${(typeTotals["Expenses"] || 0).toLocaleString()}`}
                        color="text-blue-600"
                        isLoading={isLoading}
                    />

                    <Card
                        icon={<Award className="w-5 h-5 text-purple-600" />}
                        label="Highest Entry"
                        value={highestEntry ? `₹${highestEntry.amount.toLocaleString()}` : "—"}
                        sub={highestEntry ? `${highestEntry.month} · ${highestEntry.type}` : ""}
                        color="text-purple-600"
                        isLoading={isLoading}
                    />

                </div>

                {/* ─── TAB BUTTONS ************************************************************ */}

                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                            activeTab === "all"
                                ? "bg-[#FF4500] text-white shadow-lg"
                                : "bg-white/80 text-gray-600 hover:bg-orange-50"
                        }`}
                    >
                        All Records
                    </button>
                    <button
                        onClick={() => setActiveTab("income")}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                            activeTab === "income"
                                ? "bg-[#FF4500] text-white shadow-lg"
                                : "bg-white/80 text-gray-600 hover:bg-orange-50"
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4" />
                            Clinic Income
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("expenses")}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                            activeTab === "expenses"
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-white/80 text-gray-600 hover:bg-blue-50"
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Pill className="w-4 h-4" />
                            Expenses
                        </span>
                    </button>
                </div>

                {/* ─── TABLE + PIE ************************************ */}

                <div className="grid xl:grid-cols-2 gap-5 mb-6">

                    {/* Table */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                        <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg md:text-xl flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-[#B70F17] rounded-full" />
                                {activeTab === "all" ? "All Records" : 
                                 activeTab === "income" ? "Clinic Income Records" : "Expenses Records"}
                            </h3>
                            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                {visibleData.length} entries
                            </span>
                        </div>

                        <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
                            <table className="w-full">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-200">
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600">#</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600">Month</th>
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600">Type</th>
                                        <th className="p-3 text-right text-sm font-semibold text-gray-600">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleData.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            className={`
                                                border-b border-gray-50 transition-all duration-300
                                                ${idx % 2 === 0 ? "bg-white" : "bg-orange-50/30"}
                                                hover:bg-orange-100/50
                                            `}
                                            style={{
                                                animation: `fadeInUp 0.3s ease-out ${idx * 0.02}s both`,
                                            }}
                                        >
                                            <td className="p-3 text-sm text-gray-500">{idx + 1}</td>
                                            <td className="p-3 text-sm font-medium">{item.month}</td>
                                            <td className="p-3 text-sm">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <span
                                                        className="w-2 h-2 rounded-full"
                                                        style={{
                                                            background: TYPE_COLORS[item.type as keyof typeof TYPE_COLORS] || "#999",
                                                        }}
                                                    />
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right font-semibold text-sm">
                                                ₹{item.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {visibleData.length === 0 && !isLoading && (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-gray-400">
                                                No data available for {selectedYear}
                                            </td>
                                        </tr>
                                    )}
                                    {isLoading && (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-[#B70F17] border-t-transparent rounded-full animate-spin" />
                                                    <span className="text-sm text-gray-400">Loading entries… {progress}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gradient-to-r from-orange-100 to-amber-100 border-t-2 border-orange-200">
                                        <td colSpan={3} className="p-4 font-bold text-[#B70F17] text-sm">
                                            Grand Total
                                        </td>
                                        <td className="p-4 text-right font-black text-[#B70F17] text-sm">
                                            ₹{animatedTotal.toLocaleString()}
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
                            Income Distribution by Type
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">
                            {selectedYear} · {typeData.length} categories
                        </p>

                        <div className="h-[340px] md:h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={typeData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={110}
                                        paddingAngle={2}
                                        label={({ name, percent }) =>
                                            `${String(name ?? "").slice(0, 12)} ${((percent ?? 0) * 100).toFixed(0)}%`
                                        }
                                        labelLine={false}
                                    >
                                        {typeData.map((item, idx) => (
                                            <Cell
                                                key={idx}
                                                fill={TYPE_COLORS[item.name as keyof typeof TYPE_COLORS] || CHART_COLORS[idx % CHART_COLORS.length]}
                                                stroke="white"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val) => `₹${Number(val ?? 0).toLocaleString()}`}
                                        contentStyle={{
                                            borderRadius: "16px",
                                            border: "none",
                                            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                                            padding: "12px 16px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* legend inline */}
                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                            {typeData.map((item, idx) => (
                                <span key={idx} className="flex items-center gap-1.5 text-xs">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ background: TYPE_COLORS[item.name as keyof typeof TYPE_COLORS] || CHART_COLORS[idx % CHART_COLORS.length] }}
                                    />
                                    {item.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>      

                {/* ─── BAR CHART ************************************************************************* */}

                <div className="bg-white w-full max-w-6xl mx-auto px-5 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                    {/* Header */}
                    <div className="px-7 py-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        <div>
                            <p className="text-xs uppercase tracking-[3px] text-[#B60F17] font-semibold">
                                Finance Dashboard
                            </p>

                            <h2 className="text-2xl font-bold text-slate-800 mt-1">
                                Monthly Overview
                            </h2>

                            <p className="text-slate-500 text-sm mt-1">
                                Financial performance for {selectedYear}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8">
                            <div>
                                <p className="text-xs text-slate-400 uppercase">
                                    Total
                                </p>
                                <h3 className="text-xl font-bold text-slate-800">
                                    ₹{animatedTotal.toLocaleString()}
                                </h3>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase">
                                    Highest
                                </p>
                                <h3 className="text-xl font-bold text-[#B60F17]">
                                    ₹{highestEntry ? highestEntry.amount.toLocaleString() : "0"}
                                </h3>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase">
                                    Entries
                                </p>
                                <h3 className="text-xl font-bold text-green-600">
                                    {visibleData.length}
                                </h3>
                            </div>
                        </div>

                    </div>

                    {/* Chart */}
                    <div className="px-6 py-8">
                        <div className="h-[360px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <defs>
                                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#FF6A00"/>
                                            <stop offset="100%" stopColor="#B60F17"/>
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
                                        tickFormatter={(v) => `${v/1000}K`}
                                    />

                                    <Tooltip
                                        formatter={(value) => [`₹${Number(value ?? 0).toLocaleString()}`, "Amount"]}
                                        cursor={{ fill: "#F8FAFC" }}
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: "1px solid #E2E8F0",
                                            boxShadow: "0 10px 25px rgba(0,0,0,.08)"
                                        }}
                                    />

                                    <Bar
                                        dataKey="amount"
                                        fill="url(#incomeGradient)"
                                        radius={[6,6,0,0]}
                                        barSize={36}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="grid grid-cols-3 border-t border-slate-200">
                        <div className="p-5">
                            <p className="text-xs text-slate-400 uppercase">Average</p>
                            <h4 className="font-bold text-lg mt-1">
                                ₹{monthlyData.length > 0 ? Math.round(animatedTotal / monthlyData.length).toLocaleString() : "0"}
                            </h4>
                        </div>

                        <div className="p-5 border-l border-slate-200">
                            <p className="text-xs text-slate-400 uppercase">Best Month</p>
                            <h4 className="font-bold text-lg mt-1">
                                {highestEntry ? highestEntry.month : "—"}
                            </h4>
                        </div>

                        <div className="p-5 border-l border-slate-200">
                            <p className="text-xs text-slate-400 uppercase">Total Months</p>
                            <h4 className="font-bold text-lg mt-1">{monthlyData.length}</h4>
                        </div>
                    </div>

                </div>

            </div>

            {/* ─── GLOBAL STYLES ********************** */}

            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
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

// ─── CARD SUB-COMPONENT *********************************************************************

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



