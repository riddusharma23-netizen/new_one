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

  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          {!isAdminRoute ? <Navbar /> : null}

          {/* Har page ka content */}
          {children}

          {/* Footer */}
          {!isAdminRoute ? <Footer /> : null}
        </div>

      </body>
    </html>
  );
}
