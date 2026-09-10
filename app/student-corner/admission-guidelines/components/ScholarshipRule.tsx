"use client";

import { CheckCircle2 } from "lucide-react";

interface ScholarshipRuleProps {
  text: string;
}

export default function ScholarshipRule({
  text,
}: ScholarshipRuleProps) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8F000]">

        <CheckCircle2
          size={14}
          className="text-white"
        />

      </div>

      <p className="text-gray-700 leading-7">
        {text}
      </p>

    </div>
  );
}