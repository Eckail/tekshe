const courses = [
  {
    number: "01",
    title: "拼音与声调",
    subtitle: "PINYIN & TONES",
    description: "从发音开始，掌握汉语的声音与节奏。",
    symbol: "声",
    href: "#pinyin-basics",
  },
  {
    number: "02",
    title: "词汇与汉字",
    subtitle: "WORDS & CHARACTERS",
    description: "认识汉字，积累日常生活中的基础词汇。",
    symbol: "字",
    href: "#first-words",
  },
  {
    number: "03",
    title: "日常对话",
    subtitle: "DAILY CONVERSATION",
    description: "从简单问候开始，逐渐建立中文表达能力。",
    symbol: "说",
    href: "#simple-sentences",
  },
];

export default function Courses() {
  return (
    <section
      id="courses"
      className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mb-16 grid gap-8 md:grid-cols-2">
        <div>
          <p className="mb-5 text-xs tracking-[0.3em] text-terracotta">
            01 — БІЛІМ БЕРУ ЖҮЙЕСІ
          </p>

          <h2 className="text-4xl font-medium leading-tight md:text-6xl">
            Кішкентай
            <br />
            қадамдар.
            <br />
            <span className="text-terracotta">Үлкен нәтижелер.</span>
          </h2>
        </div>

        <div className="flex items-end">
          <p className="max-w-sm text-sm leading-8 text-charcoal/70">
            Әр курс нақты бір дағдыны дамытуға арналған.
            Қарапайым сабақтардан бастап, біртіндеп
            қытай тілін меңгер.
          </p>
        </div>
      </div>

      <div className="grid border-l border-t border-charcoal/20 md:grid-cols-3">
        {courses.map((course) => (
          <article
            key={course.number}
            className="group border-b border-r border-charcoal/20 p-7 transition hover:bg-paper-alt md:p-9"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs tracking-widest text-terracotta">
                {course.number}
              </span>

              <span className="text-5xl font-light transition group-hover:text-terracotta">
                {course.symbol}
              </span>
            </div>

            <div className="mt-16">
              <p className="mb-3 text-[10px] tracking-[0.2em] text-charcoal/55">
                {course.subtitle}
              </p>

              <h3 className="text-2xl font-medium">
                {course.title}
              </h3>

              <p className="mt-5 min-h-16 text-sm leading-7 text-charcoal/70">
                {course.description}
              </p>

              <a
                href={course.href}
                className="mt-8 inline-block text-sm text-terracotta"
              >
                КУРСТЫ ҚАРАУ ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
