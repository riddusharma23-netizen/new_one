"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  School,
  Settings2,
  Users,
  X,
} from "lucide-react";
import AdminBackButton from "./AdminBackButton";

const navigation = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Our Faculty", href: "/admin/faculty", icon: Users },
  { label: "Gallery", href: "/admin/gallery", icon: Images },
  { label: "Departments", href: "/admin/departments", icon: School },
  { label: "Schedules", href: "/admin/schedules", icon: CalendarDays },
  { label: "Classes", href: "/admin/classes", icon: BookOpen },
  { label: "Subjects", href: "/admin/subjects", icon: Settings2 },
];

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login" || pathname === "/admin/login/") return <>{children}</>;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#101a2b] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-24 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c91520] text-lg font-black shadow-lg shadow-red-950/30">CD</div>
          <div><p className="text-sm font-black tracking-wide">CHAMPI DEVI</p><p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Administration</p></div>
          <button type="button" onClick={() => setOpen(false)} className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-4 py-6"><p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Workspace</p><nav className="space-y-1">{navigation.map(({ label, href, icon: Icon }) => { const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href)); return <Link key={href} href={href} onClick={() => setOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-[#c91520] text-white shadow-lg shadow-red-950/20" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}><Icon className="h-[18px] w-[18px]" /><span>{label}</span>{active ? <ChevronRight className="ml-auto h-4 w-4" /> : null}</Link>; })}</nav></div>
        <div className="mt-auto space-y-3 border-t border-white/10 p-4"><Link href="/" target="_blank" className="flex items-center justify-center rounded-xl border border-white/15 px-3 py-3 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white">View public website</Link><button type="button" onClick={() => void logout()} className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/15"><LogOut className="h-4 w-4" /> Sign out</button></div>
      </aside>
      {open ? <button aria-label="Close navigation" type="button" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" /> : null}
      <div className="lg:pl-72"><header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur md:px-8"><div className="flex items-center gap-3"><button type="button" onClick={() => setOpen(true)} className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"><Menu className="h-5 w-5" /></button><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c91520]">School control center</p><h1 className="text-lg font-black text-slate-900 md:text-xl">Admin workspace</h1></div></div><div className="hidden items-center gap-3 sm:flex"><div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />System online</div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-[#c91520]">SA</div></div></header><AdminBackButton /><main>{children}</main></div>
    </div>
  );
}
