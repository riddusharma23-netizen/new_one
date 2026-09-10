'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface DepartmentCardProps {
  department: {
    id: number;
    slug: string;
    title: string;
    shortDescription: string;
    heroImage: string;
  };
}

export default function DepartmentCard({
  department,
}: DepartmentCardProps) {
  return (
    <Link href={`/department/${department.slug}`}>

      <div
        className="
        group
        overflow-hidden
        rounded-3xl
        border
        bg-white
        shadow-lg
        transition
        duration-500
        hover:-translate-y-2
        hover:shadow-2xl
      "
      >
        {/* Image */}

        <div className="relative h-64 overflow-hidden">

          <Image
            src={department.heroImage}
            alt={department.title}
            fill
            className="
            object-cover
            transition
            duration-700
            group-hover:scale-110
          "
          />

        </div>

        {/* Content */}

        <div className="p-6">

          <h2 className="text-2xl font-black text-slate-900">

            {department.title}

          </h2>

          <p className="mt-4 leading-7 text-slate-600">

            {department.shortDescription}

          </p>

          <div className="mt-6 flex items-center gap-2 font-semibold text-[#DF6525]">

            Explore Department

            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-2"
            />

          </div>

        </div>

      </div>

    </Link>
  );
}