"use client";
import Image from "next/image";
import {
    Road,
    ShieldCheck,
    CheckCircle,
    Clock,
    Users,
    Award,
} from "lucide-react";

import brokenRoadImage from '@/public/futureplans/BAD-ROAD.jpg';
import repairedRoadImage from '@/public/futureplans/FixRoad.jpg';

export default function FuturePlans() {
    const stats = [
        { icon: Road, label: "Road Repaired", value: "5.2 km" },
        { icon: Users, label: "Villagers Benefited", value: "2,400+" },
        { icon: Clock, label: "Project Duration", value: "45 Days" },
        { icon: Award, label: "Quality Rating", value: "A+" },
    ];

    const achievements = [
        "Safe commute for 200+ students daily",
        "Reduced travel time by 40%",
        "Better access to emergency services",
        "Increased village connectivity",
    ];

    return (
        <section className="py-24 overflow-hidden">
            <div className="max-w-[1450px] mx-auto px-6">

                {/* ===== HEADER ===== */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="inline-block px-5 py-2 rounded-full bg-[#F8F400] text-[#B60F17] font-semibold text-sm tracking-wide">
                          CHAMPI DEVI INTER COLLAGE
                    </span>
                    <h2 className="mt-5   text-4xl lg:text-6xl font-black' leading-tight   ">
                        Our Future<span className="text-[#B60F17]"> Plan</span>
                    </h2>
                    <p className="mt-5 text-gray-900 leading-6 max-w-3xl mx-auto">
&quot;Repairing and paving the damaged connecting roads leading to the school
remains our top priority. This extensive regional initiative is designed keeping in mind
the convenience, smooth transit, and safety of the residents of all neighboring
link villages alongside Jamon. Our ultimate goal is to ensure a safe, reliable, and
seamless commute for the entire rural network, significantly accelerating the socioeconomic growth of all connected rural areas.&quot;
                    </p>
                </div>

                {/* ===== BEFORE & AFTER — SIDE BY SIDE ===== */}
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Before */}

    <div
  className="
    relative
    rounded-3xl
    overflow-hidden
    bg-white
    shadow-xl
    transition-all
    duration-300
    hover:-translate-y-2
    hover:shadow-2xl
    border
    border-gray-100
  "
>
  {/* Premium Gradient Top Border */}
  <div className="relative z-30 h-[6px] w-full bg-gradient-to-r from-[#DF6525] via-[#FF9A3C] to-[#F8F400]" />

  {/* Image */}
  <div className="relative aspect-[4/3] w-full bg-gray-200 overflow-hidden">
    <Image
      src={brokenRoadImage}
      alt="Broken road before repair"
      fill
      className="object-cover transition-transform duration-500 hover:scale-105"
    />
  </div>

  {/* Badge */}
  <div className="absolute top-5 left-5 z-20 bg-red-600 px-4 py-2 rounded-xl text-white font-bold text-sm shadow-lg">
    ⚠️ Before Repair
  </div>

  {/* Content */}
  <div className="p-5">
    <p className="text-gray-600 leading-7">
      Cracked, uneven surface making commute difficult for students and
      villagers.
    </p>
  </div>
</div>

                    {/* After */}

<div
  className="
    relative
    rounded-3xl
    overflow-hidden
    bg-white
    shadow-xl
    transition-all
    duration-300
   hover:-translate-y-2
    hover:shadow-2xl
    border
    border-gray-100
  "
>
  {/* Premium Gradient Top Border */}
  <div className="relative z-30 h-[6px] w-full bg-gradient-to-r from-[#DF6525] via-[#FF9A3C] to-[#F8F400]" />

  {/* Image */}
  <div className="relative aspect-[4/3] w-full bg-gray-200">
    <Image
      src={repairedRoadImage}
      alt="Repaired road after construction"
      fill
      className="object-cover"
    />
  </div>

  {/* Badge */}
  <div className="absolute top-5 left-5 z-20 bg-green-600 px-4 py-2 rounded-xl text-white font-bold text-sm shadow-lg">
    ✅ After Repair
  </div>

  {/* Content */}
  <div className="p-5">
    <p className="text-gray-600 leading-7">
      Smooth, durable asphalt with proper drainage — a safe passage for
      everyone.
    </p>
  </div>
</div>


                </div>

                {/* ===== STATS ROW ===== */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-lg border border-white/50 hover:scale-105 transition-transform duration-300"
                        >
                            <stat.icon className="w-7 h-7 mx-auto text-[#DF6525]" strokeWidth={1.8} />
                            <div className="mt-2 text-2xl font-black text-[#B60F17]">{stat.value}</div>
                            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* ===== ACHIEVEMENTS + VILLAGE IMPACT ===== */}
                <div className="mt-16 grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {/* Left — Achievements */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                        <h3 className="text-xl font-black text-[#B60F17] flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-[#DF6525]" />
                            Village Impact
                        </h3>
                        <ul className="mt-5 space-y-3">
                            {achievements.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-[#DF6525] flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right — Quote / Testimonial */}
                    <div className="bg-gradient-to-br from-[#B60F17] to-[#DF6525] rounded-3xl p-8 shadow-xl text-white flex flex-col justify-center">
                        <div className="text-5xl leading-none mb-2">“</div>
                        <p className="text-lg font-medium leading-relaxed opacity-95">
                            This road is not just concrete — it&apos;s a lifeline for our
                            children, our farmers, and every family in this village.
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                                SD
                            </div>
                            <div>
                                <div className="font-bold text-sm">Shri Dinesh Yadav</div>
                                <div className="text-xs opacity-80">Village Head, Champi Devi</div>
                            </div>
                        </div>
                    </div>
                </div>

              

              

            </div>
        </section>
    );
}