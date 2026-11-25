
"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import AppIcon from "./AppIcon";
import AvatarPhotoEditor from "./AvatarPhotoEditor";
import PageHeading from "./PageHeading";
import { hsk1FoundationCurriculum } from "../data/hsk1Foundation";
import { learningSummaryStore } from "../data/learningSummary";
import {
  learnerProfileStore,
  saveLearnerProfile,
  type DailyLessonGoal,
  type LearnerProfile,
} from "../data/learnerProfile";
import { pinyinCurriculum } from "../data/pinyinCurriculum";

function StatRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {note && (
          <p className="mt-1 text-xs text-text-secondary">{note}</p>
        )}
      </div>
      <p className="shrink-0 text-lg font-bold tracking-tight text-text-primary tabular-nums">
        {value}
      </p>
    </div>
  );
}

function SettingsRow({
  href,
  symbol,
  title,
  description,
  status,
}: {
  href?: string;
  symbol: string;
  title: string;
  description: string;
  status?: string;
}) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue/10 text-lg text-blue-dark">
        {symbol}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-text-primary">
          {title}
        </span>
        <span className="mt-1 block text-xs text-text-secondary">
          {description}
        </span>
      </span>

      {status && (
        <span className="shrink-0 text-xs text-text-secondary">
          {status}
        </span>
      )}

      {href ? (
        <AppIcon
          name="arrow"
          className="h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200 group-hover:translate-x-0.5"
        />
      ) : (
        <span className="shrink-0 text-xs text-text-secondary">
          Кейінірек
        </span>
      )}
    </>
  );

  if (!href) {
    return (
      <div
        aria-disabled="true"
        className="flex min-h-[68px] items-center gap-3 px-4 py-3 opacity-60"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group flex min-h-[68px] items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-card-soft active:scale-[0.98]"
    >
      {content}
    </Link>
  );
}

export default function ProfileDashboard() {
  const savedProfile = useSyncExternalStore(
    learnerProfileStore.subscribe,
    learnerProfileStore.getSnapshot,
    learnerProfileStore.getServerSnapshot
  );

  const summary = useSyncExternalStore(
    learningSummaryStore.subscribe,
    learningSummaryStore.getSnapshot,
    learningSummaryStore.getServerSnapshot
  );

  const [draftState, setDraftState] = useState({
    source: savedProfile,
    value: savedProfile,
  });

  const [message, setMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  const draft =
    draftState.source === savedProfile ? draftState.value : savedProfile;

  const pinyinCompleted = summary.completedPinyin.length;
  const hskCompleted = summary.completedHsk.length;
  const pinyinTotal = pinyinCurriculum.lessons.length;
  const hskTotal = hsk1FoundationCurriculum.lessons.length;

  const overallPercent = summary.totalLessons
    ? Math.round(
        (summary.completedLessons / summary.totalLessons) * 100
      )
    : 0;

  function updateDraft<K extends keyof LearnerProfile>(
    key: K,
    value: LearnerProfile[K]
  ) {
    setDraftState({
      source: savedProfile,
      value: { ...draft, [key]: value },
    });
    setMessage(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.nickname.trim()) {
      setMessage({
        kind: "error",
        text: "Өзіңізге қысқа ат енгізіңіз.",
      });
      return;
    }

    const saved = saveLearnerProfile(draft);

    setMessage(
      saved
        ? {
            kind: "success",
            text: "Профиль осы құрылғыда сақталды.",
          }
        : {
            kind: "error",
            text: "Браузер бұл деректі сақтай алмады. Сақтау рұқсатын тексеріңіз.",
          }
    );
  }

  const courses = [
    {
      title: "Пиньинь негіздері",
      done: pinyinCompleted,
      total: pinyinTotal,
      href: "/learn/pinyin",
      symbol: "拼",
      tone: "blue",
    },
    {
      title: "HSK 1 бастау курсы",
      done: hskCompleted,
      total: hskTotal,
      href: "/learn/hsk",
      symbol: "汉",
      tone: "mint",
    },
  ];

  return (
    <div className="space-y-5 pb-6 sm:space-y-6">
      <PageHeading
        eyebrow="ЖЕКЕ ОҚУ КЕҢІСТІГІ"
        title="Профиль"
        description="Жеке мәліметтеріңіз бен оқу барысыңызды осы жерден басқарыңыз."
      />

      {/* 1. Profile */}
      <section
        className="overflow-hidden rounded-card border border-border-soft bg-card shadow-card"
        aria-labelledby="profile-title"
      >
        <div className="relative h-[140px] overflow-hidden bg-gradient-to-br from-sky/70 via-card-soft to-mint/50">
          <svg
            aria-hidden="true"
            viewBox="0 0 900 220"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full text-blue/20"
            fill="none"
          >
            <path
              d="M0 174 105 103 171 147 287 42 397 151 492 83 607 159 711 68 900 176V220H0Z"
              fill="currentColor"
            />
            <path
              d="m105 103 36 25-19 2-17-27Zm182-61 42 43-25-9-17-34Zm205 41 37 27-24-6-13-21Zm219-15 43 40-26-10-17-30Z"
              fill="currentColor"
              opacity=".65"
            />
            <path
              d="M0 188c132-26 224-8 336 4 141 15 244-23 361-14 82 6 140 22 203 12v30H0Z"
              fill="currentColor"
              opacity=".45"
            />
          </svg>

          <div
            aria-hidden="true"
            className="absolute -right-8 -top-16 h-48 w-48 rounded-full bg-card/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -left-10 h-40 w-64 rounded-full bg-mint/40 blur-3xl"
          />
        </div>

        <div className="relative px-5 pb-5 sm:px-7 sm:pb-7">
          <div className="-mt-12 flex flex-col items-center text-center">
            <div className="rounded-[24px] border-4 border-card bg-card p-1 shadow-floating">
              <AvatarPhotoEditor
                avatarId={draft.avatarId}
                nickname={draft.nickname}
              />
            </div>

            <h2
              id="profile-title"
              className="mt-3 text-xl font-bold tracking-tight text-text-primary sm:text-2xl"
            >
              {draft.nickname || "Оқушы"}
            </h2>

            <span className="mt-2 inline-flex items-center rounded-full border border-blue/15 bg-blue/10 px-3 py-1 text-xs font-semibold text-blue-dark">
              Tekshe · Оқушы профилі
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="learner-nickname"
                className="block text-sm font-semibold text-text-primary"
              >
                Оқушының қысқа аты
              </label>
              <p
                id="nickname-help"
                className="mt-1 text-xs leading-5 text-text-secondary"
              >
                Шын аты-жөніңізді енгізудің қажеті жоқ.
              </p>
              <input
                id="learner-nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                maxLength={24}
                required
                value={draft.nickname}
                onChange={(event) =>
                  updateDraft("nickname", event.target.value)
                }
                aria-describedby="nickname-help"
                className="mt-3 min-h-12 w-full rounded-control border border-border-soft bg-card-soft px-4 text-base text-text-primary outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
              />
            </div>

            <div>
              <label
                htmlFor="daily-goal"
                className="block text-sm font-semibold text-text-primary"
              >
                Күндік сабақ мақсаты
              </label>
              <p
                id="goal-help"
                className="mt-1 text-xs leading-5 text-text-secondary"
              >
                Dashboard-тағы бүгінгі мақсат осы таңдауға сай өзгереді.
              </p>
              <select
                id="daily-goal"
                name="dailyGoalLessons"
                value={draft.dailyGoalLessons}
                onChange={(event) =>
                  updateDraft(
                    "dailyGoalLessons",
                    Number(event.target.value) as DailyLessonGoal
                  )
                }
                aria-describedby="goal-help"
                className="mt-3 min-h-12 w-full rounded-control border border-border-soft bg-card-soft px-4 text-base text-text-primary outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
              >
                <option value={1}>Күніне 1 сабақ</option>
                <option value={2}>Күніне 2 сабақ</option>
                <option value={3}>Күніне 3 сабақ</option>
              </select>
            </div>

            <div className="divide-y divide-border-soft rounded-secondary border border-border-soft bg-card-soft px-4">
              <StatRow label="Оқыту тілі" value="Қазақ тілі" />
              <StatRow label="Үйреніп жатқан тіл" value="Мандарин қытай тілі" />
            </div>

            <div className="flex flex-col gap-3 border-t border-border-soft pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p
                aria-live="polite"
                role={message?.kind === "error" ? "alert" : "status"}
                className={`min-h-5 text-sm ${
                  message?.kind === "error"
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                {message?.text ?? ""}
              </p>

              <button
                type="submit"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-blue px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-dark active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              >
                <AppIcon name="check" className="h-4 w-4" />
                Өзгерістерді сақтау
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Learning progress */}
      <section
        className="rounded-card border border-border-soft bg-card p-5 shadow-card sm:p-6"
        aria-labelledby="learning-progress-title"
      >
        <div className="mb-5">
          <p className="text-[10px] font-bold tracking-[0.18em] text-blue-dark">
            LEARNING PROGRESS
          </p>
          <h2
            id="learning-progress-title"
            className="mt-1 text-lg font-bold text-text-primary"
          >
            Жалпы оқу барысы
          </h2>
        </div>

        <div
          className="h-2.5 overflow-hidden rounded-full bg-card-soft"
          role="progressbar"
          aria-label="Жалпы оқу барысы"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={overallPercent}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue to-mint-dark transition-[width] duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-border-soft">
          <div className="px-2 text-center">
            <p className="text-2xl font-bold tracking-tight text-text-primary tabular-nums">
              {summary.completedLessons}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Аяқталды
            </p>
          </div>

          <div className="px-2 text-center">
            <p className="text-2xl font-bold tracking-tight text-text-primary tabular-nums">
              {summary.totalLessons}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Барлығы
            </p>
          </div>

          <div className="px-2 text-center">
            <p className="text-2xl font-bold tracking-tight text-blue-dark tabular-nums">
              {overallPercent}%
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Нәтиже
            </p>
          </div>
        </div>

        <Link
          href={summary.continueHref}
          className="mt-5 flex min-h-12 items-center justify-between gap-3 rounded-secondary border border-border-soft bg-card-soft px-4 text-sm font-semibold text-text-primary transition-all duration-200 hover:border-blue/40 active:scale-[0.98]"
        >
          <span className="min-w-0 truncate">
            {summary.lastModuleLabel}: {summary.continueTitle}
          </span>
          <AppIcon name="arrow" className="h-4 w-4 shrink-0 text-blue-dark" />
        </Link>
      </section>

      {/* 3. Study statistics */}
      <section
        className="rounded-card border border-border-soft bg-card p-5 shadow-card sm:p-6"
        aria-labelledby="study-statistics-title"
      >
        <div className="mb-3">
          <p className="text-[10px] font-bold tracking-[0.18em] text-blue-dark">
            STUDY STATISTICS
          </p>
          <h2
            id="study-statistics-title"
            className="mt-1 text-lg font-bold text-text-primary"
          >
            Оқу статистикасы
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            Қолда бар оқу жазбаларының негізінде.
          </p>
        </div>

        <div className="divide-y divide-border-soft">
          <StatRow
            label="Аяқталған курстар"
            value={`${summary.completedCourses} / ${summary.totalCourses}`}
            note="Пиньинь және HSK 1"
          />
          <StatRow
            label="Орындалған жаттығулар"
            value={String(summary.practiceCount)}
            note="Сақталған нәтиже"
          />
          <StatRow
            label="XP деңгейі"
            value={String(summary.progressLevel)}
            note={summary.progressLevelTitle}
          />
          <StatRow
            label="Tek Coin балансы"
            value={new Intl.NumberFormat("kk-KZ").format(
              summary.coinBalance
            )}
            note={`${summary.totalCoinsEarned} барлығы жиналды`}
          />
        </div>
      </section>

      {/* 4. Course progress */}
      <section
        className="rounded-card border border-border-soft bg-card p-5 shadow-card sm:p-6"
        aria-labelledby="course-progress-title"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-blue-dark">
              MY COURSES
            </p>
            <h2
              id="course-progress-title"
              className="mt-1 text-lg font-bold text-text-primary"
            >
              Оқу курстарым
            </h2>
          </div>

          <Link
            href="/learn"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-dark transition hover:opacity-75"
          >
            Барлығы
            <AppIcon name="arrow" className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-border-soft">
          {courses.map((course) => {
            const percent = course.total
              ? Math.round((course.done / course.total) * 100)
              : 0;

            const isMint = course.tone === "mint";

            return (
              <Link
                key={course.href}
                href={course.href}
                className="group flex items-center gap-3 py-4 transition-all duration-200 active:scale-[0.98]"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-secondary text-lg font-bold ${
                    isMint
                      ? "bg-mint/40 text-mint-dark"
                      : "bg-blue/10 text-blue-dark"
                  }`}
                >
                  {course.symbol}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-semibold text-text-primary">
                      {course.title}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-text-secondary tabular-nums">
                      {percent}%
                    </span>
                  </span>

                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-card-soft">
                    <span
                      className={`block h-full rounded-full transition-[width] duration-500 ${
                        isMint ? "bg-mint-dark" : "bg-blue"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </span>

                  <span className="mt-1.5 block text-xs text-text-secondary">
                    {course.done} / {course.total} сабақ аяқталды
                  </span>
                </span>

                <AppIcon
                  name="arrow"
                  className="h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. App settings */}
      <section
        className="rounded-card border border-border-soft bg-card p-5 shadow-card sm:p-6"
        aria-labelledby="app-settings-title"
      >
        <div className="mb-3">
          <p className="text-[10px] font-bold tracking-[0.18em] text-blue-dark">
            APP SETTINGS
          </p>
          <h2
            id="app-settings-title"
            className="mt-1 text-lg font-bold text-text-primary"
          >
            Қолданба параметрлері
          </h2>
        </div>

        <div className="divide-y divide-border-soft">
          <SettingsRow
            href="/settings/language"
            symbol="文"
            title="Тіл және оқу параметрлері"
            description="Қолданба тілі және пиньинь көрінісі"
            status="Қазақша"
          />

          <SettingsRow
            href="/settings/appearance"
            symbol="◐"
            title="Көрініс және тақырып"
            description="Жарық, қараңғы немесе жүйелік режим"
          />

          <SettingsRow
            symbol="♙"
            title="Тіркелгі параметрлері"
            description="Тіркелгі мен қауіпсіздік"
          />

   <SettingsRow
  href="/settings/notifications"
  symbol="♧"
  title="Хабарландырулар"
  description="Еске салғыштар мен оқу хабарламалары"
/>

          <SettingsRow
            symbol="ⓘ"
            title="Көмек және қолдау"
            description="Жиі қойылатын сұрақтар мен кері байланыс"
          />
        </div>
      </section>

      {/* 6. Local beta notice */}
      <aside className="flex items-start gap-3 rounded-secondary border border-border-soft bg-card-soft/80 p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue/10 text-sm font-semibold text-blue-dark">
          i
        </span>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-text-primary">
            Tekshe · Local Beta
          </p>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            Бұл — жергілікті бета нұсқа. Профиль мен аватар деректері осы
            браузерде сақталады. Тіркелгі, бұлттық сақтау және басқа
            құрылғымен синхрондау әзірге жоқ.
          </p>
        </div>
      </aside>
    </div>
  );
}
