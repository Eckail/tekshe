"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import AppIcon from "./AppIcon";
import DailyQuests from "./DailyQuests";
import PageHeading from "./PageHeading";
import TekCoinMark from "./TekCoinMark";
import { learningSummaryStore } from "../data/learningSummary";

function DashboardLink({ href, title, description, icon }: { href: string; title: string; description: string; icon: "book" | "practice" | "progress" | "wallet" }) {
  return (
    <Link href={href} className="group flex min-h-[132px] flex-col rounded-xl border border-charcoal/10 bg-paper p-4 transition-colors hover:border-terracotta/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta sm:p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream text-charcoal"><AppIcon name={icon} className="h-[18px] w-[18px]" /></span>
      <span className="mt-4 font-semibold text-charcoal group-hover:text-terracotta">{title}</span>
      <span className="mt-1 text-xs leading-5 text-charcoal/60">{description}</span>
    </Link>
  );
}

export default function DashboardHome() {
  const summary = useSyncExternalStore(
    learningSummaryStore.subscribe,
    learningSummaryStore.getSnapshot,
    learningSummaryStore.getServerSnapshot
  );
  const goalPercent = Math.min(summary.todayLessons, 1) * 100;

  return (
    <div className="space-y-9">
      <PageHeading
        eyebrow="TEKSHE · ҚЫТАЙ ТІЛІН ҮЙРЕНУ"
        title="Сәлем, оқушы."
        description="Келесі шағын қадамды таңдаңыз. Сабақ барысы мен Tek Coin осы құрылғыда сақталады."
      />

      <section className="grid gap-4 lg:grid-cols-[1.45fr_0.8fr]" aria-label="Жалғастыру және бүгінгі оқу мақсаты">
        <div className="relative isolate overflow-hidden rounded-2xl bg-charcoal p-5 text-cream sm:p-7 lg:min-h-[260px] lg:p-9">
          <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-64 w-64 rounded-full border border-cream/10" aria-hidden="true" />
          <div className="pointer-events-none absolute right-10 top-0 -z-10 h-full w-px bg-cream/10" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/65">ЖАЛҒАСТЫРУ · {summary.lastModuleLabel}</p>
          <h2 className="mt-5 max-w-xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{summary.continueTitle}</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-cream/70">Алдыңғы ашқан модульге қайтыңыз немесе қолжетімді келесі сабақтан бастаңыз.</p>
          <Link href={summary.continueHref} className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-lg bg-terracotta px-5 text-sm font-semibold text-white transition-colors hover:bg-steppe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Оқуды жалғастыру <AppIcon name="arrow" className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-paper p-5 sm:p-7">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">БҮГІНГІ МАҚСАТ</p>
            <h2 className="mt-3 text-xl font-semibold">Бір сабақ оқу</h2>
            <p className="mt-2 text-sm text-charcoal/60">Жеңіл ырғақпен күн сайын жалғастырыңыз.</p>
          </div>
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-sm"><span className="text-charcoal/65">Бүгін аяқталған сабақ</span><span className="font-semibold">{Math.min(summary.todayLessons, 1)} / 1</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-charcoal/10" role="progressbar" aria-label="Бүгінгі оқу мақсаты" aria-valuemin={0} aria-valuemax={1} aria-valuenow={Math.min(summary.todayLessons, 1)}>
              <div className="h-full bg-steppe transition-[width]" style={{ width: `${goalPercent}%` }} />
            </div>
            <p className="mt-3 text-xs text-charcoal/55">{goalPercent ? "Мақсат орындалды." : "Алғашқы сабақты аяқтағанда орындалады."}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Оқу ақпараты">
        <article className="flex min-h-[120px] items-start gap-3 rounded-xl border border-charcoal/10 bg-paper p-4 sm:p-5">
          <TekCoinMark className="h-9 w-9 text-base" />
          <div><p className="text-xs text-charcoal/55">Tek Coin</p><p className="mt-1 text-2xl font-semibold">{new Intl.NumberFormat("kk-KZ").format(summary.coinBalance)}</p><Link href="/wallet" className="mt-1 inline-block text-xs font-medium text-terracotta underline-offset-4 hover:underline">Әмиянды ашу</Link></div>
        </article>
        <article className="min-h-[120px] rounded-xl border border-charcoal/10 bg-paper p-4 sm:p-5">
          <p className="text-xs text-charcoal/55">Ішкі XP деңгейі</p><p className="mt-2 font-semibold">{summary.progressLevel}. деңгей · {summary.progressLevelTitle}</p><p className="mt-1 text-xs leading-5 text-charcoal/55">Бұл HSK біліктілік деңгейі емес. HSK 1 бастау курсы қолжетімді.</p>
        </article>
        <article className="min-h-[120px] rounded-xl border border-charcoal/10 bg-paper p-4 sm:p-5">
          <p className="text-xs text-charcoal/55">Оқу тізбегі</p><p className="mt-2 text-xl font-semibold">Әзірге есептелмейді</p><p className="mt-1 text-xs leading-5 text-charcoal/55">Тізбек санағы келесі кезеңде қосылады.</p>
        </article>
      </section>

      <section aria-labelledby="quick-access-title">
        <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">ЖЫЛДАМ ӨТУ</p><h2 id="quick-access-title" className="mt-2 text-section-title font-semibold">Оқу аймағы</h2></div><Link href="/learn" className="min-h-11 inline-flex items-center gap-2 text-sm font-semibold text-charcoal hover:text-terracotta">Барлық модуль <AppIcon name="arrow" className="h-4 w-4" /></Link></div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <DashboardLink href="/learn" title="Оқу орталығы" description="Пиньинь және қолжетімді HSK сабақтары" icon="book" />
          <DashboardLink href="/practice" title="Жаттығу" description="Қолжетімді сөз, сөйлем және тыңдалым тесттері" icon="practice" />
          <DashboardLink href="/progress" title="Ілгерілеу" description={`${summary.practiceCount} сақталған жаттығу нәтижесі`} icon="progress" />
          <DashboardLink href="/wallet" title="Tek әмияны" description={`${summary.totalCoinsEarned} Tek Coin табылды`} icon="wallet" />
        </div>
      </section>

      <DailyQuests />
    </div>
  );
}
