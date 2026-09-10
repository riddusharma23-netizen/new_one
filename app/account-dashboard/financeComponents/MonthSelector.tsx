'use client';

interface MonthSelectorProps {
  value?: string;
  onChange?: (month: string) => void;
}

export default function MonthSelector({
  value = "July",
  onChange,
}: MonthSelectorProps) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-blue-500"
    >
      {months.map((month) => (
        <option key={month} value={month}>
          {month}
        </option>
      ))}
    </select>
  );
}