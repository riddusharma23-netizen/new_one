import {
  CalendarDays,
  ClipboardList,
  Clock3,
  Gift,
  GraduationCap,
  School,
  Users,
  Bike,
  Computer,
} from "lucide-react";

export const admissionGuidelinesData = {
  heading: {
    badge: "ADMISSION GUIDELINES • 2026–2027",

    titleBlack: "Admission",

    titleGradient: "Process & Rules",

    description:
      "Important admission rules, fee details, attendance requirements, student benefits, merit schemes and special instructions for the academic session 2026–2027.",
  },

  image: "/images/admission/PG8.jpg",

  importantDates: [
    {
      label: "Admissions Open",
      value: "01 April 2026",
    },
    {
      label: "Classes Begin",
      value: "01 April 2026",
    },
    {
      label: "Result Declaration",
      value: "30 April 2026",
    },
    {
      label: "Uniform Admission Fee",
      value: "From 01 July 2026",
    },
  ],

  button: {
    text: "Apply for Admission",
    link: "/contact",
  },

  sections: [
    {
      id: 1,
      icon: ClipboardList,
      title: "Application & Admission Process",
      description:
        "General rules applicable to students seeking admission for the academic session 2026–2027.",
      points: [
        "All students seeking admission must fill and submit the prescribed admission application form.",
        "The application form fee is ₹100.",
        "Admissions for the academic session 2026–2027 will begin from 01 April 2026.",
        "A minimum of 33% marks in the previous class is required for admission.",
        "Classes for the academic session 2026–2027 will begin from 01 April 2026.",
        "The result for the academic session 2025–2026 will be distributed to students on 30 April 2026.",
      ],
    },

    {
      id: 2,
      icon: Clock3,
      title: "Attendance Rules",
      description:
        "Regular attendance is compulsory for all students studying in the school.",
      points: [
        "Attendance of all enrolled students will be compulsory from 01 April 2026.",
        "If a student remains continuously absent up to 06 April without proper information, the student's name may be removed from the school register.",
        "A student whose name has been removed will be required to take re-admission.",
      ],
    },

    {
      id: 3,
      icon: CalendarDays,
      title: "Re-Admission & Admission Fee",
      description:
        "Fee concessions and re-admission charges depend on the date of admission.",
      points: [
        "Re-admission fee up to 30 April 2026 will be ₹100.",
        "Old students taking admission up to 20 April 2026 will receive 100% exemption from the Admission Fee.",
        "After 20 April and up to 30 April 2026, the re-admission fee will be ₹100.",
        "From 01 July 2026, a uniform admission fee will be applicable to all students.",
      ],
    },

    {
      id: 4,
      icon: Bike,
      title: "Meritorious Student Bicycle Scheme",
      description:
        "Special bicycle benefits are available for meritorious Class 10 students taking admission in Class 11.",
      points: [
        "Students scoring a minimum of 80% marks in Class 10 and taking admission in Class 11 by 04 May 2026 will receive a bicycle free of cost.",
        "Students scoring a minimum of 75% marks in Class 10 and taking admission in Class 11 by 04 May 2026 can receive a bicycle for ₹2,000.",
        "Free or highly subsidised bicycles will be distributed only on 04 May 2026.",
      ],
    },

    {
      id: 5,
      icon: Gift,
      title: "Class 9 Merit Benefit",
      description:
        "A special incentive is available for meritorious students studying in Class 9.",
      points: [
        "After admission in Class 9, 10 meritorious students will be provided bicycles at ₹2,000 each.",
      ],
    },

    {
      id: 6,
      icon: Bike,
      title: "General Bicycle Charges",
      description:
        "Bicycle pricing for students who are not covered under the special merit concession.",
      points: [
        "Up to 10 May 2026, the bicycle price will be ₹3,000.",
        "After 10 May and up to 20 May 2026, the bicycle price will be ₹3,500.",
        "Special concessions for meritorious students will continue to apply according to the applicable scheme.",
      ],
    },

    {
      id: 7,
      icon: Users,
      title: "Sibling Fee Concession",
      description:
        "Special fee concession is available for families with more than two children studying in the school.",
      points: [
        "If more than two children from the same family are studying in the school, full tuition fee of all children after the first two will be waived.",
      ],
    },

    {
      id: 8,
      icon: School,
      title: "Class 6 Special Benefit",
      description:
        "Students taking timely admission in Class 6 are eligible for a special benefit.",
      points: [
        "Students taking admission in Class 6 by 30 April 2026 will receive one school uniform completely free of cost.",
      ],
    },

    {
      id: 9,
      icon: Computer,
      title: "Class 11 Computer Subject Benefit",
      description:
        "Special facility for students opting for Computer as a subject in Class 11.",
      points: [
        "The first 10 students taking admission in Class 11 with Computer as a subject will be provided a computer at half price.",
        "Classes for any subject will start only when a minimum of 10 students have taken admission in that subject.",
      ],
    },

    {
      id: 10,
      icon: GraduationCap,
      title: "Special Instructions for Class 11 Admission",
      description:
        "Important rules regarding admission fee and bicycle benefits for Class 11 students.",
      points: [
        "Students scoring at least 80% marks in Class 10 and taking admission in Class 11 by 04 May 2026 will receive a bicycle free of cost.",
        "Students scoring at least 75% marks in Class 10 and taking admission in Class 11 by 04 May 2026 can receive a bicycle for ₹2,000.",
        "Free or highly subsidised bicycles will be distributed only on 04 May 2026.",
        "Old students taking admission in Class 11 by 30 April 2026 will pay no admission fee.",
        "Old students taking admission in Class 11 by 10 May 2026 will pay an admission fee of ₹100.",
        "Old students taking admission in Class 11 by 20 May 2026 will pay an admission fee of ₹200.",
        "From 01 July 2026, a uniform admission fee will be applicable to all students seeking admission in Class 11.",
      ],
    },
  ],

  note: {
    title: "Documents Required at the Time of Admission",
    description:
      "Students must bring a photocopy of the Aadhaar Card, Transfer Certificate (TC), student photograph and previous class marksheet at the time of admission.\n\nAll admissions, concessions, bicycle schemes and other benefits are subject to eligibility, applicable dates, availability and final approval by the school administration.",
  },
};