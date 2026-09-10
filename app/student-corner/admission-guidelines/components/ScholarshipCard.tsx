"use client";

import ScholarshipRule from "./ScholarshipRule";

interface ScholarshipCardProps {
  title: string;
  points: string[];
}

export default function ScholarshipCard({
  title,
  points,
}: ScholarshipCardProps) {
  return (
    <div className="rounded-[30px] border border-orange-100 bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

      <h3 className="text-2xl font-bold text-[#B60F17]">
        {title}
      </h3>

      <div className="mt-6 space-y-5">

        {points.map((item, index) => (
          <ScholarshipRule
            key={index}
            text={item}
          />
        ))}

      </div>

    </div>
  );
}