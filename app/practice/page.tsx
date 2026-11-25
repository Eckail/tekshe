import Link from "next/link";
import PageHeading from "../components/PageHeading";

export default function PracticePage() {
  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="ЖАТТЫҒУ"
        title="Білімді бекіту"
        description="Үйренген дыбыстар мен сөздерді жаттығу арқылы бекітіңіз."
      />

      <section className="rounded-card border border-border-soft bg-card p-6 shadow-card sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">
          Оқу модулін таңдаңыз
        </h2>

        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Қайталағыңыз келетін оқу бағытын таңдаңыз.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/learn/pinyin"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue/20 bg-blue px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-dark active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            Пиньинь курсы
          </Link>

          <Link
            href="/learn/hsk"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border-soft bg-card-soft px-5 text-sm font-semibold text-text-primary transition-all duration-200 hover:border-blue/40 hover:bg-ice active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            HSK 1 курсы
          </Link>
        </div>
      </section>
    </div>
  );
}
