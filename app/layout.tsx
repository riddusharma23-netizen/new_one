import "./globals.css";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransitionShell from "@/components/PageTransitionShell";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isTimetableRoute = pathname === "/schedules" || pathname.startsWith("/schedules/");

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <PageTransitionShell>
          {!isAdminRoute && !isTimetableRoute ? <Navbar /> : null}

          {/* Har page ka content */}
          {children}

          {/* Footer */}
          {!isAdminRoute && !isTimetableRoute ? <Footer /> : null}
        </PageTransitionShell>

      </body>
    </html>
  );
}
