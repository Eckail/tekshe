export default function Navbar() {
  return (
    <header className="border-b border-[#242321]/20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-12">
        <a href="#" className="text-2xl font-bold tracking-tight">
          TEKSHE<span className="text-[#B85F3D]">.</span>
        </a>

        <div className="hidden items-center gap-10 text-xs tracking-[0.15em] md:flex">
          <a href="#courses" className="hover:text-[#B85F3D]">
            КУРСТАР
          </a>
          <a href="#about" className="hover:text-[#B85F3D]">
            БІЗ ТУРАЛЫ
          </a>
        </div>

        <a
          href="#courses"
          className="border border-[#242321] px-5 py-3 text-xs tracking-widest transition hover:bg-[#242321] hover:text-[#F3EDE1]"
        >
          БАСТАУ ↗
        </a>
      </nav>
    </header>
  );
}
