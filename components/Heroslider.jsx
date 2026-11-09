"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const slides = [
  {
    title: "Learning with purpose",
    desc: "A welcoming place to discover your strengths and build a bright future.",
    img: "/images/homehero/PLA1.jpg",
  },
  {
    title: "Growing with confidence",
    desc: "Supportive teachers and meaningful learning help every student move forward.",
    img: "/images/homehero/s1.png",
  },
  {
    title: "Ready for what comes next",
    desc: "Knowledge, discipline and values for a future full of possibility.",
    img: "/images/homehero/hero1.png",
  },
];

// Infinite loop ke liye
const extendedSlides = [
  slides[slides.length - 1],
  ...slides,
  slides[0],
];

export default function HeroSlider() {
  const schoolDialogRef = useRef(null);

  // 1 se start karenge kyunki 0 par last slide ki clone hai
  const [active, setActive] = useState(1);

  const [transition, setTransition] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setTransition(true);

      setActive((prev) =>
        prev >= slides.length + 1 ? 1 : prev + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    // Last clone par pahunchne ke baad bina animation first slide
    if (active >= slides.length + 1) {
      setTransition(false);
      setActive(1);
    }

    // Agar backward last clone par jana ho
    if (active === 0) {
      setTransition(false);
      setActive(slides.length);
    }
  };

  const handleDotClick = (index) => {
    setTransition(true);
    setActive(index + 1);
  };

  return (
    <section aria-label="School highlights" className="relative h-[58vh] min-h-[400px] max-h-[760px] w-full overflow-hidden sm:h-[66vh] md:h-[70vh]">
      
      <div
        className={`flex h-full ${
          transition
            ? "transition-transform duration-700 ease-in-out"
            : ""
        }`}
        style={{
          transform: `translateX(-${active * 100}%)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedSlides.map((slide, i) => (
          <div
            key={i}
            className="relative h-full min-w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slide.img})`,
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-slate-950/75 via-slate-950/40 to-slate-950/10 px-5 pb-10 text-left sm:px-10 md:justify-start md:px-16 lg:px-24">
              <div className="home-hero-copy max-w-2xl text-white">
                <span data-entrance-item className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur-sm sm:text-xs">
                  Smt. Champi Devi Inter College
                </span>
                <h2 data-entrance-item className="mt-5 text-4xl font-black leading-[1.05] tracking-tight drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
                  {slide.title}
                </h2>
                <p data-entrance-item className="mt-4 max-w-xl text-sm leading-6 text-white/85 drop-shadow sm:mt-5 sm:text-lg sm:leading-8">
                  {slide.desc}
                </p>
                <button
                  type="button"
                  data-entrance-item
                  onClick={() => schoolDialogRef.current?.showModal()}
                  className="motion-cta mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#f4c15a] px-6 py-3 text-sm font-extrabold text-[#542b24] shadow-lg transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-white sm:mt-8"
                >
                  Discover our school
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Tabs */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => handleDotClick(i)}
            aria-current={active === i + 1 ? "true" : undefined}
            className={`h-3 rounded-full transition-all duration-300 ${
              active === i + 1
                ? "w-10 bg-[#B60F17]"
                : "w-3 bg-white/70 hover:bg-white"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <dialog
        ref={schoolDialogRef}
        className="school-dialog"
        aria-labelledby="school-dialog-title"
        onClick={(event) => {
          if (event.target === schoolDialogRef.current) {
            schoolDialogRef.current?.close();
          }
        }}
      >
        <div className="school-dialog__panel relative rounded-3xl border border-orange-100 bg-[#fffaf5] p-6 text-[#542b24] shadow-2xl sm:p-8">
          <button
            type="button"
            onClick={() => schoolDialogRef.current?.close()}
            aria-label="Close dialog"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl text-slate-500 shadow-sm transition hover:bg-orange-50 hover:text-[#b60f17]"
          >
            &times;
          </button>
          <span className="inline-flex rounded-full bg-[#fff0de] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9b3d19]">
            Smt. Champi Devi Inter College
          </span>
          <h2
            id="school-dialog-title"
            className="mt-4 pr-8 text-2xl font-black leading-tight text-slate-900 sm:text-3xl"
          >
            A place to learn, grow, and find your path.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Discover a welcoming school community built around purposeful
            learning, supportive teachers, and confidence for the future.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/about"
              onClick={() => schoolDialogRef.current?.close()}
              className="motion-cta inline-flex min-h-11 items-center justify-center rounded-full bg-[#b60f17] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#951c12]"
            >
              Explore our school
            </Link>
            <button
              type="button"
              onClick={() => schoolDialogRef.current?.close()}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-bold text-[#694237] transition hover:bg-orange-50"
            >
              Maybe later
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
