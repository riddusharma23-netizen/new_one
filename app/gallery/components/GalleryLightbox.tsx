"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

interface GalleryImage {
  id: number;
  image: string;
  title: string;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function GalleryLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: GalleryLightboxProps) {

  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {

      if (!isOpen) return;

      if (e.key === "Escape") onClose();

      if (e.key === "ArrowRight") onNext();

      if (e.key === "ArrowLeft") onPrev();

    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);

  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  const image = images[currentIndex];

  return (

    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center">

      {/* Close */}

      <button
        onClick={onClose}
        className="absolute top-8 right-8 w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 duration-300"
      >

        <X />

      </button>

      {/* Previous */}

      <button
        onClick={onPrev}
        className="absolute left-8 w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 duration-300"
      >

        <ChevronLeft />

      </button>

      {/* Image */}

      <div className="relative w-[92%] max-w-6xl h-[80vh]">

        <Image
          src={image.image}
          alt={image.title}
          fill
          className="object-contain"
        />

      </div>

      {/* Next */}

      <button
        onClick={onNext}
        className="absolute right-8 w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 duration-300"
      >

        <ChevronRight />

      </button>

      {/* Counter */}

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-white px-6 py-3 font-semibold">

        {currentIndex + 1} / {images.length}

      </div>

    </div>

  );

}
