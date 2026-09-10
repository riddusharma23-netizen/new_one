'use client';

interface YearSelectorProps {
  value?: string;
  onChange?: (year: string) => void;
}

export default function YearSelector({
  value = "2025-2026",
  onChange,
}: YearSelectorProps) {
  const years = [
    "2022-2023",
    "2023-2024",
    "2024-2025",
    "2025-2026",
    "2026-2027",
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-blue-500"
    >
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
}