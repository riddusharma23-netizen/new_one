"use client";

interface SectionHeadingProps {
  badge: string;
  titleBlack: string;
  titleGradient: string;
  description: string;
}

export default function SectionHeading({
  badge,
  titleBlack,
  titleGradient,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-20 max-w-4xl text-center">

      {/* Badge */}

      <div className="inline-flex items-center rounded-full bg-[#F8F400] px-5 py-2">

        <span className="text-sm font-bold uppercase tracking-[4px] text-[#B60F17]">
          {badge}
        </span>

      </div>

      {/* Heading */}

      <h2 className="mt-8 text-4xl font-black' leading-tight text-[#333] md:text-5xl lg:text-6xl">

        {titleBlack}{" "}

        <span className="text-[#B60F17]">

          {titleGradient}

        </span>

      </h2>

      {/* Gold Divider */}

      <div className="mx-auto mt-4 h-1 w-32 rounded-full bg-gradient-to-r from-[#B60F17] to-[#F8F400]" />

      {/* Description */}

      <p className="mx-auto mt-8 max-w-3xl text-lg leading-6 text-[#333]">

        {description}

      </p>

    </div>
  );
}