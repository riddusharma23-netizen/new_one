"use client";

import { Download } from "lucide-react";

interface DownloadButtonProps {
  text: string;
  href: string;
}

export default function DownloadButton({
  text,
  href,
}: DownloadButtonProps) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8F000] px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105"
    >
      <Download size={20} />

      {text}
    </a>
  );
}