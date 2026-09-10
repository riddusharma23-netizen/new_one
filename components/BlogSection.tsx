"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  Clock3,
} from "lucide-react";

const blogs = [
  {
    id: 1,
    title:
      "How Modern Education Builds Better Future",
    date: "12 Feb 2026",
    read: "5 min read",
    desc:
      "Discover innovative learning methods and how students gain confidence through practical education.",
  },

  {
    id: 2,
    title:
      "Why Students Need Creative Learning",
    date: "16 Feb 2026",
    read: "4 min read",
    desc:
      "Interactive activities improve understanding and make learning enjoyable.",
  },

  {
    id: 3,
    title:
      "Building Leadership In School Life",
    date: "22 Feb 2026",
    read: "6 min read",
    desc:
      "Student development through events, teamwork and practical activities.",
  },
];

export default function BlogSection() {
  return (
    <section
      className="
      relative
      overflow-hidden
      py-24
      "
    >

      {/* Background */}
      <div
        className="
        absolute
        inset-0

         
        "
      />

      {/* Glow */}
      <div
        className="
        absolute
        top-0
        left-1/2

        -translate-x-1/2

        w-[700px]
        h-[700px]

        rounded-full

        bg-[#F8F000]

        text-[#FF4500]

        blur-[220px]
        opacity-10
        "
      />

      <div className="relative max-w-[1450px] mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">

          <span
            className="
            inline-block

            px-6
            py-2

            rounded-full
             
            text-[#B60F17]

            bg-[#F8F000]

            "
          >
            LATEST BLOGS
          </span>

          <h2
            className="
           mt-5
            text-4xl
            lg:text-6xl
            font-white
            text-black
            leading-tight
            "
          >
            Learn Through
            <span className="text-[#B60F17]">
              {" "}Our Articles
            </span>
          </h2>

          <p
            className="
            mt-5
            text-gray-600
            text-lg
            "
          >
            Fresh ideas and educational insights
          </p>

        </div>

        {/* Grid */}
        <div
          className="
          grid
          gap-8

          lg:grid-cols-[1.2fr_.8fr]
          "
        >



          {/* Featured */}
          <div
            className="
            relative

            overflow-hidden

            rounded-[40px]

            p-10

            bg-gradient-to-br
           from-[#B60F17]
to-[#FF6A00] 

            text-white

            min-h-[520px]

            flex
            flex-col
            justify-between
            "
          >

{/* Top Decoration */}
<div
  className="
  absolute
  top-10
  right-10

  w-[180px]
  h-[180px]

  rounded-full

  bg-white/10

  blur-xl
  "
/>

<div
  className="
  absolute
  top-8
  left-8

  grid
  grid-cols-5
  gap-2
  "
>
  {[...Array(20)].map((_, i) => (
    <span
      key={i}
      className="
      w-2.5
      h-2.5

      rounded-full

      bg-white/30
      "
    />
  ))}
</div>


            <div
              className="
              absolute

              right-[-100px]
              top-[-100px]

              w-[320px]
              h-[320px]

              rounded-full

              bg-white/10
              "
            />

            <div>

              <span
                className="
                inline-block

                px-4
                py-2

                rounded-full
                 text-[#B60F17]
                bg-[#F8F000]
                "
              >
                Featured
              </span>

              <h3
                className="
                mt-10

                text-3xl
                lg:text-5xl

                font-black

                leading-tight
                "
              >
                Transforming Students Through Smart Education
              </h3>

              <p
                className="
                mt-8

                text-2xl

                leading-9

                text-white/90
                leading-tight
                "
              >
                Education becomes more engaging when
                innovation, creativity and real-world
                learning combine together.
              </p>

            </div>



{/* Bottom Illustration */}
 

{/* Center Image Design */}

{/* Center Image */}
<div
  className="
  relative
  mt-10

  flex
  items-center
  justify-center
  "
>

  {/* Glow */}
  <div
    className="
    absolute
    w-[360px]
    h-[360px]
    rounded-full
    bg-white/10
    blur-[120px]
    "
  />

  {/* Border */}
  <div
    className="
    relative

    w-full
    max-w-[420px]

    p-[6px]

    rounded-[40px]

    bg-gradient-to-r
     
from-[#FF6A00] 
to-[#B60F17]

    shadow-[0_40px_120px_rgba(0,0,0,.25)]

    overflow-hidden
    "
  >

    <div
      className="
      relative

      w-full

      h-[220px]
      sm:h-[260px]
      md:h-[300px]
      lg:h-[340px]

      rounded-[34px]

      overflow-hidden
      "
    >
      <Image
        src="/school.jpg"
        alt="education"
        fill
        priority
        sizes="(max-width:768px) 100vw, 420px"
        className="
        object-cover
        hover:scale-110
        transition-transform
        duration-700
        "
      />

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-t
        from-black/40
        to-transparent
        "
      />
    </div>

  </div>







  {/* Floating Dots */}
  <div
    className="
    absolute

    top-10
    left-10

    w-4
    h-4

    rounded-full

    bg-white/40

    animate-bounce
    "
  />

  <div
    className="
    absolute

    right-10
    bottom-10

    w-6
    h-6

    rounded-full

    bg-[#B60F17]

    animate-pulse
    "
  />

</div>

<Link
  href="/about"
  className="
    relative
    inline-flex

    items-center
    gap-3
    justify-center

    overflow-hidden

    mt-12

    w-fit

    px-8
    py-4

    rounded-full

    bg-[#F8F000]

    text-[#B60F17]
    font-semibold

    transition-all
    duration-500

    hover:-translate-y-1
    hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]

    hover:bg-[#B60F17]
    hover:text-[#F8F000]
 
  "
>
  <span className="relative z-10">
    Read Article
  </span>

  <ArrowRight
    className="
    relative
    z-10

    transition-transform
    duration-300

    group-hover:translate-x-1
    "
  />
</Link>

            

          </div>

          {/* Right cards */}
          <div className="space-y-8">

            {blogs.map((blog) => (

              <article
                key={blog.id}
                className="
                group

                rounded-[30px]

                p-8

                bg-white

                border
                border-blue-100

                shadow-xl

                hover:-translate-y-2

                duration-500
                "
              >

                <div
                  className="
                  flex
                  gap-4
                  flex-wrap

                  text-sm
                  "
                >

                  <span
                    className="
                    flex
                    items-center
                    gap-2

                    text-[#B60F17]
                    "
                  >
                    <Calendar size={16} />

                    {blog.date}
                  </span>

                  <span
                    className="
                    flex
                    items-center
                    gap-2

                    text-black
                    "
                  >
                    <Clock3 size={16} />

                    {blog.read}
                  </span>

                </div>

                <h3
                  className="
                  mt-6

                  text-3xl

                  font-black

                  group-hover:text-[#B60F17]

                  duration-300
                  leading-tight
                  "
                >
                  {blog.title}
                </h3>

                <p
                  className="
                  mt-5

                  leading-8

                  text-gray-600
                  "
                >
                  {blog.desc}
                </p>

                <button
                  className="
                  mt-8

                  flex
                  items-center
                  gap-3

                  font-bold

                  text-[#F8F000]

                  group-hover:text-[#B60F17]

                  duration-300
                  "
                >
                  Read More

                  <ArrowRight
                    className="
                    group-hover:translate-x-2
                    duration-300
                    "
                  />

                </button>

              </article>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}