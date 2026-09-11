"use client";

import { useState } from "react";
import {
  GraduationCap,
  User,
  Hash,
  Layers,
  CalendarDays,
  ChevronDown,
  Search,
  Sparkles,
} from "lucide-react";

// ------------------- Types -------------------
interface ResultForm {
  studentName: string;
  rollNo: string;
  studentClass: string;
  session: string;
}

interface ResultSearchProps {
  onResult: (data: any) => void;
}

const CLASS_OPTIONS = ["6", "7", "8", "9", "10", "11", "12"];
const SESSION_OPTIONS = ["2025-26", "2024-25", "2023-24"];

// ------------------- Reusable brand dropdown (no native blue) -------------------
function Dropdown({
  label,
  icon,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
        {icon} {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between h-14 px-4 rounded-xl border-2 border-gray-200 bg-[#FFFCF7] text-gray-800 font-medium focus:border-[#B60F17] outline-none transition focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
        >
          <span className={value ? "" : "text-gray-400"}>{value || placeholder}</span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute z-20 mt-2 w-full max-h-56 overflow-y-auto bg-white rounded-2xl shadow-xl border border-[#B60F17]/10 p-2 grid grid-cols-3 gap-1.5">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`py-2.5 rounded-lg text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] ${
                    opt === value
                      ? "bg-gradient-to-br from-[#B60F17] to-[#FF6A00] text-white"
                      : "text-gray-600 hover:bg-[#FFF8F0]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ------------------- Mini banner strip inside the card -------------------
function ResultCardBanner() {
  return (
    <div className="relative overflow-hidden rounded-t-[32px] bg-gradient-to-r from-[#B60F17] via-[#D94B00] to-[#FF6A00] px-8 sm:px-12 py-7">
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 left-1/3 h-28 w-28 rounded-full bg-[#F8F000]/10 blur-2xl" />

      <div className="relative flex items-center gap-4">
        <div className="h-14 w-14 flex-shrink-0 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
          <GraduationCap size={26} className="text-[#B60F17]" />
        </div>
        <div>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white/80 flex items-center gap-1.5">
            <Sparkles size={12} /> Student Corner
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mt-0.5">
            Check Examination Result
          </h1>
        </div>
      </div>
    </div>
  );
}

// ------------------- Main Component -------------------
export default function ResultSearch({ onResult }: ResultSearchProps) {
  const [form, setForm] = useState<ResultForm>({
    studentName: "",
    rollNo: "",
    studentClass: "",
    session: "2025-26",
  });
  const [error, setError] = useState("");

  const update = (field: keyof ResultForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.studentName.trim()) {
      setError("Please enter the student's name.");
      return;
    }
    if (!form.rollNo.trim()) {
      setError("Please enter the roll number.");
      return;
    }
    if (!form.studentClass) {
      setError("Please select a class.");
      return;
    }

    // TODO: replace demo payload with a real lookup once the backend endpoint is wired up
    const demoData = {
      studentName: form.studentName,
      fatherName: "Rakesh Sharma",
      motherName: "Sunita Sharma",
      class: form.studentClass,
      section: "A",
      rollNo: form.rollNo,
      session: form.session,
      subjects: [
        { subject: "English", max: 100, obtain: 90, grade: "A+" },
        { subject: "Hindi", max: 100, obtain: 82, grade: "A" },
        { subject: "Math", max: 100, obtain: 98, grade: "A+" },
      ],
    };

    onResult(demoData);
  };

  return (
    <div className="relative max-w-4xl mx-auto rounded-[32px] overflow-hidden shadow-[0_25px_60px_-20px_rgba(182,15,23,0.25)] bg-white">
      <ResultCardBanner />

      <form onSubmit={handleSubmit} className="px-8 sm:px-12 pt-8 pb-10 space-y-6">
        <p className="text-gray-500 text-sm sm:text-base -mt-2">
          Enter the student's details below to view their result.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <User size={15} className="text-[#B60F17]" /> Student Name
            </label>
            <input
              value={form.studentName}
              onChange={(e) => update("studentName", e.target.value)}
              placeholder="Enter student's full name"
              className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-[#FFFCF7] text-gray-800 font-medium placeholder:text-gray-400 focus:border-[#B60F17] outline-none transition focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Hash size={15} className="text-[#B60F17]" /> Roll Number
            </label>
            <input
              value={form.rollNo}
              onChange={(e) => update("rollNo", e.target.value)}
              placeholder="Enter roll number"
              className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-[#FFFCF7] text-gray-800 font-medium placeholder:text-gray-400 focus:border-[#B60F17] outline-none transition focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Dropdown
            label="Class"
            icon={<Layers size={15} className="text-[#B60F17]" />}
            value={form.studentClass}
            options={CLASS_OPTIONS}
            placeholder="Select Class"
            onChange={(v) => update("studentClass", v)}
          />
          <Dropdown
            label="Session"
            icon={<CalendarDays size={15} className="text-[#B60F17]" />}
            value={form.session}
            options={SESSION_OPTIONS}
            placeholder="Select Session"
            onChange={(v) => update("session", v)}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 p-3.5 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full bg-gradient-to-r from-[#B60F17] via-[#D94B00] to-[#FF6A00] text-white font-bold shadow-lg shadow-[#B60F17]/30 hover:shadow-xl hover:shadow-[#B60F17]/40 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-2"
        >
          <Search size={18} className="group-hover:scale-110 transition" />
          View Result
        </button>
      </form>
    </div>
  );
} 