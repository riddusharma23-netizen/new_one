'use client';

import Image from "next/image";
import {
  CheckCircle,
  MonitorSmartphone,
} from "lucide-react";
import { futurePlans } from "../data";

export default function SmartClasses() {

  const smart = futurePlans[1] as {
    title: string;
    icon: any;
    image: any;
    description: string;
    features: string[];
  };

  const Icon = smart.icon;

  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Image */}

          <div className="relative">

            <div className="overflow-hidden rounded-3xl shadow-2xl border bg-white">

              <Image
                src={smart.image}
                alt={smart.title}
                className="w-full h-[520px] object-cover hover:scale-105 transition duration-700"
              />

            </div>

            {/* Floating Card */}

            <div className="absolute -bottom-8 left-8 rounded-2xl bg-white shadow-xl p-6 border">

              <div className="flex items-center gap-3">

                <MonitorSmartphone
                  size={34}
                  className="text-[#B70F17]"
 
                />

                <div>

                  <h4 className="font-bold text-slate-900">
                    Smart Learning
                  </h4>

                  <p className="text-sm text-slate-500">
                    Interactive Digital Education
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Right */}

          <div>

            <span className="inline-flex items-center gap-2 rounded-full bg-[#F8F000] px-5 py-2 font-semibold text-[#B70F17]">

              <Icon size={18} />

              {smart.title}

            </span>

            <h2 className="mt-6 text-4xl lg:text-5xl font-black' text-slate-900">
              Modern Smart Classrooms
            </h2>

            <p className="mt-6 text-slate-900 leading-8">
              {smart.description}
            </p>

            {/* Features */}

            <div className="mt-10 grid md:grid-cols-2 gap-5">

              {smart.features.map((feature) => (

                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border bg-white p-4 shadow-sm hover:shadow-lg transition"
                >

                  <CheckCircle
                    size={22}
                    className="mt-1 text-green-600"
                  />

                  <span className="font-medium text-slate-700">
                    {feature}
                  </span>

                </div>

              ))}

            </div>

            {/* Bottom Cards */}

            <div className="mt-10 grid grid-cols-2 gap-5">

              <div className="rounded-2xl bg-gradient-to-r from-[#DF6525] to-[#B60F17] p-6 text-white">

                <h3 className="text-3xl font-black">
                  25+
                </h3>

                <p className="mt-2">
                  Digital Classrooms
                </p>

              </div>

              <div className="rounded-2xl border bg-white p-6">

                <h3 className="text-3xl font-black text-[#B70F17]">
                  2027
                </h3>

                <p className="mt-2 text-slate-600">
                  Target Completion
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}