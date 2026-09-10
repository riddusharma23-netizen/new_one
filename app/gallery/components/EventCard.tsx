"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import ImageCarousel from "./ImageCarousel";
import GalleryLightbox from "./GalleryLightbox";

interface GalleryImage {
  id: number;
  image: string;
  title: string;
}

interface EventCardProps {
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  images: GalleryImage[];
}

export default function EventCard({
  title,
  subtitle,
  description,
  coverImage,
  images,
}: EventCardProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <>
      <section className="mb-28">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT */}

          <div className="relative group overflow-hidden rounded-[32px] shadow-2xl">

            <Image
              src={coverImage}
              alt={title}
              width={700}
              height={700}
              className="w-full h-[620px] object-cover duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute left-8 bottom-8">

              <span className="inline-flex rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#072F60]">
                {subtitle}
              </span>

              <h3 className="mt-5 text-4xl font-black text-white">
                {title}
              </h3>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <h3 className="text-4xl font-black' text-[#333]">
              {title}
            </h3>

            <div className="mt-5 h-1 w-28 rounded-full bg-gradient-to-r from-[#B60F17] to-[#F8F400]" />

            <p className="mt-8 text-lg leading-6 text-[#333]">
              {description}
            </p>

            {/* Gallery Grid */}

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-5">

              {images.slice(0, 6).map((item, index) => (

                <div
                  key={item.id}
                  onClick={() => openLightbox(index)}
                  className="cursor-pointer overflow-hidden rounded-2xl shadow-lg group"
                >

                  <Image
                    src={item.image}
                    alt={item.title}
                    width={250}
                    height={250}
                    className="aspect-square w-full object-cover duration-500 group-hover:scale-110"
                  />

                </div>

              ))}

            </div>

            <button
              onClick={() => openLightbox(0)}
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#B60F17] hover:bg-[#F8F400] hover:text-[#B60F17] px-8 py-4 text-white font-semibold shadow-xl hover:gap-5 duration-300"
            >
              View Complete Gallery
              <ArrowRight size={20} />
            </button>

          </div>

        </div>

        {/* Slider */}

        <ImageCarousel images={images} />

      </section>

      {/* Full Screen Gallery */}

      <GalleryLightbox
        images={images}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />

    </>
  );
}