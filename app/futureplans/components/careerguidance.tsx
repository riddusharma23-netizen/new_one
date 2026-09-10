'use client';

import Image from "next/image";
import { CheckCircle, Users, ArrowRight } from "lucide-react";
import { futurePlans } from "../data";

export default function CareerGuidance() {
  const career = futurePlans[2];

  if (!career) return null;

  return (
    <section className="py-10 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <div>

            <span className="inline-flex items-center gap-2 rounded-full bg-[#F8F000] px-5 py-2 font-semibold text-blue-700">

              <career.icon size={18} />

              {career.title}

            </span>

            <h2 className=" mt-6 text-4xl   lg:text-5xl   font-black'   leading-tight">

              Guiding Students Towards

              <span className="text-blue-700">

                {" "}Successful Careers

              </span>

            </h2>

            <p className="mt-6 text-slate-600 leading-8">

              {career.description}

            </p>

            {/* Features */}

            <div className="mt-10 space-y-4">

              {(career.features ?? []).map((feature) => (

                <div
                  key={feature}
                  className="flex items-center gap-4 rounded-xl bg-white p-5 shadow border hover:shadow-lg transition"
                >

                  <CheckCircle
                    size={22}
                    className="text-green-600"
                  />

                  <span className="font-medium text-slate-700">

                    {feature}

                  </span>

                </div>

              ))}

            </div>

            {/* CTA */}

            <div className="mt-10 flex items-center gap-4">

              <button className="rounded-xl bg-blue-700 px-6 py-3 text-white font-semibold hover:bg-blue-800">

                Career Development

              </button>

              {/* <button className="flex items-center gap-2 font-semibold text-blue-700">

                Learn More

                <ArrowRight size={18} />

              </button> */}

            </div>

          </div>

          {/* Right */}

          <div className="relative">

            <div className="overflow-hidden rounded-3xl shadow-2xl border bg-white">

              {career.image && (

                <Image
                  src={career.image}
                  alt={career.title}
                  className="h-[550px] w-full object-cover hover:scale-105 transition duration-700"
                />

              )}

            </div>

            <div className="absolute -bottom-8 right-8 rounded-2xl bg-white p-6 shadow-xl border">

              <div className="flex items-center gap-4">

                <Users
                  size={34}
                  className="text-blue-700"
                />

                <div>

                  <h3 className="text-2xl font-black text-slate-900">

                    100%

                  </h3>

                  <p className="text-slate-500">

                    Career Support

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}