"use client";

import { Download, FileText } from "lucide-react";

interface Props {
  title: string;
  description: string;
  file: string;
}

export default function DocumentCard({
  title,
  description,
  file,
}: Props) {
  return (
    <div className="group rounded-[30px] border border-orange-100 bg-white p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-5">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B60F17] via-[#FF6A00] to-[#F8F000]">

            <FileText className="text-white" />

          </div>

          <div>

            <h3 className="text-xl font-bold">
              {title}
            </h3>

            <p className="mt-1 text-gray-600">
              {description}
            </p>

          </div>

        </div>

        <a
          href={file}
          download
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF5E8] text-[#B60F17] duration-300 hover:bg-[#FF6A00] hover:text-white"
        >
          <Download size={20} />
        </a>

      </div>

    </div>
  );
}