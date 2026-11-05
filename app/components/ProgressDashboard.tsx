"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import Achievements from "./Achievements";
import AppIcon from "./AppIcon";
import PageHeading from "./PageHeading";
import { learningSummaryStore } from "../data/learningSummary";
import { pinyinCurriculum } from "../data/pinyinCurriculum";
import { hsk1FoundationCurriculum } from "../data/hsk1Foundation";
import PlayerProgress from "./PlayerProgress";

function CourseProgress({ title, done, total, href }: { title: string; done: number; total: number; href: string }) {
  const percent = total ? Math.round((done / total) * 100) : 0;
  return (
    <Link href={href} className="block rounded-xl border border-charcoal/10 bg-paper p-4 transition-colors hover:border-terracotta/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta sm:p-5">
      <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-xs text-charcoal/60">{done} / {total} сабақ аяқталды</p></div><span className="text-sm font-semibold text-terracotta">{percent}%</span></div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-charcoal/10" role="progressbar" aria-label={`${title} барысы`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><div className="h-full bg-terracotta" style={{ width: `${percent}%` }} /></div>
    </Link>
  );
}

export default function ProgressDashboard() {
  const summary = useSyncExternalStore(learningSummaryStore.subscribe, learningSummaryStore.getSnapshot, learningSummaryStore.getServerSnapshot);
  return (
    <div className="space-y-9">
      <PageHeading eyebrow="ЖЕКЕ ОҚУ ЖУРНАЛЫ" title="Ілгерілеу" description="Көрсеткіштер браузерде сақталған нақты сабақ, жаттығу және марапат жазбаларынан алынады." />
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Оқу көрсеткіштері">
        <article className="rounded-xl border border-charcoal/10 bg-paper p-5"><p className="text-xs text-charcoal/55">Аяқталған сабақ</p><p className="mt-2 text-3xl font-semibold">{summary.completedPinyin.length + summary.completedHsk.length}</p></article>
        <article className="rounded-xl border border-charcoal/10 bg-paper p-5"><p className="text-xs text-charcoal/55">Сақталған жаттығу</p><p className="mt-2 text-3xl font-semibold">{summary.practiceCount}</p></article>
        <article className="rounded-xl border border-charcoal/10 bg-paper p-5"><p className="text-xs text-charcoal/55">Tek Coin балансы</p><p className="mt-2 text-3xl font-semibold">{summary.coinBalance}</p><p className="mt-1 text-xs text-charcoal/55">Оқу марапаттары бөлек әмиян журналында.</p></article>
      </section>
      <PlayerProgress />
      <section aria-labelledby="course-progress-title">
        <div className="mb-4"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">БАҒДАРЛАМАЛАР</p><h2 id="course-progress-title" className="mt-2 text-section-title font-semibold">Курс барысы</h2></div>
        <div className="grid gap-3 lg:grid-cols-2">
          <CourseProgress title="Пиньинь негіздері" done={summary.completedPinyin.length} total={pinyinCurriculum.lessons.length} href="/learn/pinyin" />
          <CourseProgress title="HSK 1 бастау курсы" done={summary.completedHsk.length} total={hsk1FoundationCurriculum.lessons.length} href="/learn/hsk" />
        </div>
      </section>
      <section className="flex flex-col gap-4 rounded-xl border border-charcoal/10 bg-steppe/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-steppe">КҮНДЕЛІКТІ ТІЗБЕК</p><h2 className="mt-2 font-semibold">Тізбек санағы қосылмаған</h2><p className="mt-1 max-w-xl text-sm leading-6 text-charcoal/65">Қазіргі бет нақты XP деңгейін және курс барысын көрсетеді. Күнделікті белсенділік тізбегін есептеу әзірге іске асырылмаған.</p></div>
        <AppIcon name="clock" className="hidden h-8 w-8 shrink-0 text-steppe sm:block" />
      </section>
      <Achievements />
    </div>
  );
}
