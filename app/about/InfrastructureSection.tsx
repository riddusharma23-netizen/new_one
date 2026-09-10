"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { infrastructureData } from "./data";

export default function InfrastructureSection() {
  const { heading, features } = infrastructureData;

  return (
    <section className="relative py-10 bg-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8F000] opacity-10 blur-[180px]" />

      <div className="relative max-w-[1400] mx-auto px-6">
        {/* Dynamic Heading */}

        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block px-5 py-2 rounded-full shadow-lg bg-[#F8F400] text-[#B60F17] font-semibold">
            {heading.subtitle}
          </span>
 <h2 className="mt-8 text-4xl lg:text-5xl font-black' leading-tight">

    <span className="block text-[#333]">
      {heading.titleBlack}
    </span>

    <span className="block mt-2 text-[#B60F17]">
      {heading.titleGradient}
    </span>

  </h2>

          <p className="mt-6 text-lg leading-8 text-[#333]">
            {heading.description}
          </p>
        </div>

        {/* Features */}

      <div className="space-y-16 sm:space-y-20 lg:space-y-28">
  {features.map((item, index) => {
    const Icon = item.icon;

    return (
      <div
        key={item.id}
       className={`group grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-20 ${
  index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
}`}
      >
        {/* ================= IMAGE ================= */}

        <div className="relative">
          {/* Decorative Shape */}
          <div
            className={`absolute -z-10 h-32 w-32 rounded-full bg-[#FF6A00]/10 blur-2xl ${
              index % 2 === 0
                ? "-left-10 -top-10"
                : "-right-10 -bottom-10"
            }`}
          />

          {/* Image Card */}
          <div className="relative overflow-hidden rounded-[35px] border border-[#B60F17]   bg-gradient-to-r
          from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000] p-3 shadow-[0_25px_70px_rgba(7,47,96,0.14)]">
            <div className="relative overflow-hidden rounded-[28px]">
              <Image
                src={item.image}
                alt={item.title}
                width={700}
                height={500}
                className="h-[380px] w-full object-cover transition duration-700 ease-out group-hover:scale-105 sm:h-[420px]"
              />

              {/* Image Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Number */}
              <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/90 shadow-lg backdrop-blur-md">
                <span className="text-xl font-extrabold text-[#B60F17]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Bottom Overlay */}
              <div className="absolute bottom-5 left-5 right-5">
                <div className="rounded-2xl border border-white/20 bg-white/15 px-5 py-3 backdrop-blur-md">
                  <p className="text-sm font-medium text-white">
                    Champi Devi Inter College
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="relative">
          {/* Small Label */}
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-gradient-to-r from-[#B60F17] to-[#FF6A00]" />

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#B60F17]">
              CDIC
            </span>
          </div>

          {/* Icon */}
          <div className="mb-7 inline-flex">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 rounded-[24px] bg-[#FF6A00]/20 blur-xl" />

              <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#B60F17] via-[#FF6A00] to-[#F8F000] shadow-[0_15px_35px_rgba(255,106,0,0.25)] transition duration-500 group-hover:-translate-y-1 group-hover:rotate-2">
                <Icon size={36} strokeWidth={1.8} className="text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h3 className="max-w-xl text-3xl font-extrabold' leading-tight text-[#072F60] sm:text-4xl lg:text-[42px]">
            {item.title}
          </h3>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-2">
            <span className="h-1 w-14 rounded-full bg-[#B60F17]"/>
            <span className="h-1 w-5 rounded-full bg-[#FF6A00]"/>
            <span className="h-1 w-2 rounded-full bg-[#F8F000]"/>
          </div>

          {/* Description */}
          <p className="mt-7 max-w-xl text-[16px] leading-6 text-[#333]">
            {item.description}
          </p>

          {/* Bottom Feature */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF4ED]">
              <Icon size={21} className="text-[#FF6A00]" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#333]">
                Quality Education
              </p>
              <p className="text-sm text-[#333]">
                Building a brighter future together
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>
      </div>
    </section>
  );
}