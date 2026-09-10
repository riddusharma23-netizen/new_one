"use client";

import Image from "next/image";

import SectionHeading from "./components/SectionHeading";

import { disciplineData } from "./components/data/discipline";

export default function Discipline() {
  const {
    heading,
    image,
    rules,
    quote,
    note,
    committee,
  } = disciplineData;

  return (
    <section className="overflow-hidden bg-slate-50 py-10 md:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Heading */}
        <SectionHeading
          badge={heading.badge}
          titleBlack={heading.titleBlack}
          titleGradient={heading.titleGradient}
          description={heading.description}
        />

        {/* Main Layout */}
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">

          {/* LEFT - RULES */}
          <div className="space-y-6">

            {rules.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-slate-100
                    bg-white
                    p-5
                    shadow-[0_12px_35px_rgba(15,23,42,0.06)]
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)]
                    sm:p-7
                  "
                >
                  {/* Decorative Glow */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-200/20 blur-2xl" />

                  <div className="relative flex items-start gap-4 sm:gap-6">

                    {/* Icon */}
                    <div
                      className="
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-gradient-to-br
                        from-[#B60F17]
                        via-[#FF6A00]
                        to-[#F8F000]
                        shadow-lg
                        sm:h-16
                        sm:w-16
                      "
                    >
                      <Icon className="text-white" size={28} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">

                      <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
                        {item.title}
                      </h3>

                      <p className="mt-3 leading-7 text-slate-600">
                        {item.description}
                      </p>

                      {item.points && item.points.length > 0 && (
                        <ul className="mt-5 space-y-3">

                          {item.points.map((point, index) => (
                            <li
                              key={index}
                              className="
                                flex
                                items-start
                                gap-3
                                text-sm
                                leading-7
                                text-slate-700
                                sm:text-[15px]
                              "
                            >
                              <span
                                className="
                                  mt-[10px]
                                  h-2
                                  w-2
                                  shrink-0
                                  rounded-full
                                  bg-gradient-to-r
                                  from-[#B60F17]
                                  to-[#FF6A00]
                                "
                              />

                              <span>{point}</span>

                            </li>
                          ))}

                        </ul>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}

            {/* Note */}
            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                bg-gradient-to-r
                from-[#8f0910]
                via-[#B60F17]
                to-[#FF6A00]
                p-6
                text-white
                shadow-[0_18px_45px_rgba(182,15,23,0.25)]
                sm:p-8
              "
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-white/5" />

              <div className="relative">

                <p
                  className="
                    mb-3
                    inline-flex
                    rounded-full
                    bg-white/15
                    px-3
                    py-1
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                  "
                >
                  Important
                </p>

                <h3 className="text-2xl font-black sm:text-3xl">
                  {note.title}
                </h3>

                <p className="mt-4 leading-8 text-white/90">
                  {note.description}
                </p>

              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-24">

            <div
              className="
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-white
                bg-white
                p-2
                shadow-[0_25px_70px_rgba(15,23,42,0.14)]
              "
            >
              <div className="relative overflow-hidden rounded-[26px]">

                <Image
                  src={image}
                  alt="School Discipline"
                  width={700}
                  height={900}
                  className="
                    h-[480px]
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    hover:scale-105
                    sm:h-[580px]
                    lg:h-[720px]
                  "
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

                {/* Quote Card */}
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
                    sm:left-auto
                    sm:right-7
                    sm:max-w-sm
                    sm:p-6
                  "
                >
                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#B60F17]">
                    Discipline
                  </p>

                  <p className="mt-3 italic leading-7 text-slate-700">
                    “{quote}”
                  </p>

                </div>

              </div>
            </div>

            {/* Small Info Card */}
            <div
              className="
                mt-6
                rounded-[26px]
                border
                border-orange-100
                bg-white
                p-6
                shadow-[0_12px_35px_rgba(15,23,42,0.06)]
              "
            >
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B60F17]">
                Session
              </p>

              <h3 className="mt-2 text-3xl font-black text-slate-900">
                2026–2027
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Students are expected to maintain discipline, regular attendance,
                academic responsibility and respectful conduct throughout the session.
              </p>
            </div>

          </div>

        </div>

        {/* Committee Rules */}
        <div
          className="
            relative
            mt-12
            w-full
            overflow-hidden
            rounded-[28px]
            bg-gradient-to-r
            from-[#8f0910]
            via-[#B60F17]
            to-[#d91a24]
            px-5
            py-6
            shadow-[0_15px_40px_rgba(182,15,23,0.30)]
            sm:px-8
            sm:py-8
            lg:mt-16
            lg:px-10
          "
        >
          {/* Background Design */}
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute bottom-[-100px] left-[35%] h-48 w-48 rounded-full bg-white/5" />

          {/* Content */}
          <div className="relative z-10 flex items-center gap-4 sm:gap-6">

            {/* Icon */}
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-2xl
                shadow-lg
                sm:h-16
                sm:w-16
                sm:text-3xl
              "
            >
              👥
            </div>

            {/* Text */}
            <div className="flex-1">

              <span
                className="
                  mb-2
                  inline-block
                  rounded-full
                  bg-[#F8F400]
                  px-3
                  py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#B60F17]
                  sm:text-xs
                "
              >
                {committee.badge}
              </span>

              <h2
                className="
                  text-xl
                  font-black
                  leading-tight
                  text-white
                  sm:text-2xl
                  lg:text-3xl
                "
              >
                {committee.title}
              </h2>

              <p
                className="
                  mt-3
                  max-w-4xl
                  text-xs
                  leading-relaxed
                  text-white/90
                  sm:text-sm
                  lg:text-base
                  lg:leading-7
                "
              >
                {committee.description}
              </p>

            </div>

            {/* Arrow */}
            <div
              className="
                hidden
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-xl
                font-bold
                text-[#B60F17]
                shadow-lg
                transition-all
                duration-300
                hover:translate-x-2
                hover:bg-[#F8F400]
                md:flex
              "
            >
              →
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}