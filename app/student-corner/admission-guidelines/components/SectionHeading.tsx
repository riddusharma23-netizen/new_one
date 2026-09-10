"use client";

interface SectionHeadingProps {
  badge: string;
  titleBlack: string;
  titleGradient: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  badge,
  titleBlack,
  titleGradient,
  description,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-20 ${
        align === "center" ? "text-center max-w-4xl mx-auto" : "max-w-3xl"
      }`}
    >
      {/* Badge */}

      <span className="inline-flex items-center rounded-full bg-[#F8F400] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#B60F17] shadow-sm">
        {badge}
      </span>

      {/* Heading */}

      <h2 className="   mt-5 text-4xl lg:text-6xl font-black' leading-tight">
        <span className="">{titleBlack}</span> 


        <span className="text-[#B60F17]">
          {titleGradient}
        </span>
      </h2>

      {/* Description */}

      {description && (
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
          {description}
        </p>
      )}

      {/* Gradient Line */}

      <div
        className={`mt-8 ${
          align === "center" ? "mx-auto" : ""
        } h-[5px] w-40 rounded-full bg-gradient-to-r from-[#B60F17] via-[#FF6A00] to-[#F8F000]`}
      />
    </div>
  );
}