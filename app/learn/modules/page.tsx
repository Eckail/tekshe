import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeading from "../../components/PageHeading";
import { curriculumRepository } from "../../data/curriculumRepository";
import { U01_RELEASE_ID } from "../../data/u01Curriculum";

const labels = {
  pinyin: "Пиньинь",
  character: "Иероглифтер",
  vocabulary: "Сөздік",
  grammar: "Грамматика",
  listening: "Тыңдау",
  speaking: "Сөйлеу",
  reading: "Оқу",
  writing: "Жазу",
} as const;

export default function IndependentModulesPage() {
  const release = curriculumRepository.getRelease(U01_RELEASE_ID);
  if (!release) notFound();
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="ЕРКІН ОҚУ" title="Тәуелсіз модульдер" description="Кез келген білім нүктесін ашып үйрен. Мұнда жинаған дәлелдерің U01 негізгі жолындағы сәйкес нүктелермен байланысады." />
      <section className="rounded-2xl border border-warning/30 bg-warning-bg/60 p-4 text-sm leading-6 text-warning">
        U01 — редакциялық draft үлгісі. Қазақша түсіндірмелер мен оқу мысалдары ана тілді немесе маман тексеруінен кейін ғана жарияланады.
      </section>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {release.independentModules.map((module) => {
          const blocks = module.contentBlockIds.map((id) => release.contentBlocks.find((item) => item.id === id)).filter(Boolean);
          const exercises = module.exerciseIds.map((id) => release.exercises.find((item) => item.id === id)).filter(Boolean);
          const available = module.status === "available" && (blocks.length > 0 || exercises.length > 0);
          return (
            <article key={module.id} className="flex min-h-[220px] flex-col rounded-2xl border border-border-soft bg-card p-4 shadow-card sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-full bg-mint/45 px-3 py-1.5 text-xs font-semibold text-mint-dark">{labels[module.kind]}</span>
                <span className={"rounded-full px-2.5 py-1 text-[10px] font-semibold " + (available ? "bg-ice text-blue-dark" : "bg-card-soft text-text-secondary")}>{available ? "U01 draft материалы" : "Құрылыста"}</span>
              </div>
              <h2 className="mt-4 text-base font-semibold leading-6 text-text-primary">{module.titleKazakh}</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{module.descriptionKazakh}</p>
              <div className="mt-auto pt-5">
                {available
                  ? <Link href={"/learn/modules/" + module.id} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Модульді ашу</Link>
                  : <p className="rounded-xl bg-card-soft px-3 py-3 text-center text-sm text-text-secondary">Материал әзірге жоқ.</p>}
              </div>
            </article>
          );
        })}
      </div>
      <Link href={"/learn/hsk/" + release.path.levelId + "/units/" + release.units[0].id} className="inline-flex min-h-11 items-center rounded-xl border border-blue/25 bg-ice px-4 text-sm font-semibold text-blue-dark focus-visible:outline-2 focus-visible:outline-blue">U01 құрылымдық жолына өту</Link>
    </div>
  );
}
