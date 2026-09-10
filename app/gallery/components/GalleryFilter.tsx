"use client";

interface GalleryFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export default function GalleryFilter({
  categories,
  active,
  onChange,
}: GalleryFilterProps) {
  return (

    <div className="mb-16 flex flex-wrap items-center justify-center gap-4">

      {categories.map((category) => (

        <button
          key={category}
          onClick={() => onChange(category)}
          className={`rounded-full px-8 py-3 font-semibold transition-all duration-300 ${
            active === category
              ? "bg-[#F8F000] text-[#B60F17] shadow-xl"
              : "border border-slate-200 bg-white text-slate-700 hover:border-[#D4AF37] hover:text-[#072F60]"
          }`}
        >
          {category}
        </button>

      ))}

    </div>

  );
}
