"use client";

import { useState, type FormEvent } from "react";
import {
  GraduationCap,
  ExternalLink,
  Search,
  CalendarDays,
  ChevronDown,
  User,
  BookOpen,
  AlertCircle,
  Sparkles,
  Trophy,
  ShieldCheck,
  Info,
} from "lucide-react";

// ------------------- Board Data -------------------
type BoardInfo = {
  name: string;
  shortLabel: string;
  hasOnlinePortal: boolean;
  primaryUrl?: string;
  mirrorUrl?: string;
  note?: string;
};

const boardData: Record<string, BoardInfo> = {
  "8": {
    name: "Class 8th — Basic Shiksha Parishad",
    shortLabel: "Class 8th",
    hasOnlinePortal: false,
    note:
      "Class 8 results are declared directly by the school and are not published on a public roll-number portal. Please contact the school office to collect your result.",
  },
  "10": {
    name: "UP Board Class 10th (High School)",
    shortLabel: "Class 10th",
    hasOnlinePortal: true,
    primaryUrl: "https://upresults.nic.in/",
    mirrorUrl: "https://results.upmsp.edu.in/",
  },
  "12": {
    name: "UP Board Class 12th (Intermediate)",
    shortLabel: "Class 12th",
    hasOnlinePortal: true,
    primaryUrl: "https://upresults.nic.in/",
    mirrorUrl: "https://results.upmsp.edu.in/",
  },
};

// ------------------- Illustration: School Building (used in Hero) -------------------
function SchoolBuildingIllustration() {
  return (
    <svg
      viewBox="0 0 480 400"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF3DE" />
          <stop offset="100%" stopColor="#FFE1B8" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="480" height="400" fill="url(#skyGrad)" />

      {/* Sun */}
      <circle cx="378" cy="66" r="34" fill="#F8B500" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1={378 + Math.cos((deg * Math.PI) / 180) * 46}
          y1={66 + Math.sin((deg * Math.PI) / 180) * 46}
          x2={378 + Math.cos((deg * Math.PI) / 180) * 58}
          y2={66 + Math.sin((deg * Math.PI) / 180) * 58}
          stroke="#F8B500"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}

      {/* Birds */}
      <path d="M60 60 q8 -8 16 0 q8 -8 16 0" fill="none" stroke="#B60F17" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
      <path d="M100 90 q6 -6 12 0 q6 -6 12 0" fill="none" stroke="#B60F17" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />

      {/* Ground */}
      <rect x="0" y="330" width="480" height="70" fill="#FCEBD5" />
      <path d="M0 330 Q120 312 240 330 T480 330 V400 H0 Z" fill="#FFDFB8" opacity="0.7" />

      {/* Tree left */}
      <rect x="52" y="270" width="10" height="60" fill="#8B5E34" />
      <circle cx="57" cy="258" r="28" fill="#7A9B57" />
      <circle cx="38" cy="272" r="18" fill="#7A9B57" />
      <circle cx="76" cy="272" r="18" fill="#7A9B57" />

      {/* Tree right */}
      <rect x="410" y="280" width="9" height="50" fill="#8B5E34" />
      <circle cx="414" cy="270" r="22" fill="#7A9B57" />

      {/* Flagpole + pennant */}
      <line x1="240" y1="110" x2="240" y2="60" stroke="#B60F17" strokeWidth="3" />
      <path d="M240 62 L272 72 L240 82 Z" fill="#FF6A00" />

      {/* Roof pediment */}
      <polygon points="118,182 240,110 362,182" fill="#B60F17" />
      <polygon points="130,182 240,124 350,182" fill="#D94B00" />

      {/* Building body */}
      <rect x="140" y="182" width="200" height="148" fill="#FFFFFF" stroke="#B60F17" strokeWidth="3" />

      {/* Columns */}
      {[152, 186, 220, 254, 288, 322].map((x) => (
        <rect key={x} x={x} y="196" width="10" height="120" fill="#FFF1E0" stroke="#B60F17" strokeWidth="1.5" />
      ))}

      {/* Windows */}
      {[160, 196, 284, 320].map((x) => (
        <rect key={x} x={x} y="212" width="24" height="30" rx="2" fill="#FFD9A0" stroke="#B60F17" strokeWidth="1.5" />
      ))}

      {/* Arched door */}
      <path d="M218 330 V272 a22 22 0 0 1 44 0 V330 Z" fill="#FF6A00" stroke="#B60F17" strokeWidth="2" />
      <line x1="240" y1="272" x2="240" y2="330" stroke="#B60F17" strokeWidth="1.5" opacity="0.5" />

      {/* Steps */}
      <rect x="204" y="330" width="72" height="8" fill="#F3D9B1" />
      <rect x="196" y="338" width="88" height="8" fill="#F3D9B1" />
    </svg>
  );
}

// ------------------- Illustration: Wide banner skyline -------------------
function SchoolBannerIllustration() {
  return (
    <svg
      viewBox="0 0 1400 400"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="bannerGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B60F17" />
          <stop offset="55%" stopColor="#D94B00" />
          <stop offset="100%" stopColor="#FF6A00" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1400" height="400" fill="url(#bannerGrad)" />

      {/* Sun */}
      <circle cx="1180" cy="90" r="46" fill="#F8B500" opacity="0.9" />

      {/* Scattered sparkle dots */}
      {[
        [120, 60], [260, 110], [420, 50], [600, 90], [760, 40], [920, 100], [1040, 55], [1320, 130],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#FFF3DE" opacity="0.5" />
      ))}

      {/* Distant tree line */}
      {[80, 260, 1240, 1340].map((x) => (
        <g key={x}>
          <rect x={x} y="230" width="8" height="40" fill="#7A4B24" opacity="0.6" />
          <circle cx={x + 4} cy="222" r="20" fill="#8AA968" opacity="0.6" />
        </g>
      ))}

      {/* Silhouette buildings, three schools in a row */}
      {[
        { x: 430, scale: 1 },
        { x: 640, scale: 1.25 },
        { x: 880, scale: 1 },
      ].map(({ x, scale }, i) => (
        <g key={i} transform={`translate(${x} 0) scale(${scale})`} opacity="0.9">
          <polygon points="-70,220 0,160 70,220" fill="#FFF1E0" opacity="0.25" />
          <rect x="-60" y="220" width="120" height="90" fill="#FFF1E0" opacity="0.22" />
          <line x1="0" y1="160" x2="0" y2="130" stroke="#FFF1E0" strokeWidth="2.5" opacity="0.5" />
          <path d="M0 132 L20 140 L0 148 Z" fill="#F8B500" opacity="0.8" />
        </g>
      ))}

      {/* Ground band */}
      <rect x="0" y="310" width="1400" height="90" fill="#FFFFFF" opacity="0.08" />
    </svg>
  );
}

// ------------------- School Banner -------------------
function SchoolBanner() {
  return (
    <section className="relative w-full">
      <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] overflow-hidden">
        <SchoolBannerIllustration />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 sm:left-8">
          <p className="text-white font-black text-lg sm:text-3xl tracking-tight">
            SMT. Champi Devi Inter College
          </p>
          <p className="text-[11px] sm:text-sm font-semibold tracking-wide text-white/85 mt-1">
            Jamon, Aligarh · Uttar Pradesh
          </p>
        </div>
      </div>
    </section>
  );
}

// ------------------- Hero Component -------------------
function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFF8F0]">
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#FF6A00]/20 to-[#F8F000]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#B60F17]/15 to-[#FF6A00]/10 blur-3xl" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#B60F17 1px, transparent 1px), linear-gradient(90deg, #B60F17 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#B60F17] to-[#FF6A00] text-white text-xs sm:text-sm font-bold tracking-widest shadow-lg shadow-[#B60F17]/30">
              <Sparkles size={14} /> RESULT ANNOUNCEMENT 2026
            </span>

            <h1 className="mt-7 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] text-[#1a1a1a]">
              UP Board
              <br />
              <span className="bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8B500] bg-clip-text text-transparent">
                Result 2026
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-8 text-gray-700 max-w-xl mx-auto lg:mx-0">
              Congratulations to all our brilliant students for their outstanding
              performance. <span className="font-semibold text-[#B60F17]">SMT. Champi Devi Inter College</span> is proud of you!
            </p>

            <div className="mt-9 flex flex-wrap justify-center lg:justify-start gap-4">
              <a
                href="#result-checker"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#B60F17] to-[#FF6A00] text-white px-7 py-4 rounded-full font-bold shadow-lg shadow-[#B60F17]/30 hover:shadow-xl hover:shadow-[#B60F17]/40 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-2"
              >
                <Search size={20} className="group-hover:scale-110 transition" />
                Check Your Result
              </a>

              <a
                href="https://upresults.nic.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-white text-[#B60F17] border-2 border-[#B60F17]/20 px-7 py-4 rounded-full font-bold shadow-md hover:border-[#B60F17] hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B60F17] focus-visible:ring-offset-2"
              >
                Official Website
                <ExternalLink size={18} className="group-hover:translate-x-0.5 transition" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#B60F17]" />
                <span className="font-medium">Official Board Link</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-[#FF6A00]" />
                <span className="font-medium">100% Verified</span>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative flex justify-center order-1 lg:order-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[85%] w-[85%] rounded-[40px] bg-gradient-to-br from-[#FF6A00]/30 via-[#F8F000]/20 to-[#B60F17]/30 blur-3xl" />
            </div>

            <div className="relative w-full max-w-[560px] p-[6px] rounded-[36px] bg-gradient-to-br from-[#B60F17] via-[#FF6A00] to-[#F8B500] shadow-[0_25px_70px_-15px_rgba(182,15,23,0.45)]">
              <div className="relative w-full aspect-[4/3] sm:aspect-[5/4] rounded-[30px] overflow-hidden bg-[#FFF8F0]">
                <SchoolBuildingIllustration />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 bg-white/95 backdrop-blur rounded-2xl px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#B60F17] to-[#FF6A00] flex items-center justify-center text-white">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium leading-none">Board Exam</p>
                      <p className="text-sm font-bold text-[#1a1a1a] leading-tight mt-0.5">
                        Result 2026 Declared
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#B60F17] bg-[#F8F000] px-3 py-1.5 rounded-full">
                    LIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------- Class Toggle (8, 10, 12) -------------------
interface ClassToggleProps {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
}

function ClassToggle({ selectedClass, setSelectedClass }: ClassToggleProps) {
  const classes = [
    // { id: "8", label: "Class 8th", sub: "Basic Shiksha" },
    { id: "10", label: "Class 10th", sub: "High School" },
    { id: "12", label: "Class 12th", sub: "Intermediate" },
  ];

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-3xl shadow-xl shadow-[#B60F17]/5 p-2 flex flex-wrap justify-center gap-2 border border-[#B60F17]/10">
        {classes.map((cls) => (
          <button
            key={cls.id}
            type="button"
            onClick={() => setSelectedClass(cls.id)}
            className={`px-5 sm:px-7 py-3 rounded-2xl font-bold transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-2 ${
              selectedClass === cls.id
                ? "bg-gradient-to-br from-[#B60F17] to-[#FF6A00] text-white shadow-lg shadow-[#B60F17]/30"
                : "text-gray-600 hover:bg-[#FFF8F0]"
            }`}
          >
            <span className="block text-sm sm:text-base leading-tight">{cls.label}</span>
            <span
              className={`block text-[10px] sm:text-xs font-medium mt-0.5 ${
                selectedClass === cls.id ? "text-white/80" : "text-gray-400"
              }`}
            >
              {cls.sub}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ------------------- Year Picker (replaces native <select>) -------------------
function YearPicker({ year, setYear }: { year: string; setYear: (y: string) => void }) {
  const [open, setOpen] = useState(false);
  const years = ["2026", "2025", "2024", "2023", "2022", "2021"];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#B60F17] outline-none transition bg-[#FFFCF7] text-gray-800 font-medium focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
      >
        <span className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#B60F17]" />
          {year}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-xl border border-[#B60F17]/10 p-2 grid grid-cols-3 gap-1.5">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => {
                  setYear(y);
                  setOpen(false);
                }}
                className={`py-2.5 rounded-lg text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] ${
                  y === year
                    ? "bg-gradient-to-br from-[#B60F17] to-[#FF6A00] text-white"
                    : "text-gray-600 hover:bg-[#FFF8F0]"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ------------------- Result Checker Form -------------------
function ResultChecker({ selectedClass }: { selectedClass: string }) {
  const [rollNo, setRollNo] = useState("");
  const [passingYear, setPassingYear] = useState("2026");
  const [error, setError] = useState("");

  const board = boardData[selectedClass];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!board.hasOnlinePortal) {
      setError(board.note || "An online result checker isn't available for this class.");
      return;
    }

    const cleaned = rollNo.trim();
    if (!cleaned) {
      setError("Please enter your Roll Number.");
      return;
    }

    const looksValid = /^[0-9]{6,10}$/.test(cleaned);

    if (!looksValid) {
      setError(
        `That roll number doesn't look quite right — opening the official ${passingYear} result site so you can search there directly.`
      );
    }

    if (board.primaryUrl) {
      window.open(board.primaryUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      id="result-checker"
      className="relative max-w-4xl mx-auto mt-12 rounded-[32px] overflow-hidden shadow-[0_25px_60px_-20px_rgba(182,15,23,0.25)]"
    >
      <div className="h-2 bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8B500]" />

      <div className="bg-white">
        <div className="px-8 sm:px-12 pt-10 pb-6 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-[#B60F17] to-[#FF6A00] text-white shadow-lg shadow-[#B60F17]/30 mb-4">
            <BookOpen size={28} />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#1a1a1a]">
            Check Your Result
          </h3>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Enter your details to view your{" "}
            <span className="font-bold text-[#B60F17]">{board.shortLabel}</span> Result.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 sm:px-12 pb-10 space-y-6">
          <div className="flex items-center gap-4 bg-gradient-to-r from-[#FFF8F0] to-[#FFF1E0] p-4 rounded-2xl border border-[#FF6A00]/15">
            <div className="bg-gradient-to-br from-[#B60F17] to-[#FF6A00] p-3 rounded-xl text-white shadow-md shadow-[#B60F17]/20">
              <GraduationCap size={22} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Selected Board
              </p>
              <p className="text-base sm:text-lg font-bold text-[#1a1a1a]">{board.name}</p>
            </div>
            {board.hasOnlinePortal && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#B60F17] bg-[#F8F000]/40 px-3 py-1.5 rounded-full">
                <Sparkles size={12} /> Ready
              </span>
            )}
          </div>

          {!board.hasOnlinePortal ? (
            <div className="flex items-start gap-3 text-[#B60F17] bg-[#FFF1E0] border border-[#FF6A00]/25 p-4 rounded-xl text-sm font-medium">
              <Info size={18} className="mt-0.5 flex-shrink-0" />
              <span>{board.note}</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <User size={15} className="text-[#B60F17]" /> Roll Number
                  </label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="Enter your Roll No."
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#B60F17] outline-none transition bg-[#FFFCF7] text-gray-800 font-medium placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <CalendarDays size={15} className="text-[#B60F17]" /> Passing Year
                  </label>
                  <YearPicker year={passingYear} setYear={setPassingYear} />
                </div>
              </div>

              {board.mirrorUrl && (
                <p className="text-xs text-gray-400 text-center">
                  Mirror site if the main one is slow:{" "}
                  <a
                    href={board.mirrorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B60F17] font-semibold hover:underline"
                  >
                    {board.mirrorUrl.replace("https://", "")}
                  </a>
                </p>
              )}
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 p-3.5 rounded-xl text-sm font-medium">
              <AlertCircle size={18} className="flex-shrink-0" /> {error}
            </div>
          )}

          {board.hasOnlinePortal && (
            <button
              type="submit"
              className="group w-full bg-gradient-to-r from-[#B60F17] via-[#D94B00] to-[#FF6A00] text-white py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-[#B60F17]/30 hover:shadow-xl hover:shadow-[#B60F17]/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-2"
            >
              <Search size={20} className="group-hover:scale-110 transition" />
              View Result on Board Website
              <ExternalLink size={18} className="group-hover:translate-x-0.5 transition" />
            </button>
          )}

          <p className="text-center text-xs text-gray-400">
            You will be redirected to the official UP Board result website.
          </p>
        </form>
      </div>
    </div>
  );
}

// ------------------- Main Page -------------------
export default function ResultPage() {
  const [selectedClass, setSelectedClass] = useState("10");

  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      <Hero />
      <SchoolBanner />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B60F17]/10 text-[#B60F17] text-xs font-bold uppercase tracking-widest">
            <Sparkles size={12} /> Select Your Class
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black text-[#1a1a1a]">
            Choose Your <span className="text-[#B60F17]">Board</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Select the class to check your result
          </p>
        </div>

        <ClassToggle selectedClass={selectedClass} setSelectedClass={setSelectedClass} />

        <ResultChecker selectedClass={selectedClass} />

        <div className="mt-16 max-w-3xl mx-auto text-center bg-white rounded-2xl p-6 border border-[#FF6A00]/15 shadow-sm">
          <p className="text-gray-600 text-sm sm:text-base">
            📌 For any query regarding results, please contact the school administration.
          </p>
        </div>
      </section>
    </main>
  );
}