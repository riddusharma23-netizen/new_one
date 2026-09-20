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
    Search,
    Phone,
} from "lucide-react";

// ─── CONSTANTS ──────────────────────────────────────────────────────────

const ACADEMIC_YEARS = ["2020-21", "2021-22", "2022-23", "2023-24"];
const CHART_COLORS = [
    "#FF4500", "#2563EB", "#10B981", "#F59E0B", "#8B5CF6",
    "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
    "#14B8A6", "#F43F5E", "#8B5CF6", "#0EA5E9", "#D946EF",
];

// ─── FALLBACK DATA (used if API fails) ────────────────────────────────

const FALLBACK_DATA: Record<string, any[]> = {
    "2020-21": [
        { id: 1, studentName: "MUNESH KUMAR", fatherName: "SHYAM BABOO", totalTuitionFee: 7500, amountPayable: 3750,
            village: "jamon", college: "ch.c.s.s.d c iglas", class: "B.Sc. Ag", mobile: "" },
        { id: 2, studentName: "CHANDRA PRAKASH", fatherName: "MURARI LAL", totalTuitionFee: 19516, amountPayable: 9758,
            village: "jamon", college: "m.g.poly.hathras", class: "POLY. TECH", mobile: "" },
        { id: 3, studentName: "VIKASH KUMAR", fatherName: "RAMESHWAR SINGH", totalTuitionFee: 7500, amountPayable: 3750,
            village: "mahadora", college: "s.l.s.m. naujheel", class: "B.Sc", mobile: "" },
        { id: 4, studentName: "ANKUR KUMAR", fatherName: "SATISH PACHAURI", totalTuitionFee: 7000, amountPayable: 3500,
            village: "mahadora", college: "s.b.s.c mant", class: "B.Sc", mobile: "" },
        { id: 5, studentName: "ARUN KUMAR", fatherName: "RAMESHWAR DAYAL", totalTuitionFee: 67865, amountPayable: 30000,
            village: "kubra", college: "sanjay college mal", class: "B.Pharma", mobile: "" },
        { id: 6, studentName: "SHEETAL SHARMA", fatherName: "RAM BABU SHARMA", totalTuitionFee: 6000, amountPayable: 3000,
            village: "kubra", college: "s. khushi ram m v k", class: "B.A", mobile: "" },
        { id: 7, studentName: "ANJU", fatherName: "ASHOK KUMAR", totalTuitionFee: 5000, amountPayable: 2500,
            village: "mahadora", college: "b.k.m bajana matl", class: "B.A", mobile: "" },
        { id: 8, studentName: "SANDHYA", fatherName: "BRAJ LAL", totalTuitionFee: 12500, amountPayable: 6250,
            village: "jamon", college: "ch.c.s.s.d c iglas", class: "B.A", mobile: "" },
        { id: 9, studentName: "KM . VIPNEH", fatherName: "RAJENDRA SHARMA", totalTuitionFee: 9000, amountPayable: 4500,
            village: "jamon", college: "b.k.ins.&mang ray", class: "B.A", mobile: "" },
        { id: 10, studentName: "RANJEET KUMAR", fatherName: "RISHEEPAL SINGH", totalTuitionFee: 14000, amountPayable: 7000,
            village: "mahadora", college: "ch.j.s.dc matroi", class: "B.Sc", mobile: "" },
        { id: 11, studentName: "RUPESH BHARDWAJ", fatherName: "MUKESH KUMAR SHARMA", totalTuitionFee: 10000,
            amountPayable: 5000, village: "khem ka vas", college: "b.k.ins.&mang ray", class: "B.Sc", mobile: "" },
        { id: 12, studentName: "RAVI KUMAR", fatherName: "SATYAVEER SINGH", totalTuitionFee: 7000, amountPayable: 3500,
            village: "mahadora", college: "ch.j.s.dc matroi", class: "B.Sc", mobile: "" },
        { id: 13, studentName: "RASHMI KUMARI", fatherName: "LALATA PRASAD", totalTuitionFee: 7200, amountPayable: 3600,
            village: "jamon", college: "shri.y s d c mant", class: "B.A", mobile: "" },
        { id: 14, studentName: "RANJANA", fatherName: "HARI BHAJAN SHARMA", totalTuitionFee: 12000, amountPayable: 6000,
            village: "mahadora", college: "ch.j.s.dc matroi", class: "B.Sc 1&2", mobile: "" },
    ],
    "2021-22": [
        { id: 1, studentName: "Rohit", fatherName: "Prempal", totalTuitionFee: 5000, amountPayable: 2500,
            village: "jamon", college: "apdc sasni hathras", class: "B.sc-1", mobile: "9719246538" },
        { id: 2, studentName: "Aman Kumar", fatherName: "Jitendra Kumar", totalTuitionFee: 40500, amountPayable: 20250,
            village: "khem ka vas", college: "manglayatan", class: "Dip-EE", mobile: "8439946107" },
        { id: 3, studentName: "Pawan Kumar", fatherName: "Khajan Singh", totalTuitionFee: 11803, amountPayable: 5901,
            village: "khem ka vas", college: "govt.poly muradab", class: "Poly", mobile: "8954723784" },
        { id: 4, studentName: "Pratap Singh", fatherName: "Harpal Singh", totalTuitionFee: 11592, amountPayable: 5796,
            village: "jamon", college: "govt.poly ghaziaba", class: "Poly", mobile: "8869843192" },
        { id: 5, studentName: "Puja", fatherName: "Raghuveer", totalTuitionFee: 4000, amountPayable: 2000,
            village: "jamon", college: "g.l.r. ins.mathura", class: "BA-1", mobile: "9761983367" },
        { id: 6, studentName: "Nitu", fatherName: "Rameshwar Da", totalTuitionFee: 3500, amountPayable: 1750,
            village: "kubra", college: "d.j.m.iglas", class: "BA-1", mobile: "7302574589" },
        { id: 7, studentName: "Shiv Kumar", fatherName: "Raj Kumar", totalTuitionFee: 43500, amountPayable: 21750,
            village: "sakaua", college: "manglayatan", class: "Dip-CSE", mobile: "7217294230" },
        { id: 8, studentName: "Pavan Kumar", fatherName: "Vijay Kumar", totalTuitionFee: 6000, amountPayable: 3000,
            village: "tara", college: "s.m.d.c mathura", class: "BA-1", mobile: "9528378077" },
        { id: 9, studentName: "Vikash Kumar", fatherName: "Rameshwar Sin", totalTuitionFee: 7500, amountPayable: 3500,
            village: "mahadora", college: "s.l.s.m. nauhjeel", class: "B.sc-2", mobile: "9368264979" },
        { id: 10, studentName: "Ajay Kumar", fatherName: "Dharmpal Singh", totalTuitionFee: 6500, amountPayable: 3250,
            village: "vas toda", college: "c.j.s.matroi", class: "B.sc-1", mobile: "7895032567" },
        { id: 11, studentName: "Sandeep Kumar", fatherName: "Dhan Singh", totalTuitionFee: 6000, amountPayable: 3000,
            village: "bas jula", college: "vijaya d c iglas", class: "BA-1", mobile: "6397790869" },
        { id: 12, studentName: "Chandra Prakash", fatherName: "Murari Lal", totalTuitionFee: 19020, amountPayable: 9510,
            village: "jamon", college: "m.g.poly. Hathras", class: "Poly-2", mobile: "9634654433" },
        { id: 13, studentName: "Sheetal Sharma", fatherName: "Ram Babu Shar", totalTuitionFee: 6000, amountPayable: 3000,
            village: "kubra", college: "khushi ram m v khai", class: "B.A.ii", mobile: "9627624668" },
        { id: 14, studentName: "Kavita", fatherName: "Bablu", totalTuitionFee: 6500, amountPayable: 3250,
            village: "jamon", college: "c.j.s.matroi", class: "B.sc-1", mobile: "8979184016" },
        { id: 15, studentName: "Priti", fatherName: "Mukesh Kumar", totalTuitionFee: 7000, amountPayable: 3500,
            village: "jamon", college: "c.j.s.matroi", class: "B.sc-1", mobile: "9756681254" },
        { id: 16, studentName: "Komal Sharma", fatherName: "Satya Prakash S", totalTuitionFee: 8000, amountPayable: 4000,
            village: "khem ka vas", college: "dps d c iglas", class: "B.sc-1", mobile: "9758216174" },
        { id: 17, studentName: "Arun Kumar Shar", fatherName: "Rameshwar Da", totalTuitionFee: 71600, amountPayable: 35800,
            village: "kubra", college: "sanjay college mat", class: "B.Pharma-2", mobile: "9837167253" },
        { id: 18, studentName: "Suraj Kumar", fatherName: "Ram Gopal Sing", totalTuitionFee: 4500, amountPayable: 2250,
            village: "jamon", college: "c.r.s.d.c.mathura", class: "B.sc-1", mobile: "6398590651" },
        { id: 19, studentName: "Ankur Kumar", fatherName: "Satish Pachauri", totalTuitionFee: 8100, amountPayable: 4050,
            village: "mahadora", college: "s.b.s. mant mathura", class: "B.sc-2", mobile: "9997005280" },
        { id: 20, studentName: "Sachin Kumar", fatherName: "Damodar Singh", totalTuitionFee: 7000, amountPayable: 3500,
            village: "mahadora", college: "s.y.s.d.c.mant", class: "B.A-1", mobile: "7409073237" },
        { id: 21, studentName: "Nikhil Kumar", fatherName: "Manoj Sharma", totalTuitionFee: 36368, amountPayable: 18184,
            village: "khem ka vas", college: "poly.mathura", class: "Poly-1", mobile: "8287491035" },
        { id: 22, studentName: "Kanhaiya Lal", fatherName: "Chhatra Pal Sin", totalTuitionFee: 8000, amountPayable: 4000,
            village: "mahadora", college: "c.r.s.d.c.mathura", class: "B.sc-1", mobile: "7500126642" },
        { id: 23, studentName: "Avdhesh Kumar", fatherName: "Meghshyam", totalTuitionFee: 4500, amountPayable: 2250,
            village: "govardhan", college: "s.l.s.m. nauhjeel", class: "B.A-1", mobile: "7505958215" },
        { id: 24, studentName: "Anuj", fatherName: "Ashok Kumar", totalTuitionFee: 7270, amountPayable: 3635,
            village: "siktara", college: "b.k.m.bajana math", class: "B.A-2", mobile: "6395649651" },
    ],
    "2022-23": [
        { id: 1, studentName: "Jitendra Kumar", fatherName: "Netrapal", totalTuitionFee: 6000, amountPayable: 3000,
            village: "MAHADORA", college: "CH.J.S.D.C MATROI", class: "B.A.-I", mobile: "6396920527" },
        { id: 2, studentName: "Gaurav Kumar", fatherName: "Mahaveer Singh", totalTuitionFee: 6000, amountPayable: 3000,
            village: "JULABAS", college: "K.D.C RAYA", class: "B.A.-I", mobile: "9027822867" },
        { id: 3, studentName: "Sumit Kumar", fatherName: "Prempal Singh", totalTuitionFee: 8000, amountPayable: 3000,
            village: "SIKTARA", college: "MANGALAYATAN", class: "D,Pharam-1", mobile: "8433009571" },
        { id: 4, studentName: "Kaushal Kumar", fatherName: "Suresh Chand", totalTuitionFee: 4000, amountPayable: 2000,
            village: "MAHADORA", college: "MANGALAYATAN", class: "D,Pharam-1", mobile: "7017316105" },
    ],
    "2023-24": [
        { id: 1, studentName: "SHIVAM KUMAR", fatherName: "SHANKAR SINGH", totalTuitionFee: 98000, amountPayable: 30000,
            village: "MAHDORA", college: "GLA MATHURA", class: "BCA - 2", mobile: "6395393108" },
        { id: 2, studentName: "SACHIN KUMAR", fatherName: "DAMODAR SINGH", totalTuitionFee: 7000, amountPayable: 3500,
            village: "MAHDORA", college: "Y S D C BHADNVARA", class: "B.A-2", mobile: "7819043482" },
        { id: 3, studentName: "SANDEEP", fatherName: "DHAN SINGH", totalTuitionFee: 6000, amountPayable: 3000,
            village: "JULABAS", college: "V D C IGLAS", class: "B.A-2", mobile: "9758079485" },
        { id: 4, studentName: "AJAY KUMAR", fatherName: "DHARMPAL SINGH", totalTuitionFee: 9500, amountPayable: 4750,
            village: "BASTODA", college: "C J S D C MATROI IGLAS", class: "Bsc-2", mobile: "7895032567" },
        { id: 5, studentName: "SUMAN", fatherName: "RAKESH KUMAR", totalTuitionFee: 12000, amountPayable: 6000,
            village: "KOOBARA", college: "KHAIR KANYA MAHAVIDYALYA KHAIR", class: "Bsc-2", mobile: "8650530055" },
        { id: 6, studentName: "MOHINI", fatherName: "GAJENDRA SINGH", totalTuitionFee: 80000, amountPayable: 30000,
            village: "MAHDORA", college: "ALIGARH COLL OF ENGINE AND TECH", class: "CSE-1", mobile: "8077886370" },
        { id: 7, studentName: "DEEPAK KUMAR", fatherName: "UMAKANT", totalTuitionFee: 13800, amountPayable: 6900,
            village: "CHHANHARI", college: "R C CDEVI MANT MATHURA", class: "B.A-3", mobile: "7351133544" },
        { id: 8, studentName: "RAMAVTAR KUMAR", fatherName: "VEERPAL SINGH", totalTuitionFee: 60000, amountPayable: 30000,
            village: "SIKTARA", college: "B H S C RAMNAGARIYA IGLAS", class: "DPHA-1", mobile: "9528304120" },
        { id: 9, studentName: "ANKIT KUMAR", fatherName: "AMAR SINGH", totalTuitionFee: 117000, amountPayable: 30000,
            village: "MAHDORA", college: "G L A MATHURA", class: "BCA-1", mobile: "8433227834" },
        { id: 10, studentName: "SHIVAM KUMAR", fatherName: "SHANKAR SINGH", totalTuitionFee: 97030, amountPayable: 30000,
            village: "MAHDORA", college: "G L A MATHURA", class: "BCA-3", mobile: "9759598891" },
        { id: 11, studentName: "NISHA", fatherName: "RAJESH SARSWAT", totalTuitionFee: 5699, amountPayable: 2849.50,
            village: "JAMON", college: "B S AGRAWAL COLLEGE MATHURA", class: "Bsc-1", mobile: "7310927627" },
        { id: 12, studentName: "ARCHANA", fatherName: "RAMVEER SARSWAT", totalTuitionFee: 5699, amountPayable: 2849.50,
            village: "JAMON", college: "B S AGRAWAL COLLEGE MATHURA", class: "Bsc-1", mobile: "9897568915" },
        { id: 13, studentName: "NEHA", fatherName: "ROOPKISHOR", totalTuitionFee: 5699, amountPayable: 2849.50,
            village: "JAMON", college: "B S AGRAWAL COLLEGE MATHURA", class: "Bsc-1", mobile: "9897568915" },
        { id: 14, studentName: "SHYAM SUNDAR", fatherName: "DEVENDRA SINGH", totalTuitionFee: 11000, amountPayable: 5500,
            village: "MAHDORA", college: "B H S C RAMNAGARIYA IGLAS", class: "Bsc-2", mobile: "9058577497" },
        { id: 15, studentName: "GAURAV RAGHAV", fatherName: "SHRIPAL SINGH", totalTuitionFee: 62500, amountPayable: 30000,
            village: "KANTHI NAGARIYA", college: "H I M C S F MATHURA", class: "B.C.A-2", mobile: "6397388197" },
        { id: 16, studentName: "BANTI SINGH", fatherName: "OMVEER SINGH", totalTuitionFee: 9000, amountPayable: 4500,
            village: "SIKATARA", college: "D P S D C IGLASH ALIGARH", class: "Bsc-2", mobile: "8077947467" },
        { id: 17, studentName: "VIKAS KUMAR", fatherName: "KARE SINGH", totalTuitionFee: 9000, amountPayable: 4500,
            village: "SIKATARA", college: "D P S D C IGLASH ALIGARH", class: "Bsc-2", mobile: "8650041904" },
        { id: 18, studentName: "ARUN KUMAR", fatherName: "RAJKUMAR", totalTuitionFee: 20000, amountPayable: 10000,
            village: "MAHDORA", college: "S Y S D C MANT MATHURA", class: "Bsc-1", mobile: "8279777618" },
        { id: 19, studentName: "SHALU", fatherName: "VIJAY KUMAR", totalTuitionFee: 20000, amountPayable: 10000,
            village: "MAHDORA", college: "S Y S D C MANT MATHURA", class: "Bsc-1", mobile: "8279777618" },
        { id: 20, studentName: "POOJA", fatherName: "RAJKUMAR", totalTuitionFee: 10000, amountPayable: 5000,
            village: "MAHDORA", college: "S Y S D C MANT MATHURA", class: "B.A-1", mobile: "9719751737" },
        { id: 21, studentName: "SUPRIVA", fatherName: "VIJAY KUMAR", totalTuitionFee: 10000, amountPayable: 5000,
            village: "MAHDORA", college: "S Y S D C MANT MATHURA", class: "B.A-1", mobile: "9719751737" },
        { id: 22, studentName: "NITU", fatherName: "RAMESHWAR DAYAL", totalTuitionFee: 4000, amountPayable: 2000,
            village: "KUBARA", college: "D J MTAHARPUR ALIGARH", class: "B.A-3", mobile: "9759441325" },
        { id: 23, studentName: "SUMIT KUMAR", fatherName: "PREMPAL SINGH", totalTuitionFee: 80000, amountPayable: 30000,
            village: "MAHDORA", college: "MANGALAYATAN", class: "D.PHARMA", mobile: "8433009571" },
        { id: 24, studentName: "DURGESH", fatherName: "BACHCHU SINGH", totalTuitionFee: 8000, amountPayable: 4000,
            village: "MAHDORA", college: "KHAIR KANYA MAHAVIDYALYA KHAIR", class: "B.A-3", mobile: "8394078822" },
        { id: 25, studentName: "ROHIT KUMAR", fatherName: "MAHAVIR SINGH", totalTuitionFee: 6500, amountPayable: 3250,
            village: "MAHDORA", college: "C J S D C MATROI IGLAS", class: "Bsc-1", mobile: "8077886370" },
        { id: 26, studentName: "YOGESH KUMAR", fatherName: "RAMESH CHAND", totalTuitionFee: 6000, amountPayable: 3000,
            village: "KOOBARA", college: "MANGALAYATAN", class: "B.PHARMA", mobile: "9719519943" },
        { id: 27, studentName: "POOJA SHARMA", fatherName: "POORANMAL SHARMA", totalTuitionFee: 6000, amountPayable: 3000,
            village: "KOOBARA", college: "G V P K A H T D A A L I G A R H", class: "B.Sc-1", mobile: "8859666928" },
    ],
};

// ─── MAIN COMPONENT ───────────

export default function ScholarshipPage() {
    const [selectedYear, setSelectedYear] = useState("2023-24");
    const [searchQuery, setSearchQuery] = useState("");
    // Static exports have no runtime API routes. Keep the scholarship data in the bundle.
    const [fullData] = useState<Record<string, any[]>>(FALLBACK_DATA);
    const [loading] = useState(false);
    const [visibleData, setVisibleData] = useState<any[]>([]);
    const [animatedTotal, setAnimatedTotal] = useState({ students: 0, tuition: 0, payable: 0 });
    const [showMobile, setShowMobile] = useState(true);

    // ─── Fetch data from API ──────────────────────────────────────────

    // ─── Memoized computed data ───────────────────────────────────────

    const yearData = useMemo(() => fullData[selectedYear] || [], [fullData, selectedYear]);

    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return yearData;
        const q = searchQuery.toLowerCase().trim();
        return yearData.filter((item) =>
            item.studentName.toLowerCase().includes(q) ||
            item.fatherName.toLowerCase().includes(q) ||
            item.village.toLowerCase().includes(q) ||
            item.college.toLowerCase().includes(q) ||
            item.class.toLowerCase().includes(q) ||
            (item.mobile && item.mobile.includes(q))
        );
    }, [yearData, searchQuery]);

    const stats = useMemo(() => {
        const students = filteredData.length;
        const tuition = filteredData.reduce((s, d) => s + d.totalTuitionFee, 0);
        const payable = filteredData.reduce((s, d) => s + d.amountPayable, 0);
        return { students, tuition, payable };
    }, [filteredData]);

    const classData = useMemo(() => {
        const map: Record<string, number> = {};
        filteredData.forEach((d) => {
            const cls = d.class || "Unknown";
            map[cls] = (map[cls] || 0) + 1;
        });
        return Object.entries(map)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [filteredData]);

    const collegeData = useMemo(() => {
        const map: Record<string, number> = {};
        filteredData.forEach((d) => {
            const college = d.college || "Unknown";
            map[college] = (map[college] || 0) + d.amountPayable;
        });
        return Object.entries(map)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    }, [filteredData]);

    // ─── Animated loading ─────────────────────────────────────────────

    useEffect(() => {
        if (loading) return;
        const total = filteredData.length;
        if (total === 0) {
            setVisibleData([]);
            setAnimatedTotal({ students: 0, tuition: 0, payable: 0 });
            return;
        }
        let index = 0;
        const step = Math.max(1, Math.floor(total / 15));
        const interval = setInterval(() => {
            index = Math.min(index + step, total);
            const slice = filteredData.slice(0, index);
            setVisibleData(slice);
            const s = slice.reduce(
                (acc, d) => ({
                    students: acc.students + 1,
                    tuition: acc.tuition + d.totalTuitionFee,
                    payable: acc.payable + d.amountPayable,
                }),
                { students: 0, tuition: 0, payable: 0 }
            );
            setAnimatedTotal(s);
            if (index >= total) clearInterval(interval);
        }, 60);
        return () => clearInterval(interval);
    }, [filteredData, loading]);

    // ─── Navigation ────────────────────────────────────────────────────

    const goToYear = (dir: number) => {
        const idx = ACADEMIC_YEARS.indexOf(selectedYear);
        const newIdx = Math.max(0, Math.min(ACADEMIC_YEARS.length - 1, idx + dir));
        setSelectedYear(ACADEMIC_YEARS[newIdx]);
    };

    const fmt = (v: number) => `₹${Number(v).toLocaleString()}`;

    // ─── Render ────────────────────────────────────────────────────────

    return (
        <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-3 md:p-6 lg:p-8">
            <div className="max-w-[1600px] mx-auto">

                {/* ─── HEADER ─────────────────────────────────────────── */}

                <div className="rounded-3xl overflow-hidden mb-6 shadow-2xl">
                    <div className="bg-gradient-to-r from-[#1e3a5f] via-[#BD272D] to-[#F8F000] p-6 md:p-10 text-white relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-5xl lg:text-5xl font-black tracking-tight drop-shadow-lg flex items-center gap-3">
                                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-200" />
                                    Scholarship Portal
                                </h1>
                                <p className="mt-1 text-white/90 text-lg md:text-xl font-medium drop-shadow">
                                    Champi Devi Inter College · Higher Education Incentives
                                </p>
                            </div>

                            {/* year selector */}
                            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-2 border border-white/30">
                                <button
                                    onClick={() => goToYear(-1)}
                                    className="p-2 rounded-xl hover:bg-white/20 transition disabled:opacity-40"
                                    disabled={ACADEMIC_YEARS.indexOf(selectedYear) === 0}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex gap-1.5">
                                    {ACADEMIC_YEARS.map((y) => (
                                        <button
                                            key={y}
                                            onClick={() => setSelectedYear(y)}
                                            className={`
                                                px-4 py-1.5 rounded-xl font-bold text-sm transition-all
                                                ${y === selectedYear
                                                    ? "bg-white text-[#1e3a5f] shadow-lg scale-105"
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
                                    disabled={ACADEMIC_YEARS.indexOf(selectedYear) === ACADEMIC_YEARS.length - 1}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* live indicator */}
                        <div className="relative z-10 mt-4 flex items-center gap-3 text-white/80 text-sm flex-wrap">
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
                                {loading ? "Loading..." : "Ready"}
                            </span>
                            <span className="text-white/40">|</span>
                            <span>{selectedYear}</span>
                            <span className="text-white/40">|</span>
                            <span>{filteredData.length} students</span>
                        </div>
                    </div>
                </div>

                {/* ─── SUMMARY CARDS ──────────────────────────────────── */}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
                    <Card
                        icon={<Users className="w-5 h-5 text-[#1e3a5f]" />}
                        label="Total Students"
                        value={animatedTotal.students.toString()}
                        color="text-[#1e3a5f]"
                        isLoading={loading}
                    />
                    <Card
                        icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                        label="Total Tuition Fee"
                        value={fmt(animatedTotal.tuition)}
                        color="text-blue-600"
                        isLoading={loading}
                    />
                    <Card
                        icon={<Award className="w-5 h-5 text-green-600" />}
                        label="Total Payable"
                        value={fmt(animatedTotal.payable)}
                        color="text-green-600"
                        isLoading={loading}
                    />
                    <Card
                        icon={<Calendar className="w-5 h-5 text-purple-600" />}
                        label="Academic Year"
                        value={selectedYear}
                        color="text-purple-600"
                        isLoading={loading}
                    />
                </div>

                {/* ─── SEARCH BAR ──────────────────────────────────────── */}

                <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name, village, college..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{filteredData.length} records found</span>
                        <button
                            onClick={() => setShowMobile(!showMobile)}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-xs font-medium"
                        >
                            {showMobile ? "Hide Mobile" : "Show Mobile"}
                        </button>
                    </div>
                </div>

                {/* ─── TABLE ───────────────────────────────────────────── */}

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden mb-6">
                    <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg md:text-xl flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-[#1e3a5f] rounded-full" />
                            Student Records
                        </h3>
                        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            {visibleData.length} students
                        </span>
                    </div>

                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-gradient-to-r from-[#A41814] to-indigo-50 border-b border-gray-200">
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">#</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Student Name</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Father's Name</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Class</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">College</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Village</th>
                                    <th className="p-3 text-right text-sm font-semibold text-gray-600">Tuition Fee</th>
                                    <th className="p-3 text-right text-sm font-semibold text-gray-600">Payable</th>
                                    {showMobile && (
                                        <th className="p-3 text-left text-sm font-semibold text-gray-600">Mobile</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {visibleData.map((item, idx) => (
                                    <tr
                                        key={`${selectedYear}-${item.id}`}
                                        className={`
                                            border-b border-gray-50 transition-all duration-300
                                            ${idx % 2 === 0 ? "bg-white" : "bg-blue-50/20"}
                                            hover:bg-blue-100/40
                                        `}
                                        style={{
                                            animation: `fadeInUp 0.25s ease-out ${Math.min(idx * 0.012, 0.5)}s both`,
                                        }}
                                    >
                                        <td className="p-3 text-sm text-gray-500">{idx + 1}</td>
                                        <td className="p-3 text-sm font-medium text-gray-800">{item.studentName}</td>
                                        <td className="p-3 text-sm text-gray-600">{item.fatherName}</td>
                                        <td className="p-3 text-sm">
                                            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                                {item.class}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-600 max-w-[140px] truncate" title={item.college}>
                                            {item.college}
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">{item.village}</td>
                                        <td className="p-3 text-right text-sm font-medium text-gray-700">
                                            {fmt(item.totalTuitionFee)}
                                        </td>
                                        <td className="p-3 text-right text-sm font-bold text-green-600">
                                            {fmt(item.amountPayable)}
                                        </td>
                                        {showMobile && (
                                            <td className="p-3 text-sm text-gray-500">
                                                {item.mobile ? (
                                                    <a href={`tel:${item.mobile}`} className="flex items-center gap-1 hover:text-blue-600 transition">
                                                        <Phone className="w-3 h-3" />
                                                        {item.mobile}
                                                    </a>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {visibleData.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={showMobile ? 9 : 8} className="p-10 text-center text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-3xl">📚</span>
                                                <p>No students found for {selectedYear}</p>
                                                <p className="text-xs">Try adjusting your search or select a different year</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {loading && (
                                    <tr>
                                        <td colSpan={showMobile ? 9 : 8} className="p-8 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-5 h-5 border-2 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm text-gray-400">Loading records…</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 border-t-2 border-blue-200">
                                    <td colSpan={6} className="p-4 font-bold text-[#1e3a5f] text-sm">
                                        Grand Total
                                    </td>
                                    <td className="p-4 text-right font-bold text-[#1e3a5f] text-sm">
                                        {fmt(animatedTotal.tuition)}
                                    </td>
                                    <td className="p-4 text-right font-black text-green-700 text-sm">
                                        {fmt(animatedTotal.payable)}
                                    </td>
                                    {showMobile && <td className="p-4" />}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* ─── CHARTS ──────────────────────────────────────────── */}

                <div className="grid lg:grid-cols-2 gap-6">

                    {/* Pie: Class Distribution */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-4 md:p-6">
                        <h3 className="font-bold text-lg md:text-xl mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-[#8B5CF6] rounded-full" />
                            Class Distribution
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">
                            {selectedYear} · {classData.length} classes
                        </p>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={classData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        label={({ name, percent }) =>
                                            `${String(name ?? "").slice(0, 12)} ${((percent ?? 0) * 100).toFixed(0)}%`
                                        }
                                        labelLine={false}
                                    >
                                        {classData.map((_, idx) => (
                                            <Cell
                                                key={idx}
                                                fill={CHART_COLORS[idx % CHART_COLORS.length]}
                                                stroke="white"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val) => `${Number(val ?? 0)} students`}
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
                        <div className="flex flex-wrap justify-center gap-2 mt-2 max-h-16 overflow-y-auto scrollbar-thin">
                            {classData.slice(0, 10).map((item, idx) => (
                                <span key={idx} className="flex items-center gap-1.5 text-xs">
                                    <span
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ background: CHART_COLORS[idx % CHART_COLORS.length] }}
                                    />
                                    {item.name} ({item.value})
                                </span>
                            ))}
                            {classData.length > 10 && (
                                <span className="text-xs text-gray-400">+{classData.length - 10} more</span>
                            )}
                        </div>
                    </div>

                    {/* Bar: College-wise Payable */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-4 md:p-6">
                        <h3 className="font-bold text-lg md:text-xl mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-[#10B981] rounded-full" />
                            College-wise Payable
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">
                            Top {collegeData.length} colleges by amount payable
                        </p>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={collegeData} layout="vertical" margin={{ left: 10, right: 10 }}>
                                    <CartesianGrid horizontal={false} stroke="#ECECEC" strokeDasharray="3 3" />
                                    <XAxis type="number" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        tick={{ fontSize: 10, fill: "#64748B" }}
                                        width={100}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        formatter={(val) => [`₹${Number(val ?? 0).toLocaleString()}`, "Payable"]}
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: "1px solid #E2E8F0",
                                            boxShadow: "0 10px 25px rgba(0,0,0,.08)",
                                            background: "rgba(255,255,255,0.92)",
                                            backdropFilter: "blur(4px)",
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="url(#collegeGradient)"
                                        radius={[0, 6, 6, 0]}
                                        barSize={18}
                                    />
                                    <defs>
                                        <linearGradient id="collegeGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#10B981" />
                                            <stop offset="100%" stopColor="#3B82F6" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* ─── FOOTER ──────────────────────────────────────────── */}

                <div className="mt-8 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
                    <p>© 2026 Champi Devi Inter College · Higher Education Scholarship Program</p>
                    <p className="mt-1">
                        Data for {selectedYear} · {filteredData.length} students · Total Payable {fmt(animatedTotal.payable)}
                    </p>
                </div>

            </div>

            {/* ─── GLOBAL STYLES ────────────────────────────────────────── */}

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
                    background: #c4b5fd;
                    border-radius: 999px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #8b5cf6;
                }
            `}</style>
        </section>
    );
}

// ─── CARD SUB-COMPONENT ──────────────────────────────────────────────────

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
