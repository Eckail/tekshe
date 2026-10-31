import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Courses from "./components/Courses";
import About from "./components/About";
import Footer from "./components/Footer";


export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F3EDE1] text-[#242321]">

     <Navbar />

      <Hero />

     

      {/* Introduction strip */}
      <section className="border-y border-[#242321]/20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-7 text-xs tracking-[0.2em] md:flex-row md:px-12">
          <span>01 / ТІЛ</span>
          <span>02 / МӘДЕНИЕТ</span>
          <span>03 / БІЛІМ</span>
          <span className="text-[#B85F3D]">LEARN SOMETHING NEW ↗</span>
        </div>
      </section>

      <Courses />

      <About />

      <Footer />
      
    </main>
  );
}
