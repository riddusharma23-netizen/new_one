'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export default function SidebarItem({
  title,
  href,
  icon: Icon,
  badge,
}: SidebarItemProps) {
  const pathname = usePathname();

  const active =
    pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 ${
        active
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          size={20}
          className={`${
            active
              ? 'text-white'
              : 'text-slate-400 group-hover:text-white'
          }`}
        />

        <span className="font-medium">
          {title}
        </span>
      </div>

      {badge && (
        <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}