import HeroSlider from "@/components/Heroslider";
import FeatureCards from "@/components/FeatureCards";
import About from "@/components/about";
import WhyChooseUs from "@/components/WhyChooseUs";
// import Department from "@/components/Department";
import StudentSays from "@/components/StudentSays";
// import BlogSection from "@/components/BlogSection";
// import Footer from "@/components/Footer";

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  animationDelay: `${i * 0.5}s`,
}));

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-blob bg-blob1"></div>
        <div className="bg-blob bg-blob2"></div>
        <div className="bg-blob bg-blob3"></div>

        {particles.map((particle) => (
          <span
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              animationDelay: particle.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20">
        <HeroSlider />
        <FeatureCards />
        <About />
        <WhyChooseUs />
        
        {/* <Department /> */}
        {/* <FuturePlansPage /> */}
        {/* <FuturePlans /> */}
        {/* <Services /> */}

        <StudentSays />

        {/* <BlogSection /> */}

        {/* <Footer /> */}
      </div>
    </main>
  );
}