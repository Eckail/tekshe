"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import AppIcon from "./AppIcon";
import DailyQuests from "./DailyQuests";
import LearnerAvatar from "./LearnerAvatar";
import PageHeading from "./PageHeading";
import { learningSummaryStore } from "../data/learningSummary";

type DashboardIcon = "book" | "practice" | "progress" | "wallet";

function DashboardLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: DashboardIcon;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[148px] flex-col rounded-2xl bg-paper p-4 ring-1 ring-charcoal/5 transition duration-200 hover:-translate-y-0.5 hover:ring-terracotta/30 hover:shadow-[0_12px_30px_rgba(36,35,33,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta sm:p-5"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-charcoal transition-colors group-hover:bg-charcoal group-hover:text-cream">
        <AppIcon name={icon} className="h-[18px] w-[18px]" />
      </span>
      <span className="mt-4 font-semibold text-charcoal">{title}</span>
      <span className="mt-1 text-xs leading-5 text-charcoal/60">{description}</span>
      <AppIcon name="arrow" className="mt-auto hidden h-4 w-4 self-end text-terracotta sm:block" />
    </Link>
  );
}

export default function DashboardHome() {
  const summary = useSyncExternalStore(
    learningSummaryStore.subscribe,
    learningSummaryStore.getSnapshot,
    learningSummaryStore.getServerSnapshot
  );
  const goal = summary.dailyGoalLessons;
  const completedToday = Math.min(summary.todayLessons, goal);
  const goalPercent = Math.round((completedToday / goal) * 100);

  return (
    <div className="space-y-9 pb-2 sm:space-y-10">
      <PageHeading
        eyebrow="TEKSHE · ОҚУ КАБИНЕТІ"
        title={`Сәлем, ${summary.learnerProfile.nickname}.`}
        description="Қытай тілін қазақ тілінде, қадам-қадаммен үйреніңіз. Келесі шағын қадам өз қарқыныңызбен жалғасады."
        action={
          <Link
            href="/profile"
            className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-paper px-3.5 text-sm font-semibold text-charcoal ring-1 ring-charcoal/8 transition hover:ring-terracotta/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <LearnerAvatar
              avatarId={summary.learnerProfile.avatarId}
              nickname={summary.learnerProfile.nickname}
              className="h-8 w-8 rounded-xl text-sm"
            />
            <span>Профиль</span>
          </Link>
        }
      />

      <section
        className="grid gap-4 lg:grid-cols-[1.45fr_0.8fr]"
        aria-label="Жалғастыру және бүгінгі оқу мақсаты"
      >
        <div className="relative isolate flex min-h-[310px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-charcoal p-6 text-cream sm:min-h-[330px] sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full border border-cream/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-4 top-10 -z-10 h-56 w-56 rounded-full border border-cream/10" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-0 right-4 -z-10 select-none font-serif text-[11rem] leading-none text-cream/[0.045] sm:right-10 sm:text-[14rem]" aria-hidden="true">学</div>

          <div>
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/65">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/20 text-terracotta">
                <AppIcon name="spark" className="h-4 w-4" />
              </span>
              <span>Келесі қадам · {summary.lastModuleLabel}</span>
            </div>
            <h2 className="mt-7 max-w-xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              {summary.continueTitle}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-cream/70">
              Соңғы оқыған жеріңіз немесе қолжетімді келесі сабақ бірден ашылады.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={summary.continueHref}
              className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-terracotta px-5 text-sm font-semibold text-white transition-colors hover:bg-steppe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Оқуды жалғастыру <AppIcon name="arrow" className="h-4 w-4" />
            </Link>
            <span className="text-xs text-cream/55">
              {summary.completedLessons} / {summary.totalLessons} сабақ аяқталды
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[1.75rem] bg-paper p-6 ring-1 ring-charcoal/5 sm:p-8">
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
                БҮГІНГІ МАҚСАТ
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sand/45 text-charcoal">
                <AppIcon name="clock" className="h-5 w-5" />
              </span>
            </div>
            <h2 className="mt-4 text-xl font-semibold">{goal} сабақ оқу</h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-charcoal/60">
              Қысқа, тұрақты сабақтар күнделікті әдет қалыптастыруға көмектеседі.
            </p>
          </div>
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="text-charcoal/65">Бүгін аяқталған сабақ</span>
              <span className="font-semibold tabular-nums">{summary.todayLessons} / {goal}</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-charcoal/10"
              role="progressbar"
              aria-label="Бүгінгі оқу мақсаты"
              aria-valuemin={0}
              aria-valuemax={goal}
              aria-valuenow={completedToday}
            >
              <div
                className="h-full rounded-full bg-steppe transition-[width] duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-charcoal/55">
                {goalPercent === 100
                  ? "Бүгінгі мақсатыңыз орындалды."
                  : "Келесі сабақты аяқтап, мақсатыңызға жақындаңыз."}
              </p>
              <Link href="/profile" className="shrink-0 text-xs font-semibold text-terracotta underline-offset-4 hover:underline">
                Өзгерту
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Оқу статистикасы">
        <article className="rounded-2xl bg-paper p-4 ring-1 ring-charcoal/5 sm:p-5">
          <p className="text-xs text-charcoal/55">Аяқталған сабақ</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {summary.completedLessons}<span className="ml-1 text-sm font-normal text-charcoal/45">/ {summary.totalLessons}</span>
          </p>
        </article>
        <article className="rounded-2xl bg-paper p-4 ring-1 ring-charcoal/5 sm:p-5">
          <p className="text-xs text-charcoal/55">Орындалған жаттығу</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{summary.practiceCount}</p>
        </article>
        <article className="rounded-2xl bg-paper p-4 ring-1 ring-charcoal/5 sm:p-5">
          <p className="text-xs text-charcoal/55">Жиналған XP</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{new Intl.NumberFormat("kk-KZ").format(summary.totalXP)}</p>
        </article>
        <article className="rounded-2xl bg-paper p-4 ring-1 ring-charcoal/5 sm:p-5">
          <p className="text-xs text-charcoal/55">Tek Coin</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{new Intl.NumberFormat("kk-KZ").format(summary.coinBalance)}</p>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-charcoal/8 bg-paper/55 p-5 sm:p-7" aria-label="Tekshe оқу тәсілі">
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">01 · ТІЛ</p>
            <p className="mt-2 text-sm font-medium">Қазақ тіліндегі түсіндіру</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">02 · ЖҮЙЕ</p>
            <p className="mt-2 text-sm font-medium">Пиньинь мен HSK курстары</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">03 · НӘТИЖЕ</p>
            <p className="mt-2 text-sm font-medium">Жаттығу және нақты ілгерілеу</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="quick-access-title">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">ЖЫЛДАМ ӨТУ</p>
            <h2 id="quick-access-title" className="mt-2 text-section-title font-semibold">Оқу аймағы</h2>
          </div>
          <Link href="/learn" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-charcoal hover:text-terracotta">
            Барлық курс <AppIcon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <DashboardLink href="/learn" title="Оқу орталығы" description="Пиньинь және HSK 1 курстары" icon="book" />
          <DashboardLink href="/practice" title="Жаттығу" description="Сөздер мен сөйлемдерге арналған тапсырмалар" icon="practice" />
          <DashboardLink href="/progress" title="Ілгерілеу" description={`${summary.completedCourses} аяқталған курс · ${summary.practiceCount} жаттығу`} icon="progress" />
          <DashboardLink href="/wallet" title="Tek әмияны" description={`${summary.totalCoinsEarned} Tek Coin жиналды`} icon="wallet" />
        </div>
      </section>

      <DailyQuests />
    </div>
  );
}
