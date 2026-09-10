
"use client";

import {
  Phone,
  MapPin,
  Mail,
  Send,
  ChevronRight,
} from "lucide-react";

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
        px-6
        lg:px-10
        py-20
        "
      >
        <div
          className="
          grid
          gap-14
          md:grid-cols-2
          lg:grid-cols-4
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

                  <p className="text-md">
                    {item.text}
                  </p>
                </div>
              ))}

            </div>
          </div>

  <FooterLinks
            title="Important Links"
            links={[
               "Account",
              "Students",
              "Schedules",
              "Kindergarten",
          
            ]}
          />
          <FooterLinks
            title="Our School"

            links={[
              " Home ",
              "About Us",
              "Cultural",
              "Our Story",
                 "Contact Us",
             
              
            ]}
          />

        

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

      <h3 className="text-3xl font-black">
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

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div>

      <Title title={title} />

      <div className="mt-10 space-y-3">

        {links.map((item: string) => (
          <a
            key={item}
            href="#"
            className="
            flex
            items-center
            gap-3

            text-lg

            hover:text-[#F8F000]


            duration-300
            "
          >
            <ChevronRight
              size={18}
              color="#F8F400"
            />

            {item}
          </a>
        ))}

      </div>

    </div>
  );
}
 
