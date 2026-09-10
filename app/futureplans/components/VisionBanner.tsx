'use client';

import { ArrowRight } from "lucide-react";

export default function VisionBanner() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-[#B60F17] via-[#DF6525] to-[#F8B400] p-14 text-white shadow-2xl">

          <div className="max-w-4xl">

            <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">

              OUR VISION

            </span>

            <h2 className="mt-6 text-4xl lg:text-6xl font-black leading-tight">

              Building Tomorrow's
              Leaders Through
              Modern Education

            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/90">

              Champi Devi Inter College is committed to providing
              modern infrastructure, quality education, career
              guidance, and a sustainable green environment so every
              student can build a brighter future.

            </p>

            <button className="mt-10 flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-bold text-[#B60F17] transition hover:scale-105">

              Learn More

              <ArrowRight size={20} />

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}