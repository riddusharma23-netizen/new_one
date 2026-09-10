"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    desc: "Fast • Responsive • Beautiful UI",
    img: "/images/homehero/PLA1.jpg",
  },
  {
    desc: "Next.js + React + CSS",
    img: "/images/homehero/s1.png",
  },
  {
    desc: "Works Perfect Everywhere",
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
  // 1 se start karenge kyunki 0 par last slide ki clone hai
  const [active, setActive] = useState(1);

  const [transition, setTransition] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTransition(true);

      setActive((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    // Last clone par pahunchne ke baad bina animation first slide
    if (active === slides.length + 1) {
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
    <section className="relative h-[55vh] min-h-[400px] w-full overflow-hidden sm:h-[65vh] md:h-[60vh]">
      
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
            <div className="absolute inset-0 flex items-center justify-center bg-[#B60F17]/10 px-4 text-center sm:px-8 lg:px-16">
              <div className="max-w-5xl">
                
                {/* Agar title chahiye to uncomment kar sakte ho */}
                {/* 
                <h1 className="text-3xl font-extrabold leading-tight text-[#F8F000] drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
                  {slide.title}
                </h1>
                */}

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Tabs */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`h-3 rounded-full transition-all duration-300 ${
              active === i + 1
                ? "w-10 bg-[#B60F17]"
                : "w-3 bg-white/70 hover:bg-white"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}