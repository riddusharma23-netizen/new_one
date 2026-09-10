'use client';

import Image from "next/image";
import {
  CheckCircle,
  Trees,
  Leaf,
  Sun,
  Droplets,
} from "lucide-react";
import { futurePlans } from "../data";

export default function GreenCampus() {

  const green = futurePlans[3] as {
    title: string;
    icon: any;
    image: any;
    description: string;
    features: string[];
  };

  const Icon = green.icon;

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <div className="relative">

            <div className="overflow-hidden rounded-3xl border bg-white shadow-2xl">
              <Image
                src={green.image}
                alt={green.title}
                className="h-[560px] w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>

            <div className="absolute -bottom-8 left-8 rounded-2xl bg-white p-6 shadow-xl border">
              <div className="flex items-center gap-4">
                <Trees
                  size={36}
                  className="text-green-600"
                />

                <div>
                  <h3 className="text-3xl font-black text-green-600">
                    Eco
                  </h3>

                  <p className="text-slate-500">
                    Friendly Campus
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Right */}

          <div>

            <span className="inline-flex items-center gap-2 rounded-full bg-[#F8F000] px-5 py-2 font-semibold text-green-700">

              <Icon size={18} />

              {green.title}

            </span>

            <h2 className="mt-6 text-4xl lg:text-5xl font-black' text-slate-900">

              Building A

              <span className="text-green-600">
                {" "}Green Campus
              </span>

            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              {green.description}
            </p>

            <div className="mt-10 grid gap-5">

              {green.features.map((item) => ( 

                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow hover:shadow-lg transition"
                >

                  <CheckCircle
                    size={22}
                    className="text-green-600"
                  />

                  <span className="font-medium text-slate-700">
                    {item}
                  </span>

                </div>

              ))}

            </div>

            <div className="mt-10 grid grid-cols-3 gap-5">

              <div className="rounded-2xl border bg-white p-5 text-center shadow">
                <Leaf
                  size={32}
                  className="mx-auto text-green-600"
                />

                <h3 className="mt-3 text-xl font-black">
                  1000+
                </h3>

                <p className="text-sm text-slate-500">
                  Trees
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 text-center shadow">
                <Sun
                  size={32}
                  className="mx-auto text-[#B70F17]"
                />

                <h3 className="mt-3 text-xl font-black">
                  Solar
                </h3>

                <p className="text-sm text-slate-500">
                  Energy
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-5 text-center shadow">
                <Droplets
                  size={32}
                  className="mx-auto text-blue-600"
                />

                <h3 className="mt-3 text-xl font-black">
                  Rain
                </h3>

                <p className="text-sm text-slate-500">
                  Harvesting
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}