"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  ChevronDown,
  FolderOpen,
  GraduationCap,
  House,
  Images,
  Info,
  LayoutDashboard,
  Menu,
  Phone,
  School,
  Users,
  X,
} from "lucide-react";

const menuItems = [
  {
    title: "Home",
    href: "/",
    icon: House,
  },
  {
    title: "About Us",
    href: "/about",
    icon: Info,
  },
  {
    title: "Gallery",
    href: "/gallery1",
    icon: Images,
  },
  {
    title: "Our Faculty",
    href: "/teachers",
    icon: Users,
  },
  {
    title: "Accounts",
    icon: FolderOpen,
    dropdown: [
      {
        title: "Accounts Dashboard",
        href: "/account-dashboard",
      },
      {
        title: "School Income",
        href: "/account-dashboard/income",
      },
      {
        title: "School Expenses",
        href: "/account-dashboard/expenses",
      },
      {
        title: "Clinic Income",
        href: "/clinic-income",
      },
    ],
  },
  {
    title: "Departments",
    href: "/department",
    icon: School,
  },
  {
    title: "Schedules",
    href: "/schedules",
    icon: GraduationCap,
  },
  {
    title: "Students",
    icon: LayoutDashboard,
    dropdown: [
      {
        title: "Student Corner",
        href: "/student-corner",
      },
      {
        title: "Admission Guidelines",
        href: "/student-corner/admission-guidelines",
      },
      {
        title: "Board Results",
        href: "/student-corner/board-result",
      },
      {
        title: "Results",
        href: "/student-corner/result",
      },
      {
        title: "Achievements",
        href: "/student-corner/achievent",
      },
    ],
  },
  {
    title: "Contact Us",
    href: "/contact",
    icon: Phone,
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const pathname = usePathname();

  if (pathname?.startsWith("/account-dashboard")) {
    return null;
  }

  const isActive = (href: string) => {
    return (
      pathname === href ||
      (href !== "/" && pathname?.startsWith(`${href}/`))
    );
  };

  const isDropdownActive = (
    dropdown: { title: string; href: string }[]
  ) => {
    return dropdown.some((item) => isActive(item.href));
  };

  const closeMenu = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header className="relative z-50">
      {/* =========================================
          SCHOOL BRAND HEADER
      ========================================== */}

      <div className="relative overflow-hidden border-b border-orange-100 ">
        {/* background decorations */}
        <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-[#f7b500]/10 blur-xl" />

        <div className="pointer-events-none absolute right-[10%] top-5 h-3 w-3 rounded-full bg-[#b60f17]/15" />

        <div className="pointer-events-none absolute right-[26%] top-16 h-2 w-2 rounded-full bg-[#d85d00]/30" />

        <div className="pointer-events-none absolute left-[40%] top-7 h-3 w-3 rounded-full bg-[#072f60]/10" />

        <div
          className="
            relative
            mx-auto
            flex
            max-w-[1400px]
            items-center
            gap-4
            px-4
            py-4
            sm:px-6
            md:gap-6
            lg:py-6
          "
        >
          {/* Desktop logo */}
          <div className="hidden shrink-0 md:block">
            <div
              className="
                relative
                flex
                h-[88px]
                w-[88px]
                items-center
                justify-center
                rounded-full
                border-[3px]
                border-[#f4b400]
                bg-white
                p-1
                shadow-[0_8px_25px_rgba(182,15,23,0.14)]
                lg:h-[104px]
                lg:w-[104px]
              "
            >
              <img
                src="/logo.png"
                alt="Smt. Champi Devi Inter College logo"
                className="h-full w-full rounded-full object-contain"
              />
            </div>
          </div>

          {/* School name */}
          <div className="min-w-0">
            <h1
              className="
                bg-gradient-to-r
                from-[#d85d00]
                via-[#173c6b]
                to-[#b60f17]
                bg-clip-text
                text-[24px]
                font-extrabold
                leading-[1.08]
                tracking-tight
                text-transparent
                sm:text-3xl
                md:text-4xl
                lg:text-[52px]
              "
            >
              Smt. Champi Devi Inter College
            </h1>

            <div className="mt-2 flex items-center gap-2">
              <span className="hidden h-[2px] w-7 rounded-full bg-[#f4b400] sm:block" />

              <p className="text-[12px] font-medium tracking-wide text-slate-600 sm:text-sm md:text-base lg:text-lg">
                Learning with purpose, growing with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* *****************************************
          desktop navigation 
         ********************************************* */}

      <nav
        className="
          hidden
          bg-gradient-to-r
          from-[#951c12]
          via-[#b60f17]
          to-[#df5b00]
          text-white
          shadow-[0_8px_24px_rgba(104,25,17,0.22)]
          lg:block
        "
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-[1400px] items-stretch justify-center px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            /* ****************************
               normal link 
            ****************************************** */

            if (!item.dropdown) {
              const active = isActive(item.href!);

              return (
              <Link
  key={item.title}
  href={item.href!}
  className={`
    group
    relative
    flex
    min-w-[92px]
    flex-col
    items-center
    justify-center
    px-3
    py-3
    text-center
    text-xs
    font-semibold
    transition-all
    duration-300
    xl:min-w-[105px]
  `}
>
  {/* Active top line */}
  {active && (
    <span
      className="
        absolute
        left-1/2
        top-0
        h-[4px]
        w-[65%]
        -translate-x-1/2
        rounded-b-full
        bg-[#ffd34e]
      "
    />
  )}

  {/* Icon */}
  <span
    className={`
      flex
      h-11
      w-11
      items-center
      justify-center
      rounded-full
      border
      transition-all
      duration-300
      ${
        active
          ? "border-[#ffd34e] text-[#ffd34e] shadow-md"
          : "border-white/20 text-white group-hover:-translate-y-1 group-hover:border-[#ffd34e] group-hover:text-[#ffd34e]"
      }
    `}
  >
    <Icon size={20} strokeWidth={1.9} />
  </span>

  {/* Text */}
  <span
    className={`
      mt-2
      whitespace-nowrap
      transition-colors
      duration-300
      ${
        active
          ? "text-[#ffd34e]"
          : "text-white group-hover:text-[#ffd34e]"
      }
    `}
  >
    {item.title}
  </span>

  {/* Hover bottom line */}
  <span
    className="
      absolute
      bottom-0
      left-1/2
      h-[3px]
      w-0
      -translate-x-1/2
      rounded-full
      bg-[#ffd34e]
      transition-all
      duration-300
      group-hover:w-[55%]
    "
  />
</Link>
              );
            }

            /* =====================
               DROPDOWN LINK
            ====================== */

            const open = openDropdown === item.title;
            const active = isDropdownActive(item.dropdown);

            return (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.title)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(open ? null : item.title)
                  }
                  aria-expanded={open}
                  className={`
                    group
                    relative
                    flex
                    min-w-[92px]
                    flex-col
                    items-center
                    justify-center
                    px-3
                    py-3
                    text-center
                    text-xs
                    font-semibold
                    transition-all
                    duration-300
                    hover:bg-white/10
                    xl:min-w-[105px]

                    ${
                      open || active
                        ? "bg-white/15"
                        : ""
                    }
                  `}
                >
                  {(open || active) && (
                    <span
                      className="
                        absolute
                        left-1/2
                        top-0
                        h-[4px]
                        w-[65%]
                        -translate-x-1/2
                        rounded-b-full
                        bg-[#ffd34e]
                      "
                    />
                  )}

                  <span
                    className={`
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-all
                      duration-300

                      ${
                        open || active
                          ? "border-[#ffd34e] bg-[#fff7d6] text-[#b60f17]"
                          : "border-white/20 bg-white/10 group-hover:-translate-y-1 group-hover:bg-white group-hover:text-[#b60f17]"
                      }
                    `}
                  >
                    <Icon size={20} strokeWidth={1.9} />
                  </span>

                  <span className="mt-2 flex items-center gap-1 whitespace-nowrap">
                    {item.title}

                    <ChevronDown
                      size={13}
                      className={`
                        transition-transform
                        duration-300
                        ${open ? "rotate-180" : ""}
                      `}
                    />
                  </span>
                </button>

                {/* Dropdown */}
                <div
                  className={`
                    absolute
                    left-1/2
                    top-full
                    w-[270px]
                    -translate-x-1/2
                    pt-2
                    transition-all
                    duration-200

                    ${
                      open
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }
                  `}
                >
                  <div
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-orange-100
                      bg-white
                      p-2
                      text-slate-800
                      shadow-[0_20px_55px_rgba(57,28,18,0.20)]
                    "
                  >
                    {/* small arrow */}
                    <div
                      className="
                        absolute
                        left-1/2
                        top-[2px]
                        h-3
                        w-3
                        -translate-x-1/2
                        rotate-45
                        border-l
                        border-t
                        border-orange-100
                        bg-white
                      "
                    />

                    {item.dropdown.map((sub) => {
                      const subActive = isActive(sub.href);

                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setOpenDropdown(null)}
                          className={`
                            group/sub
                            relative
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            transition-all
                            duration-200

                            ${
                              subActive
                                ? "bg-[#fff3e8] text-[#b60f17]"
                                : "hover:bg-[#fff7ef] hover:text-[#b60f17]"
                            }
                          `}
                        >
                          <span
                            className={`
                              h-2
                              w-2
                              rounded-full

                              ${
                                subActive
                                  ? "bg-[#b60f17]"
                                  : "bg-[#f0b13c] group-hover/sub:bg-[#b60f17]"
                              }
                            `}
                          />

                          {sub.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* =========================================
          MOBILE NAVBAR
      ========================================== */}

      <nav
        className="
          bg-gradient-to-r
          from-[#951c12]
          via-[#b60f17]
          to-[#df5b00]
          text-white
          shadow-lg
          lg:hidden
        "
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile branding */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex min-w-0 items-center gap-3"
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-full
                border-2
                border-[#ffd34e]
                bg-white
                p-[2px]
                shadow-md
              "
            >
              <img
                src="/logo.png"
                alt="CDIC logo"
                className="h-full w-full rounded-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <div className="text-[17px] font-extrabold tracking-wide">
                CDIC
              </div>

              <div className="max-w-[190px] truncate text-[10px] font-medium text-white/80">
                Smt. Champi Devi Inter College
              </div>
            </div>
          </Link>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/25
              bg-white/10
              shadow-inner
              transition-all
              duration-300
              hover:bg-white/20
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-white
            "
          >
            {mobileOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>
        </div>

        {/* =========================================
            MOBILE MENU
        ========================================== */}

        <div
          className={`
            overflow-hidden
            bg-[#fffaf5]
            text-slate-800
            transition-all
            duration-500

            ${
              mobileOpen
                ? "max-h-[900px] border-t border-white/10"
                : "max-h-0"
            }
          `}
        >
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {menuItems.map((item) => {
                const Icon = item.icon;

                /* mobile normal link */

                if (!item.dropdown) {
                  const active = isActive(item.href!);

                  return (
                    <Link
                      key={item.title}
                      href={item.href!}
                      onClick={closeMenu}
                      className={`
                        group
                        flex
                        min-h-[72px]
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        p-3
                        shadow-[0_5px_16px_rgba(50,35,25,0.06)]
                        transition-all
                        duration-300

                        ${
                          active
                            ? "border-[#f4c15a] bg-[#fff0de] text-[#b60f17]"
                            : "border-[#f2ddc5] bg-white hover:-translate-y-0.5 hover:border-[#f4c15a]"
                        }
                      `}
                    >
                      <span
                        className={`
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          shadow-sm

                          ${
                            active
                              ? "bg-[#b60f17] text-white"
                              : "bg-gradient-to-br from-[#b60f17] to-[#df5b00] text-white"
                          }
                        `}
                      >
                        <Icon size={19} />
                      </span>

                      <span className="text-[13px] font-bold leading-tight">
                        {item.title}
                      </span>
                    </Link>
                  );
                }

                /* mobile dropdown */

                const open = openDropdown === item.title;
                const active = isDropdownActive(item.dropdown);

                return (
                  <div
                    key={item.title}
                    className="col-span-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown(
                          open ? null : item.title
                        )
                      }
                      aria-expanded={open}
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        p-3
                        text-left
                        shadow-[0_5px_16px_rgba(50,35,25,0.06)]
                        transition-all

                        ${
                          open || active
                            ? "border-[#f4c15a] bg-[#fff0de] text-[#b60f17]"
                            : "border-[#f2ddc5] bg-white"
                        }
                      `}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-gradient-to-br
                            from-[#b60f17]
                            to-[#df5b00]
                            text-white
                            shadow-sm
                          "
                        >
                          <Icon size={19} />
                        </span>

                        <span className="text-[13px] font-bold">
                          {item.title}
                        </span>
                      </span>

                      <ChevronDown
                        size={18}
                        className={`
                          transition-transform
                          duration-300
                          ${open ? "rotate-180" : ""}
                        `}
                      />
                    </button>

                    {/* Mobile dropdown links */}
                    <div
                      className={`
                        overflow-hidden
                        transition-all
                        duration-300

                        ${
                          open
                            ? "max-h-[400px] opacity-100"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >
                      <div
                        className="
                          mt-2
                          space-y-1
                          rounded-2xl
                          border
                          border-orange-100
                          bg-white
                          p-2
                        "
                      >
                        {item.dropdown.map((sub) => {
                          const subActive = isActive(sub.href);

                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={closeMenu}
                              className={`
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                text-[13px]
                                font-semibold
                                transition

                                ${
                                  subActive
                                    ? "bg-[#fff0de] text-[#b60f17]"
                                    : "hover:bg-orange-50 hover:text-[#b60f17]"
                                }
                              `}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-[#e4a62e]" />

                              {sub.title}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom school message */}
            <div
              className="
                mt-4
                rounded-2xl
                border
                border-[#f4d48e]
                bg-gradient-to-r
                from-[#fff3c9]
                to-[#fff7e8]
                px-4
                py-3
                text-center
              "
            >
              <p className="text-[11px] font-bold tracking-wide text-[#8e3a14]">
                EDUCATION • DISCIPLINE • VALUES • CONFIDENCE
              </p>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}