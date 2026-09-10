import Link from "next/link";

export default function StudentCornerPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-20">
      <h1 className="text-4xl font-black text-[#072F60]">Student Corner</h1>
      <p className="mt-4 text-gray-600">Explore student resources, achievements, and examination results.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link className="rounded-xl bg-[#B60F17] px-5 py-3 font-semibold text-white" href="/student-corner/result">
          Check results
        </Link>
        <Link className="rounded-xl border border-[#072F60] px-5 py-3 font-semibold text-[#072F60]" href="/student-corner/achievent">
          View achievements
        </Link>
      </div>
    </main>
  );
}
