
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const reviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Student",
    image: "/st2.jpg",
    comment:
      "Champi Devi Inter College provides a friendly and positive learning environment. Along with quality education, I have also learned discipline, teamwork, and confidence. I am proud to be a student of this school.",
  },
  {
    id: 2,
    name: "Priya Verma",
    role: "Student",
    image: "/st1.jpg",
    comment:
      "My experience at Champi Devi Inter College has been truly wonderful. The teachers are supportive, the learning environment is positive, and the school has helped me grow both academically and personally.",
  },
  {
    id: 3,
    name: "Riya Gupta",
    role: "Student",
    image: "/st1.jpg",
    comment:
      "Champi Devi Inter College has provided me with a positive learning environment and supportive teachers. My experience here has helped me improve my knowledge, confidence, and overall personality.",
  },
  {
    id: 4,
    name: "Aditya Singh",
    role: "Student",
    image: "/st3.jpg",
    comment:
      "Studying at Champi Devi Inter College has been a great experience for me. The teachers are caring and supportive, and they always encourage us to do our best.",
  },
  {
    id: 5,
    name: "Ananya Sharma",
    role: "Student",
    image: "/st2.jpg",
    comment:
      "The school has helped me become more disciplined, focused, and confident. I appreciate the encouragement and guidance given by all my teachers.",
  },
  {
    id: 6,
    name: "Rahul Kumar",
    role: "Student",
    image: "/st3.jpg",
    comment:
      "I enjoy studying at Champi Devi Inter College because the teachers explain every subject clearly and motivate us to achieve our goals.",
  },
];

export default function StudentSays() {
  return (
    <section className="relative overflow-hidden py-6 lg:py-6">
      {/* Decorative Background */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#F8C400]/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#B60F17]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1450px] px-5 md:px-8">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full shadow-lg bg-[#F8F000] px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-[#B60F17] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#B60F17]" />
            Student Stories
          </span>

          <h2 className="mt-6 text-3xl leading-tight text-[#333] md:text-5xl lg:text-5xl">
            What Our Students
            <span className="block text-[#B60F17]">Say About Us</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#333] md:text-lg">
            Real experiences from students who are learning, growing, and
            building confidence every day at Champi Devi Inter College.
          </p>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{
            delay: 3200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
          }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 22,
            },
            1100: {
              slidesPerView: 3,
              spaceBetween: 28,
            },
          }}
          className="studentSwiper !pb-16"
        >
          {reviews.map((item) => (
            <SwiperSlide key={item.id} className="h-auto">
              <article className="group relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-[28px] border border-[#F2D56B]/70 bg-white p-7 shadow-[0_18px_50px_rgba(30,41,59,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(182,15,23,0.14)] md:p-8">
                {/* Top accent line */}
                <div className="absolute left-0 top-0 h-[5px] w-full bg-gradient-to-r from-[#B60F17] via-[#F8C400] to-[#FF8A00]" />

                {/* Decorative glow */}
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#F8C400]/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />

                {/* Quote Icon */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex gap-1 text-lg text-[#F8B900]">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>

                  <div className="font-serif text-7xl leading-none text-[#B60F17]/10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    “
                  </div>
                </div>

                {/* Review */}
                <p className="relative z-10 mt-5 flex-1 text-[16px] leading-8 text-[#333]">
                  {item.comment}
                </p>

                {/* Divider */}
                <div className="relative z-10 my-7 h-px w-full bg-gradient-to-r from-transparent via-[#E9C547] to-transparent" />

                {/* Student Profile */}
                <div className="relative z-10 flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-[#B60F17] via-[#F8C400] to-[#FF8A00] p-[3px] shadow-md">
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#072f60]">
                      {item.name}
                    </h3>

                    <span className="mt-1 inline-flex rounded-full bg-[#B60F17]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#B60F17]">
                      {item.role}
                    </span>
                  </div>
                </div>

                {/* Bottom Hover Accent */}
                <div className="absolute bottom-0 left-0 h-[5px] w-0 bg-[#B60F17] transition-all duration-500 group-hover:w-full" />
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Slider pagination styling */}
      <style jsx global>{`
        .studentSwiper .swiper-pagination-bullet {
          width: 9px;
          height: 9px;
          background: #d6b25e;
          opacity: 0.45;
          transition: all 0.3s ease;
        }

        .studentSwiper .swiper-pagination-bullet-active {
          width: 28px;
          border-radius: 20px;
          background: #b60f17;
          opacity: 1;
        }

        .studentSwiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
}
