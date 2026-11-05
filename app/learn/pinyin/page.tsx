import Link from "next/link";
import CurriculumOverview from "../../components/CurriculumOverview";
import PageHeading from "../../components/PageHeading";
import { pinyinCurriculum, pinyinFinalGroups, pinyinInitials } from "../../data/pinyinCurriculum";

export default function PinyinPage() {
  return (
    <div>
      <PageHeading
        eyebrow="ПИНЬИНЬ · 5 САБАҚ"
        title="Дыбыстан буынға дейін"
        description="Мандариннің дыбыстарын, бес тонды және буын құрау ережелерін ретімен меңгеріңіз."
        action={<Link href="/learn" className="inline-flex min-h-11 items-center rounded-lg border border-charcoal/15 px-4 text-sm font-semibold hover:border-terracotta/50">Модульдерге оралу</Link>}
      />
      <div className="mb-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-charcoal/10 bg-paper p-4"><p className="text-xs text-charcoal/55">Негізгі声母</p><p className="mt-1 text-lg font-semibold">{pinyinInitials.length} дыбыс</p></div>
        <div className="rounded-xl border border-charcoal/10 bg-paper p-4"><p className="text-xs text-charcoal/55">韵母 пішіні</p><p className="mt-1 text-lg font-semibold">{Object.values(pinyinFinalGroups).flat().length} түрі</p></div>
        <div className="rounded-xl border border-charcoal/10 bg-paper p-4"><p className="text-xs text-charcoal/55">Тон</p><p className="mt-1 text-lg font-semibold">4 + жеңіл тон</p></div>
      </div>
      <CurriculumOverview curriculum={pinyinCurriculum} basePath="/learn/pinyin" />
    </div>
  );
}
