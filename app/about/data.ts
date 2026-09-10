import {
  Sun,
  Wifi,
  GraduationCap,
  HeartHandshake,
} from "lucide-react";

export const infrastructureData = {
  heading: {
    subtitle: "OUR UNIQUE INFRASTRUCTURE",
     titleBlack: "Modern Facilities &",
  titleGradient: "Innovation",
    description:
      "Champi Devi Inter College provides students with a modern learning environment through advanced infrastructure, technology, and value-based education.",
  },

  features: [
    {
      id: 1,
      icon: Sun,
      title: "24×7 Solar Power System",
      image: "/images/about/solar.jpg",
      description:"To counter the extreme summer heat (April to September) and unreliable grid power, the entire school is powered by Solar Panels. This ensures uninterrupted electricity for fans, lights, and computer labs. "

    },
    
    {   
      id: 2,
      icon: Wifi,
      title: "70 Feet Internet Tower",
      image: "/images/about/internet.jpg",
      description:
        "Believing that internet literacy bridges global gaps, the college erected a specialized 70-feet high antenna to capture strong signals, educating students in English and advanced internet skills. ",
 

    },
    // {
    //   id: 3,
    //   icon: GraduationCap,
    //   title: "Professional Teacher Training",
    //   image: "/images/about/training.jpg",
    //   description:
    //     "Along with excellent local permanent teachers, a team of highly educated external mentors visits once a week to train and guide our faculty in modern teaching methodologies. ",


    // },
    {
      id: 4,
      icon: HeartHandshake,
      title: "Character Building with ISKCON Vrindavan: ",
      image: "/images/about/iskcon.jpg",
      description:
        "Education without values is incomplete. Representatives from ISKCON Vrindavan visit the campus weekly to conduct moral science and character-building  sessions for both students and teachers. ",


    },
  ],
};