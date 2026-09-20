'use client';

import React, { useState, useMemo, useCallback } from 'react';

// ---------- CONFIGURATION ----------
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
const CLASSES = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B'];

const TEACHERS = [
  { name: 'Mr. Murari Sharma', subject: 'Math' },
  { name: 'Ms. Sandeep Sharma', subject: 'Physics' },
  { name: 'Mr. Shivam ', subject: 'Biology' },
  { name: 'Ms. Hemlata Sharma', subject: 'science' },
  { name: 'Mr. Rakesh Sharma', subject: 'History' },
  { name: 'Ms. Dharamvir Sharma', subject: 'Math' },
  { name: 'Mr. Dinesh', subject: 'Math' },
  { name: 'Ms. Devkinandan Sharma', subject: 'SST' },
  { name: 'Mr. Vineet Sharma', subject: 'Chemistory' },
  { name: 'Ms. Vineet Sir', subject: 'English' },
  { name: 'Mr. Anil Kaushik', subject: 'Science' },
  { name: 'Ms. Bhagwati Prasad', subject: 'Hindi' },
  { name: 'Ms. Suvarna', subject: 'Computer' },
];

// ---------- HELPERS ----------
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDates(monday: Date): Date[] {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function formatWeekRange(monday: Date): string {
  const sat = new Date(monday);
  sat.setDate(sat.getDate() + 5);
  return `${formatDateShort(monday)} – ${formatDateShort(sat)}, ${monday.getFullYear()}`;
}

// ---------- GENERATE RANDOM SCHEDULE ----------
function generateSchedule() {
  const sched: Record<number, Record<string, Record<string, typeof TEACHERS[0] | null>>> = {};
  DAYS.forEach((_, dIdx) => {
    sched[dIdx] = {};
    const used: Record<string, string[]> = {};
    PERIODS.forEach((period, pIdx) => {
      sched[dIdx][period] = {};
      used[period] = [];
      CLASSES.forEach((cls, cIdx) => {
        // Off for some classes in 6th period
        if (pIdx === 5 && (cIdx === 3 || cIdx === 5 || cIdx === 7)) {
          sched[dIdx][period][cls] = null;
          return;
        }
        const available = TEACHERS.filter(t => !used[period].includes(t.name));
        if (available.length === 0) {
          sched[dIdx][period][cls] = null;
          return;
        }
        if (Math.random() < 0.12) {
          sched[dIdx][period][cls] = null;
        } else {
          const idx = Math.floor(Math.random() * available.length);
          const teacher = { ...available[idx] };
          used[period].push(teacher.name);
          sched[dIdx][period][cls] = teacher;
        }
      });
    });
  });
  return sched;
}

// ---------- MAIN COMPONENT ----------
export default function Home() {
  // State: schedule is now mutable via setSchedule
  const [schedule, setSchedule] = useState(() => generateSchedule());
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  // Editing state: track which cell is being edited (dayIdx, period, class)
  const [editingCell, setEditingCell] = useState<{ dayIdx: number; period: string; cls: string } | null>(null);

  // Derived: week dates
  const monday = useMemo(() => getMonday(currentDate), [currentDate]);
  const weekDates = useMemo(() => getWeekDates(monday), [monday]);

  // Update teacher for a specific cell
  const updateTeacher = useCallback(
    (dayIdx: number, period: string, cls: string, teacher: typeof TEACHERS[0] | null) => {
      setSchedule(prev => {
        const newSched = { ...prev };
        if (!newSched[dayIdx]) newSched[dayIdx] = {};
        if (!newSched[dayIdx][period]) newSched[dayIdx][period] = {};
        newSched[dayIdx][period][cls] = teacher;
        return newSched;
      });
      setEditingCell(null); // close editing
    },
    []
  );

  // Navigation
  const goToWeek = useCallback((date: Date) => {
    const mon = getMonday(date);
    setCurrentDate(mon);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const week = getWeekDates(mon);
    const idx = week.findIndex(d => d.getTime() === today.getTime());
    setCurrentDayIndex(idx === -1 ? 0 : idx);
  }, []);

  const goToToday = useCallback(() => {
    goToWeek(new Date());
  }, [goToWeek]);

  const prevMonth = useCallback(() => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    goToWeek(first);
  }, [currentDate, goToWeek]);

  const nextMonth = useCallback(() => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    goToWeek(first);
  }, [currentDate, goToWeek]);

  // Stats
  const daySched = schedule[currentDayIndex];
  const dateStr = formatDate(weekDates[currentDayIndex]);
  const stats = useMemo(() => {
    let total = 0,
      filled = 0,
      empty = 0;
    if (daySched) {
      PERIODS.forEach(p => {
        const pData = daySched[p];
        if (!pData) return;
        CLASSES.forEach(cls => {
          total++;
          const t = pData[cls];
          if (t === null || t === undefined) empty++;
          else filled++;
        });
      });
    }
    return { total, filled, empty };
  }, [daySched]);

  // Export
  const exportView = useCallback(() => {
    const rows: string[] = [];
    rows.push(['Period', ...CLASSES].join('\t'));
    PERIODS.forEach(p => {
      const row = [p];
      const pData = daySched?.[p] || {};
      CLASSES.forEach(cls => {
        const t = pData[cls];
        if (t === null || t === undefined) row.push('—');
        else row.push(t.name);
      });
      rows.push(row.join('\t'));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `timetable_${dateStr}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [daySched, dateStr]);

  // Check if a cell is currently being edited
  const isEditing = (idx: number, period: string, cls: string) =>
    editingCell?.dayIdx === idx && editingCell?.period === period && editingCell?.cls === cls;

  // Handler for dropdown change
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    dayIdx: number,
    period: string,
    cls: string
  ) => {
    const value = e.target.value;
    if (value === '') {
      updateTeacher(dayIdx, period, cls, null);
    } else {
      const teacher = TEACHERS.find(t => t.name === value);
      if (teacher) {
        updateTeacher(dayIdx, period, cls, { ...teacher });
      }
    }
    setEditingCell(null);
  };

  // Click on a cell to start editing (only if not off)
  const handleCellClick = (dayIdx: number, period: string, cls: string) => {
    // If it's an off cell (daySched?.[period]?.[cls] === null and it's a fixed off), we can't edit.
    // But we allow editing any non-off cell, even empty.
    // So we check if the cell is off (based on generation logic). We'll just allow editing any cell.
    setEditingCell({ dayIdx, period, cls });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl p-5 md:p-8">
        {/* HEADER */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {/* <div className="bg-gradient-to-br from-blue-800 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shadow-md">
              
            </div> */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Smt. Champi Devi  <span className="font-light text-[#B70F17]">Inter College</span>
              </h1>
              <p className="text-sm text-gray-500">📋 Dynamic Weekly Timetable · Mon–Sat</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
              <button
                onClick={prevMonth}
                className="px-3 py-1 text-lg font-semibold text-[#B70F17] hover:bg-gray-200 rounded-full transition"
              >
                ◀
              </button>
              <span className="font-semibold text-gray-700 min-w-[90px] text-center text-sm">
                {formatMonthYear(monday)}
              </span>
              <button
                onClick={nextMonth}
                className="px-3 py-1 text-lg font-semibold text-[#B70F17] hover:bg-gray-200 rounded-full transition"
              >
                ▶
              </button>
              <button
                onClick={goToToday}
                className="bg-[#B70F17] text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-800 transition ml-1"
              >
                Today
              </button>
            </div>
            <div className="text-sm bg-blue-50 px-4 py-1.5 rounded-full text-[#B70F17] whitespace-nowrap">
              {formatWeekRange(monday)}
            </div>
            <div className="flex flex-wrap gap-3 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200">
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                <span className="inline-block w-3 h-3 bg-blue-100 border border-blue-300 rounded"></span> Teaching
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                <span className="inline-block w-3 h-3 bg-gray-100 border border-dashed border-gray-300 rounded"></span> Empty
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                <span className="inline-block w-3 h-3 bg-gray-200 border border-gray-300 rounded"></span> Off
              </span>
            </div>
          </div>
        </header>

        {/* DAY TABS */}
        <div className="flex flex-wrap gap-1.5 border-b border-gray-200 pb-3 mb-4">
          {DAYS.map((day, idx) => {
            const date = weekDates[idx];
            const isActive = idx === currentDayIndex;
            return (
              <button
                key={day}
                onClick={() => setCurrentDayIndex(idx)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                  isActive ? 'bg-[#B70F17] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {day} {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* TIMETABLE TABLE */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left font-bold text-gray-700 border-b border-gray-200 sticky left-0 bg-gray-50">
                  ⏰ Period
                </th>
                {CLASSES.map(cls => (
                  <th
                    key={cls}
                    className="px-3 py-3 text-center font-bold text-gray-700 border-b border-gray-200 whitespace-nowrap"
                  >
                    {cls}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map(period => {
                const pData = daySched?.[period] || {};
                return (
                  <tr key={period}>
                    <td className="px-3 py-2 font-semibold text-gray-600 border-b border-gray-100 sticky left-0 bg-white whitespace-nowrap">
                      {period}
                    </td>
                    {CLASSES.map(cls => {
                      const teacher = pData[cls] ?? null;
                      const isOff = teacher === null && (() => {
                        // Check if this is a fixed off (6th period for some classes)
                        // We can't easily know from schedule alone; but we can check if the teacher is null
                        // and the period is 6th and class matches off pattern.
                        // For simplicity, we treat any null as editable (including off).
                        // But we want to visually distinguish off cells.
                        // We'll rely on the fact that off cells are only in 6th period for certain classes.
                        // We can recalc the condition.
                        const pIdx = PERIODS.indexOf(period);
                        const cIdx = CLASSES.indexOf(cls);
                        return pIdx === 5 && (cIdx === 3 || cIdx === 5 || cIdx === 7);
                      })();

                      const isEditingCell = isEditing(currentDayIndex, period, cls);

                      let cellContent;
                      if (isOff) {
                        cellContent = (
                          <div className="flex flex-col items-center justify-center min-h-[44px] bg-gray-100 rounded-lg border border-gray-200">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">OFF</span>
                          </div>
                        );
                      } else if (isEditingCell) {
                        // Render dropdown
                        cellContent = (
                          <div className="flex flex-col items-center justify-center min-h-[44px] bg-blue-50 rounded-lg border-2 border-blue-400">
                            <select
                              className="w-full text-sm bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              defaultValue={teacher ? teacher.name : ''}
                              onChange={(e) => handleSelectChange(e, currentDayIndex, period, cls)}
                              onBlur={() => setEditingCell(null)}
                              autoFocus
                            >
                              <option value="">— Empty —</option>
                              {TEACHERS.map(t => (
                                <option key={t.name} value={t.name}>
                                  {t.name} ({t.subject})
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      } else if (teacher === null || teacher === undefined) {
                        // Empty (click to assign)
                        cellContent = (
                          <div
                            className="flex flex-col items-center justify-center min-h-[44px] bg-gray-50 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => handleCellClick(currentDayIndex, period, cls)}
                          >
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Empty</span>
                            <span className="text-[9px] text-gray-400 mt-0.5">click to assign</span>
                          </div>
                        );
                      } else {
                        // Teacher assigned (click to edit)
                        cellContent = (
                          <div
                            className="flex flex-col items-center justify-center min-h-[44px] bg-blue-50 rounded-lg border border-blue-200 cursor-pointer transition hover:bg-blue-100 hover:scale-[1.02]"
                            onClick={() => handleCellClick(currentDayIndex, period, cls)}
                          >
                            <span className="font-semibold text-blue-800">{teacher.name}</span>
                            <span className="text-[11px] text-gray-500">{teacher.subject}</span>
                          </div>
                        );
                      }

                      return (
                        <td key={cls} className="px-1 py-1.5 border-b border-gray-100 text-center">
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📘 Total</span>
              <span className="font-bold text-blue-700 text-lg">{stats.total}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>✅ Filled</span>
              <span className="font-bold text-green-600 text-lg">{stats.filled}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>⬜ Empty</span>
              <span className="font-bold text-gray-600 text-lg">{stats.empty}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSchedule(generateSchedule())}
              className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-full text-sm font-semibold text-gray-700 transition"
            >
              🔄 Reset Schedule
            </button>
            <button
              onClick={exportView}
              className="px-4 py-1.5 bg-[#B70F17] hover:bg-[#eb141e] rounded-full text-sm font-semibold text-white transition shadow"
            >
              📤 Export View
            </button>
          </div>
        </div>

        {/* TOAST (simple inline) */}
        <div
          id="toast"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-900 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg opacity-0 transition-opacity duration-300 pointer-events-none"
        >
          <span id="toastMessage">Done</span>
        </div>
      </div>
    </div>
  );
}