"use client";

import { useEffect, useState, type ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  Star,
  Award,
  Users,
  ArrowRight,
  Briefcase,
  Mail,               
  GraduationCap,  
   Phone,
 
    
} from "lucide-react";

const teachers = Array.from({ length: 13 }, (_, i) => ({
  id: i + 1,

  name: [
    "Bhagwati Prasad",
    "Devki Nandan Sharma",
    "Krishna Murari Upadhyay",
    "Vineet Kumar",
    "Megh Shyam",
    "Rakesh Kumar",
    "Sandeep Kumar",
    "Vineet Sharma",
    "Vikram Babu",
    "Shivam Varshney",
    "Anil Kumar Kaushik",
    "Dharmvir Sharma",
    "Hemalata Garg",
  ][i],

  role: [
    "Principal",
    "Vice-Principal",
    "Lecturer - Mathematics",
    "Lecturer - Chemistry",
    "Lecturer - English",
    "Lecturer - History",
    "Lecturer - Physics",
    "Lecturer - English",
    "Lecturer - Hindi",
    "Lecturer - Biology",
    "Lecturer - Physics",
    "Assistant Teacher - Science",
    "Assistant Teacher - Science",
  ][i],

  image: [
    "/teachers/bhagwati-prasad.png",
    "/teachers/devki-nandan-sharma.jpeg",
    "/teachers/krishna-murari.jpeg",
    "/teachers/vineet-kumar.jpeg",
    "/teachers/megh-shyam.jpeg",
    "/teachers/rakesh-kumar.jpeg",
    "/teachers/sandeep-kumar.jpeg",
    "/teachers/vineet-sharma.jpeg",
    "/teachers/vikram-babu.jpeg",
    "/teachers/shivam-varshney.jpeg",
    "/teachers/anilkumar-Kaushik.jpeg",
    "/teachers/dharmvir-sharma.jpeg",
    "/teachers/hemalata-garg.jpeg",
  ][i],

  experience: `${(i % 5) + 2}+ Years`,
  students: "100+",
  projects: "120+",
  rating: "4.9",

  skills: [
    "Next.js",
    "React",
    "Motion",
    "Editing",
  ],

  email: [
    "bhagwati@example.com",
    "dnsharma779@gmail.com",
    "krishnamurari8532@gmail.com",
    "vineetupadhyay2014@gmail.com",
    "sharmameghshyam6@gmail.com",
    "glpathak779@gmail.com",
    "sandeepksharma4243@gmail.com",
    "vineetsharma1600@gmail.com",
    "vikrambabu101271@gmail.com",
    "mth.shivam20@gmail.com",
    "pt.akkaushik1997@gmail.com",
    "dharmvirsharma15@gmail.com",
    "neerajkaushik734@gmail.com",
  ][i],

  degree: [
    "M.A. (Sanskrit), L.T.",
    "M.A., I.G.D. (Bombay)",
    "M.Sc. (Mathematics), B.Ed.",
    "M.Sc. (Chemistry), B.Ed.",
    "M.A. (English), B.Ed.",
    "M.A., B.Ed.",
    "M.Sc. (Physics), B.Ed.",
    "M.A., B.Ed.",
    "M.A., B.Ed.",
    "M.Sc. (Biology), B.Ed.",
    "M.Sc. (Physics)",
    "B.Sc., B.Ed.",
    "B.Sc.",
  ][i],
}));


// our support staff array details****************************
const supportStaff = [
  {
    id: 1,
    name: "Dr. Pavan Kumar Ravat",
    role: "M.D. (Medicine)",
    image: "/staff/s.jpg",
 
    phone: "91-9997948930 ",
   
    department: "Medical Department",
  },

  {
    id: 2,
    name: "Devdutt Sharma",
    role: "Compounder",
    image: "/staff/s2.jpg",
    
    phone: "+91-9410882205",
    
    department: "Pharmacist",
  },

  {
    id: 3,
    name: "Rajesh Kaushik ",
    role: "Peon",
    image: "/staff/s3.jpg",
 
    phone: "+91 9756578303",
    
    // department: "Security",
  },

  // {
  //   id: 4,
  //   name: "Ramesh",
  //   role: "Peon",
  //   image: "/staff/s4.jpg",
 
  //   phone: "+91 9876543210",
   
  //   department: "Support Staff",
  // },

  // {
  //   id: 5,
  //   name: "Mohan",
  //   role: "Driver",
  //   image: "/staff/s5.jpg",
   
  //   phone: "+91 9876543210",
 
  //   department: "Transport",
  // },

  {
    id: 6,
    name: "Ravi",
    role: "Gardener",
    image: "/staff/s6.jpg",
 
    phone: "+91 9876543210",
 
    department: "Maintenance",
  },
];



export default function Teachers() {
  const [databaseTeachers, setDatabaseTeachers] = useState(teachers);

  useEffect(() => {
    void fetch("/api/teachers")
      .then(async (response) => {
        if (!response.ok) return;
        const payload = (await response.json()) as {
          success?: boolean;
          data?: Array<{
            id: number;
            name: string;
            designation: string;
            qualification: string | null;
            experience: string | null;
            email: string | null;
            image: string | null;
          }>;
        };
        if (!payload.success || !payload.data?.length) return;
        setDatabaseTeachers(payload.data.map((teacher) => ({
          id: teacher.id,
          name: teacher.name,
          role: teacher.designation,
          image: teacher.image || "/teachers/SCHOOL.jpg",
          experience: teacher.experience || "",
          students: "100+",
          projects: "120+",
          rating: "4.9",
          skills: [],
          email: teacher.email || "",
          degree: teacher.qualification || "",
        })));
      })
      .catch(() => undefined);
  }, []);

  return (
    <main className=" overflow-hidden">

    {/* Background Glow */}
        <div
          className="
          absolute
          top-0
          left-1/2
  
          -translate-x-1/2
  
          w-[800px]
          h-[800px]
  
          rounded-full
  
          bg-gradient-to-r
          from-blue-700
          via-blue-500
          to-cyan-400
  
          opacity-10
          blur-[180px]
          "
        />
  
        {/* HERO */}
   
  <section
    className="
    relative
  
    overflow-hidden
  
    py-28
    "
  >
  
    {/* Background Image */}
    <div
      className="
      absolute
      inset-0
      "
    >
      <Image
        src="/teachers/SCHOOL.jpg"
        alt="background"
        fill
        priority
        className="
        object-cover
        opacity-30
        "
      />
  
      {/* Orange Layer */}
      <div
        className="
        absolute
        inset-0
  
        bg-[#FF4500]/70
        "
      />
  
      {/* Blue Gradient Mix */}
      <div
        className="
        absolute
        inset-0
  
        bg-gradient-to-r
        from-blue-950/80
        via-blue-900/40
        to-transparent
        "
      />
    </div>
  
    <div
      className="
      relative
  
      max-w-[1450px]
      mx-auto
  
      px-6
      lg:px-10
      "
    >
  
      <div
        className="
        grid
        gap-16
  
        lg:grid-cols-2
        items-center
        "
      >
  
        {/* LEFT */}
        <div className="text-white">
  
          <span
            className="
            inline-flex
  
            px-6
            py-2
  
            rounded-full
  
            bg-white/15
            backdrop-blur
            "
          >
            ABOUT OUR TEACHERS
          </span>
  
          <h1
            className="
            mt-8
  
            text-3xl
            lg:text-6xl
  
            font-black'
  
            leading-tight
            "
          >
           
            <span className="text-[#B70F17]">
              {" "} Building Future
            </span>
  
            <br />
  
            Through Education
          </h1>
  
      
        </div>
  
        {/* RIGHT IMAGE FIX */}
        <div
          className="
          relative
  
          flex
          justify-center
          "
        >
  
          <div
            className="
            relative
  
            w-full
            max-w-[560px]
  
            p-[8px]
  
            rounded-[40px]
  
            bg-gradient-to-r
           from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]
  
            shadow-[0_40px_120px_rgba(0,0,0,.3)]
            "
          >
  
            <div
              className="
              relative
  
              w-full
  
              h-[280px]
              sm:h-[340px]
              md:h-[420px]
  
              rounded-[34px]
  
              overflow-hidden
              "
            >
  
              <Image
                src="/teachers/SCHOOL.jpg"
                alt="about"
  
                fill
  
                sizes="
                (max-width:768px) 100vw,
                560px
                "
  
                className="
                object-cover
                "
              />
  
              <div
                className="
                absolute
                inset-0
  
                bg-[#FF4500]/20
                "
              />
  
            </div>
  
          </div>
  
        </div>
  
      </div>
  
    </div>
  
  </section>

{/*  founder about  section */}
<section
  className="
  relative

  overflow-hidden

  py-28

  bg-white
  "
>

  {/* Background Glow */}
  <div
    className="
    absolute
    top-0
    left-1/2

    -translate-x-1/2

    w-[700px]
    h-[700px]

    rounded-full

    bg-gradient-to-r
    from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]


    opacity-10

    blur-[180px]
    "
  />

  <div
    className="
    relative

    max-w-[1450px]
    mx-auto

    px-6

    grid
    gap-20

    lg:grid-cols-2
    items-center
    "
  >

    {/* LEFT IMAGE */}
    <div
      className="
      relative

      flex
      justify-center
      "
    >

      {/* Gradient Border */}
      <div
        className="
        relative

        p-[6px]

        rounded-[36px]

        bg-gradient-to-b
       from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]
        "
      >

        <div
          className="
          relative

          overflow-hidden

          rounded-[32px]

          w-[320px]
          sm:w-[430px]

          h-[450px]
          sm:h-[600px]
          "
        >

          <img
            src="/aboutimages/arun.jpg"
            alt="Founder"
            className="
            w-full
            h-full

            object-cover

            hover:scale-105

            duration-700
            "
          />

        </div>

      </div>

      {/* Name Badge */}
      <div
        className="
        absolute

        right-0
        bottom-[-20px]

        rounded-[28px]

        px-8
        py-7

        text-white

        bg-[#B70F17]

        shadow-2xl
        border-4
border-[#F8F400]
        "
      >

        <h3
          className="
          text-3xl

          font-black
          "
        >
          Arun Bansal
        </h3>

        <p
          className="
          mt-2

          text-white/90
          "
        >
          Board Member
        </p>

      </div>

    </div>


    {/* RIGHT CONTENT */}
    <div>

      <span
        className="
        inline-block

        px-6
        py-2

        rounded-full
 

    bg-[#F8F400]
 text-[#B70F17] 
        "
      >
        OUR FOUNDER
      </span>


      <h2
        className="
        mt-8

       text-4xl
            lg:text-4xl
            font-black'
            leading-tight
        "
      >
        Meet The
        <br />

        Visionary Behind

        <span className="text-[#B70F17]">
          {" "}Success
        </span>

      </h2>


      <div
        className="
        mt-4

        w-[170px]
        h-[6px]

        rounded-full

        bg-gradient-to-r
        from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]
        "
      />

      <p
        className="
        mt-2

        text-[#333]

        text-md

        leading-6
        "
      >
       Arun Kumar Bansal who is known as founder of Computer Astrology in India. He is born and brought up in Delhi. From the very beginning he had keen interest in Astrology and Vedic sciences. Besides topping in M.Sc. in Physics from Delhi University, he also topped in M.Phil and did research in computer science from Jawahar Lal Nehru University, Delhi.
      </p>


      <div className="mt-6 space-y-8">

        {[
          {
            title: "Email",
            desc:
              "akbansal@hotmail.com.",
          },

          {
            title: "Phone",
            desc:
              "+91-9910080001.",
          },

         

        ].map((item) => (

          <div
            key={item.title}

            className="
            flex
            gap-5
            "
          >

            <div
              className="
              min-w-[50px]
              h-[50px]

              rounded-full

              bg-gradient-to-r
             from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]
              "
            />

            <div>

              <h3
                className="
                text-2xl

                font-black
                "
              >
                {item.title}
              </h3>

              <p
                className="
                mt-0

                text-gray-600

                leading-8
                "
              >
                {item.desc}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  </div>

</section>

{/* second founder abiout section */}

<section
  className="
  relative
  overflow-hidden
  py-28
  bg-white
  "
>

  {/* Background Glow */}
  <div
    className="
    absolute
    top-0
    left-1/2
    -translate-x-1/2

    w-[700px]
    h-[700px]

    rounded-full

    bg-gradient-to-r
   from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]

    opacity-10
    blur-[180px]
    "
  />

  <div
    className="
    relative

    max-w-[1450px]
    mx-auto

    px-6

    grid
    gap-20

    lg:grid-cols-2
    items-center
    "
  >

    {/* LEFT CONTENT */}
    <div>

      <span
        className="
        inline-block
        px-6
        py-2
        rounded-full
        text-[#B70F17]
        bg-[#F8F400]
        "
      >
        OUR FOUNDER
      </span>

      <h2
        className="
        mt-8

        text-4xl
            lg:text-4xl
            font-black'
            leading-tight
        "
      >
        Meet The

        <br />

        Visionary Behind

        <span className="text-[#B70F17]">
          {" "}Success
        </span>

      </h2>

      <div
        className="
        mt-5

        w-[170px]
        h-[6px]

        rounded-full

        bg-gradient-to-r
         from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]
        "
      />
      <p
        className="
        mt-8

        text-[#333]

        text-md

        leading-6
        "
      >
       Narendra Kumar Bansal is a retired electronic engineer in US and now serving as President of TulsiDas Charity Org. He has a strong interest in religious and social service activities. Out of love for Lord Krishna, he loves to serve monetarily, physically, and mentally for the causes of religious and social service activities. Though he is an American citizen but he frequently visits India for long periods of time and serves poor communities.
      </p>
  <div className="mt-6 space-y-8">

        {[
          {
            title: "Email",
            desc:
              "nkbansal@gmail.com",
          },

          {
            title: "Phone",
            desc:
              "603-818-7830 (day & evenings)",
          },

         

        ].map((item) => (

          <div
            key={item.title}

            className="
            flex
            gap-5
            "
          >

            <div
              className="
              min-w-[50px]
              h-[50px]

              rounded-full

              bg-gradient-to-r
             from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]
              "
            />

            <div>

              <h3
                className="
                text-2xl

                font-black
                "
              >
                {item.title}
              </h3>

              <p
                className="
                mt-0

                text-gray-600

                leading-8
                "
              >
                {item.desc}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>


    {/* RIGHT IMAGE */}
    <div
      className="
      relative

      flex
      justify-center
      "
    >

      <div
        className="
        relative

        p-[6px]

        rounded-[36px]

        bg-gradient-to-b
         from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]
        "
      >

        <div
          className="
          relative

          overflow-hidden

          rounded-[32px]

          w-[320px]
          sm:w-[430px]

          h-[450px]
          sm:h-[600px]
          "
        >

          <img
            src="/aboutimages/nk-bansal.jpg"
            alt="Founder"

            className="
            w-full
            h-full

            object-cover

            hover:scale-105

            duration-700
            "
          />

        </div>

      </div>


      {/* Name Badge */}
      <div
        className="
        absolute

        left-0
        bottom-[-20px]

        rounded-[28px]

        px-8
        py-7

        text-white

        bg-[#B70F17]

        shadow-2xl
        border-4
border-[#F8F400]
        "
      >

        <h3
          className="
          text-3xl

          font-black
          "
        >
          NK Bansal
        </h3>

        <p
          className="
          mt-2

          text-white/90
          "
        >
          President TulsiDas Charity Org
        </p>

      </div>

    </div>

  </div>

</section>









      {/* TEACHERS */}

   

<section
  className="
  py-24
  px-6

  bg-gradient-to-br
  from-orange-50
  via-blue-50
  to-cyan-50
"
>

<div className="max-w-[1250px] mx-auto">

{/* heading */}
<div className="text-center">
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
             OUR TEACHERS
          </span>
</div>

<div className="text-center mb-16">

  <h2
        className="
        mt-8

       text-4xl
            lg:text-5xl
            font-black'
            leading-tight
        "
      >
        Meet Our
        

        

        <span className="text-[#B70F17]">
          {" "}Mentors
        </span>

      </h2>

<p className="mt-5 text-gray-600">
11 Industry Experts
</p>

</div>

{/* cards */}

<div
className="
grid

grid-cols-1
sm:grid-cols-2
lg:grid-cols-4

gap-7
"
>

{databaseTeachers.map((teacher) => (
  <div
    key={teacher.id}
    className="
      group
      relative
      rounded-2xl
      bg-white
      border
      border-gray-200
      p-5
      pl-7
      text-center
      shadow-sm
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-lg
    "
  >
    {/* Left Orange Theme Line */}
    <div
      className="
        absolute
        left-0
        top-4
        bottom-4
        w-1.5
        rounded-r-full
        bg-gradient-to-b
        from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]
      "
    />

    {/* Image */}
    <div
      className="
        relative
        mx-auto
        h-28
        w-28
        overflow-hidden
        rounded-2xl
        bg-gray-100
      "
    >
      <Image
        src={teacher.image}
        alt={teacher.name}
        fill
        className="
          object-cover
          transition-transform
          duration-500
          group-hover:scale-105
        "
      />
    </div>

    {/* Name */}
    <h3
      className="
        mt-4
        text-lg
        font-bold
        text-gray-900
      "
    >
      {teacher.name}
    </h3>

    {/* Role */}
    <p
      className="
        mt-1
        text-sm
        font-semibold
        text-[#B60F17]
      "
    >
      {teacher.role}
    </p>

    {/* Divider */}
    <div className="mx-auto my-4 h-px w-16 bg-gray-200" />

    {/* Degree */}
    <div
      className="
        flex
        items-center
        justify-center
        gap-2
        text-sm
        text-gray-600
      "
    >
      <GraduationCap className="h-4 w-4 text-[#B60F17]" />
      <span>{teacher.degree}</span>
    </div>

    {/* Email */}
    <div
      className="
        mt-2
        flex
        items-center
        justify-center
        gap-2
        text-xs
        text-gray-500
      "
    >
      <Mail className="h-4 w-4 shrink-0 text-[#B60F17]" />
      <span className="break-all">{teacher.email}</span>
    </div>
  </div>
))}

</div>

{/* our support staf ********************************  */}

{/* heading */}

<div className="text-center mb-16">

  <h2
        className="
        mt-8

       text-4xl
            lg:text-5xl
            font-black'
            leading-tight
        "
      >
         Our Support
        

        

        <span className="text-[#B70F17]">
          {" "}Staff
        </span>

      </h2>

<p className="mt-5 text-gray-800">
Medical & Support Staff Layout
</p>

</div>

{/* our support staf cards ******************************************* */}
 
<div
  className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-4
    gap-7
    mt-14
  "
>
  {supportStaff.map((staff) => (
    <div
      key={staff.id}
      className="
        group
        relative
        rounded-2xl
        bg-white
        border
        border-gray-200
        p-5
        pl-7
        text-center
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* Left Theme Line */}
      <div
        className="
          absolute
          left-0
          top-4
          bottom-4
          w-1.5
          rounded-r-full
          bg-gradient-to-b
          from-[#B60F17]
          via-[#FF6A00]
          to-[#F8F000]
        "
      />

      {/* Image */}
      <div
        className="
          relative
          mx-auto
          h-28
          w-28
          overflow-hidden
          rounded-2xl
          bg-gray-100
        "
      >
        <Image
          src={staff.image}
          alt={staff.name}
          fill
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />
      </div>

      {/* Name */}
      <h3
        className="
          mt-4
          text-lg
          font-bold
          text-gray-900
        "
      >
        {staff.name}
      </h3>

      {/* Role */}
      <p
        className="
          mt-1
          text-sm
          font-semibold
          text-[#B60F17]
        "
      >
        {staff.role}
      </p>

      {/* Divider */}
      <div className="mx-auto my-4 h-px w-16 bg-gray-200" />

      {/* Phone */}
      <div
        className="
          flex
          items-center
          justify-center
          gap-2
          text-sm
          text-gray-600
        "
      >
        <Phone className="h-4 w-4 text-[#B60F17]" />

        <span>
          {staff.phone}
        </span>
      </div>

      {/* Department */}
      {staff.department && (
        <div
          className="
            mt-2
            flex
            items-center
            justify-center
            gap-2
            text-sm
            text-gray-500
          "
        >
          <Briefcase className="h-4 w-4 text-[#B60F17]" />

          <span>
            {staff.department}
          </span>
        </div>
      )}

    </div>
  ))}
</div>
</div>

</section>

    </main>
  );
}

function Stat({
  icon,
  value,
  title,
}: {
  icon: ReactNode;
  value: string;
  title: string;
}) {
  return (
    <div
      className="
      text-center

      rounded-3xl

      p-6

      bg-white/[0.02]

      hover:bg-white/[0.05]

      duration-300
      "
    >
      <div
        className="
        flex
        justify-center

        text-orange-500
        "
      >
        {icon}
      </div>

      <h3
        className="
        text-3xl
        md:text-4xl

        font-black

        text-white

        mt-4
        "
      >
        {value}
      </h3>

      <p className="text-gray-500 mt-2">
        {title}
      </p>

    </div>
  );
}
