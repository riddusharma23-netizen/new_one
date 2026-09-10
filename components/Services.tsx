"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";
 
export const services = [
  {
    id: 1,
    title: "Champi Devi Inter College",
    image: "/school.jpg",
    points: [
      
      "Official UP Board recognized school for grades 6 to 12.",
    "24/7 CCTV security across the campus.",
    "High-tech computer laboratory with 30 internet-enabled computers.",
    "Merit scholarship and cash rewards for students of Classes 9–12.",
    "50% tuition scholarship for higher education to eligible pass-out students."

    ],
  },
  {
    id: 2,
    title: "Prabha Clinic",
    image: "/clinic4.jpg",
    points: [
    "Treating 40+ patients daily.",
    "Managed by 1 Doctor and 1 Pharmacist.",
    "Free or highly subsidized medical consultations.",
    "Free or highly subsidized medicines.",
    "Regular free eye care camps for the community."
    ],
  },


  {
    id: 3,
    title: "Hare Krishna Kreeda Sthal",
    image: "/p1.jpg",
    points: [
      " A grand playground utilized daily by 300 to 400 students and village youth.",
      "Some internal roads, the village well, drainage system have been renovated.",
      "Building and playground was inaugurated on 3rd Jan 2021.",
      "The playground is a part of school, but it allows villagers to use it after school hours.",

     "The response has been magnanimous. Approximately 300 to 400 students, and villagers use the playground every day.",

    ],
  },


    {
    id: 4,
    title: " Improving primary school education",
    image: "/primary.jpg",
    points: [
      "We have adopted Hare Krishna Savilaya School, Jamon. It is now under development. Click on 'Primary School' tab for more details.",
    

    ],
  },


      {
    id: 5,
    title: " Opening a new Kindergarten school",
    image: "/kindergarten.jpg",
    points: [
      "We have adopted a non-working Aaganwari School. In its place, we have started a free Kindergarten School named Hare Krishna Shishu Mandir. The villagers' response was very encouraging and full of enthusiasm. At present, the school has 90 students. Click on 'Kindergarten' tab for more details.",
    

    ],
  },
];

export default function PresentServices() {
  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 via-blue-50 to-yellow-50">
      <div className="max-w-[1400px] mx-auto px-5">

        <div className="text-center mb-14">
          <span className="bg-[#F8F400] text-[#B60F17] px-5 py-2 rounded-full font-semibold text-sm">
            Our Facilities
          </span>

          <h2 className="mt-5 text-4xl lg:text-5xl font-black' leading-tight">
            Our Core Services <span className="text-[#B60F17]">& Initiatives</span>
          </h2>
        </div>

      <div className="space-y-8">
  {services.map((service) => (
    <div
      key={service.id}
      className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100"
    >
      <div className="h-1.5 bg-gradient-to-r from-[#B60F17] to-[#F8F400]" />

      <div className="grid md:grid-cols-3 gap-6 p-6 items-center">
        {/* Image */}
        <div className="relative h-75 rounded-2xl overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover" 
          />
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-[#B60F17] mb-4">
            {service.title}
          </h3>

          <ul className="space-y-3">
            {service.points.map((point, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#B60F17] mt-1 flex-shrink-0" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </section>
  );
}