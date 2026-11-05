import Link from "next/link";
import PageHeading from "../../components/PageHeading";
import { hsk1FoundationCurriculum } from "../../data/hsk1Foundation";
import HskLevelCatalog from "../../components/HskLevelCatalog";

export default function HskAcademyPage() {
  return (
    <div>
      <PageHeading
        eyebrow={`HSK · ${hsk1FoundationCurriculum.standard.version}`}
        title="HSK академиясы"
        description="Бұл нұсқа CLEC шығарған 2025 жылғы HSK емтихан бағдарламасына сүйенеді. Қазір тек нақты сабақ дерегі бар деңгей көрсетіледі."
        action={<Link href="/learn" className="inline-flex min-h-11 items-center rounded-lg border border-charcoal/15 px-4 text-sm font-semibold hover:border-terracotta/50">Модульдерге оралу</Link>}
      />
      <section className="mb-7 rounded-xl border border-charcoal/10 bg-sand/25 p-4 sm:p-5" aria-label="Қолданылған стандарт">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">ҚОЛДАНЫЛҒАН СТАНДАРТ</p>
        <h2 className="mt-2 font-semibold">{hsk1FoundationCurriculum.standard.name}</h2>
        <p className="mt-1 text-sm text-charcoal/60">Нұсқа {hsk1FoundationCurriculum.standard.version} · жарияланған {hsk1FoundationCurriculum.standard.publishedAt} · күшіне енген {hsk1FoundationCurriculum.standard.effectiveFrom}</p>
        <a href={hsk1FoundationCurriculum.standard.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-terracotta underline-offset-4 hover:underline">Ресми бағдарлама көзі <span className="sr-only">(жаңа терезеде ашылады)</span></a>
      </section>
      <HskLevelCatalog curriculum={hsk1FoundationCurriculum} />
    </div>
  );
}
