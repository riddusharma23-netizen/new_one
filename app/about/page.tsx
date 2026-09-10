
// app/about/page.tsx
import InfrastructureSection from "./InfrastructureSection";
import LegalDocumentsSection from "./LegalDocumentsSection";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  GraduationCap,
  Users,
  Trophy,
  BookOpen,
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    {
      number: "20+",
      label: "Years Experience",
      icon: GraduationCap,
    },
    {
      number: "2500+",
      label: "Students",
      icon: Users,
    },
    {
      number: "98%",
      label: "Success Rate",
      icon: Trophy,
    },
    {
      number: "100+",
      label: "Programs",
      icon: BookOpen,
    },
  ];


  return (
    <main
      className="
      relative
      overflow-hidden

      bg-white
      text-[#333]

      poppins_307548c1-module__hM4dSa__className
      "
    >
      {/* Background Glow */}
      <div
        className="
        absolute
        top-0
        left-1/2

        -translate-x-1/2

        w-[800px]
        h-[800px]

        rounded-full

        bg-gradient-to-r
        from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]


        opacity-10
        blur-[180px]
        "
      />

      {/* HERO */}
 
<section
  className="
  relative

  overflow-hidden

  py-10
  "
>

  {/* Background Image */}


 {/* Background Image */}
<div className="absolute inset-0">
  <img
    src="/aboutimages/s1.png"
    alt="background"
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
      opacity-30
    "
  />

  {/* Orange Layer */}
  <div
    className="
      absolute
      inset-0
      bg-[#DF6525]/70
    "
  />

  {/* Blue Gradient Mix */}
  <div
    className="
      absolute
      inset-0
      bg-gradient-to-r
      from-blue-950/80
      via-blue-900/40
      to-transparent
    "
  />
</div>



  <div
    className="
    relative

    max-w-[1450px]
    mx-auto

    px-6
    lg:px-10
    "
  >

    <div
      className="
      grid
      gap-16

      lg:grid-cols-2
      items-center
      "
    >

      {/* LEFT */}
      <div className="text-white">

        <span
          className="
          inline-flex

          px-6
          py-2

          rounded-full

          bg-[#F8F400]
          backdrop-blur
          text-[#B70F17]
          shadow-lg
          bold
          text-sm
          font-semibold
          tracking-wider
          "
        >
          ABOUT OUR SCHOOL
        </span>

        <h1
          className="
          mt-8

          text-3xl
          lg:text-6xl

          font-black'

          leading-tight
          "
        >
          Building Future
          <span className="text-[#B70F17]">
            {" "} Through Education
          </span>

          <br />

         
        </h1>

       

      </div>

      {/* RIGHT IMAGE FIX */}
      <div
        className="
        relative

        flex
        justify-center
        "
      >

        <div
          className="
          relative

          w-full
          max-w-[560px]

          p-[8px]

          rounded-[40px]

          bg-gradient-to-r
          from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]


          shadow-[0_40px_120px_rgba(0,0,0,.3)]
          "
        >

      <div
  className="
    relative
    w-full
    h-[280px]
    sm:h-[340px]
    md:h-[420px]
    rounded-[34px]
    overflow-hidden
  "
>
 <img
  src="/aboutimages/s1.png"
  alt="about"
  className="absolute inset-0 w-full h-full object-cover"
/>

  
  <div
    className="
      absolute
      inset-0
      bg-[#FF4500]/20
    "
  />
 
</div>

        </div>

      </div>

    </div>

  </div>

</section>


      {/* Story */}
   
<section className="relative overflow-hidden bg-gradient-to-br from-[#B60F17] via-[#c92d17] to-[#FF6A00] py-24 sm:py-28">

  {/* Decorative Background */}
  <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-yellow-300/10 blur-3xl" />

  <div className="relative mx-auto max-w-[1500px] px-6">

    {/* Heading */}
    <div className="mx-auto mb-16 max-w-3xl text-center">

      <span className="inline-flex items-center rounded-full border-white/30 bg-[#F8F400]  px-5 py-2 text-sm font-semibold tracking-wider text-[#B60F17] backdrop-blur-md">
        OUR JOURNEY
      </span>

      <h2 className="mt-5 text-4xl font-black' tracking-tight text-white sm:text-5xl lg:text-5xl">
        Our Story
      </h2>

      <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-white" />

      <p className="mt-6 text-base leading-8 text-white/80 sm:text-lg">
        A journey of dedication, education and transformation spanning
        more than three decades.
      </p>

    </div>


    {/* Story Card */}
    <div className="relative mx-auto max-w-6xl">

      {/* Timeline Line */}
      <div className="absolute left-6 top-8 hidden h-[calc(100%-64px)] w-px bg-white/30 md:block" />

      <div className="space-y-10">

        {/* Beginning */}
        <div className="relative md:pl-20">

          {/* Timeline Dot */}
          <div className="absolute left-[11px] top-7 hidden h-4 w-4 rounded-full border-4 border-[#B60F17] bg-white shadow-lg md:block" />

          <div className="rounded-[28px] border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur-xl transition duration-300 hover:bg-white/[0.15] sm:p-9">

            <div className="mb-5 flex flex-wrap items-center gap-4">

              <span className="rounded-full bg-white px-5 py-2 text-sm font-black text-[#B60F17]">
                35+ YEARS
              </span>

              <span className="text-sm font-medium text-white/70">
                A Legacy of Education
              </span>

            </div>

            <p className="text-base leading-8 text-white/90 sm:text-lg sm:leading-9">
              Smt. Champi Devi Inter College, located in village Jamou
              (Jamon), Aligarh, has been a beacon of education for over
              35 years. It originated as a highly popular junior high
              school with <strong className="font-bold text-white">172 students</strong>,
              running a small dispensary and a local temple with the
              complete cooperation of the villagers.
            </p>

            <p className="mt-5 text-base leading-8 text-white/90 sm:text-lg sm:leading-9">
              Our proud alumni have graduated from top colleges and
              hold prestigious positions across different fields,
              carrying forward the values and vision of the institution.
            </p>

          </div>
        </div>


        {/* 2016 - 2017 */}
        <div className="relative md:pl-20">

          {/* Timeline Dot */}
          <div className="absolute left-[11px] top-7 hidden h-4 w-4 rounded-full border-4 border-[#B60F17] bg-white shadow-lg md:block" />

          <div className="rounded-[28px] border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur-xl transition duration-300 hover:bg-white/[0.15] sm:p-9">

            <div className="mb-6">

              <span className="inline-block rounded-full bg-[#072F60] px-5 py-2 text-sm font-black text-white shadow-lg">
                2016 – 2017
              </span>

              <h3 className="mt-4 text-2xl font-black text-white sm:text-3xl">
                The Milestone of Transformation
              </h3>

            </div>

            <p className="text-base leading-8 text-white/90 sm:text-lg sm:leading-9">
              After 35 years of dedicated service, the existing building
              required complete reconstruction. The school governing board
              partnered with the{" "}
              <strong className="font-black text-yellow-200">
                Tulsi Das Charity Org
              </strong>
              , which generously sanctioned the required funds for the
              transformation.
            </p>

            <p className="mt-5 text-base leading-8 text-white/90 sm:text-lg sm:leading-9">
              Construction began in early{" "}
              <strong className="font-black text-yellow-200">
                2016
              </strong>{" "}
              and was successfully completed in{" "}
              <strong className="font-black text-yellow-200">
                February 2017
              </strong>
              .
            </p>

          </div>
        </div>


        {/* Inauguration */}
        <div className="relative md:pl-20">

          {/* Timeline Dot */}
          <div className="absolute left-[11px] top-7 hidden h-4 w-4 rounded-full border-4 border-[#B60F17] bg-white shadow-lg md:block" />

          <div className="rounded-[28px] border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur-xl transition duration-300 hover:bg-white/[0.15] sm:p-9">

            <div className="grid gap-6 sm:grid-cols-3">

              {/* Date */}
              <div className="rounded-2xl bg-white/10 p-5 text-center">
                <span className="text-3xl font-black text-white">
                  01
                </span>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-white/70">
                  March 2017
                </p>
                <p className="mt-2 text-xs text-white/60">
                  New Campus Inaugurated
                </p>
              </div>

              {/* Classes */}
              <div className="rounded-2xl bg-white/10 p-5 text-center">
                <span className="text-3xl font-black text-white">
                  01
                </span>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-white/70">
                  April 2017
                </p>
                <p className="mt-2 text-xs text-white/60">
                  Classes Commenced
                </p>
              </div>

              {/* Recognition */}
              <div className="rounded-2xl bg-white/10 p-5 text-center">
                <span className="text-3xl font-black text-white">
                  2018
                </span>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-white/70">
                  UP Board
                </p>
                <p className="mt-2 text-xs text-white/60">
                  Official Recognition
                </p>
              </div>

            </div>

            <p className="mt-8 text-center text-base leading-8 text-white/90 sm:text-lg sm:leading-9">
              The new campus was inaugurated on{" "}
              <strong className="font-black text-yellow-200">
                1st March 2017
              </strong>
              , classes began on{" "}
              <strong className="font-black text-yellow-200">
                1st April 2017
              </strong>
              , and the college received official{" "}
              <strong className="font-black text-yellow-200">
                UP Board recognition
              </strong>{" "}
              by March 2018.
            </p>

          </div>
        </div>

      </div>

    </div>


    {/* Bottom Quote */}
    <div className="mx-auto mt-16 max-w-4xl text-center">

      <div className="mx-auto mb-5 h-px w-24 bg-white/40" />

      <p className="text-lg font-semibold italic text-white/90 sm:text-xl">
        “From a humble beginning to a growing institution,
        our journey continues with a commitment to quality education.”
      </p>

    </div>

  </div>
</section>

      {/* STATS */} 

<section
  className="
  relative

  py-10
  overflow-hidden
  "
>

    <InfrastructureSection />
          <LegalDocumentsSection />

</section>


    </main>
  );
}

