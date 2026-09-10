"use client";

import { useState } from "react";
import ResultSearch from "@/app/student-corner/result/ResultSearch";
import ResultCard from "@/app/student-corner/result/ResultCard";

type Result = {
  studentName: string;
  fatherName: string;
  motherName: string;
  class: string;
  rollNo: string;
  session: string;
  subjects: Array<{ subject: string; max: number; obtain: number; grade: string }>;
};

export default function ResultPage() {

  const [result, setResult] = useState<Result | null>(null);

  return (
    <main className="min-h-screen bg-[#f4f8fc] py-20">

      <div className="max-w-6xl mx-auto px-5">

        <ResultSearch
          onResult={setResult}
        />

        {result && (
          <div className="mt-10">
            <ResultCard data={result}/>
          </div>
        )}

      </div>

    </main>
  );
}
