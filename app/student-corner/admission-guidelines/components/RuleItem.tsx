"use client";

import { CheckCircle2 } from "lucide-react";

interface RuleItemProps {
  text: string;
}

export default function RuleItem({ text }: RuleItemProps) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2
        size={18}
        className="mt-1 text-[#FF6A00] flex-shrink-0"
      />

      <p className="text-gray-700 leading-7">
        {text}
      </p>
    </div>
  );
}