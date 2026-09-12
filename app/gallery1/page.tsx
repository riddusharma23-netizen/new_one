"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Camera,
  Trophy,
  Music,
  Sparkles,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCoverflow,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

// -----------------------------------------------------
// DATA — More images added to each section
// -----------------------------------------------------

const culturalEvents = [
  {
    image: "/images/gallery/PG9.jpg",
    title: "Annual Cultural Function",
    category: "Cultural Event",
    date: "15 December 2025",
  },
  {
    image: "/images/gallery/school.jpg",
    title: "Dance Performance",
    category: "Cultural Event",
    date: "15 December 2025",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Annual Celebration",
    category: "Cultural Event",
    date: "15 December 2025",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Students Performance",
    category: "Cultural Event",
    date: "15 December 2025",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Folk Dance Showcase",
    category: "Cultural Event",
    date: "16 December 2025",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Drama & Skit Competition",
    category: "Cultural Event",
    date: "17 December 2025",
  },
];

const sportsEvents = [
  {
    image: "/images/gallery/PLA1.jpg",
    title: "Annual Sports Meet",
    category: "Sports",
  },
  {
    image: "/images/gallery/PLA1.jpg",
    title: "Cricket Tournament",
    category: "Sports",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Athletics Competition",
    category: "Sports",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Volleyball Match",
    category: "Sports",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Basketball Championship",
    category: "Sports",
  },
  {
    image: "/gallery/sports-6.jpg",
    title: "Kho-Kho Competition",
    category: "Sports",
  },
];

const schoolEvents = [
  {
    image: "/images/gallery/PG9.jpg",
    title: "Republic Day Celebration",
    category: "Celebration",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Independence Day",
    category: "Celebration",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Teachers Day",
    category: "School Event",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Science Exhibition",
    category: "Academic",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Prize Distribution",
    category: "Achievement",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Educational Tour",
    category: "Activity",
  },
  {
    image: "/images/gallery/PG9.jpg",
    title: "Annual Day Function",
    category: "Celebration",
  },
  {
    image: "/gallery/event-8.jpg",
    title: "Art & Craft Exhibition",
    category: "Academic",
  },
];

const campusImages = [
  "/images/gallery/PG9.jpg",
 "/images/gallery/PG9.jpg",
 "/images/gallery/PG9.jpg",
  "/gallery/campus-4.jpg",
  "/gallery/campus-5.jpg",
  "/gallery/campus-6.jpg",
  "/gallery/campus-7.jpg",
  "/gallery/campus-8.jpg",
];

// -----------------------------------------------------
// PAGE
// -----------------------------------------------------

export default function GalleryPage() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <main className="overflow-hidden bg-white">
      {/* =================================================
          HERO — New color scheme
      ================================================= */}
      <section className="relative min-h-[560px] overflow-hidden bg-[#B60F17]">


  {/* Background Image */}
  <div
    className="
    absolute
    inset-0
    "
  >
    <Image
      src="/school.jpg"
      alt="background"
      fill
      priority
      className="
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



        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              <Camera className="h-4 w-4 text-[#B60F17]" />
              School Gallery
            </div>

            <h1 className="text-4xl leading-tight' text-[#B60F17] sm:text-5xl lg:text-7xl">
              Memories That
              <span className="block text-white">Inspire Us</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              Explore the vibrant moments, achievements, celebrations,
              cultural activities and sports events of Champi Devi Inter
              College.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#cultural-events"
                className="group inline-flex items-center gap-2 rounded-full bg-[#F8F400] px-6 py-3 font-semibold text-[#B60F17] transition hover:bg-[#e6db00]"
              >
                Explore Gallery
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white backdrop-blur">
                <Sparkles className="h-4 w-4 text-[#F8F400]" />
                2025–26 Memories
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CULTURAL EVENTS — Fixed slider with navigation
      ================================================= */}

      <section id="cultural-events" className="relative bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Cultural Events"
            title="Annual Cultural Function"
            description="A celebration of creativity, confidence and talent where our students showcase their extraordinary performances."
            icon={<Music className="h-5 w-5" />}
          />

          <div className="relative mt-14">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={1}
              spaceBetween={24}
              loop
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={{
                prevEl: ".cultural-prev",
                nextEl: ".cultural-next",
              }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-14"
            >
              {culturalEvents.map((event) => (
                <SwiperSlide key={event.title}>
                  <GalleryCard
                    image={event.image}
                    title={event.title}
                    category={event.category}
                    date={event.date}
                    onClick={() => setActiveImage(event.image)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <SliderButton
              className="cultural-prev left-0"
              direction="left"
            />
            <SliderButton
              className="cultural-next right-0"
              direction="right"
            />
          </div>
        </div>
      </section>

      {/* =================================================
          SPORTS SECTION — FIXED: now with navigation like cultural
      ================================================= */}


      <section className="relative overflow-hidden bg-[#FFF8F0] py-24">
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#B60F17]/5 blur-3xl" />
        <div className="absolute -left-40 bottom-20 h-80 w-80 rounded-full bg-[#F8F400]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Sports & Fitness"
            title="Annual Sports Meet"
            description="Building teamwork, discipline, confidence and sportsmanship through healthy competition."
            icon={<Trophy className="h-5 w-5" />}
            align="center"
          />

          <div className="relative mt-16">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={1}
              spaceBetween={24}
              loop
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={{
                prevEl: ".sports-prev",
                nextEl: ".sports-next",
              }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-14"
            >
              {sportsEvents.map((event) => (
                <SwiperSlide key={event.title}>
                  <div
                    className="group relative overflow-hidden rounded-[30px] bg-[#B60F17] shadow-[0_25px_60px_rgba(182,15,23,0.18)] cursor-pointer"
                    onClick={() => setActiveImage(event.image)}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#B60F17] via-[#B60F17]/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-7">
                        <span className="inline-flex rounded-full bg-[#F8F400] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#B60F17]">
                          {event.category}
                        </span>
                        <h3 className="mt-3 text-2xl text-white">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <SliderButton
              className="sports-prev left-0"
              direction="left"
            />
            <SliderButton
              className="sports-next right-0"
              direction="right"
            />
          </div>
        </div>
      </section>

      {/* =================================================
          SCHOOL EVENTS
      ================================================= */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="School Life"
            title="Events & Celebrations"
            description="Moments that bring students, teachers and the entire school community together."
          />

          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {schoolEvents.map((event) => (
              <article
                key={event.title}
                onClick={() => setActiveImage(event.image)}
                className="group cursor-pointer overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-[0_12px_40px_rgba(182,15,23,0.08)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(182,15,23,0.16)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
                  <div className="absolute bottom-5 left-5">
                    <span className="rounded-full bg-[#F8F400] px-3 py-1 text-xs font-semibold text-[#B60F17]">
                      {event.category}
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-white">
                      {event.title}
                    </h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          CAMPUS LIFE — New color scheme
      ================================================= */}
      <section className="bg-[#B60F17] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Campus Life"
            title="Life at Champi Devi Inter College"
            description="A glimpse into the everyday learning, friendship and memorable moments of our students."
            light
          />

          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {campusImages.map((image, index) => (
              <div
                key={image}
                onClick={() => setActiveImage(image)}
                className={`
                  group relative cursor-pointer overflow-hidden rounded-3xl
                  ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}
                  ${index === 3 ? "md:row-span-2" : ""}
                `}
              >
                <div className="relative h-full min-h-[180px] md:min-h-[220px]">
                  <Image
                    src={image}
                    alt="Champi Devi Inter College campus"
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#B60F17]/0 transition group-hover:bg-[#B60F17]/40" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                    <div className="rounded-full bg-[#F8F400] p-4 shadow-xl">
                      <Camera className="h-6 w-6 text-[#B60F17]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          CTA — New color scheme
      ================================================= */}
      <section className="relative overflow-hidden bg-[#F8F400] py-20">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#B60F17]/10" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#B60F17]/10" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-[#B60F17]/80" />
          <h2 className="mt-5 text-3xl font-bold text-[#B60F17] sm:text-4xl">
            Every Moment Tells a Story
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#B60F17]/80">
            Discover more memories, achievements and celebrations from
            Champi Devi Inter College.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#B60F17] px-7 py-3 font-bold text-[#F8F400] transition hover:bg-[#8a0c12]"
          >
            Get in Touch
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* =================================================
          LIGHTBOX
      ================================================= */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-5 backdrop-blur-sm"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative h-[80vh] w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt="Gallery preview"
              fill
              className="object-contain"
            />
            <button
              onClick={() => setActiveImage(null)}
              className="absolute right-3 top-3 rounded-full bg-[#F8F400] px-4 py-2 font-bold text-[#B60F17] shadow-xl hover:bg-[#e6db00]"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// -----------------------------------------------------
// SECTION HEADING
// -----------------------------------------------------

function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div
      className={`
        ${align === "center" ? "mx-auto text-center" : ""}
        max-w-3xl
      `}
    >
      <div
        className={`
          inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[.18em] bg-[#F8F400] py-2 px-3 rounded-full
          ${light ? "text-[#F8F400]" : "text-[#B60F17]"}
        `}
      >
        {icon}
        {eyebrow}
      </div>

      <h2
        className={`
          mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl
          ${light ? "text-white" : "text-[#B60F17]"}
        `}
      >
        {title}
      </h2>

      <p
        className={`
          mt-5 text-base leading-8
          ${light ? "text-white/80" : "text-[#333]"}
        `}
      >
        {description}
      </p>
    </div>
  );
}

// -----------------------------------------------------
// GALLERY CARD
// -----------------------------------------------------

function GalleryCard({
  image,
  title,
  category,
  date,
  onClick,
}: {
  image: string;
  title: string;
  category: string;
  date: string;
  onClick: () => void;
}) {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-[28px] bg-white shadow-[0_15px_45px_rgba(182,15,23,0.10)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#B60F17]/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="rounded-full bg-[#F8F400] px-3 py-1 text-xs font-bold text-[#B60F17]">
            {category}
          </span>
          <h3 className="mt-3 text-xl font-bold text-white">{title}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
            <CalendarDays className="h-4 w-4" />
            {date}
          </div>
        </div>
      </div>
    </article>
  );
}

// -----------------------------------------------------
// SLIDER BUTTON
// -----------------------------------------------------

function SliderButton({
  className,
  direction,
}: {
  className: string;
  direction: "left" | "right";
}) {
  return (      
    <button
      className={`
        absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full
        bg-white text-[#B60F17] shadow-xl transition
        hover:bg-[#F8F400] hover:text-[#B60F17]
        lg:flex ${className}
      `}
    >
      {direction === "left" ? (
        <ChevronLeft className="h-5 w-5" />
      ) : (
        <ChevronRight className="h-5 w-5" />
      )}
    </button>
  );
}

