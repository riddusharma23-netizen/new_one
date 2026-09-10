import {
  Trophy,
  Award,
  Star,
  CheckCircle,
} from "lucide-react";

interface Stat {
  label: string;
  value: string;
}

interface Props {
  achievements: string[];
  stats: Stat[];
}

export default function DepartmentAchievements({
  achievements,
  stats,
}: Props) {
  return (
    <section className="py-20">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-14">

          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 font-semibold text-[#DF6525]">

            <Award size={18} />

            Achievements

          </span>

          <h2 className="mt-6 text-4xl lg:text-5xl font-black">

            Department Achievements

          </h2>

          <p className="mt-5 text-slate-600 max-w-3xl mx-auto">

            Our department continues to achieve excellence in academics,
            innovation, practical learning and student development.

          </p>

        </div>

        {/* Statistics */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {stats.map((item) => (

            <div
              key={item.label}
              className="rounded-3xl border bg-white p-8 shadow-lg text-center hover:-translate-y-2 transition"
            >

              <Trophy
                size={34}
                className="mx-auto text-[#DF6525]"
              />

              <h3 className="mt-4 text-4xl font-black text-[#DF6525]">

                {item.value}

              </h3>

              <p className="mt-2 text-slate-600">

                {item.label}

              </p>

            </div>

          ))}

        </div>

        {/* Achievement List */}

        <div className="mt-16 rounded-3xl bg-white border shadow-xl p-10">

          <h3 className="flex items-center gap-2 text-2xl font-bold">

            <Star className="text-[#DF6525]" />

            Highlights

          </h3>

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            {achievements.map((item) => (

              <div
                key={item}
                className="flex items-start gap-3"
              >

                <CheckCircle
                  size={22}
                  className="text-green-600 mt-1"
                />

                <span className="text-slate-700 leading-7">

                  {item}

                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}