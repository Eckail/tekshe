export default function Navbar() {
  return (
    <header className="border-b border-charcoal/20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-12">
        <a href="#" className="text-2xl font-bold tracking-tight">
          TEKSHE<span className="text-terracotta">.</span>
        </a>

        <div className="hidden items-center gap-10 text-xs tracking-[0.15em] md:flex">
          <a href="#courses" className="hover:text-terracotta">
            КУРСТАР
          </a>
          <a href="#about" className="hover:text-terracotta">
            БІЗ ТУРАЛЫ
          </a>
        </div>

        <a
          href="#courses"
          className="border border-charcoal px-5 py-3 text-xs tracking-widest transition hover:bg-charcoal hover:text-cream"
        >
          БАСТАУ ↗
        </a>
      </nav>
    </header>
  );
}
