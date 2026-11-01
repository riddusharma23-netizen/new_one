"use client";

import { useMemo, useState } from "react";

type Option = { id: number | string; label: string; hint?: string };

export default function SearchSelect({
  label,
  value,
  options,
  placeholder = "Search and select",
  allowEmpty = true,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  placeholder?: string;
  allowEmpty?: boolean;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return options.slice(0, 80);
    return options.filter((option) => `${option.label} ${option.hint ?? ""}`.toLowerCase().includes(term)).slice(0, 80);
  }, [options, query]);

  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium"
      />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
      >
        {allowEmpty ? <option value="">Unassigned</option> : <option value="">Select</option>}
        {filtered.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
            {option.hint ? ` · ${option.hint}` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
