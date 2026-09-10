'use client';

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { futurePlans } from "../data";

export default function RoadDevelopment() {
  const road = futurePlans[0];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 rounded-full bg-[#F8F000] px-5 py-2">
            <road.icon
              size={18}
              className="text-[#B70F17]"
            />

            <span className="font-semibold text-[#B70F17]">
              {road.title}
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-black' leading-tight">
            Road Infrastructure Development
          </h2>

          <p className="mt-5 text-slate-900 leading-8">
            {road.description}
          </p>

        </div>

        {/* Before & After */}

        <div className="mt-16 grid gap-8 lg:grid-cols-2">

          <div className="overflow-hidden rounded-3xl bg-white shadow-xl border">

            <div className="relative h-[350px]">

              <Image
                src={road.beforeImage!}
                alt="Before Road"
                fill
                className="object-cover"
              />

              <span className="absolute left-5 top-5 rounded-xl bg-[#B70F17] px-4 py-2 text-white font-semibold">
                Before
              </span>

            </div>

            <div className="p-6">

              <h3 className="text-xl font-bold">
                Existing Road
              </h3>

              <p className="mt-3 text-slate-600">
                Damaged road causing difficulty for students, parents and nearby villagers.
              </p>

            </div>

          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-xl border">

            <div className="relative h-[350px]">

              <Image
                src={road.afterImage!}
                alt="After Road"
                fill
                className="object-cover"
              />

              <span className="absolute left-5 top-5 rounded-xl bg-green-600 px-4 py-2 text-white font-semibold">
                Future Vision
              </span>

            </div>

            <div className="p-6">

              <h3 className="text-xl font-bold">
                Proposed Development
              </h3>

              <p className="mt-3 text-slate-600">
                Wide and durable roads ensuring safe transportation for students and villagers.
              </p>

            </div>

          </div>

        </div>

        {/* Stats */}

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {road.stats?.map((item) => (

            <div
              key={item.label}
              className="rounded-3xl border bg-white p-8 shadow-lg"
            >

              <h3 className="text-4xl font-black text-[#B70F17]">
                {item.value}
              </h3>

              <p className="mt-2 text-slate-600">
                {item.label}
              </p>

            </div>

          ))}

        </div>

        {/* Benefits */}

        <div className="mt-16 rounded-3xl bg-white p-10 shadow-xl border">

          <h3 className="text-2xl font-bold text-slate-900">
            Expected Benefits
          </h3>

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            {road.achievements?.map((item) => (

              <div
                key={item}
                className="flex items-center gap-3"
              >

                <CheckCircle
                  size={22}
                  className="text-green-600"
                />

                <span className="text-slate-700">
                  {item}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}