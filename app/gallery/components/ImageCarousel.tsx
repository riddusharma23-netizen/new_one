
"use client";

import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";

import {
  Autoplay,
  Pagination,
  Navigation,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface GalleryImage {
  id: number;
  image: string;
  title: string;
}

interface ImageCarouselProps {
  images: GalleryImage[];
}

export default function ImageCarousel({
  images,
}: ImageCarouselProps) {
  return (
    <div className="school-gallery relative mt-16 px-2 sm:px-4">

   <Swiper
  modules={[Autoplay, Pagination]}
  slidesPerView={1}
  spaceBetween={22}
  loop={true}
  autoplay={{
    delay: 3000,
    disableOnInteraction: false,
  }}
  pagination={{
    clickable: true,
  }}
  navigation={false}
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
  className="!pb-14"
>
        {images.map((item) => (
          <SwiperSlide key={item.id}>

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-[#D4AF37]/40
                bg-white
                shadow-[0_12px_35px_rgba(7,47,96,0.15)]
                transition-all
                duration-500
                hover:-translate-y-2
                hover:shadow-[0_20px_50px_rgba(7,47,96,0.25)]
              "
            >

              {/* Image */}
              <div className="relative h-[280px] overflow-hidden">

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 1024px) 50vw,
                    (max-width: 1280px) 33vw,
                    25vw
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-110
                  "
                />

                {/* Bottom Gradient */}
                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    h-24
                    bg-gradient-to-t
                    from-[#072F60]/45
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />

                {/* Orange Hover Border */} 
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-[26px]
                    border-2
                    border-transparent
                    transition-all
                    duration-500
                    group-hover:border-[#FF6A00]
                  "
                />

              </div>

            </div>

          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}

