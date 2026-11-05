import Link from "next/link";
import { notFound } from "next/navigation";
import CurriculumOverview from "../../../components/CurriculumOverview";
import PageHeading from "../../../components/PageHeading";
import { hsk1FoundationCurriculum } from "../../../data/hsk1Foundation";

type Props = { params: Promise<{ level: string }> };

export function generateStaticParams() {
  return hsk1FoundationCurriculum.levels.map(({ id }) => ({ level: id }));
}

export default async function HskLevelPage({ params }: Props) {
  const { level: levelId } = await params;
  const level = hsk1FoundationCurriculum.levels.find(({ id }) => id === levelId);
  if (!level) notFound();
  const words = hsk1FoundationCurriculum.vocabulary.filter((entry) => entry.levelId === level.id);

  return (
    <div>
      <PageHeading eyebrow={`HSK · ${hsk1FoundationCurriculum.standard.version}`} title={`${level.displayName} · бастау курсы`} description="Бұл — ресми сөздік тізімнен алынған шағын бастау бөлігі; толық деңгей курсы емес." action={<Link href="/learn/hsk" className="inline-flex min-h-11 items-center rounded-lg border border-charcoal/15 px-4 text-sm font-semibold hover:border-terracotta/50">HSK академиясына оралу</Link>} />
      <div className="mb-7 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-charcoal/10 bg-paper p-4"><p className="text-xs text-charcoal/55">Осы курста бар сөз</p><p className="mt-1 text-xl font-semibold">{words.length}</p></div>
        <div className="rounded-xl border border-charcoal/10 bg-paper p-4"><p className="text-xs text-charcoal/55">Деңгейдегі нақты сабақ</p><p className="mt-1 text-xl font-semibold">{hsk1FoundationCurriculum.lessons.filter((lesson) => lesson.levelId === level.id).length}</p></div>
      </div>
      <CurriculumOverview curriculum={hsk1FoundationCurriculum} basePath={`/learn/hsk/${level.id}`} levelId={level.id} />
    </div>
  );
}
