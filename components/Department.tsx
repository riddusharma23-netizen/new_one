"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

// icons
import {
  Monitor,
  FlaskConical,
  Calculator,
  Languages,
  Trophy,
  Bus,
  Library,
} from "lucide-react";

const cards = [
  {
    title: "Science Lab",
    desc: "The science lab is a hub of discovery, where experiments bring theories to life.",
    icon: FlaskConical,
  },

  {
    title: "Computer Lab",
    desc: "The computer lab is a space for innovation.",
    icon: Monitor,
  },

  {
    title: "Maths Lab",
    desc: "The maths lab explores concepts through activities.",
    icon: Calculator,
  },

  {
    title: "English Lab",
    desc: "The English lab enhances language skills.",
    icon: Languages,
  },

  {
    title: "Games & Sports",
    desc: "Games and sports promote teamwork.",
    icon: Trophy,
  },

  {
    title: "Transportation",
    desc: "Safe and convenient travel.",
    icon: Bus,
  },

  {
    title: "Library",
    desc: "A quiet haven filled with books.",
    icon: Library,
  },
];

export default function Department() {
  return (
    <section className="py-20 relative">

      <div className="max-w-[1400px] mx-auto px-5">

        <div className="  mb-10">

          <div className="text-center">

        
            <span className="inline-flex   items-center   gap-3 

                bg-[#F8F000] 
            
            rounded-full  text-[#B60F17]    px-6   py-2      font-semibold   tracking-[4px]   uppercase   ">
              Department
            </span>

            <h2
              className="
            mt-5
            text-4xl
            lg:text-6xl
            font-black'
            leading-tight
              "
            >
             Browse Our

              <span className="ml-3 text-[#B60F17]">
               Department
              </span>
            </h2>

            <p
              className="
              mt-8
              text-gray-600
              text-lg
              leading-9
              
              "
            >
              We instill strong values, critical thinking and
              life skills to prepare students for future
              challenges.
            </p>
       </div>

      
        </div>



<div className="hidden lg:block">

  {/* LEFT */}
  <button
    className="
    dep-prev

    absolute
    left-6
    top-2/3

    -translate-y-1/2

    w-[60px]
    h-[60px]

    rounded-full

    bg-[#B60F17]

    text-white

    shadow-[0_10px_40px_rgba(255,132,0,0.35)]

    hover:-translate-y-1
    hover:scale-105

    transition-all
    duration-300

    z-20
    "
  >
    <ChevronLeft size={28} className="mx-auto" />
  </button>

  {/* RIGHT */}
  <button
    className="
    dep-next

    absolute
    right-6
    top-2/3

    -translate-y-1/2

    w-[60px]
    h-[60px]

    rounded-full

    bg-[#B60F17]

    text-white

    shadow-[0_10px_40px_rgba(0,0,0,.15)]

    hover:bg-[#B60F17]

    hover:text-white

    hover:-translate-y-1
    hover:scale-105

    transition-all
    duration-300

    z-20
    "
  >

    <ChevronRight size={28} className="mx-auto" />
  </button>

</div>

        <Swiper
          modules={[Navigation, Autoplay]}
          loop={true}
          speed={900}
          spaceBetween={25}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: ".dep-prev",
            nextEl: ".dep-next",
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },

            640: {
              slidesPerView: 2,
            },

            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
             <div
  className="
  group
  relative
  overflow-hidden

  rounded-[38px]

  bg-white

  p-10
  h-[480px]

  border
  border-[#B60F17]


  transition-all
  duration-500

  hover:-translate-y-3
  hover:shadow-[0_20px_60px_rgba(255,132,0,0.25)]
  "
>

  {/* TOP RIGHT DESIGN */}
  <div
    className="
    absolute
    top-0
    right-0

    w-[100px]
    h-[100px]
bg-[#f145064b]

    rounded-bl-[120px]

    transition-all
    duration-500

    group-hover:scale-125
    group-hover:rotate-6
     group-hover:bg-[#B60F17]

    "
  />

  {/* DOT DESIGN */}
  <div
    className="
    absolute
    top-6
    right-6

    z-20

    grid
    grid-cols-4
    gap-2
    "
  >
    {[...Array(12)].map((_, i) => (
      <span
        key={i}
        className="
        w-1
        h-1
        rounded-full
        bg-white
        "
      />
    ))}
  </div>

  {/* ICON */}
<div
  className="
  relative
  z-10
  w-20
  h-20
  rounded-full
 bg-[#F8F000]


  flex
  items-center
  justify-center
  transition
  duration-500
  group-hover:bg-orange-50
  "
>
  <card.icon
    className="
    w-10
    h-10
    text-[#B60F17]


    transition
    duration-500

    group-hover:scale-110
    "
  />
</div>

  {/* TITLE */}
  <h3
    className="
    relative
    z-10

    mt-10

    text-[24px]
    font-black

    text-[#B60F17]

    "
  >
    {card.title}
  </h3>

  {/* DESC */}
  <p
    className="
    relative
    z-10

    mt-5

    text-gray-500
    text-lg
    leading-8
    "
  >
    {card.desc}
  </p>

  {/* BUTTON */}
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
      bg-[#B60F17]


      text-white
      font-semibold
      tracking-wide

      transition-all
      duration-500
      ease-out

      hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]
      hover:-translate-y-1
 hover:bg-[#F8F000]
 hover:text-[#B60F17]

  
    "
  >
    <span className="relative z-10">
      Explore →
    </span>
  </Link>

  {/* BOTTOM SMALL LINE */}
  <div
    
  />

</div>



            </SwiperSlide>
          ))}
        </Swiper>

      </div>

    </section>
  );
}