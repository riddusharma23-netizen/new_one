import Link from "next/link";
import Image from "next/image";
import { departments } from "./data/department";
import { ArrowRight } from "lucide-react";

export default function DepartmentPage() {
  return (
    <main className="bg-slate-50">

      {/* Hero */}

      <section className="py-24 bg-gradient-to-r from-[#B60F17] via-[#DF6525] to-[#FF8C00] text-white">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <span className="inline-block rounded-full bg-white/20 px-6 py-2 font-semibold">
            Academic Departments
          </span>

          <h1 className="mt-6 text-5xl lg:text-6xl font-black">
            Our Departments
          </h1>

          <p className="mt-6 max-w-3xl mx-auto leading-8 text-white/90">
            Champi Devi Inter College provides modern laboratories,
            experienced faculty and practical learning for every student.
          </p>

        </div>

      </section>

      {/* Cards */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {departments.map((department) => {
              const Icon = department.icon;

              return (
                <div
                  key={department.id}
                  className="
                  group
                  rounded-3xl
                  overflow-hidden
                  bg-white
                  shadow-xl
                  hover:-translate-y-3
                  transition
                  duration-500
                "
                >
                  {/* Image */}

                  <div className="relative h-60 overflow-hidden">

                    <Image
                      src={department.banner}
                      alt={department.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-700"
                    />

                  </div>

                  {/* Content */}

                  <div className="p-8">

                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                      style={{
                        background: department.color,
                      }}
                    >
                      <Icon size={28} />
                    </div>

                    <h2 className="mt-6 text-2xl font-black">
                      {department.title}
                    </h2>

                    <p className="mt-4 text-slate-600 leading-7 line-clamp-3">
                      {department.description}
                    </p>

                    <Link
                      href={`/department/${department.slug}`}
                      className="
                      mt-8
                      inline-flex
                      items-center
                      gap-2
                      font-bold
                      text-[#DF6525]
                      hover:gap-4
                      transition-all
                    "
                    >
                      Explore Department

                      <ArrowRight size={18} />

                    </Link>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>

    </main>
  );
}