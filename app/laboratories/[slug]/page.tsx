import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { labs } from "@/data/labs";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return labs.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const lab = labs.find((item) => item.slug === slug);

  return {
    title: lab
      ? `${lab.title} | Champi Devi Inter College`
      : "Laboratories",
    description: lab?.description,
  };
}

export default async function LaboratoryPage({ params }: Props) {
  const { slug } = await params;

  const lab = labs.find((item) => item.slug === slug);

  if (!lab) notFound();

  const Icon = lab.icon;

  return (
    <main className="bg-[#f8fafc]">

      {/* Hero */}

    <section className="relative overflow-hidden py-24">

  {/* Background Image */}
  <Image
    src={lab.image}
    alt={lab.title}
    fill
    priority
    className="object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/70" />

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

  {/* Decorative Blur */}
  <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[#F8F000]/20 blur-[150px]" />

  <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#B60F17]/30 blur-[150px]" />

  <div className="relative mx-auto max-w-7xl px-5">

    {/* Back Button */}
    {/* <Link
      href="/"
      className="
        inline-flex items-center gap-3
        rounded-full
        border border-[#B60F17]
        bg-white/10
        px-5 py-3
        text-[#B60F17]
        backdrop-blur-md
        transition
        hover:bg-white/20
      "
    >
      <ArrowLeft size={18} />
      Back To Home
    </Link> */}

    <div className="mt-16 grid items-center gap-16 lg:grid-cols-2">

      {/* LEFT CONTENT */}
      <div>

        {/* <div
          className="
            inline-flex items-center gap-3
            rounded-full
            bg-[#F8F000]
            px-5 py-2
            font-semibold
            text-[#B60F17]
          "
        >
          <Icon size={18} />
          Laboratory
        </div> */}

        <h1 className="mt-6 text-5xl font-black' leading-tight lg:text-6xl">
          <span className="block text-white">
            {lab.title}
          </span>
        </h1>

        <div className="mt-6 h-1 w-28 rounded-full bg-gradient-to-r from-[#B60F17] to-[#F8F000]" />

        <p className="mt-8 max-w-xl text-lg leading-9 text-white/80">
          {lab.description}
        </p>

      </div>

     
     {/* RIGHT IMAGE */}
<div className="relative">
  <div
    className="
      relative
      h-[480px]
      overflow-hidden
      rounded-[28px]
      border
      border-white/20
      bg-white/10
      p-2
      shadow-[0_25px_60px_rgba(0,0,0,0.30)]
    "
  >
    <div className="relative h-full w-full overflow-hidden rounded-[22px]">
      <Image
        src={lab.image}
        alt={lab.title}
        fill
        priority
        className="
          object-cover
          transition-transform
          duration-700
          hover:scale-105
        "
      />
    </div>
  </div>
</div>

    </div>

  </div>

</section>

      {/* Features */}

<section className="relative overflow-hidden bg-[#fffaf5] py-24">

  {/* Background Decorations */}

  <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#F8F000]/10 blur-[100px]" />

  <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-[#B60F17]/10 blur-[100px]" />

  <div className="relative mx-auto max-w-7xl px-5">

    {/* Heading */}

    <div className="mx-auto max-w-2xl text-center">

      <span className="inline-flex rounded-full bg-[#F8F000] px-5 py-2 text-sm font-bold tracking-[2px] text-[#B60F17]">
        LABORATORY
      </span>

      <h2 className="mt-5 text-4xl font-black' text-[#333] sm:text-5xl">
        Laboratory Features
      </h2>

      <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#B60F17] to-[#F8F000]" />

      <p className="mt-5 text-base leading-7 text-[#333] sm:text-lg">
        Modern laboratory facilities designed to provide students
        with practical and meaningful learning experiences.
      </p>

    </div>

   
{/* Cards */}
<div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
  {lab.features.map((item) => (
    <div
      key={item.title}
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-gray-100
        bg-white
        shadow-[0_15px_45px_rgba(7,47,96,0.08)]
        transition-all
        duration-500
        hover:-translate-y-3
        hover:shadow-[0_25px_60px_rgba(7,47,96,0.15)]
      "
    >
      {/* Top Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        {/* Image Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#072F60]/40
            via-transparent
            to-transparent
          "
        />

        {/* Icon */}
        <div
          className="
            absolute
            bottom-4
            left-5
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border
            border-white/30
            bg-white/90
            text-[#B60F17]
            shadow-lg
            backdrop-blur-md
            transition-all
            duration-500
            group-hover:rotate-3
            group-hover:bg-[#B60F17]
            group-hover:text-white
          "
        >
          <CheckCircle2 size={29} strokeWidth={2.2} />
        </div>
      </div>

      {/* Top Gradient Line */}
      <div
        className="
          absolute
          left-0
          top-0
          z-20
          h-1.5
          w-0
          rounded-r-full
          bg-gradient-to-r
          from-[#B60F17]
          to-[#F8F000]
          transition-all
          duration-500
          group-hover:w-full
        "
      />

      {/* Decorative Circle */}
      <div
        className="
          absolute
          -right-10
          top-40
          h-28
          w-28
          rounded-full
          bg-[#F8F000]/10
          transition-all
          duration-500
          group-hover:scale-150
          group-hover:bg-[#F8F000]/20
        "
      />

      {/* Content */}
      <div className="relative p-7 pt-6">
        <h3
          className="
            text-lg
            font-extrabold
            leading-7
            text-[#072F60]
            transition-colors
            duration-300
            group-hover:text-[#B60F17]
          "
        >
          {item.title}
        </h3>

        {/* Small Line */}
        <div
          className="
            mt-5
            h-1
            w-10
            rounded-full
            bg-gradient-to-r
            from-[#B60F17]
            to-[#F8F000]
            transition-all
            duration-500
            group-hover:w-20
          "
        />
      </div>
    </div>
  ))}
</div>

  </div>

</section>

    {/* Sections */}

<section className="relative overflow-hidden bg-[#fffaf6] py-20 lg:py-24">

  {/* Decorative Background */}

  <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-orange-100/60 blur-[120px]" />

  <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-orange-200/40 blur-[120px]" />

  <div className="relative mx-auto max-w-7xl px-5">

    {/* Sections */}

    <div className="space-y-20 lg:space-y-28">

      {lab.sections.map((section, index) => (

        <div
          key={section.title}
          className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >

          {/* IMAGE */}
 
<div
  className={`group relative ${
    index % 2 !== 0 ? "lg:order-2" : "lg:order-1"
  }`}
>
  <div
    className="
      relative
      h-[300px]
      overflow-hidden
      rounded-[24px]
      bg-gray-100
      shadow-[0_15px_40px_rgba(0,0,0,0.12)]
      sm:h-[380px]
      lg:h-[430px]
    "
  >
    <Image
      src={section.image}
      alt={section.title}
      fill
      className="
        object-cover
        transition-transform
        duration-700
        ease-out
        group-hover:scale-105
      "
    />
  </div>
</div>

          {/* CONTENT */}

          <div
            className={`${
              index % 2 !== 0
                ? "lg:order-1"
                : "lg:order-2"
            }`}
          >

            {/* Small Label */}

            <div className="flex items-center gap-3">

              <span className="h-[2px] w-10 bg-[#B60F17]" />

              <span className="text-sm font-bold uppercase tracking-[2px] text-[#B60F17]">
                {String(index + 1).padStart(2, "0")} / Laboratory
              </span>

            </div>

            {/* Title */}

            <h2 className="mt-5 text-3xl leading-tight text-[#333] sm:text-4xl">
              {section.title}
            </h2>

            {/* Content */}

            <p className="mt-5 text-base leading-8 text-[#333] sm:text-lg">
              {section.content}
            </p>

            {/* Bottom Accent */}

            <div className="mt-8 flex items-center gap-3">

              <div className="h-1 w-16 rounded-full bg-[#B60F17]" />

              <div className="h-1 w-3 rounded-full bg-orange-200" />

              <div className="h-1 w-2 rounded-full bg-orange-100" />

            </div>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>

      {/* Highlights */}

    <section className="relative overflow-hidden bg-[#fffaf6] py-20 lg:py-24">

  {/* Decorative Background */}

  <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#F8F000]/10 blur-[120px]" />

  <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-[#B60F17]/10 blur-[120px]" />

  <div className="relative mx-auto max-w-6xl px-5">

    {/* Heading */}

    <div className="mx-auto max-w-2xl text-center">

      <span className="inline-flex rounded-full bg-[#F8F000] px-5 py-2 text-sm font-bold uppercase tracking-[2px] text-[#B60F17]">
        Our Strength
      </span>

      <h2 className="mt-5 text-4xl font-black' text-[#333] sm:text-5xl">
        Why This Laboratory?
      </h2>

      <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#B60F17] to-[#F8F000]" />

    </div>

    {/* Highlights */}

    <div className="mt-14 grid gap-5 md:grid-cols-2">

      {lab.highlights.map((item, index) => (

        <div
          key={item}
          className="
            group
            relative
            overflow-hidden
            rounded-[24px]
            border
            border-gray-100
            bg-white
            p-6
            shadow-[0_12px_35px_rgba(7,47,96,0.07)]
            transition-all
            duration-500
            hover:-translate-y-2
            hover:border-[#B60F17]/20
            hover:shadow-[0_20px_45px_rgba(7,47,96,0.12)]
          "
        >

          {/* Top Accent */}

          <div
            className="
              absolute
              left-0
              top-0
              h-1
              w-0
              bg-gradient-to-r
              from-[#B60F17]
              to-[#F8F000]
              transition-all
              duration-500
              group-hover:w-full
            "
          />

          <div className="flex items-start gap-5">

            {/* Number + Icon */}

            <div className="relative shrink-0">

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#B60F17]/10
                  text-[#B60F17]
                  transition-all
                  duration-500
                  group-hover:bg-[#B60F17]
                  group-hover:text-white
                  group-hover:scale-105
                "
              >
                <CheckCircle2 size={27} strokeWidth={2.2} />
              </div>

           

            </div>

            {/* Text */}

            <div className="pt-1">

              <p
                className="
                  text-base
                  font-semibold
                  leading-7
                  text-[#333]
                  transition-colors
                  duration-300
                  group-hover:text-[#072F60]
                  sm:text-lg
                "
              >
                {item}
              </p>

              {/* Small Accent */}

              <div className="mt-3 h-1 w-8 rounded-full bg-[#F8F000] transition-all duration-500 group-hover:w-14" />

            </div>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>

    </main>
  );
}
