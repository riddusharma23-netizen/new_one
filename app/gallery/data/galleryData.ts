import { GalleryData } from "../types";

export const galleryData: GalleryData = {
  heading: {
    badge: "CAMPUS GALLERY",

    titleBlack: "Cultural Events",

    titleGradient: "& Sports",

    description:
      "Experience the vibrant moments of Champi Devi Inter College through our annual cultural celebrations, sports competitions, and student activities that inspire confidence, teamwork, and creativity.",
  },

  sections: [
    {
      id: 1,

      title: "Annual Cultural Function",

      subtitle: "Celebrating Art & Culture",

      description:
        "Every year, Champi Devi Inter College organizes a grand Annual Cultural Function where students proudly showcase their talents through folk dances, patriotic performances, dramas, music, and stage presentations. The event helps students build confidence, creativity, leadership, and communication skills while preserving Indian culture and values.",

      coverImage: "/images/gallery/PG9.jpg",

      images: [
        {
          id: 1, 
          image: "/images/gallery/school.jpg",
          title: "Folk Dance Performance",
        },
        {
          id: 2,
          image: "/images/gallery/T2.jpg",
          title: "Patriotic Song",
        },
        {
          id: 3,
          image: "/images/gallery/school.jpg",
          title: "Drama Performance",
        },
        {
          id: 4,
          image: "/images/gallery/PG9.jpg",
          title: "Prize Distribution",
        },
        {
          id: 5,
          image: "/images/gallery/cultural/5.jpg",
          title: "Group Dance",
        },
        {
          id: 6,
          image: "/images/gallery/cultural/6.jpg",
          title: "Stage Performance",
        },
      ],
    },

    {
      id: 2,

      title: "Annual Sports Meet",

      subtitle: "Sports & Athletics",

      description:
        "The Annual Sports Meet encourages every student to participate in athletics and outdoor games. Students compete in cricket, volleyball, badminton, kabaddi, kho-kho, running races, and other competitions, promoting teamwork, discipline, leadership, and physical fitness.",

      coverImage: "/images/gallery/sports/cover.jpg",

      images: [
        {
          id: 1,
          image: "/images/gallery/PG9.jpg",
          title: "100 Meter Race",
        },
        {
          id: 2,
          image: "/images/gallery/PG9.jpg",
          title: "Cricket Match",
        },
        {
          id: 3,
          image: "/images/gallery/T2.jpg",
          title: "Volleyball Tournament",
        },
        {
          id: 4,
          image: "/images/gallery/sports/4.jpg",
          title: "Kabaddi Competition",
        },
        {
          id: 5,
           image: "/images/gallery/T2.jpg",
          title: "Kho-Kho Match",
        },
        {
          id: 6,
          image: "/images/gallery/PG9.jpg",
          title: "Prize Ceremony",
        },
      ],
    },
  ],
};