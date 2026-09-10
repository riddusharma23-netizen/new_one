import {
  Sun,
  Wifi,
  GraduationCap,
  HeartHandshake,
} from "lucide-react";

export const infrastructureData = {
  heading: {
    subtitle: "OUR UNIQUE INFRASTRUCTURE",
    title: "Modern Facilities & Innovation",
    description:
      "Champi Devi Inter College provides students with a modern learning environment through advanced infrastructure, technology, and value-based education.",
  },

  features: [
    {
      id: 1,
      icon: Sun,
      title: "24×7 Solar Power System",
      image: "/images/about/solar.jpg",
      description:
        " To counter the extreme summer heat (April to September) and unreliable grid power, the entire school is powered by Solar Panels. This ensures uninterrupted electricity for fans, lights, and computer labs."  

 
    },
    {
      id: 2,
      icon: Wifi,
      title: "70 Feet Internet Tower",
      image: "/images/about/internet.jpg",
      description:
        "A dedicated internet tower provides high-speed connectivity for smart learning and digital education.",
    },
    // {
    //   id: 3,
    //   icon: GraduationCap,
    //   title: "Professional Teacher Training",
    //   image: "/images/about/training.jpg",
    //   description:
    //     "Experienced education experts regularly train our teachers using modern teaching methodologies.",
    // },
    {
      id: 4,
      icon: HeartHandshake,
      title: "Character Building Program",
      image: "/images/about/iskcon.jpg",
      description:
        "Weekly ISKCON sessions help students develop discipline, leadership, and strong moral values.",
    },
  ],
};