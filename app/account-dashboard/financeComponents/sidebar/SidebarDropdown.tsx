'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';

interface ChildItem {
  title: string;
  href: string;
}

interface SidebarDropdownProps {
  title: string;
  icon: LucideIcon;
  childrenItems: ChildItem[];
}

export default function SidebarDropdown({
  title,
  icon: Icon,
  childrenItems,
}: SidebarDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>

      {/* Parent */}

      <button
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
      >
        <div className="flex items-center gap-3">

          <Icon
            size={20}
            className="text-slate-400 group-hover:text-white"
          />

          <span className="font-medium">

            {title}

          </span>

        </div>

        {open ? (
          <ChevronDown size={18} />
        ) : (
          <ChevronRight size={18} />
        )}
      </button>

      {/* Children */}

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[600px] mt-2' : 'max-h-0'
        }`}
      >
        <div className="ml-11 space-y-1 border-l border-slate-700 pl-4">

          {childrenItems.map((item) => (

            <a
              key={item.href}
              href={item.href}
              className="block rounded-lg py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:px-2 hover:text-white"
            >
              {item.title}
            </a>

          ))}

        </div>
      </div>
    </div>
  );
}