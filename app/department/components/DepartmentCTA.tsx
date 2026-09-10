import Link from "next/link";
import { ArrowRight, PhoneCall, GraduationCap } from "lucide-react";

interface Props {
  department: {
    title: string;
    slug: string;
  };
}

export default function DepartmentCTA({ department }: Props) {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div
          className="
          relative
          overflow-hidden
          rounded-[40px]
          bg-gradient-to-r
          from-[#B60F17]
          via-[#DF6525]
          to-[#FF8C00]
          px-10
          py-16
          text-white
          shadow-2xl
        "
        >

          {/* Background Blur */}

          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">

            {/* Left */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2">

                <GraduationCap size={18} />

                {department.title}

              </div>

              <h2 className="mt-6 text-4xl lg:text-5xl font-black leading-tight">

                Join Our
                <br />
                Modern Learning Environment

              </h2>

              <p className="mt-6 text-white/90 leading-8 max-w-xl">

                Become a part of Champi Devi Inter College and experience
                quality education with modern facilities, experienced
                teachers and practical learning.

              </p>

            </div>

            {/* Right */}

            <div className="flex flex-col sm:flex-row lg:flex-col gap-5 lg:items-end">

              <Link
                href="/contact"
                className="
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-2xl
                bg-white
                px-8
                py-4
                text-[#DF6525]
                font-bold
                hover:scale-105
                transition
              "
              >
                <PhoneCall size={20} />

                Contact Us
              </Link>

              <Link
                href="/admission"
                className="
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-2xl
                border
                border-white
                px-8
                py-4
                font-bold
                hover:bg-white
                hover:text-[#DF6525]
                transition
              "
              >
                Apply Now

                <ArrowRight size={20} />
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}