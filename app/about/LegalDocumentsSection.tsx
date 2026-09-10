"use client";

import { FileText, Download } from "lucide-react";
import { legalDocumentsData } from "./legalDocumentsData";

export default function LegalDocumentsSection() {
  const { heading, documents } = legalDocumentsData;

  return (
    <section className="relative py-10 bg-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8F000] opacity-10 blur-[180px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Dynamic Heading */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-5 py-2 rounded-full shadow-lg bg-[#F8F400] text-[#B60F17] font-semibold">
            {heading.subtitle}
          </span>

        <h2 className="   mt-8 text-4xl lg:text-5xl font-black' leading-tight">

    <span className="block text-slate-900">
      {heading.titleBlack}
    </span>

    <span className="block mt-2 text-[#B60F17]">
      {heading.titleGradient}
    </span>

  </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            {heading.description}
          </p>
        </div>

        {/* Documents List */}
        <div className="grid gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 duration-500"
            >
              {/* Left Content */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#B60F17] via-[#FF6A00] to-[#F8F000] shadow-lg">
                  <FileText size={28} className="text-white" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {doc.title}
                  </h3>

                  <p className="mt-1 text-gray-600 leading-7">
                    {doc.description}
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <a
                href={doc.fileUrl}
                download
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8F000] px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 duration-300"
              >
                <Download size={18} />
                Download PDF
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}