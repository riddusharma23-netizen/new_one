"use client";

import EventCard from "./EventCard";

import { GallerySection } from "../types";

interface EventGalleryProps {
  sections: GallerySection[];
}

export default function EventGallery({
  sections,
}: EventGalleryProps) {
  return (
    <div className="space-y-28">

      {sections.map((section) => (

        <EventCard
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          description={section.description}
          coverImage={section.coverImage}
          images={section.images}
        />

      ))}

    </div>
  );
}