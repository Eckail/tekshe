import Link from "next/link";
import CurriculumOverview from "../../components/CurriculumOverview";
import PageHeading from "../../components/PageHeading";
import {
  pinyinCurriculum,
  pinyinFinalGroups,
  pinyinInitials,
} from "../../data/pinyinCurriculum";

export default function PinyinPage() {
  const stats = [
    {
      label: "Негізгі声母",
      value: `${pinyinInitials.length}`,
      suffix: "дыбыс",
    },
    {
      label: "韵母 пішіні",
      value: `${Object.values(pinyinFinalGroups).flat().length}`,
      suffix: "түрі",
    },
    {
      label: "Қытай тондары",
      value: "4 + 1",
      suffix: "тон",
    },
  ];

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="ПИНЬИНЬ · 5 САБАҚ"
        title="Дыбыстан буынға дейін"
        description="Мандариннің дыбыстарын, бес тонды және буын құрау ережелерін ретімен меңгеріңіз."
        action={
          <Link
            href="/learn"
            className="inline-flex min-h-11 items-center rounded-xl border border-border-soft bg-card px-4 text-sm font-semibold text-text-primary transition hover:border-blue/35 hover:bg-card-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            Модульдерге оралу
          </Link>
        }
      />

      <section
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        aria-label="Пиньинь курсының мазмұны"
      >
        {stats.map((stat, index) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm"
          >
            <p className="text-xs text-text-secondary">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-text-primary">
              {stat.value}
              <span className="ml-2 text-sm font-normal text-text-secondary">
                {stat.suffix}
              </span>
            </p>
            <div
              className={`mt-4 h-1.5 rounded-full ${
                index === 1 ? "bg-mint" : "bg-sky"
              }`}
            />
          </article>
        ))}
      </section>

      <CurriculumOverview
        curriculum={pinyinCurriculum}
        basePath="/learn/pinyin"
      />
    </div>
  );
}
