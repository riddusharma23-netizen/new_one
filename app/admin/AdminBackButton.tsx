"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminBackButton() {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-3 md:px-8">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#B60F17] hover:text-[#B60F17]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
    </div>
  );
}
