"use client";

import Image from "next/image";

import {
  GraduationCap,
  BookOpen,
  Bed,
  Trophy,
} from "lucide-react";

const stats = [
  {
    icon: <GraduationCap size={42} />,
    number: "8713+",
    title: "Graduated Alumni",
  },
  {
    icon: <BookOpen size={42} />,
    number: "172+",
    title: "Enrolled Students",
  },
  {
    icon: <Bed size={42} />,
    number: "300+",
    title: "Daily Playground Users",
  },
  {
    icon: <Trophy size={42} />,
    number: "20",
    title: "Win Awards",
  },
];


export default function About() {
  return (
    <section className="relative overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[180px]" />

        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[250px]" />
      </div>


      {/* ================= ABOUT SECTION ================= */}

      <section className="relative overflow-hidden py-6 sm:py-6 lg:py-12">

        <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-5">

          <div
            className="
              grid
              grid-cols-1
              gap-14
              lg:grid-cols-[700px_1fr]
              lg:items-center
              lg:gap-14
            "
          >

        

  {/* =====================================================
    LEFT IMAGE COLLAGE
===================================================== */}

<div
  className="
    relative
    mx-auto
    w-full
    max-w-[520px]
    h-auto
    sm:max-w-[600px]
    lg:max-w-none
    lg:h-auto
    lg:mx-0
  "
>

  {/* =====================================================
      MOBILE COLLAGE
  ===================================================== */} 

{/* MOBILE COLLAGE */}

<div className="block lg:hidden w-full">

  {/* BIG IMAGE */}
  <div className="w-full">
    <div
      className="
        h-[300px]
        w-full
        rounded-[35px]
        bg-cover
        bg-center
        bg-no-repeat
        sm:h-[390px]
        sm:rounded-[45px]
      "
      style={{
        backgroundImage: "url('/images/homehero/SCHOOL.jpg')",
      }}
    />
  </div>

  {/* ROUND IMAGE */}
  <div className="flex justify-center py-7 sm:py-9">
    <div className="relative">

      <div
        className="
          relative
          z-10
          h-[300px]
          w-[300px]
          rounded-full
          border-[5px]
          border-white
          bg-cover
          bg-center
          bg-no-repeat
          shadow-lg
          sm:h-[230px]
          sm:w-[230px]
        "
        style={{
          backgroundImage: "url('/images/homehero/sc2.jpg')",
        }}
      />

      {/* Dashed Circle */}
      <div
        className="
          pointer-events-none
          absolute
          inset-[-9px]
          rounded-full
          border-[2px]
          border-dashed
          border-[#B60F17]
        "
      />

    </div>
  </div>

  {/* SECOND IMAGE */}
  <div className="mt-2 w-full">
    <div
      className="
        h-[280px]
        w-full
        rounded-tr-[50px]
        rounded-bl-[50px]
        bg-cover
        bg-center
        bg-no-repeat
        sm:h-[360px]
        sm:rounded-tr-[65px]
        sm:rounded-bl-[65px]
      "
      style={{
        backgroundImage: "url('/images/homehero/sc4.jpg')",
      }}
    />
  </div>

  {/* THIRD IMAGE */}
  <div className="mt-5 w-full">
    <div
      className="
        h-[280px]
        w-full
        rounded-tl-[45px]
        rounded-br-[45px]
        bg-cover
        bg-center
        bg-no-repeat
        sm:h-[300px]
        sm:rounded-tl-[60px]
        sm:rounded-br-[60px]
      "
      style={{
        backgroundImage: "url('/images/homehero/sc2.jpg')",
      }}
    />
  </div>

</div>


  {/* =====================================================
      DESKTOP COLLAGE
  ===================================================== */}

  <div
    className="
      hidden

      grid-cols-2
      gap-5

      lg:grid
    "
  >

    {/* BIG IMAGE */}

    <div className="row-span-2">

 <div
  className="row-span-2 relative w-full h-[500px] rounded-[60px] bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/homehero/SCHOOL.jpg')",
  }}
></div>
    </div>


    {/* ROUND IMAGE */}

    <div className="flex justify-center">

      <div className="relative inline-block">

      <div
  className="relative z-10 h-[320px] w-[320px] rounded-full bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/images/homehero/sc2.jpg')",
  }}
></div>

        <div
          className="
            pointer-events-none
            absolute
            inset-[-10px]
            rounded-full
            border-[2px]
            border-dashed
            border-[#B60F17]
          "
        />

      </div>

    </div>


    {/* BOTTOM IMAGE */}

    <div>

      <Image
        src="/images/homehero/sc4.jpg"
        width={450}
        height={350}
        alt="Classroom"
        className="
          h-[300px]
          w-full
          rounded-tr-[80px]
          rounded-bl-[80px]
          object-cover
        "
      />

    </div>

  </div>


  {/* DESKTOP EXPERIENCE CARD */}

  <div
    className="
      absolute
      bottom-[-30px]
      left-[30px]
      z-30
      hidden

      rounded-[40px]
      border-[6px]
      border-[#F8F000]

      bg-[#B60F17]

      px-8
      py-6

      text-white

      shadow-[0_0_25px_rgba(255,69,0,.5)]

      lg:block
    "
  >

    <h3 className="text-4xl font-black' ">
      35+
    </h3>

    <p className="leading-7">
      Years Of
      <br />
      Educational Excellence
    </p>

  </div>

</div>


            {/* =====================================================
                RIGHT CONTENT
            ===================================================== */}

            <div className="relative z-10">

              {/* ABOUT BUTTON */}

              <div
                className="
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  bg-[#F8F400]
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[3px]
                  text-[#B60F17]
                  shadow-md

                  sm:px-6
                  sm:tracking-[4px]
                "
              >
                About Us →
              </div>


              {/* HEADING */}

              <h2
                className="
                  mt-5
                  text-3xl
                  font-black'
                  leading-tight
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Welcome to Smt.

                <span className="text-[#B60F17]">
                  {" "}
                  CDIC, Jamon (Aligarh)
                </span>
              </h2>


              {/* DESCRIPTION */}

              <p
                className="
                  mt-6
                  text-base
                  leading-8
                  text-[#333]

                  sm:mt-8
                  sm:text-lg
                  sm:leading-9
                "
              >
                "Our core mission is to provide high-quality modern education,
                sustainable solar-powered facilities, digital literacy,
                and strong moral values to rural students. Together, let us
                build a bright and successful future for our children."


"Our core mission is to empower rural students by instilling strong moral and cultural
values from the very beginning. We are dedicated to providing modern facilities that
prepare our children for successful future studies and higher education. Our ultimate
goal is to equip student with the skills and confidence needed to secure proper."

              </p>

            </div>

          </div>

        </div>

      </section>

 

      <section className="relative overflow-hidden">

        {/* Background Image */}

        <div
          className="
            absolute
            inset-0
            bg-[url('/school.jpg')]
            bg-cover
            bg-center
          "
        />

        {/* Red Overlay */}

        <div className="absolute inset-0 bg-[#B60F17]/90" />


        {/* Stats Container */}

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1450px]
            px-4
            py-7

            sm:px-6
            sm:py-8

            lg:px-5
            lg:py-9
          "
        >

          <div
            className="
              grid
              grid-cols-2
              items-center

              lg:grid-cols-4
            "
          >

            {stats.map((item, i) => (
              <div
                key={i}
                className={`
                  relative
                  flex
                  flex-col
                  items-center
                  justify-center
                  px-3
                  py-5
                  text-center

                  sm:px-4
                  sm:py-6

                  lg:py-3

                  ${i < 3 ? "lg:border-r lg:border-white/20" : ""}

                  ${
                    i % 2 === 0
                      ? "max-lg:border-r max-lg:border-white/20"
                      : ""
                  }

                  ${
                    i < 2
                      ? "max-lg:border-b max-lg:border-white/20"
                      : ""
                  }
                `}
              >

                {/* Number */}

                <h2
                  className="
                    text-3xl
                    font-black
                    leading-none
                    tracking-tight
                    text-[#F8F000]

                    sm:text-4xl
                    md:text-[42px]
                  "
                >
                  {item.number}
                </h2>


                {/* Title */}

                <p
                  className="
                    mt-2
                    text-xs
                    font-semibold
                    leading-tight
                    text-white

                    sm:text-sm
                    md:text-[15px]
                  "
                >
                  {item.title}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

    </section>
  );
}