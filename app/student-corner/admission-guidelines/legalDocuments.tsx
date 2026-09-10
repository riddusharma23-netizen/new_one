"use client";

import SectionHeading from "./components/SectionHeading";
import DocumentCard from "./components/DocumentCard";

import { legalDocumentsData } from "./components/data/legaldocumentsData";

export default function LegalDocuments() {
  const { heading, documents } = legalDocumentsData;

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[650px] w-[650px] rounded-full bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8F000] opacity-10 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <SectionHeading
          badge={heading.badge}
          titleBlack={heading.titleBlack}
          titleGradient={heading.titleGradient}
          description={heading.description}
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {documents.map((item) => (
            <DocumentCard
              key={item.id}
              title={item.title}
              description={item.description}
              file={item.file}
            />
          ))}

        </div>

      </div>

    </section>
  );
}