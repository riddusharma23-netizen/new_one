"use client";

import { useState } from "react";
import Image from "next/image";
import { GraduationCap, ExternalLink } from "lucide-react";

// ------------------- Data -------------------
export const boardResults: Record<string, any> = {
  "10": {
    toppers: [
      {
        id: 1,
        name: "Aarav Sharma",
        photo: "/GovindSharan.jpg",
        percentage: 98.8,
        rank: "School Topper",
        resultLink: "https://results.cbse.nic.in/",
      },
      {
        id: 2,
        name: "Anjali Singh",
        photo: "/GovindSharan.jpg",
        percentage: 98.2,
        rank: "Second Rank",
        resultLink: "https://results.cbse.nic.in/",
      },
      {
        id: 3,
        name: "Riya Gupta",
        photo: "/GovindSharan.jpg",
        percentage: 97.9,
        rank: "Third Rank",
        resultLink: "https://results.cbse.nic.in/",
      },
    ],
    students: [
      { id: 1, name: "Aarav Sharma", rollNo: "1022101", resultLink: "https://results.cbse.nic.in/" },
      { id: 2, name: "Anjali Singh", rollNo: "1022102", resultLink: "https://results.cbse.nic.in/" },
      { id: 3, name: "Riya Gupta", rollNo: "1022103", resultLink: "https://results.cbse.nic.in/" },
    ],
  },
  "12": {
    toppers: [
      {
        id: 1,
        name: "Mohit Sharma",
        photo: "/GovindSharan.jpg",
        percentage: 97.8,
        rank: "School Topper",
        resultLink: "https://results.cbse.nic.in/",
      },
      {
        id: 2,
        name: "Priya Verma",
        photo: "/GovindSharan.jpg",
        percentage: 97.1,
        rank: "Second Rank",
        resultLink: "https://results.cbse.nic.in/",
      },
      {
        id: 3,
        name: "Rohit Singh",
        photo: "/GovindSharan.jpg",
        percentage: 96.7,
        rank: "Third Rank",
        resultLink: "https://results.cbse.nic.in/",
      },
    ],
    students: [
      { id: 1, name: "Mohit Sharma", rollNo: "1222101", resultLink: "https://results.cbse.nic.in/" },
      { id: 2, name: "Priya Verma", rollNo: "1222102", resultLink: "https://results.cbse.nic.in/" },
      { id: 3, name: "Rohit Singh", rollNo: "1222103", resultLink: "https://results.cbse.nic.in/" },
    ],
  },
};


// ------------------- Hero Component (new design) -------------------
function Hero() {
  return (
    <section className="relative overflow-hidden py-28">
      {/* Background Image */}
       <div className="absolute inset-0 bg-[#072F60]">
        <Image
          src="/school.jpg"
          alt="School background"
          fill
          className="object-contain object-center"
          sizes="100vw"
          priority
        />
        
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8F000] opacity-10 blur-[180px] pointer-events-none"></div>


        
        <div className="absolute inset-0 bg-[#DF6525]/70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-blue-900/40 to-transparent"></div>
      </div>

      {/* Decorative blurred gradient circle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8F000] opacity-10 blur-[180px] pointer-events-none"></div>

      <div className="relative max-w-[1450px] mx-auto px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <div className="text-white">
            <span className="inline-flex px-6 py-2 rounded-full bg-white/15 backdrop-blur">
             RESULT ANNOUNCEMENT
           
            </span>
            <h1 className="mt-8 text-5xl lg:text-6xl font-black' leading-tight">
               UP Board Result  <br />
              <span className="text-[#B70F17]">2026</span>
            </h1>
            <p className="mt-8 text-lg leading-9 text-white/90">
              Congratulations to all our brilliant students for their outstanding performance. 
              Smt. Champi Devi Inter College is proud of you!
            </p>
            <div className="mt-10 flex flex-wrap gap-5">
              <button className="bg-white text-[#072F60] px-8 py-4 rounded-full font-bold hover:scale-105 transition shadow-lg">
                View Toppers
              </button>
              <button className="bg-[#B70F17] text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition shadow-lg">
                Board Website
              </button>
            </div>
          </div>

          {/* Right Image with gradient border */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-[560px] p-[8px] rounded-[40px] bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8F000] shadow-[0_40px_120px_rgba(0,0,0,.3)]">
              <div className="relative w-full h-[280px] sm:h-[340px] md:h-[420px] rounded-[34px] overflow-hidden">
                <Image
                  src="/school.jpg"   // you can use a different image for the right side
                  alt="School"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 560px"
                />
                <div className="absolute inset-0 bg-[#FF4500]/20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------- Class Toggle -------------------
interface ClassToggleProps {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
}

function ClassToggle({ selectedClass, setSelectedClass }: ClassToggleProps) {
  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-full shadow-lg p-2 flex flex-wrap justify-center">
        <button
          onClick={() => setSelectedClass("10")}
          className={`px-8 py-3 rounded-full font-bold transition-all ${
            selectedClass === "10" ? "bg-[#B60F17] text-white" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Class 10
        </button>
        <button
          onClick={() => setSelectedClass("12")}
          className={`px-8 py-3 rounded-full font-bold transition-all ${
            selectedClass === "12" ? "bg-[#F6EF02] text-[#B60F17]" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Class 12
        </button>
      </div>
    </div>
  );
}

// ------------------- Topper Card -------------------
function TopperCard({ topper }: { topper: any }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
      <div className="relative h-64 w-full bg-gray-200">
        <Image
          src={topper.photo}
          alt={topper.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5 text-center">
        <h3 className="text-xl font-bold text-[#072F60]">{topper.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{topper.rank}</p>
        <p className="text-2xl font-extrabold text-[#D85D00] mt-2">{topper.percentage}%</p>
        <a
          href={topper.resultLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-[#072F60] hover:underline"
        >
          View Result <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

// ------------------- Main Page -------------------
export default function ResultPage() {
  const [selectedClass, setSelectedClass] = useState("10");
  const data = boardResults[selectedClass];

  return (
    <main className="min-h-screen bg-slate-50">
      <Hero />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <ClassToggle selectedClass={selectedClass} setSelectedClass={setSelectedClass} />

        {/* Toppers Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center text-[#072F60]">🏆 Our Toppers</h2>
          <p className="text-center text-gray-500 mt-2">
            Congratulations to all our achievers.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.toppers.map((topper: any) => (
              <TopperCard key={topper.id} topper={topper} />
            ))}
          </div>
        </div>

        {/* All Students List with Scroll */}
    {/* Result Check Section */}
<div className="mt-16">

  <div
    className="
      relative
      overflow-hidden
      rounded-[28px]
      border
      border-orange-100
      bg-gradient-to-br
      from-[#fffaf7]
      via-white
      to-[#fff7e8]
      px-6
      py-10
      text-center
      shadow-[0_15px_45px_rgba(7,47,96,0.08)]

      sm:px-10
      sm:py-12
    "
  >

    {/* Decorative Glow */}
    <div
      className="
        pointer-events-none
        absolute
        -left-16
        -top-16
        h-40
        w-40
        rounded-full
        bg-[#F8F000]/25
        blur-3xl
      "
    />

    <div
      className="
        pointer-events-none
        absolute
        -bottom-20
        -right-16
        h-48
        w-48
        rounded-full
        bg-[#B60F17]/10
        blur-3xl
      "
    />


    <div className="relative">

      {/* Small Label */}
      <span
        className="
          inline-flex
          items-center
          rounded-full
          bg-[#F8F000]
          px-5
          py-2
          text-sm
          font-bold
          text-[#B60F17]
        "
      >
        Class {selectedClass} Result
      </span>


      {/* Heading */}
      <h3
        className="
          mt-5
          text-2xl
          font-bold
          text-[#072F60]

          sm:text-3xl
        "
      >
        Check Your Examination Result
      </h3>


      {/* Description */}
      <p
        className="
          mx-auto
          mt-3
          max-w-2xl
          text-sm
          leading-7
          text-gray-600

          sm:text-base
        "
      >
        Students can check their official examination result through
        the government result portal. Click the button below to continue.
      </p>


      {/* Government Website Button */}
      <a
        href="YOUR_GOVERNMENT_RESULT_LINK"
        target="_blank"
        rel="noopener noreferrer"
        className="
          mt-7
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-full
          bg-[#B60F17]
          px-7
          py-3.5
          font-semibold
          text-white
          shadow-md
          transition-all
          duration-300

          hover:-translate-y-1
          hover:bg-[#072F60]
          hover:shadow-lg
        "
      >
        Check Result on Government Website

        <ExternalLink size={18} />
      </a>


      {/* Note */}
      <p className="mt-4 text-xs text-gray-500">
        You will be redirected to the official government result website.
      </p>

    </div>

  </div>

</div>
      </section>
    </main>
  );
}