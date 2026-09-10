import Image from "next/image";

interface Props {
  department: any;
}

export default function DepartmentHero({ department }: Props) {

  return (

    <section className="relative h-[550px]">

      <Image
        src={department.banner}
        alt={department.title}
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute inset-0 flex items-center">

        <div className="max-w-7xl mx-auto px-6 text-white">

          <h1 className="text-6xl font-black">

            {department.title}

          </h1>

          <p className="mt-6 max-w-3xl text-lg">

            {department.description}

          </p>

        </div>

      </div>

    </section>

  );
}