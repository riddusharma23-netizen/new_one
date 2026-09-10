"use client";

import { CheckCircle2 } from "lucide-react";

interface GuidelineCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  points: string[];
}

export default function GuidelineCard({
  icon: Icon,
  title,
  description,
  points,
}: GuidelineCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[30px] border border-orange-100 bg-white p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      {/* Background Glow */}

      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-orange-200 opacity-20 blur-3xl transition-all duration-700 group-hover:scale-150" />

      {/* Icon */}

      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#B60F17] via-[#FF6A00] to-[#F8F000] shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
        <Icon size={36} className="text-white" />
      </div>

      {/* Title */}

      <h3 className="mt-8 text-2xl font-bold text-slate-900">
        {title}
      </h3>

      {/* Description */}

      <p className="mt-4 leading-8 text-gray-600">
        {description}
      </p>

      {/* Points */}

      <div className="mt-8 space-y-4">
        {points.map((point, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle2
              className="mt-1 text-[#FF6A00]"
              size={20}
            />

            <p className="leading-7 text-gray-700">
              {point}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}