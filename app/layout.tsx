import "./globals.css";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isTimetableRoute = pathname === "/schedules" || pathname.startsWith("/schedules/");

  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          {!isAdminRoute && !isTimetableRoute ? <Navbar /> : null}

          {/* Har page ka content */}
          {children}

          {/* Footer */}
          {!isAdminRoute && !isTimetableRoute ? <Footer /> : null}
        </div>

      </body>
    </html>
  );
}
