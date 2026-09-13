"use client";

import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  IndianRupee,
  Info,
} from "lucide-react";

import SectionHeading from "./components/SectionHeading";
import GuidelineCard from "./components/GuidelineCard";

import { admissionGuidelinesData } from "./components/data/admission";

export default function AdmissionGuidelines() {
  const {
    heading,
    image,
    sections,
    button,
    note,
    // importantDates,
  } = admissionGuidelinesData;

  return (
    <section className="relative overflow-hidden bg-[#fffdf8] py-12 md:py-16 lg:py-24">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-40 top-32 h-[500px] w-[500px] rounded-full bg-[#B60F17]/5 blur-[130px]" />

      <div className="pointer-events-none absolute -right-40 top-[35%] h-[500px] w-[500px] rounded-full bg-[#FF8A00]/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <SectionHeading
          badge={heading.badge}
          titleBlack={heading.titleBlack}
          titleGradient={heading.titleGradient}
          description={heading.description}
        />

        {/* Top Dates Strip */}
        {/* <div className="mb-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {importantDates.map((item) => (
            <div
              key={item.label}
              className="
                relative overflow-hidden
                rounded-2xl
                border border-orange-100
                bg-white
                p-5
                shadow-[0_10px_35px_rgba(30,30,30,0.06)]
              "
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#B60F17] to-[#FF6A00] text-white">
                <CalendarDays size={20} />
              </div>

              <p className="text-sm font-semibold text-gray-500">
                {item.label}
              </p>

              <p className="mt-1 text-lg font-black text-gray-900">
                {item.value}
              </p>
            </div>
          ))}
        </div> */}

      {/* Main Layout */}
<div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] xl:gap-16">

  {/* LEFT */}
  <div className="lg:sticky lg:top-24 lg:self-start">

    <div
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border border-white
        bg-white
        p-2
        shadow-[0_25px_70px_rgba(42,29,20,0.12)]
      "
    >
      <div className="relative overflow-hidden rounded-[22px]">

        <Image
          src={image}
          alt="Admission Guidelines"
          width={760}
          height={1000}
          className="
            h-[440px]
            w-full
            object-cover
            transition-transform
            duration-700
            hover:scale-105
            sm:h-[520px]
            lg:h-[620px]
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        {/* Floating Admission Card */}
        <div
          className="
            absolute
            bottom-5
            left-5
            right-5
            rounded-[22px]
            border
            border-white/20
            bg-white/95
            p-5
            shadow-2xl
            backdrop-blur-xl
            sm:bottom-7
            sm:left-7
            sm:right-auto
            sm:min-w-[280px]
          "
        >
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B60F17] text-white">
              <GraduationCap size={24} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B60F17]">
                Session
              </p>

              <h3 className="text-2xl font-black text-gray-900">
                2026–2027
              </h3>
            </div>

          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="font-bold text-gray-900">
              Admissions Open
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Admissions Open for Classes 6 to 12
            </p>
          </div>

        </div>

      </div>
    </div>

    {/* Fee Highlight */}
    <div
      className="
        mt-6
        rounded-[26px]
        bg-gradient-to-br
        from-[#B60F17]
        via-[#D83217]
        to-[#FF7900]
        p-6
        text-white
        shadow-[0_20px_50px_rgba(182,15,23,0.22)]
      "
    >
      <div className="flex items-start gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
          <IndianRupee size={24} />
        </div>

        <div>
          <p className="text-sm font-semibold text-white/80">
            Application Form Fee
          </p>

          <p className="mt-1 text-3xl font-black">
            ₹100
          </p>

          <p className="mt-2 text-sm leading-6 text-white/85">
            All students seeking admission must fill and submit
            the prescribed application form.
          </p>
        </div>

      </div>
    </div>

  </div>

  {/* RIGHT - INTERNAL SCROLL */}
  <div
    className="
      space-y-6

      lg:max-h-[calc(100vh-7rem)]
      lg:overflow-y-auto
      lg:overscroll-contain
      lg:pr-3

      lg:[scrollbar-width:thin]
      lg:[scrollbar-color:#B60F17_transparent]

      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-[#B60F17]/35
      hover:[&::-webkit-scrollbar-thumb]:bg-[#B60F17]/65
    "
  >

    {sections.map((section) => (
      <GuidelineCard
        key={section.id}
        icon={section.icon}
        title={section.title}
        description={section.description}
        points={section.points}
      />
    ))}

    {/* Important Note */}
    <div
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-orange-200
        bg-gradient-to-br
        from-orange-50
        via-white
        to-red-50
        p-6
        sm:p-8
      "
    >
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-300/20 blur-3xl" />

      <div className="relative flex items-start gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF6A00] text-white shadow-lg">
          <Info size={24} />
        </div>

        <div>
          <h3 className="text-xl font-black text-[#B60F17] sm:text-2xl">
            {note.title}
          </h3>

          <p className="mt-3 whitespace-pre-line leading-7 text-gray-700">
            {note.description}
          </p>
        </div>

      </div>
    </div>

    {/* CTA */}
    <div className="pb-3 pt-2">

      <a
        href={button.link}
        className="
          group
          inline-flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-2xl
          bg-gradient-to-r
          from-[#B60F17]
          via-[#D72B17]
          to-[#FF7200]
          px-7
          py-4
          text-base
          font-bold
          text-white
          shadow-[0_15px_35px_rgba(182,15,23,0.22)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_20px_45px_rgba(182,15,23,0.30)]
          sm:w-auto
        "
      >
        {button.text}

        <ArrowRight
          size={20}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </a>

    </div>

  </div>

</div>
      </div>
    </section>
  );
}