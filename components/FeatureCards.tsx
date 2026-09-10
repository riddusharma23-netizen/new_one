"use client";

import Link from "next/link";

import { facilities } from "@/data/facilities";

import { Swiper, SwiperSlide } from "swiper/react";

import {
  Autoplay,
  Navigation,
} from "swiper/modules";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

export default function FeatureCards() {
  return (
    <section className="relative overflow-hidden py-20">

 

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-10
          h-80
          w-80
          rounded-full
          bg-[#F8F000]/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-10
          h-80
          w-80
          rounded-full
          bg-[#B60F17]/10
          blur-[120px]
        "
      />

      <div className="relative mx-auto max-w-[1400px] px-5">

        {/* SLIDER WRAPPER */}

        <div className="relative">

        

          <button
            type="button"
            className="
              facility-prev

              absolute
              left-0
              top-1/2
              z-30

              -translate-x-1/2
              -translate-y-1/2

              flex
              h-12
              w-12
              items-center
              justify-center

              rounded-full

              border-2
              border-[#F8F000]

              bg-[#B60F17]

              text-white

              shadow-[0_8px_25px_rgba(182,15,23,.30)]

              transition-all
              duration-300

              hover:scale-110
              hover:bg-[#F8F000]
              hover:text-[#B60F17]

              active:scale-95

              sm:h-14
              sm:w-14
            "
            aria-label="Previous slide"
          >
            <ChevronLeft
              size={28}
              strokeWidth={2.5}
            />
          </button>

 
          <button
            type="button"
            className="
              facility-next

              absolute
              right-0
              top-1/2
              z-30

              translate-x-1/2
              -translate-y-1/2

              flex
              h-12
              w-12
              items-center
              justify-center

              rounded-full

              border-2
              border-[#F8F000]

              bg-[#B60F17]

              text-white

              shadow-[0_8px_25px_rgba(182,15,23,.30)]

              transition-all
              duration-300

              hover:scale-110
              hover:bg-[#F8F000]
              hover:text-[#B60F17]

              active:scale-95

              sm:h-14
              sm:w-14
            "
            aria-label="Next slide"
          >
            <ChevronRight
              size={28}
              strokeWidth={2.5}
            />
          </button>


          {/* ================= SWIPER ================= */}

          <Swiper
            modules={[
              Autoplay,
              Navigation,
            ]}

            spaceBetween={24}

            slidesPerView={1}

            loop={true}

            speed={700}

            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}

            navigation={{
              prevEl: ".facility-prev",
              nextEl: ".facility-next",
            }}

            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },

              1024: {
                slidesPerView: 3,
                spaceBetween: 26,
              },

              1280: {
                slidesPerView: 4,
                spaceBetween: 28,
              },
            }}

            className="!px-2 !py-5"
          >

            {facilities.map((card) => {

              const Icon = card.icon;

              return (
                <SwiperSlide
                  key={card.id}
                  className="!h-auto"
                >

                  {/* ================= CARD ================= */}

                  <Link
                    href={`/facilities/${card.slug}`}
                    className="
                      group
                      relative
                      block
                      h-full
                      min-h-[350px]

                      overflow-hidden

                      rounded-[28px]

                      border
                      border-orange-100

                      bg-white

                      p-7

                      text-center

                      shadow-[0_12px_40px_rgba(7,47,96,.10)]

                      transition-all
                      duration-500

                      hover:-translate-y-3

                      hover:border-[#F8F000]

                      hover:shadow-[0_25px_60px_rgba(216,93,0,.18)]
                    "
                  >

                    {/* Hover Background */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0

                        bg-gradient-to-b
                        from-transparent
                        via-[#D85D00]/5
                        to-[#B60F17]/10

                        opacity-0

                        transition
                        duration-500

                        group-hover:opacity-100
                      "
                    />


                    {/* Decorative Circle */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-10
                        -top-10

                        h-28
                        w-28

                        rounded-full

                        bg-[#F8F000]/20

                        transition-all
                        duration-500

                        group-hover:scale-150
                      "
                    />


                    {/* **************** ICON ***************** */}

                    <div
                      className="
                        relative
                        mx-auto

                        flex
                        h-20
                        w-20

                        items-center
                        justify-center

                        rounded-full

                        bg-[#F8F000]

                        text-[#B60F17]

                        shadow-sm

                        transition-all
                        duration-500

                        group-hover:scale-110
                        group-hover:rotate-6
                      "
                    >
                      <Icon
                        size={38}
                        strokeWidth={2.2}
                      />
                    </div>


                    {/* ================= TITLE ================= */}

                    <h3
                      className="
                        relative
                        mt-6

                        text-xl
                        font-bold

                        text-[#072F60]

                        transition
                        duration-300

                        group-hover:text-[#B60F17]
                      "
                    >
                      {card.title}
                    </h3>


                    {/* ================= DESCRIPTION ================= */}

                    <p
                      className="
                        relative
                        mt-3

                        min-h-[48px]

                        text-sm
                        leading-6

                        text-gray-600
                      "
                    >
                      {card.description}
                    </p>


                    {/* ================= EXPLORE BUTTON ================= */}

                    <div
                      className="
                        relative
                        mt-6

                        inline-flex
                        items-center
                        gap-2

                        rounded-xl

                        bg-[#B60F17]

                        px-5
                        py-2.5

                        text-sm
                        font-semibold

                        text-white

                        transition-all
                        duration-500

                        group-hover:bg-[#F8F000]
                        group-hover:text-[#B60F17]
                      "
                    >
                      Explore

                      <span
                        className="
                          transition-transform
                          duration-300

                          group-hover:translate-x-1
                        "
                      >
                        →
                      </span>
                    </div>

                  </Link>

                </SwiperSlide>
              );
            })}

          </Swiper>

        </div>

      </div>

    </section>
  );
}