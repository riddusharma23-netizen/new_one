'use client';

import { useState } from 'react';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle2,
  School,
} from 'lucide-react';

import SidebarMenu from './SidebarMenu';

interface FinanceSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FinanceSidebar({
  collapsed,
  setCollapsed,
}: FinanceSidebarProps) {

  const [mobileOpen, setMobileOpen] = useState(false);


  

  return (
    <>
    

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-5 left-5 z-50 rounded-lg bg-blue-600 p-2 text-white shadow-lg lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
    fixed
    top-0
    left-0
    z-40

    flex
    flex-col

    h-screen
   bg-gradient-to-r   from-[#B60F17]   to-[#FF6A00]   text-white   shadow-[0_4px_20px_rgba(255,120,0,0.35),0_12px_30px_rgba(100,30,0,0.22)]   
    text-white

    border-r
    border-slate-800

    transition-all
    duration-300

    ${collapsed ? "lg:w-24 w-72" : "w-72"}

    ${
      mobileOpen
        ? "translate-x-0"
        : "-translate-x-full lg:translate-x-0"}
  `}
      >
        {/* Header */}

        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">

              <School size={28} />

            </div>

            {!collapsed && (

              <div>

                <h2 className="text-lg font-bold">

                  Champi Devi

                </h2>

                <p className="text-xs text-slate-400">

                  School ERP

                </p>

              </div>

            )}

          </div>

          {/* Mobile Close */}

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
          >
            <X size={22} />
          </button>

        </div>

        {/* Collapse Button */}

        <div className="hidden lg:flex justify-end px-3 py-3">

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg bg-slate-800 p-2 hover:bg-blue-600 transition"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>

        </div>

        {/* Menu */}

        <div className="h-[calc(100vh-190px)] overflow-y-auto px-3">

          <SidebarMenu />

        </div>

        {/* Footer */}

        <div className="absolute bottom-0 left-0 w-full border-t border-slate-800 p-4">

          {!collapsed && (

            <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-800 p-3">

              <UserCircle2
                size={45}
                className="text-blue-400"
              />

              <div>

                <h4 className="font-semibold">

                  Administrator

                </h4>

                <p className="text-xs text-slate-400">

                  admin@champidevi.edu.in

                </p>

              </div>

            </div>

          )}

          <button
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-4 py-3 font-medium transition hover:bg-red-700"
          >

            <LogOut size={20} />

            {!collapsed && 'Logout'}

          </button>

        </div>

      </aside>
    </>
  );
}