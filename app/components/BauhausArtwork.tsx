export default function BauhausArtwork() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-xl border border-[#242321]/10 bg-[#F3EDE1] p-4 shadow-sm">

      {/* Large geometric forms */}
      <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#B85F3D] opacity-95 transition-transform duration-700 hover:scale-105" />

      <div className="absolute bottom-6 left-3 h-52 w-20 bg-[#242321]" />

      {/* Topological curves */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-[120%] w-[120%] rounded-full border border-dashed border-[#242321]/20" />

      <div className="pointer-events-none absolute -left-20 -top-20 h-[120%] w-[120%] rounded-full border border-[#242321]/10" />

      {/* Asymmetric structural axes */}
      <div className="absolute left-[42%] top-0 h-full w-px bg-[#242321]/20" />

      <div className="absolute left-0 top-[58%] h-px w-full bg-[#242321]/20" />

      {/* Interlocking circles */}
      <div className="absolute bottom-16 right-10 h-36 w-36 rounded-full border-2 border-[#242321] bg-[#F3EDE1] shadow-inner" />

      <div className="absolute bottom-24 right-2 h-20 w-20 rounded-full border border-[#B85F3D]/60" />

      {/* Offset typography */}
      <div className="pointer-events-none absolute left-[42.5%] top-[58.5%] -translate-x-1/2 -translate-y-1/2 select-none text-9xl font-bold tracking-tighter text-[#B85F3D]/20 mix-blend-multiply">
        学
      </div>

      <div className="absolute left-[42%] top-[58%] -translate-x-1/2 -translate-y-1/2 select-none text-9xl font-semibold tracking-tighter text-[#242321] transition-transform duration-500 hover:rotate-3">
        学
      </div>

      {/* Editorial labels */}
      <div className="absolute left-4 top-4 font-mono text-[9px] tracking-[0.4em] text-[#242321]/60">
        STRUCT. 001 / TOPOLOGY
      </div>

      <div className="absolute bottom-4 right-4 font-mono text-[9px] tracking-[0.3em] text-[#242321]/60">
        TEKSHE ARCHIVE © 2026
      </div>

      {/* Accent */}
      <div className="absolute left-8 top-1/3 h-2 w-2 rounded-full bg-[#B85F3D]" />
    </div>
  );
}
