import { LucideIcon } from "lucide-react";

export interface GalleryHeading {
  badge: string;
  titleBlack: string;
  titleGradient: string;
  description: string;
}

export interface GalleryImage {
  id: number;
  image: string;
  title: string;
}

export interface GallerySection {
  id: number;

  title: string;

  subtitle: string;

  description: string;

  coverImage: string;

  images: GalleryImage[];
}

export interface GalleryData {
  heading: GalleryHeading;

  sections: GallerySection[];
}