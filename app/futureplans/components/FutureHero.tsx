'use client';

import { ArrowRight, Target, CalendarDays, GraduationCap, Sparkles } from "lucide-react";

export default function FutureHero() {
  return (
    <section className="relative overflow-hidden py-10">

      {/* Background Shapes */}
      {/* <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-orange-300/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-yellow-300/20 blur-[140px]" /> */}

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Badge */}

        <div className="flex justify-center">

          <span className="inline-flex items-center gap-2 rounded-full bg-[#F8F000] px-6 py-2 text-sm font-semibold text-[#DF6525] shadow">

            <Sparkles size={16} />

            CHAMPI DEVI INTER COLLEGE

          </span>

        </div>

        {/* Heading */}

        <div className="mx-auto mt-8 max-w-5xl text-center">

          <h1 className="text-4xl lg:text-6xl font-black' leading-tight">

            Our

            <span className="text-[#DF6525]">

              {" "}Future Development{" "}

            </span>

            Plan

          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-900">

            Champi Devi Inter College is committed to creating a safe,
            modern and student-friendly learning environment through
            road development, smart classrooms, career guidance and
            a sustainable green campus for future generations.

          </p>

        </div>

        {/* Stats */}

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl border bg-white p-7 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">

            <Target className="mb-4 text-[#DF6525]" size={34} />

            <h3 className="text-4xl font-black text-[#DF6525]">

              04

            </h3>

            <p className="mt-2 text-slate-600">

              Major Development Projects

            </p>

          </div>

          <div className="rounded-3xl border bg-white p-7 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">

            <CalendarDays className="mb-4 text-[#DF6525]" size={34} />

            <h3 className="text-4xl font-black text-[#DF6525]">

              2026

            </h3>

            <p className="mt-2 text-slate-600">

              Project Launch

            </p>

          </div>

          <div className="rounded-3xl border bg-white p-7 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">

            <GraduationCap className="mb-4 text-[#DF6525]" size={34} />

            <h3 className="text-4xl font-black text-[#DF6525]">

              100%

            </h3>

            <p className="mt-2 text-slate-600">

              Student Focused

            </p>

          </div>

          <div className="rounded-3xl bg-gradient-to-r from-[#DF6525] to-[#B60F17] p-7 text-white shadow-xl transition hover:-translate-y-2 hover:shadow-2xl">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-2xl font-bold">

                  Future Vision

                </h3>

                <p className="mt-2 text-sm opacity-90">

                  Modern Education For Everyone

                </p>

              </div>

              <ArrowRight size={34} />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}