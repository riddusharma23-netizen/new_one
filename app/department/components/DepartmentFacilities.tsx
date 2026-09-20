import type { LucideIcon } from "lucide-react";
import {
  Monitor,
  Wifi,
  BookOpen,
  Trophy,
  FlaskConical,
  Calculator,
  CheckCircle,
} from "lucide-react";

interface Props {
  facilities: string[];
}

const iconMap: Record<string, LucideIcon> = {
  "Computer Lab": Monitor,
  "High Speed Internet": Wifi,
  Library: BookOpen,
  Playground: Trophy,
  "Science Lab": FlaskConical,
  "Math Lab": Calculator,
};

export default function DepartmentFacilities({ facilities }: Props) {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-slate-900">
            Department Facilities
          </h2>

          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Our department provides modern facilities that help students learn
            through practical knowledge and real-life experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility) => {
            const Icon = iconMap[facility] || CheckCircle;

            return (
              <div
                key={facility}
                className="bg-white rounded-3xl p-8 shadow-lg border hover:-translate-y-2 hover:shadow-xl transition"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                  <Icon
                    size={34}
                    className="text-[#DF6525]"
                  />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  {facility}
                </h3>

                <p className="mt-3 text-slate-600">
                  Well-equipped facility designed to improve students&apos;
                  practical learning experience.
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}