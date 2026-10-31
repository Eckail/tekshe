
const courses = [
  {
    number: "01",
    title: "拼音与声调",
    subtitle: "PINYIN & TONES",
    description: "从发音开始，掌握汉语的声音与节奏。",
    symbol: "声",
  },
  {
    number: "02",
    title: "词汇与汉字",
    subtitle: "WORDS & CHARACTERS",
    description: "认识汉字，积累日常生活中的基础词汇。",
    symbol: "字",
  },
  {
    number: "03",
    title: "日常对话",
    subtitle: "DAILY CONVERSATION",
    description: "从简单问候开始，逐渐建立中文表达能力。",
    symbol: "说",
  },
];


function BauhausArtwork() {
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


export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F3EDE1] text-[#242321]">

      {/* Navigation */}
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

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-12 md:py-28">

        <div>
          <p className="mb-8 text-xs tracking-[0.3em] text-[#B85F3D]">
            ҚАЗАҚ ТІЛІНДЕ · 中文学习
          </p>

          <h1 className="max-w-xl text-5xl font-medium leading-[1.1] tracking-tight md:text-7xl">
  Тілімнің шегі —
  <br />
  <span className="text-[#B85F3D]">
    әлемімнің шегі.
  </span>
</h1>

          <div className="my-10 h-px w-20 bg-[#242321]" />

          <p className="max-w-md text-base leading-8 text-[#6E685F]">
            Қытай тілін нөлден бастап үйрен.
            Пиньинь, сөздер және күнделікті диалогтар.
            Барлығы бір жерде.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#courses"
              className="bg-[#B85F3D] px-8 py-4 text-sm text-white transition hover:bg-[#98482D]"
            >
              ОҚУДЫ БАСТАУ ↗
            </a>

            <span className="text-xs tracking-widest text-[#6E685F]">
              БІРІНШІ ҚАДАМ · 你好
            </span>
          </div>
        </div>

        <div className="relative">
          <BauhausArtwork />
        </div>
      </section>

      {/* Introduction strip */}
      <section className="border-y border-[#242321]/20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-7 text-xs tracking-[0.2em] md:flex-row md:px-12">
          <span>01 / ТІЛ</span>
          <span>02 / МӘДЕНИЕТ</span>
          <span>03 / БІЛІМ</span>
          <span className="text-[#B85F3D]">LEARN SOMETHING NEW ↗</span>
        </div>
      </section>

      {/* Courses */}
      <section
        id="courses"
        className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32"
      >
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-5 text-xs tracking-[0.3em] text-[#B85F3D]">
              01 — БІЛІМ БЕРУ ЖҮЙЕСІ
            </p>

            <h2 className="text-4xl font-medium leading-tight md:text-6xl">
              Кішкентай
              <br />
              қадамдар.
              <br />
              <span className="text-[#B85F3D]">Үлкен нәтижелер.</span>
            </h2>
          </div>

          <div className="flex items-end">
            <p className="max-w-sm text-sm leading-8 text-[#6E685F]">
              Әр курс нақты бір дағдыны дамытуға арналған.
              Қарапайым сабақтардан бастап, біртіндеп
              қытай тілін меңгер.
            </p>
          </div>
        </div>

        <div className="grid border-l border-t border-[#242321]/20 md:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.number}
              className="group border-b border-r border-[#242321]/20 p-7 transition hover:bg-[#EAE2D5] md:p-9"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs tracking-widest text-[#B85F3D]">
                  {course.number}
                </span>

                <span className="text-5xl font-light transition group-hover:text-[#B85F3D]">
                  {course.symbol}
                </span>
              </div>

              <div className="mt-16">
                <p className="mb-3 text-[10px] tracking-[0.2em] text-[#8A8175]">
                  {course.subtitle}
                </p>

                <h3 className="text-2xl font-medium">
                  {course.title}
                </h3>

                <p className="mt-5 min-h-16 text-sm leading-7 text-[#6E685F]">
                  {course.description}
                </p>

                <a
                  href="#about"
                  className="mt-8 inline-block text-sm text-[#B85F3D]"
                >
                  КУРСТЫ ҚАРАУ ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="bg-[#242321] px-6 py-24 text-[#F3EDE1] md:px-12 md:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
          <div>
            <p className="mb-6 text-xs tracking-[0.3em] text-[#C77A5B]">
              02 — БІЗ ТУРАЛЫ
            </p>

            <h2 className="text-4xl font-medium leading-tight md:text-6xl">
              Тіл үйрену —
              <br />
              жаңа әлемге
              <br />
              <span className="text-[#C77A5B]">жол ашу.</span>
            </h2>
          </div>

          <div className="flex items-end">
            <p className="max-w-md text-sm leading-8 text-[#BDB6AA]">
              Tekshe — қазақ тілінде қытай тілін үйренуге
              арналған білім беру платформасы.
              Біздің мақсатымыз — күрделі нәрсені
              қарапайым әрі қызықты ету.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs tracking-wider text-[#6E685F] md:flex-row">
          <span className="font-bold text-[#242321]">TEKSHE.</span>
          <span>Қытай тілін бірге үйренейік.</span>
          <span>© 2026 TEKSHE</span>
        </div>
      </footer>
    </main>
  );
}
