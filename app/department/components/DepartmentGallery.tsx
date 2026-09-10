import Image from "next/image";
import { Images } from "lucide-react";

interface Props {
  gallery: string[];
}

export default function DepartmentGallery({ gallery }: Props) {
  return (
    <section className="py-20 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-14">

          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 font-semibold text-[#DF6525]">

            <Images size={18} />

            Department Gallery

          </div>

          <h2 className="mt-6 text-4xl lg:text-5xl font-black text-slate-900">

            Explore Our Department

          </h2>

          <p className="mt-5 text-slate-600 max-w-2xl mx-auto">

            A glimpse of our modern infrastructure, practical learning
            environment and student activities.

          </p>

        </div>

        {/* Gallery */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {gallery.map((image, index) => (

            <div
              key={index}
              className="group relative h-[280px] overflow-hidden rounded-3xl shadow-lg"
            >

              <Image
                src={image}
                alt={`Gallery ${index + 1}`}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-500" />

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}