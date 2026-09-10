import {
  MonitorSmartphone,
  Library,
  FlaskConical,
  Calculator,
  Trophy,
} from "lucide-react";

export const departments = [
  {
    id: 1,
    slug: "computer-lab",

    title: "Computer Lab",

    icon: MonitorSmartphone,

    color: "#DF6525",

    banner: "/department/computer/com-lab-2.jpg",

    description:
      "Modern computer laboratory equipped with the latest systems, high-speed internet and practical learning environment.",

    facilities: [
      "Computer Lab",
      "High Speed Internet",
      "Projector",
      "Digital Classroom",
      "Air Conditioned Lab",
      "Practical Sessions",
    ],

    gallery: [
      "/department/computer/com-lab1.jpg",
      "/department/computer/com-lab1.jpg",
      "/department/computer/com-lab1.jpg",
      "/department/computer/com-lab1.jpg",
      "/department/computer/com-lab-2.jpg",
      "/department/computer/com-lab-2.jpg",
    ],

    faculty: [
      {
        name: "Rahul Sharma",
        designation: "HOD",
        image: "/teachers/t1.jpg",
        email: "rahul@gmail.com",
        phone: "+91 9876543210",
      },
    ],

    stats: [
      {
        label: "Students",
        value: "250+",
      },
      {
        label: "Projects",
        value: "120+",
      },
      {
        label: "Faculty",
        value: "8",
      },
      {
        label: "Placements",
        value: "95%",
      },
    ],

    achievements: [
      "Latest Computer Systems",
      "Practical Based Learning",
      "Digital Smart Classes",
      "Coding Workshops",
      "Internet Enabled Lab",
      "Project Based Education",
    ],
  },

  {
    id: 2,
    slug: "library",

    title: "Library",

    icon: Library,

    color: "#2563EB",

    banner: "/department/library/banner.jpg",

    description: "",

    facilities: [],

    gallery: [],

    faculty: [],

    stats: [],

    achievements: [],
  },

  {
    id: 3,
    slug: "science-lab",

    title: "Science Lab",

    icon: FlaskConical,

    color: "#16A34A",

    banner: "/department/science/banner.jpg",

    description: "",

    facilities: [],

    gallery: [],

    faculty: [],

    stats: [],

    achievements: [],
  },

  {
    id: 4,
    slug: "math-lab",

    title: "Math Lab",

    icon: Calculator,

    color: "#7C3AED",

    banner: "/department/math/banner.jpg",

    description: "",

    facilities: [],

    gallery: [],

    faculty: [],

    stats: [],

    achievements: [],
  },

  {
    id: 5,
    slug: "games-sports",

    title: "Games & Sports",

    icon: Trophy,

    color: "#DC2626",

    banner: "/department/sports/banner.jpg",

    description: "",

    facilities: [],

    gallery: [],

    faculty: [],

    stats: [],

    achievements: [],
  },
];