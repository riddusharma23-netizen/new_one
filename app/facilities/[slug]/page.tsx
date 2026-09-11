import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { facilities } from "@/data/facilities";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return facilities.map(({ slug }) => ({ slug }));
}

export default async function FacilityPage({
  params,
}: PageProps) {

  const { slug } = await params;

  const facility = facilities.find(
    (item) => item.slug === slug
  );

 if (!facility) {
  return (
    <main className="min-h-screen">

      <div className="flex min-h-screen items-center justify-center px-5 text-center">

        <div>

          <h1 className="text-4xl font-black text-[#072F60]">
            Facility Not Found
          </h1>

          <p className="mt-4 text-gray-600">
            The facility you are looking for does not exist.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#B60F17] px-6 py-3 font-semibold text-white"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

        </div>

      </div>

    </main>
  );
}

  const Icon = facility.icon;

  return (
    <main className="">

      {/* HERO */}

      <section className="relative overflow-hidden py-20 lg:py-28">

        <Image
          src={facility.image}
          alt={facility.title}
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}

        <div className="absolute inset-0 bg-black/70" />

        {/* Gradient */}

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />

        {/* Decorative Blur */}

        <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[#F8F000]/20 blur-[150px]" />

        <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#B60F17]/30 blur-[150px]" />

        <div className="relative mx-auto max-w-7xl px-5">

          {/* Back */}

          {/* <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-3
              rounded-full
              border
              border-[#B60F17]
              bg-white/10
              px-5
              py-3
              text-[#B60F17]
              backdrop-blur-md
              transition
              hover:bg-white/20
            "
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link> */}

          {/* Hero Content */}

          <div className="mt-16 grid items-center gap-14 lg:grid-cols-2">

            {/* LEFT */}

            <div>

              <div className="inline-flex items-center gap-3 rounded-full bg-[#F8F000] px-5 py-2 font-bold text-[#B60F17]">

                <Icon size={18} />

                Student Facility

              </div>

              <h1 className="mt-7 text-5xl font-black' leading-tight text-white sm:text-6xl">

                {facility.title}

              </h1>

              <div className="mt-6 h-1 w-28 rounded-full bg-gradient-to-r from-[#B60F17] to-[#F8F000]" />

              <p className="mt-7 max-w-xl text-lg leading-8 text-white/80">

                {facility.heroDescription}

              </p>

            </div>

            {/* RIGHT IMAGE */}

            <div className="relative">

              {/* Yellow Border */}

              <div className="absolute -left-5 -top-5 h-full w-full rounded-[40px] border-[4px] border-[#F8F000]" />

              {/* Red Border */}

              <div className="absolute -right-5 -bottom-5 h-full w-full rounded-[40px] border-[4px] border-[#B60F17]" />

              <div className="relative h-[400px] overflow-hidden rounded-[40px] shadow-2xl sm:h-[460px]">

                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  className="object-cover transition duration-700 hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="relative overflow-hidden py-20 lg:py-24">

        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-orange-100/50 blur-[120px]" />

        <div className="absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-blue-100/50 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* CONTENT */}

            <div>

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-10 bg-[#B60F17]" />

                <span className="text-sm font-bold uppercase tracking-[2px] text-[#B60F17]">
                  {facility.label}
                </span>

              </div>

              <h2 className="mt-5 text-4xl font-black' leading-tight text-[#333] sm:text-5xl">
                {facility.heading}
              </h2>

              <p className="mt-6 text-lg leading-8 text-[#333]">
                {facility.content}
              </p>

              {/* Points */}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                {facility.points.map((point) => (

                  <div
                    key={point}
                    className="
                      group
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-orange-100
                      bg-white
                      p-4
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#B60F17]/30
                      hover:shadow-md
                    "
                  >

                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F8F000]
                        text-[#B60F17]
                      "
                    >
                      <CheckCircle2 size={20} />
                    </span>

                    <span className="text-sm font-semibold text-[#333]">
                      {point}
                    </span>

                  </div>

                ))}

              </div>

            </div>

            {/* IMAGE */}

            <div className="relative">

              <div className="absolute -bottom-5 -right-5 h-full w-full rounded-[35px] border-[3px] border-[#B60F17]/30" />

              <div className="absolute -left-5 -top-5 h-24 w-24 rounded-tl-[30px] border-l-[6px] border-t-[6px] border-[#B60F17]" />

              <div className="relative h-[420px] overflow-hidden rounded-[35px] shadow-[0_25px_60px_rgba(7,47,96,.15)]">

              <Image
  src={facility.contentImage ?? facility.image}
  alt={facility.title}
  fill
  className="object-cover transition duration-700 hover:scale-110"
/>

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6">

                  <p className="text-xs font-bold uppercase tracking-[3px] text-[#F8F000]">
                    Champi Devi Inter College
                  </p>

                  <p className="mt-2 text-2xl font-black text-white">
                    {facility.title}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

 

<section className="relative overflow-hidden bg-[#B60F17] py-20 lg:py-24">

  {/* Background Decorations */}

  <div
    className="
      pointer-events-none
      absolute
      -left-40
      -top-40
      h-[420px]
      w-[420px]
      rounded-full
      bg-[#F8F000]/10
      blur-[130px]
    "
  />

  <div
    className="
      pointer-events-none
      absolute
      -bottom-40
      -right-40
      h-[420px]
      w-[420px]
      rounded-full
      bg-[#B60F17]/20
      blur-[130px]
    "
  />

  <div className="relative mx-auto max-w-7xl px-5">

    {/* SECTION HEADING */}

    <div className="mx-auto max-w-3xl text-center">

      {/* Badge */}

      <div
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
          text-[#B60F17]
         shadow-lg
          backdrop-blur-sm
        "
      >
        <span className="h-2 w-2 rounded-full bg-[#F8F000]" />

        Student Facilities
      </div>


      {/* Heading */}

      <h2
        className="
          mt-6
          text-4xl
          font-black'
          leading-tight
          text-white

          sm:text-5xl
          lg:text-6xl
        "
      >
        Explore More
        <span className="text-[#F8F000]"> Facilities</span>
      </h2>


      {/* Description */}

      <p
        className="
          mx-auto
          mt-5
          max-w-2xl

          text-base
          leading-7
          text-white/70

          sm:text-lg
          sm:leading-8
        "
      >
        Discover the learning opportunities, support services and
        facilities available at SMT Champi Devi Inter College.
      </p>

    </div>


    {/* ================= FACILITY CARDS ================= */}

    <div
      className="
        mt-14
        grid
        gap-6

        sm:grid-cols-2
        lg:grid-cols-3

        lg:gap-8
      "
    >

      {facilities
        .filter((item) => item.slug !== facility.slug)
        .slice(0, 3)
        .map((item) => {

          const FacilityIcon = item.icon;

          return (
            <Link
              key={item.id}
              href={`/facilities/${item.slug}`}
              className="
                group
                relative
                overflow-hidden

                rounded-[28px]

                border
                border-white/10

                bg-white

                shadow-[0_20px_60px_rgba(0,0,0,.20)]

                transition-all
                duration-500

                hover:-translate-y-3
                hover:border-[#F8F000]/60
                hover:shadow-[0_30px_70px_rgba(248,240,0,.15)]
              "
            >

              {/* IMAGE */}

              <div
                className="
                  relative
                  h-[250px]
                  overflow-hidden
                "
              >

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="
                    object-cover

                    transition-transform
                    duration-700
                    group-hover:scale-110
                  "
                />


                {/* Dark Overlay */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/20
                    to-transparent
                  "
                />


                {/* Red Hover Overlay */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-[#B60F17]/20

                    opacity-0

                    transition
                    duration-500

                    group-hover:opacity-100
                  "
                />


                {/* Icon */}

                <div
                  className="
                    absolute
                    left-5
                    top-5

                    flex
                    h-12
                    w-12
                    items-center
                    justify-center

                    rounded-full

                    bg-[#F8F000]

                    text-[#B60F17]

                    shadow-lg

                    transition-all
                    duration-500

                    group-hover:scale-110
                    group-hover:rotate-6
                  "
                >
                  <FacilityIcon
                    size={23}
                    strokeWidth={2.4}
                  />
                </div>


                {/* Category */}

                <div
                  className="
                    absolute
                    right-5
                    top-5

                    rounded-full

                    border
                    border-white/20

                    bg-black/30

                    px-3
                    py-1.5

                    text-xs
                    font-semibold

                    text-white

                    backdrop-blur-md
                  "
                >
                  Student Facility
                </div>


                {/* Image Bottom Content */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0

                    p-6
                  "
                >

                  <h3
                    className="
                      text-2xl
                      font-black
                      text-white

                      transition-colors
                      duration-300

                      group-hover:text-[#F8F000]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      line-clamp-2

                      text-sm
                      leading-6
                      text-white/75
                    "
                  >
                    {item.description}
                  </p>

                </div>

              </div>


              {/* CARD FOOTER */}

              <div
                className="
                  flex
                  items-center
                  justify-between

                  bg-white

                  px-6
                  py-5
                "
              >

                <span
                  className="
                    text-sm
                    font-bold
                    text-[#072F60]
                  "
                >
                  Discover Facility
                </span>


                <span
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center

                    rounded-full

                    bg-[#B60F17]

                    text-white

                    transition-all
                    duration-300

                    group-hover:bg-[#F8F000]
                    group-hover:text-[#B60F17]
                    group-hover:translate-x-1
                  "
                >
                  <ArrowRight size={18} />
                </span>

              </div>

            </Link>
          );
        })}

    </div>


 

    <div className="mt-14 text-center">

      <Link
        href="/"
        className="
          group
          inline-flex
          items-center
          gap-3

          rounded-xl

          bg-[#F8F000]

          px-7
          py-3.5

          font-bold
          text-[#B60F17]

          shadow-[0_10px_30px_rgba(182,15,23,.35)]

          transition-all
          duration-300

          hover:bg-[#F8F000]
          hover:text-[#B60F17]

          hover:shadow-[0_15px_40px_rgba(248,240,0,.20)]
        "
      >
        Explore All Facilities

        <ArrowRight
          size={19}
          className="
            transition-transform
            duration-300

            group-hover:translate-x-1
          "
        />
      </Link>

    </div>

  </div>

</section>
    </main>
  );
}
