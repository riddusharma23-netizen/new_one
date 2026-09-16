import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import { whyChooseUs } from "@/data/whyChooseUs";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return whyChooseUs.map((item) => ({
    slug: item.slug,
  }));
}

export default async function WhyChooseUsDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const item = whyChooseUs.find(
    (data) => data.slug.toLowerCase() === slug.toLowerCase()
  );

  /* ============================================================
     NOT FOUND
  ============================================================ */

  if (!item) {
    return (
      <main className="min-h-screen bg-[#fffaf6]">

        <div className="flex min-h-screen items-center justify-center px-5">

          <div className="max-w-xl text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F000] text-[#B60F17]">
              <GraduationCap size={38} />
            </div>

            <h1 className="mt-7 text-4xl font-black text-[#072F60]">
              Page Not Found
            </h1>

            <p className="mt-4 text-gray-600">
              The page you are looking for does not exist.
            </p>

            {/* <Link
              href="/"
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#B60F17]
                px-7
                py-3
                font-semibold
                text-white
                transition
                hover:bg-[#F8F000]
                hover:text-[#B60F17]
              "
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link> */}

          </div>

        </div>

      </main>
    );
  }

  const Icon = item.icon;

  return (
    <main className="min-h-screen">

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden">

        {/* Background Image */}

        <div className="absolute inset-0">

          <Image
            src={item.image}
            alt={item.title}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/70" />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/90
              via-black/70
              to-black/40
            "
          />

        </div>


        {/* Decorative Glow */}

        <div
          className="
            absolute
            -left-32
            top-0
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#F8F000]/20
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            -right-32
            bottom-0
            h-[350px]
            w-[350px]
            rounded-full
            bg-[#B60F17]/30
            blur-[150px]
          "
        />


        {/* Hero Content */}

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-7xl
            px-5
            py-16

            sm:py-20

            lg:py-24
          "
        >

          {/* Back */}

          {/* <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-white/80
              transition
              hover:text-[#F8F000]
            "
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link> */}


          {/* Hero Grid */}

          <div
            className="
              mt-12
              grid
              items-center
              gap-12

              lg:grid-cols-2
              lg:gap-16
            "
          >

            {/* LEFT CONTENT */}

            <div>

              {/* Label */}

              <div
                className="
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  bg-[#F8F000]
                  px-5
                  py-2
                  text-sm
                  font-bold
                  uppercase
                  tracking-wide
                  text-[#B60F17]
                "
              >
                <Icon size={18} />
                Why Choose Us
              </div>


              {/* Title */}

              <h1
                className="
                  mt-6
                  text-4xl
                  font-black
                  leading-tight
                  text-white

                  sm:text-5xl

                  lg:text-6xl
                "
              >
                {item.title}
              </h1>


              {/* Gradient Line */}

              <div
                className="
                  mt-6
                  h-1
                  w-28
                  rounded-full
                  bg-gradient-to-r
                  from-[#B60F17]
                  to-[#F8F000]
                "
              />
              {/* Description */}

              <p
                className="
                  mt-7
                  max-w-xl
                  text-base
                  leading-8
                  text-white/80

                  sm:text-lg
                "
              >
                {item.description}
              </p>

            </div>


            {/* RIGHT IMAGE */}

            <div className="relative mx-auto w-full max-w-[520px]">

              {/* Yellow Border */}

              <div
                className="
                  absolute
                  -left-3
                  -top-3
                  h-full
                  w-full
                  rounded-[35px]
                  border-[3px]
                  border-[#F8F000]

                  sm:-left-5
                  sm:-top-5
                  sm:rounded-[45px]
                "
              />

              {/* Red Border */}

              <div
                className="
                  absolute
                  -bottom-3
                  -right-3
                  h-full
                  w-full
                  rounded-[35px]
                  border-[3px]
                  border-[#B60F17]

                  sm:-bottom-5
                  sm:-right-5
                  sm:rounded-[45px]
                "
              />


              <div
                className="
                  relative
                  h-[300px]
                  overflow-hidden
                  rounded-[35px]
                  border-4
                  border-white/20

                  sm:h-[400px]
                  sm:rounded-[45px]
                "
              >

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ============================================================
          INTRO SECTION
      ============================================================ */}

      <section className="relative overflow-hidden py-16 sm:py-20">

        {/* Background */}

        <div
          className="
            absolute
            left-0
            top-0
            h-[400px]
            w-[400px]
            rounded-full
            bg-orange-100
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            right-0
            bottom-0
            h-[350px]
            w-[350px]
            rounded-full
            bg-yellow-100
            blur-[150px]
          "
        />

        <div className="relative mx-auto max-w-7xl px-5">

          <div className="mx-auto max-w-3xl text-center">

            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#F8F000]
                px-5
                py-2
                text-sm
                font-bold
                tracking-[2px]
                text-[#B60F17]
              "
            >
              <Sparkles size={17} />
              Excellence In Education
            </span>


            <h2
              className="
                mt-6
                text-3xl
                font-black
                leading-tight
                text-[#072F60]
                sm:text-4xl
              "
            >
              Why We Believe In
              <span className="block text-[#B60F17]">
                Better Education
              </span>
            </h2>


            <p
              className="
                mt-6
                text-base
                leading-8
                text-gray-600

                sm:text-lg
              "
            >
              At Smt. CDIC, Jamon, we focus on providing students with
              quality education, practical learning, modern facilities
              and equal opportunities to grow academically and personally.
            </p>

          </div>


          {/* ========================================================
              points 
          ======================================================== */}

          <div className="mt-12 grid gap-4 sm:grid-cols-2">

            {getPoints(item).map((point) => (

              <div
                key={point}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-orange-100
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:border-[#B60F17]/30
                  hover:shadow-lg
                "
              >

                <span
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F8F000]
                    text-[#B60F17]
                  "
                >
                  <CheckCircle2 size={21} />
                </span>

                <span
                  className="
                    text-sm
                    font-semibold
                    text-[#072F60]

                    sm:text-base
                  "
                >
                  {point}
                </span>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ============================================================
          DETAIL SECTIONS
      ============================================================ */}

      {item.sections?.map((section, index) => (

        <section
          key={section.title}
          className={`
            relative
            overflow-hidden
            py-16
            sm:py-20

            ${index % 2 === 0 ? "bg-white" : "bg-[#fffaf7]"}
          `}
        >

          <div className="mx-auto max-w-7xl px-5">

            <div
              className={`
                grid
                items-center
                gap-12

                lg:grid-cols-2
                lg:gap-16

                ${
                  index % 2 !== 0
                    ? "lg:[&>*:first-child]:order-2"
                    : ""
                }
              `}
            >

              {/* IMAGE */}

              <div className="relative">

                <div
                  className="
                    absolute
                    -bottom-4
                    -left-4
                    h-24
                    w-24
                    rounded-full
                    bg-[#F8F000]/50
                    blur-2xl
                  "
                />

                <div
                  className="
                    relative
                    h-[300px]
                    overflow-hidden
                    rounded-[35px]
                    border-4
                    border-white
                    shadow-[0_15px_50px_rgba(7,47,96,.12)]

                    sm:h-[400px]
                    sm:rounded-[45px]
                  "
                >

                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="
                      object-cover
                      transition
                      duration-700
                      hover:scale-105
                    "
                  />

                </div>

              </div>


              {/* CONTENT */}

              <div>

                <span
                  className="
                    inline-flex
                    rounded-full
                    bg-[#F8F000]
                    px-5
                    py-2
                    text-sm
                    font-bold
                    text-[#B60F17]
                  "
                >
                  {String(index + 1).padStart(2, "0")}
                </span>


                <h2
                  className="
                    mt-5
                    text-3xl
                    font-black
                    leading-tight
                    text-[#072F60]

                    sm:text-4xl
                  "
                >
                  {section.title}
                </h2>


                <div
                  className="
                    mt-5
                    h-1
                    w-20
                    rounded-full
                    bg-gradient-to-r
                    from-[#B60F17]
                    to-[#F8F000]
                  "
                />


                <p
                  className="
                    mt-6
                    text-base
                    leading-8
                    text-gray-600

                    sm:text-lg
                  "
                >
                  {section.content}
                </p>


                {/* Points */}

                {section.points?.length > 0 && (

                  <div className="mt-7 grid gap-3">

                    {section.points.map((point) => (

                      <div
                        key={point}
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          bg-[#fffaf7]
                          p-3
                        "
                      >

                        <span
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#B60F17]
                            text-white
                          "
                        >
                          <CheckCircle2 size={17} />
                        </span>

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-[#072F60]
                          "
                        >
                          {point}
                        </span>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </div>

        </section>

      ))}


      {/* ============================================================
          GALLERY
      ============================================================ */}

      {item.gallery?.length > 0 && (

        <section className="bg-[#072F60] py-16 sm:py-20">

          <div className="mx-auto max-w-7xl px-5">

            <div className="text-center">

              <span
                className="
                  inline-flex
                  rounded-full
                  bg-[#F8F000]
                  px-5
                  py-2
                  text-sm
                  font-bold
                  tracking-[2px]
                  text-[#B60F17]
                "
              >
                OUR GALLERY
              </span>

              <h2
                className="
                  mt-5
                  text-3xl
                  font-black
                  text-white

                  sm:text-4xl
                "
              >
                {item.title}
              </h2>

            </div>


            <div
              className="
                mt-10
                grid
                grid-cols-2
                gap-4

                md:grid-cols-4
              "
            >

              {item.gallery.map((image, index) => (

                <div
                  key={`${image}-${index}`}
                  className="
                    group
                    relative
                    h-[180px]
                    overflow-hidden
                    rounded-[25px]
                    border
                    border-white/10

                    sm:h-[220px]
                  "
                >

                  <Image
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    fill
                    className="
                      object-cover
                      transition
                      duration-700
                      group-hover:scale-110
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-black/0
                      transition
                      group-hover:bg-black/20
                    "
                  />

                </div>

              ))}

            </div>

          </div>

        </section>

      )}


      {/* ============================================================
          BOTTOM CTA
      ============================================================ */}

      <section className="bg-[#fffaf7] px-5 py-16">

        <div
          className="
            mx-auto
            max-w-5xl
            overflow-hidden
            rounded-[35px]
            bg-[#B60F17]
            px-6
            py-10
            text-center
            shadow-xl

            sm:px-10
            sm:py-14
          "
        >

          <h2
            className="
              text-3xl
              font-black
              text-white

              sm:text-4xl
            "
          >
            Building A Better Future Together
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-white/80

              sm:text-base
            "
          >
            Our commitment is to provide students with the right
            environment, opportunities and support to achieve their goals.
          </p>


          <Link
            href="/"
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#F8F000]
              px-7
              py-3
              font-bold
              text-[#B60F17]
              transition
              hover:bg-white
            "
          >
            Back to Home
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </main>
  );
}


/* ================================================================
   DEFAULT POINTS
   ================================================================ */

function getPoints(item: { sections?: Array<{ points?: string[] }> }): string[] {
  const points = item.sections?.flatMap(
    (section: any) => section.points || []
  );

  if (points?.length) {
    return [...new Set(points)].slice(0, 8);
  }

  return [
    "Quality Education",
    "Experienced Teachers",
    "Modern Learning Facilities",
    "Practical Learning",
    "Student Support",
    "Safe Learning Environment",
  ];
}
