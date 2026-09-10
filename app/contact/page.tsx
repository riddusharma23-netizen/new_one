"use client";

import Link from "next/link";
import Image from "next/image";

import {
  MapPin,
  Phone,
  Mail,
  Clock3,
} from "lucide-react";

const contacts = [
  {
    icon: MapPin,
    title: "Office Address",
    content: [
      "Jamo Aligarh",
      " (Aligarh), U.P.",
    ],
  },
  {
    icon: Phone,
    title: "Call Us",
    content: ["+91 8057494951"],
  },
  {
    icon: Mail,
    title: "Email Us",
    content: ["cdicjamo@gmail.com"],
  },
  {
    icon: Clock3,
    title: "Open Time",
    content: ["Mon - Sat (5:00AM - 05:30PM)"],
  },
];

export default function ContactSection() {
  return (
    <main className="relative overflow-hidden">

      {/* Background Glow */}
      <div
        className="
        absolute
        top-[-250px]
        left-1/2
        -translate-x-1/2

        w-[700px]
        md:w-[900px]

        h-[700px]
        md:h-[900px]

        rounded-full

        bg-gradient-to-r
       from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]

        opacity-10
        blur-[180px]

        pointer-events-none
        "
      />

      {/* HERO */}
      <section
        className="
        relative
        overflow-hidden
        py-20
        md:py-28
        "
      >
        {/* BG */}
        <div className="absolute inset-0">

          <Image
            src="/school.jpg"
            alt="background"
            fill
            priority
            className="object-cover opacity-30"
          />

          <div className="absolute inset-0 bg-[#B70F17]/70" />

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
            lg:grid-cols-2
            gap-14

            items-center
            "
          >
            {/* LEFT */}
            <div className="text-white">

              <span
                className="
                inline-flex
                px-5
                py-2

                rounded-full

                bg-white/15
                backdrop-blur
                "
              >
                ABOUT OUR SCHOOL
              </span>

              <h1
                className="
                mt-7

                text-3xl
                sm:text-5xl
                lg:text-6xl

                font-black

                leading-tight
                "
              >
                Building
                <span className="text-[#B70F17]">
                  {" "}Future
                </span>

                <br />

                Through Education
              </h1>

             
            </div>

            {/* RIGHT */}
            <div className="flex justify-center">

              <div
                className="
                w-full
                max-w-[560px]

                p-[8px]

                rounded-[34px]

                bg-gradient-to-r
               from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]
                "
              >
                <div
                  className="
                  relative

                  h-[260px]
                  sm:h-[340px]
                  md:h-[420px]

                  rounded-[28px]

                  overflow-hidden
                  "
                >
                  <Image
                    src="/school.jpg"
                    alt="school"
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-[#FF4500]/20" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

{/* CONTACT SECTION */}

<section className="py-20">

  <div className="max-w-[1400px] mx-auto px-5">

    <div
      className="
      grid
      grid-cols-1
      sm:grid-cols-2
      xl:grid-cols-4

      gap-8
      "
    >
      {contacts.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="
            group
            relative

            overflow-hidden

            rounded-[28px]

            bg-white

            p-10

            text-center

            border
            border-[#D85D00]/20

            shadow-[0_12px_40px_rgba(7,47,96,.12)]

            transition-all
            duration-500

            hover:-translate-y-4
            hover:shadow-[0_20px_60px_rgba(216,93,0,.18)]
            "
          >

            {/* Hover Overlay */}
            <div
              className="
              absolute
              inset-0

              bg-gradient-to-b

              from-transparent
              via-[#D85D00]/5
              to-[#9f1f12]/10

              opacity-0

              group-hover:opacity-100

              duration-500
              "
            />

            {/* ICON */}
            <div
              className="
              relative

              mx-auto
              mb-8

              h-[95px]
              w-[95px]

              rounded-full

              bg-gradient-to-r
                  from-[#B60F17]
to-[#FF6A00] 

              flex
              items-center
              justify-center

              duration-700

              group-hover:rotate-[360deg]
              "
            >

              <div
                className="
                h-[72px]
                w-[72px]

                rounded-full

                bg-[#F8F000]

                flex
                items-center
                justify-center
                "
              >
                <Icon
                  size={38}
                  className="text-[#B60F17]"
                />
              </div>

            </div>

            {/* TITLE */}
            <h3
              className="
              relative

              text-[24px]

              font-black

              text-[#072F60]

              mb-5

              duration-300

              group-hover:text-[#B60F17]
              "
            >
              {item.title}
            </h3>

            {/* CONTENT */}
            <div
              className="
              relative

              space-y-2
              "
            >
              {item.content.map((line) => (
                <p
                  key={line}
                  className="
                  text-gray-600

                  leading-8
                  "
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Bottom Accent */}
            <div
              className="
              absolute

              bottom-0
              left-0

              h-[6px]
              w-full

              bg-gradient-to-r
             from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]

              scale-x-0

              origin-left

              group-hover:scale-x-100

              duration-500
              "
            />

          </div>
        );
      })}
    </div>

  </div>

</section>


{/*  form section */}

<section
  className="
  py-24
  px-5

  bg-gradient-to-b
  from-white
  to-blue-50
  "
>
  <div
    className="
    max-w-[1450px]
    mx-auto

    rounded-[36px]

    overflow-hidden

    shadow-[0_20px_80px_rgba(0,0,0,.08)]

    bg-white
    "
  >

    <div
      className="
      grid

      lg:grid-cols-2
      "
    >

      {/* LEFT IMAGE */}
      <div
        className="
        relative

        min-h-[380px]
        lg:min-h-[760px]

        overflow-hidden
        "
      >

        <Image
          src="/contact-illustration.jpg"
          alt="contact"
          fill
          className="object-cover"
        />

        <div
          className="
          absolute
          inset-0

          bg-gradient-to-tr
          from-blue-900/20
          via-transparent
          to-[#FF4500]/20
          "
        />

      </div>

      {/* RIGHT FORM */}
      <div
        className="
        p-8
        md:p-12
        lg:p-16
        "
      >

        <span
          className="
          inline-flex

          px-5
          py-2

          rounded-full

          text-[#B60F17]


          bg-[#F8F000]
          "
        >
          CONTACT US
        </span>

        <h2
          className="
          mt-6

          text-4xl
          md:text-4xl

          font-black

          text-black
          "
        >
          Get In Touch
        </h2>

        <p
          className="
          mt-5

          text-gray-600

          leading-8
          "
        >
          Have questions? Fill out the form and our
          team will get back to you shortly.
        </p>

        {/* FORM */}
        <form className="mt-10">

          <div
            className="
            grid
            md:grid-cols-2

            gap-6
            "
          >

            <input
              type="text"
              placeholder="Your Name"
              className="
              h-[60px]

              rounded-[20px]

              px-6

              border

              outline-none

              focus:border-[#B60F17]


              duration-300
              "
            />

            <input
              type="email"
              placeholder="Your Email"
              className="
              h-[60px]

              rounded-[20px]

              px-6

              border

              outline-none

              focus:border-[#B60F17]

              "
            />

          </div>

          <input
            type="text"
            placeholder="Your Subject"
            className="
            mt-6

            w-full

            h-[60px]

            rounded-[20px]

            px-6

            border

            outline-none

            focus:border-[#B60F17]

            "
          />

          <textarea
            rows={5}
            placeholder="Write Your Message"
            className="
            mt-6

            w-full

            rounded-[20px]

            p-6

            border

            resize-none

            outline-none

            focus:border-[#B60F17]

            "
          />

         <Link
  href="/about"
  className="
    relative
    inline-flex
    items-center
    justify-center
    overflow-hidden

    mt-7
    px-8
    py-3

    rounded-xl
    bg-[#F8F000]

    text-[#B60F17]
    font-semibold
    tracking-wide

    transition-all
    duration-500
    ease-out

    hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]
    hover:-translate-y-1

   hover:bg-[#B60F17]
   hover:text-[#F8F000]
  "
>
  <span className="relative z-10">
    Explore →
  </span>
</Link>

        </form>

      </div>

    </div>

  </div>
</section>
    </main>
  );
}