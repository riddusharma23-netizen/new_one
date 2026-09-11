
"use client";

import {
  Phone,
  MapPin,
  Mail,
  Send,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="
      relative
      overflow-hidden
      text-white
      bg-gradient-to-br
           from-[#B60F17]
to-[#FF6A00] 
      "
    >
      {/* Glow */}
      <div
        className="
        absolute
        inset-0
        opacity-10
        bg-gradient-to-r
        from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]
        "
      />

      <div
        className="
        relative
        max-w-[1450px]
        mx-auto
          px-5
          py-14
          sm:px-8
          sm:py-16
          lg:px-10
          lg:py-20
        "
      >
        <div
          className="
          grid
          gap-10
          md:grid-cols-2
          lg:grid-cols-5
          "
        >
         
          <div>
            {/* Logo */}
            <div className="flex items-center gap-4">

              <div
                className="
                w-20
                h-20
                rounded-full
                overflow-hidden
                p-[3px]

                bg-gradient-to-r
                 from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]
                "
              >
                <img
                  src="/logo.png"
                  alt="logo"
                  className="
                  w-full
                  h-full
                  object-cover
                  rounded-full
                  "
                />
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  CDIC
                </h2>

                <p
                  className="
                  text-sm
                  text-white/70
                  tracking-[4px]
                  "
                >
                  EDUCATION
                </p>
              </div>

            </div>

            <p
              className="
              mt-6
              leading-7
              text-white/80
              "
            >
           
            </p>

            <div className="mt-10 space-y-3">

              {[
                {
                  icon: Phone,
                  text: "+ 91-8057494951",
                },
                {
                  icon: MapPin,
                  text:
                    "Jamo Aligar",
                },
                {
                  icon: Mail,
                  text:
                    "cdicjamo@gmail.com",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="
                  flex
                  items-center
                  gap-5
                  "
                >
                  <div
                    className="
                    min-w-[43px]
                    h-[43px]

                    rounded-xl

                    flex
                    items-center
                    justify-center
                    text-[#B60F17]
                    bg-[#F8F000]
                    "
                  >
                    <item.icon size={22} />
                  </div>

                  <p className="min-w-0 break-words text-sm sm:text-base">
                    {item.text}
                  </p>
                </div>
              ))}

            </div>
          </div>

  <FooterLinks
            title="Important Links"
            links={[
              { label: "Account", href: "/account-dashboard" },
              { label: "Student Corner", href: "/student-corner" },
              { label: "Schedules", href: "/schedules" },
              { label: "Departments", href: "/department" },
            ]}
          />
          <FooterLinks
            title="Our School"
            links={[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" },
              { label: "Our Faculty", href: "/teachers" },
              { label: "Contact Us", href: "/contact" },
            ]}
          />

          <StudentResources />

          {/* Newsletter */}
          <div>

            <Title title="Newsletter" />

            <p
              className="
              mt-10
              leading-7
              text-white/80
              "
            >
              Subscribe our newsletter
              to get latest updates.
            </p>

            <input
              type="email"
              placeholder="Your Email"
              className="
              mt-8
              w-full
              h-[50px]

              rounded-2xl

              px-6

              text-black

              bg-white
              outline-none
              "
            />

            <button
              className="
              mt-8
              w-full
              h-[50px]

              rounded-2xl

              font-bold

              flex
              items-center
              justify-center
              gap-3

              bg-[#B60F17]

              hover:scale-[1.03]

              duration-300
              "
            >
              SUBSCRIBE NOW
              <Send size={18} />
            </button>

          </div>

        </div>
      </div>

      {/* Bottom */}
      <div
        className="
        border-t
        border-white/10

        py-6

        text-center
        text-white
        "
      >
     2026 Smt. Champi Devi Inter College, Jamon (Aligarh). All Rights 
Reserved. Powered by Tulsi Das Charity Org.
      </div>

    </footer>
  );
}

function Title({ title }: { title: string }) {
  return (
    <div>

      <h3 className="text-2xl font-black sm:text-3xl">
        {title}
      </h3>

      <div
        className="
        mt-5
        w-[120px]
        h-[5px]

        rounded-full
        bg-white/20
        "
      >
        <div
          className="
          w-[60px]
          h-full

          bg-gradient-to-r
          from-[#B60F17]
        via-[#FF6A00]
        to-[#F8F000]
          "
        />
      </div>

    </div>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>

      <Title title={title} />

      <div className="mt-10 space-y-3">

        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="
            flex
            items-center
            gap-3

            text-sm
            sm:text-base
            md:text-lg

            hover:text-[#F8F000]


            duration-300
            "
          >
            <ChevronRight
              size={18}
              color="#F8F400"
            />

            {item.label}
          </Link>
        ))}

      </div>

    </div>
  );
}

function StudentResources() {
  const links = [
    { label: "Student Corner", href: "/student-corner" },
    { label: "Admission Guidelines", href: "/student-corner/admission-guidelines" },
    { label: "Board Results", href: "/student-corner/board-result" },
    { label: "Results", href: "/student-corner/result" },
    { label: "Achievements", href: "/student-corner/achievent" },
  ];

  return (
    <div className="rounded-2xl border border-white/20 bg-black/10 p-5 backdrop-blur-sm">
      <Title title="Student Corner" />
      <div className="mt-6 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold transition hover:bg-white/15 hover:text-[#fff3a6]"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#f8f000]" />
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
 
