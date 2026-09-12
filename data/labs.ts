import {
  Atom,
  FlaskConical,
  Microscope,
  Calculator,
  Home,
} from "lucide-react";

export const labs = [
  {
    id: 1,

    slug: "physics-lab",

    title: "Physics Lab",

    shortTitle: "Physics Laboratory",

    icon: Atom,

    image: "/labs/physics/phy (2).png",
    
    gallery: [
      "/labs/physics/phy (2).png",
      "/labs/physics/physics-1.jpg",
      "/labs/physics/physics-2.jpg",
      "/labs/physics/physics-3.jpg",
      "/labs/physics/physics-4.jpg",
    ],

    description:
      "The Physics Laboratory provides students with practical knowledge of mechanics, electricity, optics, and magnetism through interactive experiments. High-precision measurement instruments like Vernier calipers are provided for scientific accuracy.",

   features: [
  {
    title: "Modern Physics Equipment",
    image: "/labs/physics/phy(3).png",
  },
  {
    title: "Electricity Experiments",
    image:"/labs/phy1.png",
  },
  {
    title: "Optics Practical",
     image:"/labs/physics/phy(4).png",
  },


  {
    title: "Measurement Instruments",
   image:"/labs/phy3.png",
  },
  // {
  //   title: "Hands-on Activities",
  //   image: "/labs/physics/features/hands-on-activities.jpg",
  // },
  // {
  //   title: "Scientific Observation",
  //   image: "/labs/physics/features/scientific-observation.jpg",
  // },
],

    highlights: [
      "Practical understanding of Physics",
      "Learning through experiments",
      "Safe laboratory environment",
      "Analytical thinking development",
    ],

    sections: [
      {
        title: "Practical Learning",

        content:
          "Students understand scientific principles through practical experiments and demonstrations.",

        image: "/labs/physics/phy(3).png",
      },

      {
        title: "Advanced Equipment",

        content:
          "Modern laboratory instruments help students perform experiments accurately.",

        image: "/labs/physics/phy(4).png",
      },
    ],
  },

  {
    id: 2,

    slug: "chemistry-lab",

    title: "Chemistry Lab",

    shortTitle: "Chemistry Laboratory",

    icon: FlaskConical,

    image: "/labs/chemistry/chem1.png",

    gallery: [
        "/labs/chemistry/chem1.png",
      "/labs/chemistry/chemistry-1.jpg",
      "/labs/chemistry/chemistry-2.jpg",
      "/labs/chemistry/chemistry-3.jpg",
      "/labs/chemistry/chemistry-4.jpg",
    ],

    description:
      "Our Chemistry Laboratory is fully equipped and legally compliant with safety standards, allowing students to study chemical reactions and compounds practically using precise analytical digital scales and modern heating stations",

    // features: [
    //   "Chemical Reactions",
    //   "Laboratory Safety",
    //   "Glassware Practice",
    //   "Scientific Observation",
    //   "Acid & Base Experiments",
    //   "Modern Chemicals",
    // ],

features: [
  {
    title: "Chemical Reactions",
    image: "/labs/chemistry/chem1.png",
  },
  {
    title: "Laboratory Safety",
  image: "/labs/chemistry/chem2.png",
  },

   {
   title:"Glassware Practice",
    image: "/labs/chemistry/chem3.png",
  },

    {
   title:"Scientific Observation",
    image: "/labs/chemistry/chem1.png",
  },

  //   {
  //  title:"Acid & Base Experiments",
  //   image: "/labs/chemistry/features/laboratory-safety.jpg",
  // },

  //  {
  //  title:"Modern Chemicals",
  //   image: "/labs/chemistry/features/laboratory-safety.jpg",
  // },
],


    highlights: [
      "Hands-on Chemistry",
      "Safe Experiments",
      "Observation Skills",
      "Concept Clarity",
    ],

    sections: [
      {
        title: "Chemical Experiments",

        content:
          "Students perform a variety of chemical experiments to understand concepts through practical learning. Under the guidance of experienced teachers, students learn about reactions, solutions, acids, bases, salts, and other important chemistry topics using proper laboratory equipment and safe procedures.",

         image: "/labs/chemistry/chem2.png",
      },

      {
        title: "Laboratory Safety",

        content:
          "At Smt. Champi Devi Inter College, student safety is our top priority. Our laboratories are maintained with proper safety measures, organized equipment, and clear instructions for every practical session. Students perform experiments under the guidance of teachers and are encouraged to follow laboratory rules, handle equipment carefully, and develop safe scientific practices.",

        image: "/labs/chemistry/chem3.png",
      },
    ],
  },

  {
    id: 3,

    slug: "biology-lab",

    title: "Biology Lab",

    shortTitle: "Biology Laboratory",

    icon: Microscope,

    image: "/labs/biology/biology-lab.jpg",

    gallery: [
      "/labs/biology/biology-lab.jpg",
      "/labs/biology/biology-1.jpg",
      "/labs/biology/biology-2.jpg",
      "/labs/biology/biology-3.jpg",
      "/labs/biology/biology-4.jpg",
    ],

    description:
      "The Biology Laboratory offers students an opportunity to examine microorganisms, human anatomy, and plant physiology up close using high-power compound microscopes and 3D anatomical charts.",

    // features: [
    //   "Microscope Learning",
    //   "Plant Study",
    //   "Animal Study",
    //   "Biological Models",
    //   "Practical Activities",
    //   "Observation Skills",
    // ],

features: [
  {
    title: "Microscope Learning",
    image: "/labs/biology/features/microscope-learning.jpg",
  },
  {
    title: "Plant Study",
    image: "/labs/biology/features/plant-study.jpg",
  },
  {
    title: "Animal Study",
    image: "/labs/biology/features/animal-study.jpg",
  },
  {
    title: "Biological Models",
    image: "/labs/biology/features/biological-models.jpg",
  },
  {
    title: "Practical Activities",
    image: "/labs/biology/features/practical-activities.jpg",
  },
  {
    title: "Observation Skills",
    image: "/labs/biology/features/observation-skills.jpg",
  },
],

    highlights: [
      "Living Organism Study",
      "Microscope Practice",
      "Specimen Observation",
      "Hands-on Learning",
    ],

    sections: [
      {
        title: "Microscopic Study",

        content:
          "Students observe cells, tissues and microorganisms through microscopes.",

        image: "/labs/biology/biology-1.jpg",
      },

      {
        title: "Practical Activities",

        content:
          "Interactive activities make Biology interesting and easy to understand.",

        image: "/labs/biology/biology-2.jpg",
      },
    ],
  },

  {
    id: 5,

    slug: "Home-science-lab",

    title: "Home Science Lab",

    shortTitle: "Home Science Laboratory",

    icon: Home,

    image: "/labs/home-science/home-science-lab.jpg",

    gallery: [
      "/labs/home-science/home-science-lab.jpg",
      "/labs/home-science/home-1.jpg",
      "/labs/home-science/home-2.jpg",
      "/labs/home-science/home-3.jpg",
      "/labs/home-science/home-4.jpg",
    ],

    description:
      "Equipped for training students practically in nutritional science, textile arts, and home management.",

    // features: [
    //   "Cooking Practice",
    //   "Nutrition Education",
    //   "Textile Skills",
    //   "Health & Hygiene",
    //   "Life Skills",
    //   "Creative Activities",
    // ],


    features: [
  {
    title: "Cooking Practice",
    image: "/labs/home-science/features/cooking-practice.jpg",
  },
  {
    title: "Nutrition Education",
    image: "/labs/home-science/features/nutrition-education.jpg",
  },
  {
    title: "Textile Skills",
    image: "/labs/home-science/features/textile-skills.jpg",
  },
  {
    title: "Health & Hygiene",
    image: "/labs/home-science/features/health-hygiene.jpg",
  },
  {
    title: "Life Skills",
    image: "/labs/home-science/features/life-skills.jpg",
  },
  {
    title: "Creative Activities",
    image: "/labs/home-science/features/creative-activities.jpg",
  },
],

    highlights: [
      "Everyday Practical Skills",
      "Healthy Lifestyle",
      "Creative Learning",
      "Confidence Building",
    ],

    sections: [
      {
        title: "Life Skills",

        content:
          "Students develop practical life skills useful in daily living.",

        image: "/labs/home-science/home-1.jpg",
      },

      {
        title: "Healthy Living",

        content:
          "Students understand nutrition, hygiene and balanced diets through activities.",

        image: "/labs/home-science/home-2.jpg",
      },
    ],
  },
];