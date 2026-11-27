import PageHeading from "../components/PageHeading";
import LearningCenter from "../components/LearningCenter";
import { pinyinCurriculum } from "../data/pinyinCurriculum";
import { hsk1FoundationCurriculum } from "../data/hsk1Foundation";
import LearningPath from "../components/LearningPath";
import Link from "next/link";

export default function LearningPage() {
  return (
    <div>
      <PageHeading eyebrow="ОҚУ ОРТАЛЫҒЫ" title="Қолжетімді сабақтар" description="Курс материалдары дайын модульдерден бастаңыз. Әр сабақ өз бетінде ашылады." />
      <LearningCenter pinyin={pinyinCurriculum} hsk={hsk1FoundationCurriculum} />
      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href="/learn/hsk" className="rounded-2xl border border-border-soft bg-card p-4 shadow-card transition hover:bg-ice focus-visible:outline-2 focus-visible:outline-blue sm:p-5">
          <p className="text-xs font-semibold tracking-[0.15em] text-blue-dark">HSK 1 · U01</p>
          <h2 className="mt-2 text-base font-semibold text-text-primary">Жеке ақпарат және алғашқы кездесу</h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">Бірінші сабақтан бастап негізгі жолмен үйрен.</p>
        </Link>
        <Link href="/learn/modules" className="rounded-2xl border border-border-soft bg-card p-4 shadow-card transition hover:bg-ice focus-visible:outline-2 focus-visible:outline-blue sm:p-5">
          <p className="text-xs font-semibold tracking-[0.15em] text-mint-dark">ЕРКІН ОҚУ</p>
          <h2 className="mt-2 text-base font-semibold text-text-primary">Тәуелсіз модульдер</h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">Пиньинь, сөздік, грамматика және төрт дағдыны жеке аш.</p>
        </Link>
      </section>
      <div className="mt-12">
        <LearningPath />
      </div>
    </div>
  );
}
