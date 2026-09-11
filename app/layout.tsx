import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <Navbar />

          {/* Har page ka content */}
          {children}

          {/* Footer */}
          <Footer />
        </div>

      </body>
    </html>
  );
}
