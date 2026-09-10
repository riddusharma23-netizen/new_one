import Link from "next/link";
import Image from "next/image";
import { departments } from "../data/department";

export default function DepartmentSection() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <h2 className="text-5xl font-black">
            Our Departments
          </h2>

          <p className="mt-4 text-slate-600">
            Explore our modern learning facilities.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {departments.slice(0,4).map((item)=>{

            const Icon=item.icon;

            return(

              <Link
              key={item.id}
              href={`/department/${item.slug}`}
              className="group"
              >

                <div className="rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition">

                  <div className="relative h-52">

                    <Image
                    src={item.banner}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-700"
                    />

                  </div>

                  <div className="p-6">

                    <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                    style={{background:item.color}}
                    >
                      <Icon size={22}/>
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {item.title}
                    </h3>

                  </div>

                </div>

              </Link>

            )

          })}

        </div>

      </div>

    </section>
  );
}