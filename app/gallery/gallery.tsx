"use client";

import SectionHeading from "./components/SectionHeading";
import EventGallery from "./components/EventGallery";

import { galleryData } from "./data/galleryData";
 

export default function Gallery() {

  const { heading, sections } = galleryData;

  return (

    <section className="relative overflow-hidden py-24">

      {/* Background Glow */}

      <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#072F60] via-[#D4AF37] to-[#FF6A00] opacity-10 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        <SectionHeading
          badge={heading.badge}
          titleBlack={heading.titleBlack}
          titleGradient={heading.titleGradient}
          description={heading.description}
        />

        <EventGallery
          sections={sections}
        />

    
      </div>

    </section>

  );

}