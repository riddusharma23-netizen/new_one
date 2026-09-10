"use client";

import Image from "next/image";
import Link from "next/link";

import { whyChooseUs } from "@/data/whyChooseUs";
import { labs } from "@/data/labs";

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden py-24">

      {/* Background */}

      <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-orange-100 blur-[150px]" />

      <div className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full bg-yellow-100 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-5">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-[#F8F000] shadow-md px-6 py-2 font-bold tracking-[3px] text-[#B60F17]">
            WHY CHOOSE US
          </span>

          <h2 className="mt-6 text-3xl font-black' lg:text-5xl">
            We Strive Hard To Help You 

            <span className="block text-[#B60F17]">
              Achieve Your Goals
            </span>
          </h2>

          <p className="mt-7 text-lg leading-6 text-[#333]">
            We provide quality education with modern facilities,
            experienced teachers and practical learning for every
            student.
          </p>

        </div>

  {/* Main */}
<div className="mt-16">
  {/* =====================================================
      FEATURED LARGE CARD
  ====================================================== */}

  <div
    className="
      relative
      overflow-hidden
      rounded-[34px]
      border
      border-[#f0cda8]
      bg-gradient-to-br
      from-[#fff9f3]
      via-white
      to-[#fff7d6]
      shadow-[0_20px_60px_rgba(182,15,23,0.10)]
    "
  >
    {/* decorative background */}
    <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#F8F000]/25 blur-3xl" />
    <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#B60F17]/10 blur-3xl" />

    {/* top accent */}
    <div className="absolute left-0 top-0 h-[6px] w-full bg-gradient-to-r from-[#B60F17] via-[#F8F000] to-[#d85d00]" />

    <div
      className="
        relative
        grid
        gap-10
        p-6
        sm:p-8
        lg:grid-cols-[0.9fr_1.1fr]
        lg:items-center
        lg:p-10
      "
    >
      {/* LEFT */}
      <div>
        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-[20px]
            bg-[#B60F17]
            text-white
            shadow-[0_12px_30px_rgba(182,15,23,0.22)]
          "
        >
          {(() => {
            const Icon = whyChooseUs[0].icon;
            return <Icon size={28} />;
          })()}
        </div>

        <h3
          className="
            mt-6
            text-2xl
            font-black
            leading-tight
            text-[#333]
            sm:text-3xl
          "
        >
          {whyChooseUs[0].title}
        </h3>

        <div className="mt-4 flex gap-2">
          <span className="h-1 w-12 rounded-full bg-[#B60F17]" />
          <span className="h-1 w-8 rounded-full bg-[#F8D000]" />
          <span className="h-1 w-5 rounded-full bg-[#d85d00]" />
        </div>

        <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#333] sm:text-base">
          {whyChooseUs[0].description}
        </p>

        <h4
          className="
            mt-8
            inline-flex
            rounded-full
            bg-[#fff0e5]
            px-4
            py-2
            text-xs
            font-black
            uppercase
            tracking-[2px]
            text-[#B60F17]
          "
        >
          Explore Our Labs
        </h4>
      </div>

      {/* RIGHT - LABS */}
      <div className="grid gap-3 sm:grid-cols-2">
        {labs.map((lab) => {
          const Icon = lab.icon;

          return (
            <Link
              key={lab.slug}
              href={`/laboratories/${lab.slug}`}
              className="
                group
                flex
                items-center
                justify-between
                rounded-[20px]
                border
                border-[#f0dfd1]
                bg-white
                px-4
                py-4
                shadow-[0_8px_24px_rgba(182,15,23,0.05)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#e4b578]
                hover:shadow-[0_14px_32px_rgba(182,15,23,0.10)]
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-[14px]
                    bg-[#fff4e8]
                    text-[#B60F17]
                    transition
                    group-hover:bg-[#B60F17]
                    group-hover:text-white
                  "
                >
                  <Icon size={19} />
                </div>

                <span className="text-sm font-bold text-[#5a241d]">
                  {lab.title}
                </span>
              </div>

              <span
                className="
                  ml-3
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFF4A5]
                  text-[#333]
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:bg-[#F8F000]
                "
              >
                →
              </span>
            </Link>
          );
        })}
      </div>
    </div>

    {/* Footer */}
    <div
      className="
        relative
        flex
        items-center
        justify-between
        border-t
        border-[#f0dfd1]
        bg-white/60
        px-6
        py-4
        backdrop-blur-sm
        sm:px-8
        lg:px-10
      "
    >
      <Link
        href="/laboratories/physics-lab"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-bold
          text-[#B60F17]
          transition-all
          hover:gap-3
        "
      >
        Select a Lab Above
        <span>→</span>
      </Link>
    </div>
  </div>

  {/* =====================================================
      other cards
  ====================================================== */}

  <div
    className="
      mt-7
      grid
      gap-6
      sm:grid-cols-2
      lg:grid-cols-3
    "
  >
    {whyChooseUs.slice(1).map((item) => {
      const Icon = item.icon;

      return (
        <Link
          key={item.slug}
          href={`/why-choose-us/${item.slug}`}
          className="
            group
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-[#efdccc]
            bg-white
            shadow-[0_12px_35px_rgba(182,15,23,0.06)]
            transition-all
            duration-300
            hover:-translate-y-2
            hover:border-[#e4b77f]
            hover:shadow-[0_22px_55px_rgba(182,15,23,0.12)]
          "
        >
          {/* Background Shape */}
          <div
            className="
              absolute
              -right-14
              -top-14
              h-36
              w-36
              rounded-full
              bg-[#FFF4A5]/50
              transition-transform
              duration-500
              group-hover:scale-125
            "
          />

          {/* Left accent */}
          <div
            className="
              absolute
              left-0
              top-0
              h-full
              w-[5px]
              bg-gradient-to-b
              from-[#B60F17]
              via-[#F8D000]
              to-[#d85d00]
            "
          />

          <div className="relative flex h-full flex-col p-6 sm:p-7">
            {/* Icon row */}
            <div className="flex items-center justify-between">
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-[18px]
                  border
                  border-[#f0d5c4]
                  
                  text-[#B60F17]
                  transition-all
                  duration-300
                  group-hover:rotate-[-4deg]
                  group-hover:bg-[#B60F17]
                  group-hover:text-white
                "
              >
                <Icon size={24} />
              </div>

              <div
                className="
                  h-10
                  w-10
                  rounded-full
                  border-[7px]
                  border-[#FFF4A5]
                  transition
                  group-hover:border-[#F8D000]
                "
              />
            </div>

            {/* Title */}
            <h3
              className="
                mt-6
                text-xl
                font-black
                leading-snug
                text-[#333]
                transition-colors
                duration-300
                group-hover:text-[#B60F17]
                sm:text-[22px]
              "
            >
              {item.title}
            </h3>

            {/* Description */}
            <p className="mt-4 flex-1 text-[15px] leading-7 text-[#333]">
              {item.description}
            </p>

            {/* Footer */}
            <div
              className="
                mt-6
                flex
                items-center
                justify-between
                border-t
                border-[#f0e2d7]
                pt-4
              "
            >
              <span className="text-sm font-bold text-[#B60F17]">
                Explore More
              </span>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#fff0e4]
                  text-lg
                  font-bold
                  text-[#B60F17]
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:bg-[#B60F17]
                  group-hover:text-white
                "
              >
                →
              </div>
            </div>
          </div>
        </Link>
      );
    })}
  </div>
</div>

      </div>

    </section>
  );
}


