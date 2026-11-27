
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
      className="group flex min-h-[164px] flex-col rounded-2xl border border-border-soft bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue/35 hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue/10 text-blue-dark transition-colors group-hover:bg-blue/15">
        <AppIcon name={icon} className="h-5 w-5" />
      </span>

      <span className="mt-5 font-semibold text-text-primary">
        {title}
      </span>

      <span className="mt-1 text-xs leading-5 text-text-secondary">
        {description}
      </span>

      <span className="mt-auto flex justify-end pt-3 text-blue-dark transition-transform group-hover:translate-x-1">
        <AppIcon name="arrow" className="h-4 w-4" />
      </span>
    </Link>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("kk-KZ").format(value);
}

export default function DashboardHome() {
  const summary = useSyncExternalStore(
    learningSummaryStore.subscribe,
    learningSummaryStore.getSnapshot,
    learningSummaryStore.getServerSnapshot
  );

  const goal = Math.max(1, summary.dailyGoalLessons);

  const completedToday = Math.min(
    Math.max(0, summary.todayLessons),
    goal
  );

  const goalPercent = Math.round((completedToday / goal) * 100);

  return (
    <div className="space-y-8 pb-4 sm:space-y-10">
      <PageHeading
        eyebrow="TEKSHE · ОҚУ КАБИНЕТІ"
        title={`Сәлем, ${summary.learnerProfile.nickname}.`}
        description="Қытай тілін қазақ тілінде үйренуді бүгін де жалғастырыңыз. Әр сабақ — жаңа бір қадам."
        action={
          <Link
            href="/profile"
            className="inline-flex min-h-12 items-center gap-3 rounded-2xl border border-border-soft bg-card px-3.5 text-sm font-semibold text-text-primary shadow-sm transition hover:border-blue/35 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            <LearnerAvatar
              avatarId={summary.learnerProfile.avatarId}
              nickname={summary.learnerProfile.nickname}
              className="h-9 w-9 rounded-xl text-sm"
            />
            <span>Профиль</span>
          </Link>
        }
      />

      <section
        className="grid gap-4 xl:grid-cols-[1.5fr_0.85fr]"
        aria-label="Жалғастыру және бүгінгі оқу мақсаты"
      >
        {/* Continue learning */}
        <div className="relative isolate flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-border-soft bg-gradient-to-br from-sky/45 via-card to-mint/35 p-6 shadow-card sm:min-h-[350px] sm:p-8 lg:p-9">
          <div
            className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-card/40 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -bottom-24 right-16 -z-10 h-64 w-64 rounded-full bg-mint/35 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute bottom-0 right-5 -z-10 select-none font-serif text-[12rem] leading-none text-blue-dark/[0.07] sm:right-12 sm:text-[16rem]"
            aria-hidden="true"
          >
            学
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-card/70 px-3 py-2 text-[10px] font-semibold tracking-[0.16em] text-blue-dark shadow-sm backdrop-blur-sm sm:text-xs">
              <AppIcon name="spark" className="h-4 w-4" />
              <span>КЕЛЕСІ ҚАДАМ · {summary.lastModuleLabel}</span>
            </div>

            <h2 className="mt-7 max-w-xl text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-3xl lg:text-[2.15rem]">
              {summary.continueTitle}
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-text-secondary">
              Соңғы оқыған жеріңізден жалғастырыңыз немесе қолжетімді келесі сабақты бастаңыз.
            </p>
          </div>

          <div className="relative mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={summary.continueHref}
              className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-blue/20 bg-blue/15 px-5 text-sm font-semibold text-blue-dark shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
            >
              Оқуды жалғастыру
              <AppIcon name="arrow" className="h-4 w-4" />
            </Link>

            <span className="text-xs font-medium text-text-secondary">
              {summary.completedLessons} / {summary.totalLessons} сабақ аяқталды
            </span>
          </div>
        </div>

        {/* Daily goal */}
        <div className="flex flex-col justify-between rounded-[1.75rem] border border-border-soft bg-card p-6 shadow-sm sm:p-7">
          <div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-blue-dark">
                  БҮГІНГІ МАҚСАТ
                </p>

                <h2 className="mt-3 text-xl font-semibold text-text-primary">
                  {goal} сабақ оқу
                </h2>
              </div>

              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint/55 text-mint-dark">
                <AppIcon name="clock" className="h-5 w-5" />
              </span>
            </div>

            <p className="mt-3 max-w-xs text-sm leading-6 text-text-secondary">
              Қысқа әрі тұрақты сабақтар күнделікті оқу әдетін қалыптастыруға көмектеседі.
            </p>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between gap-3 text-sm">
              <span className="text-text-secondary">
                Бүгін аяқталған сабақ
              </span>

              <span className="font-semibold tabular-nums text-text-primary">
                {summary.todayLessons} / {goal}
              </span>
            </div>

            <div
              className="h-2.5 overflow-hidden rounded-full bg-ice"
              role="progressbar"
              aria-label="Бүгінгі оқу мақсаты"
              aria-valuemin={0}
              aria-valuemax={goal}
              aria-valuenow={completedToday}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue to-mint-dark transition-[width] duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs leading-5 text-text-secondary">
                {goalPercent === 100
                  ? "Бүгінгі мақсатыңыз орындалды."
                  : "Келесі сабақты аяқтап, мақсатыңызға жақындаңыз."}
              </p>

              <Link
                href="/profile"
                className="shrink-0 text-xs font-semibold text-blue-dark underline-offset-4 hover:underline"
              >
                Өзгерту
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5 rounded-[24px] border border-border-soft bg-gradient-to-br from-card to-mint/25 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6" aria-labelledby="review-shortcut-title">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint/55 text-mint-dark">
            <AppIcon name="review" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-mint-dark">АРАЛЫҚ ҚАЙТАЛАУ</p>
            <h2 id="review-shortcut-title" className="mt-1 font-semibold text-text-primary">
              {summary.reviewDueCount > 0
                ? `${summary.reviewDueCount} сөзді қайталау уақыты келді`
                : "Үйренген сөздерді ұмытпай бекітіңіз"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              {summary.reviewCardCount > 0
                ? `${summary.reviewCardCount} сөз қайталау жүйесіне қосылған · бүгін ${summary.reviewsToday} карточка қаралды`
                : "HSK 1 сабағын аяқтаған сөздер осы жерде аралықпен қайталанады."}
            </p>
          </div>
        </div>
        <Link href="/review" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-blue/20 bg-blue/10 px-5 text-sm font-semibold text-blue-dark transition hover:bg-blue/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">
          {summary.reviewDueCount > 0 ? "Қайталауды бастау" : "Қайталауды ашу"}
          <AppIcon name="arrow" className="h-4 w-4" />
        </Link>
      </section>

      {/* Learning statistics */}
      <section aria-label="Оқу статистикасы">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">
            Оқу көрсеткіштері
          </h2>

          <Link
            href="/progress"
            className="text-xs font-semibold text-blue-dark hover:underline"
          >
            Толығырақ
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <article className="rounded-2xl border border-border-soft bg-card p-4 shadow-sm sm:p-5">
            <p className="text-xs text-text-secondary">Аяқталған сабақ</p>

            <p className="mt-2 text-2xl font-semibold tabular-nums text-text-primary">
              {summary.completedLessons}
              <span className="ml-1 text-sm font-normal text-text-secondary">
                / {summary.totalLessons}
              </span>
            </p>
          </article>

          <article className="rounded-2xl border border-border-soft bg-card p-4 shadow-sm sm:p-5">
            <p className="text-xs text-text-secondary">Орындалған жаттығу</p>

            <p className="mt-2 text-2xl font-semibold tabular-nums text-text-primary">
              {formatNumber(summary.practiceCount)}
            </p>
          </article>

          <article className="rounded-2xl border border-border-soft bg-card p-4 shadow-sm sm:p-5">
            <p className="text-xs text-text-secondary">Жиналған XP</p>

            <p className="mt-2 text-2xl font-semibold tabular-nums text-text-primary">
              {formatNumber(summary.totalXP)}
            </p>
          </article>

          <article className="rounded-2xl border border-border-soft bg-card p-4 shadow-sm sm:p-5">
            <p className="text-xs text-text-secondary">Tek Coin</p>

            <p className="mt-2 text-2xl font-semibold tabular-nums text-text-primary">
              {formatNumber(summary.coinBalance)}
            </p>
          </article>
        </div>
      </section>

      {/* Quick access */}
      <section aria-labelledby="quick-access-title">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-blue-dark">
              ОҚУДЫ ЖАЛҒАСТЫРУ
            </p>

            <h2
              id="quick-access-title"
              className="mt-2 text-xl font-semibold tracking-tight text-text-primary sm:text-2xl"
            >
              Оқу аймағы
            </h2>
          </div>

          <Link
            href="/learn"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-dark hover:underline"
          >
            Барлық курс
            <AppIcon name="arrow" className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <DashboardLink
            href="/learn"
            title="Оқу орталығы"
            description="Пиньинь және HSK курстары"
            icon="book"
          />

          <DashboardLink
            href="/practice"
            title="Жаттығу"
            description="Білімді тапсырмалар арқылы бекіту"
            icon="practice"
          />

          <DashboardLink
            href="/progress"
            title="Ілгерілеу"
            description={`${summary.completedCourses} аяқталған курс · ${summary.practiceCount} жаттығу`}
            icon="progress"
          />

          <DashboardLink
            href="/wallet"
            title="Tek әмияны"
            description={`${formatNumber(summary.totalCoinsEarned)} Tek Coin жиналды`}
            icon="wallet"
          />
        </div>
      </section>

      <DailyQuests />
    </div>
  );
}
