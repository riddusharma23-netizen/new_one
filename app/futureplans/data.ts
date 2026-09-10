import { LucideIcon, Road, MonitorSmartphone, Users, Trees } from "lucide-react";

import roadBefore from "@/public/futureplans/BAD-ROAD.jpg";
import roadAfter from "@/public/futureplans/FixRoad.jpg";
import smartClass from "@/public/futureplans/BAD-ROAD.jpg";
import careerGuidance from "@/public/futureplans/FixRoad.jpg";
import greenCampus from "@/public/futureplans/BAD-ROAD.jpg";

import { StaticImageData } from "next/image";

export interface FuturePlan {
  id: number;
  title: string;
  icon: LucideIcon;
  color: string;

  description: string;

  image?: StaticImageData;

  beforeImage?: StaticImageData;
  afterImage?: StaticImageData;

  stats?: {
    label: string;
    value: string;
  }[];

  achievements?: string[];

  features?: string[];
}

export const futurePlans: FuturePlan[] = [
  {
    id: 1,
    title: "Road Development",
    icon: Road,
    color: "#DF6525",

    description:
      "Repairing and paving the damaged connecting roads leading to the school remains our highest priority. This initiative will provide safe, smooth, and reliable transportation for students, parents, teachers, and nearby villages.",

    beforeImage: roadBefore,
    afterImage: roadAfter,

    stats: [
      {
        label: "Road Length",
        value: "5.2 KM",
      },
      {
        label: "Villages Connected",
        value: "12+",
      },
      {
        label: "Students Benefited",
        value: "200+",
      },
      {
        label: "Completion Target",
        value: "2026",
      },
    ],

    achievements: [
      "Safe transportation for students.",
      "Better village connectivity.",
      "Reduced travel time.",
      "Improved emergency access.",
    ],
  },

  {
    id: 2,
    title: "Smart Classes",
    icon: MonitorSmartphone,
    color: "#0F766E",

    image: smartClass,

    description:
      "Modern digital classrooms equipped with smart boards, projectors, internet connectivity, and interactive learning systems.",

    features: [
      "Interactive Smart Boards",
      "Projector Based Teaching",
      "Digital Content Library",
      "High-Speed Internet",
      "Audio Visual Learning",
      "Teacher Training Programs",
    ],
  },

  {
    id: 3,
    title: "Career Guidance",
    icon: Users,
    color: "#2563EB",

    image: careerGuidance,

    description:
      "Helping students choose the right career through counseling sessions, competitive exam guidance, higher education awareness, and skill development workshops.",

    features: [
      "Career Counseling",
      "Competitive Exam Guidance",
      "Skill Development",
      "Guest Lectures",
      "Higher Education Support",
      "Scholarship Guidance",
    ],
  },

  {
    id: 4,
    title: "Green Campus",
    icon: Trees,
    color: "#16A34A",

    image: greenCampus,

    description:
      "Creating an environmentally friendly campus through tree plantation, rainwater harvesting, waste management, and clean energy initiatives.",

    features: [
      "Tree Plantation",
      "Plastic Free Campus",
      "Rain Water Harvesting",
      "Solar Energy",
      "Waste Management",
      "Eco Awareness Programs",
    ],
  },
];