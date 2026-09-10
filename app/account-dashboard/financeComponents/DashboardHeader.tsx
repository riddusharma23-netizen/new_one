'use client';

import { Bell, CalendarDays, Search, UserCircle2 } from 'lucide-react';
import YearSelector from './YearSelector';
import MonthSelector from './MonthSelector';
interface DashboardHeaderProps {
  collapsed: boolean;
}
export default function DashboardHeader({
  collapsed,
}: DashboardHeaderProps) {
  return (
    <header className={`
 fixed
top-0
right-0
h-20
z-30
transition-all
duration-300

left-0
   bg-gradient-to-r   from-[#B60F17]   to-[#FF6A00]   text-white   shadow-[0_4px_20px_rgba(255,120,0,0.35),0_12px_30px_rgba(100,30,0,0.22)]   


${collapsed ? "lg:left-24" : "lg:left-72"}
  `}>

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 px-6 py-4">
 
        {/* Left */}

        <div>

          <h1 className="text-2xl font-bold text-slate-800">

            Finance Dashboard

          </h1>

          <p className="text-sm text-slate-500 mt-1">

            Champi Devi Inter College ERP

          </p>

        </div>

        {/* Right */}

        <div className="flex flex-wrap items-center gap-3">

          {/* Search */}

          <div className="relative">

            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-64 rounded-xl border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 outline-none focus:border-blue-500"
            />

          </div>

          {/* Year */}

          <YearSelector />

          {/* Month */}

          <MonthSelector />

          {/* Calendar */}

          <button className="rounded-xl border border-slate-300 p-2 hover:bg-slate-100">

            <CalendarDays size={20} />

          </button>

          {/* Notification */}

          <button className="relative rounded-xl border border-slate-300 p-2 hover:bg-slate-100">

            <Bell size={20} />

            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>

          </button>

          {/* Profile */}

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2">

            <UserCircle2
              size={38}
              className="text-blue-600"
            />

            <div>

              <p className="text-sm font-semibold text-slate-800">

                Administrator

              </p>

              <p className="text-xs text-slate-500">

                admin@champidevi.edu.in

              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}