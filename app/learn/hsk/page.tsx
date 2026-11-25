
import Link from "next/link";
import PageHeading from "../../components/PageHeading";
import { hsk1FoundationCurriculum } from "../../data/hsk1Foundation";
import HskLevelCatalog from "../../components/HskLevelCatalog";

export default function HskAcademyPage() {
  const standard = hsk1FoundationCurriculum.standard;

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow={`HSK · ${standard.version}`}
        title="HSK академиясы"
        description="Қытай тілін халықаралық емтихан стандарты бойынша жүйелі меңгеріңіз. Қазір тек нақты оқу материалы бар деңгей көрсетіледі."
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
        className="relative isolate overflow-hidden rounded-card border border-border-soft bg-card-soft p-5 shadow-card sm:p-7"
        aria-label="Қолданылған стандарт"
      >
        <div
          className="pointer-events-none absolute -right-10 -top-16 -z-10 h-52 w-52 rounded-full bg-mint/20 blur-3xl"
          aria-hidden="true"
        />

        <p className="text-[10px] font-semibold tracking-[0.18em] text-blue-dark">
          ҚОЛДАНЫЛҒАН СТАНДАРТ
        </p>

        <h2 className="mt-3 max-w-2xl text-lg font-semibold leading-snug text-text-primary sm:text-xl">
          {standard.name}
        </h2>

        <p className="mt-3 text-xs leading-6 text-text-secondary sm:text-sm">
          Нұсқа {standard.version}
          {standard.publishedAt
            ? ` · жарияланған ${standard.publishedAt}`
            : ""}
          {standard.effectiveFrom
            ? ` · күшіне енген ${standard.effectiveFrom}`
            : ""}
        </p>

        {standard.sourceUrl && (
          <a
            href={standard.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue-dark underline-offset-4 transition hover:underline"
          >
            Ресми бағдарлама көзі
            <span className="sr-only">(жаңа терезеде ашылады)</span>
          </a>
        )}
      </section>

      <HskLevelCatalog curriculum={hsk1FoundationCurriculum} />
    </div>
  );
}
