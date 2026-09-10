import Image, { StaticImageData } from "next/image";
import { Mail, Phone } from "lucide-react";

interface Faculty {
  name: string;
  designation: string;
  image: StaticImageData | string;
  email: string;
  phone: string;
}

interface Props {
  faculty: Faculty[];
}

export default function DepartmentFaculty({ faculty }: Props) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-slate-900">
            Faculty Members
          </h2>

          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Meet our experienced teachers who guide students with knowledge,
            innovation and practical learning.
          </p>
        </div>

        {/* Faculty Grid */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {faculty.map((teacher, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden border shadow-lg hover:-translate-y-2 hover:shadow-2xl transition"
            >
              <div className="relative h-72">

                <Image
                  src={teacher.image}
                  alt={teacher.name}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-6">

                <h3 className="text-xl font-bold text-slate-900">
                  {teacher.name}
                </h3>

                <p className="text-[#DF6525] font-semibold mt-1">
                  {teacher.designation}
                </p>

                <div className="mt-5 space-y-3 text-sm text-slate-600">

                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    {teacher.email}
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    {teacher.phone}
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}