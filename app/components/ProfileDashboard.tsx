"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import AppIcon from "./AppIcon";
import LearnerAvatar from "./LearnerAvatar";
import PageHeading from "./PageHeading";
import { hsk1FoundationCurriculum } from "../data/hsk1Foundation";
import { learningSummaryStore } from "../data/learningSummary";
import {
  learnerProfileStore,
  saveLearnerProfile,
  type DailyLessonGoal,
  type LearnerAvatarId,
  type LearnerProfile,
} from "../data/learnerProfile";
import { pinyinCurriculum } from "../data/pinyinCurriculum";

const avatarOptions: { id: LearnerAvatarId; label: string }[] = [
  { id: "terracotta", label: "Қыш" },
  { id: "steppe", label: "Дала" },
  { id: "charcoal", label: "Сия" },
  { id: "sand", label: "Құм" },
];

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="rounded-2xl bg-paper p-4 ring-1 ring-charcoal/5 sm:p-5">
      <p className="text-xs text-charcoal/55">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-xs leading-5 text-charcoal/50">{note}</p>
    </article>
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
  const [draftState, setDraftState] = useState({ source: savedProfile, value: savedProfile });
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const draft = draftState.source === savedProfile ? draftState.value : savedProfile;

  const pinyinCompleted = summary.completedPinyin.length;
  const hskCompleted = summary.completedHsk.length;
  const pinyinTotal = pinyinCurriculum.lessons.length;
  const hskTotal = hsk1FoundationCurriculum.lessons.length;
  const overallPercent = summary.totalLessons
    ? Math.round((summary.completedLessons / summary.totalLessons) * 100)
    : 0;

  function updateDraft<K extends keyof LearnerProfile>(key: K, value: LearnerProfile[K]) {
    setDraftState({ source: savedProfile, value: { ...draft, [key]: value } });
    setMessage(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.nickname.trim()) {
      setMessage({ kind: "error", text: "Өзіңізге қысқа ат енгізіңіз." });
      return;
    }

    const saved = saveLearnerProfile(draft);
    setMessage(saved
      ? { kind: "success", text: "Профиль осы құрылғыда сақталды." }
      : { kind: "error", text: "Браузер бұл деректі сақтай алмады. Сақтау рұқсатын тексеріңіз." });
  }

  return (
    <div className="space-y-8 pb-2 sm:space-y-10">
      <PageHeading
        eyebrow="ЖЕКЕ ОҚУ КЕҢІСТІГІ"
        title="Профиль"
        description="Оқушы атыңыз бен күндік мақсатыңызды баптаңыз. Бұл профиль тек осы браузерде сақталады."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <section className="overflow-hidden rounded-[1.75rem] bg-paper ring-1 ring-charcoal/5" aria-labelledby="profile-settings-title">
          <div className="flex items-center gap-4 border-b border-charcoal/8 bg-paper-alt/45 p-5 sm:p-7">
            <LearnerAvatar avatarId={draft.avatarId} nickname={draft.nickname} className="h-14 w-14 rounded-2xl text-xl" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">ОҚУШЫ · ЖЕРГІЛІКТІ БЕТА</p>
              <p className="mt-1 truncate text-xl font-semibold">{draft.nickname || "Оқушы"}</p>
            </div>
          </div>

          <form className="space-y-7 p-5 sm:p-7" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="learner-nickname" className="block text-sm font-semibold">Оқушының қысқа аты</label>
              <p id="nickname-help" className="mt-1 text-xs leading-5 text-charcoal/55">Шын аты-жөніңізді енгізудің қажеті жоқ.</p>
              <input
                id="learner-nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                maxLength={24}
                required
                value={draft.nickname}
                onChange={(event) => updateDraft("nickname", event.target.value)}
                aria-describedby="nickname-help"
                className="mt-3 min-h-12 w-full rounded-xl border border-charcoal/12 bg-cream/35 px-4 text-base text-charcoal outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10"
              />
            </div>

            <fieldset>
              <legend className="text-sm font-semibold">Аватар түсін таңдаңыз</legend>
              <p className="mt-1 text-xs leading-5 text-charcoal/55">Сурет жүктелмейді; бұл — осы бетке арналған қарапайым белгі.</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {avatarOptions.map((avatar) => (
                  <label key={avatar.id} className="cursor-pointer">
                    <input
                      className="peer sr-only"
                      type="radio"
                      name="avatarId"
                      value={avatar.id}
                      checked={draft.avatarId === avatar.id}
                      onChange={() => updateDraft("avatarId", avatar.id)}
                    />
                    <span className="flex min-h-16 items-center gap-2 rounded-xl border border-charcoal/8 px-3 transition hover:border-charcoal/20 peer-checked:border-terracotta peer-checked:bg-cream/60 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta">
                      <LearnerAvatar avatarId={avatar.id} nickname={draft.nickname} className="h-9 w-9 rounded-xl text-sm" />
                      <span className="text-xs font-medium">{avatar.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="daily-goal" className="block text-sm font-semibold">Күндік сабақ мақсаты</label>
              <p id="goal-help" className="mt-1 text-xs leading-5 text-charcoal/55">Dashboard-тағы бүгінгі мақсат осы таңдауға сай өзгереді.</p>
              <select
                id="daily-goal"
                name="dailyGoalLessons"
                value={draft.dailyGoalLessons}
                onChange={(event) => updateDraft("dailyGoalLessons", Number(event.target.value) as DailyLessonGoal)}
                aria-describedby="goal-help"
                className="mt-3 min-h-12 w-full rounded-xl border border-charcoal/12 bg-cream/35 px-4 text-base text-charcoal outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10"
              >
                <option value={1}>Күніне 1 сабақ</option>
                <option value={2}>Күніне 2 сабақ</option>
                <option value={3}>Күніне 3 сабақ</option>
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-cream/55 p-4">
                <p className="text-xs text-charcoal/55">Оқыту тілі</p>
                <p className="mt-1 text-sm font-semibold">Қазақ тілі</p>
              </div>
              <div className="rounded-xl bg-cream/55 p-4">
                <p className="text-xs text-charcoal/55">Үйреніп жатқан тіл</p>
                <p className="mt-1 text-sm font-semibold">Мандарин қытай тілі</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-charcoal/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" role={message?.kind === "error" ? "alert" : "status"} className={`min-h-5 text-sm ${message?.kind === "error" ? "text-danger" : "text-steppe"}`}>
                {message?.text ?? ""}
              </p>
              <button type="submit" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-charcoal px-5 text-sm font-semibold text-white transition-colors hover:bg-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta">
                <AppIcon name="check" className="h-4 w-4" /> Өзгерістерді сақтау
              </button>
            </div>
          </form>
        </section>

        <div className="space-y-5">
          <section className="rounded-[1.75rem] bg-charcoal p-5 text-cream sm:p-7" aria-labelledby="profile-progress-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/55">ОҚУ БАРЫСЫ</p>
                <h2 id="profile-progress-title" className="mt-2 text-xl font-semibold">Қадамыңыз көрініп тұр</h2>
              </div>
              <span className="rounded-full border border-cream/15 px-3 py-1.5 text-xs text-cream/70">{overallPercent}%</span>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-cream/15" role="progressbar" aria-label="Жалпы оқу барысы" aria-valuemin={0} aria-valuemax={100} aria-valuenow={overallPercent}>
              <div className="h-full rounded-full bg-terracotta transition-[width] duration-500" style={{ width: `${overallPercent}%` }} />
            </div>
            <p className="mt-3 text-sm text-cream/65">{summary.completedLessons} / {summary.totalLessons} сабақ аяқталды</p>
            <Link href={summary.continueHref} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cream underline decoration-cream/35 underline-offset-4 transition hover:text-white hover:decoration-white">
              {summary.lastModuleLabel}: {summary.continueTitle} <AppIcon name="arrow" className="h-4 w-4" />
            </Link>
          </section>

          <section aria-label="Нақты оқу статистикасы">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Аяқталған курс" value={`${summary.completedCourses} / ${summary.totalCourses}`} note="Пиньинь және HSK 1" />
              <StatCard label="Жаттығу" value={String(summary.practiceCount)} note="Сақталған нәтиже" />
              <StatCard label="XP деңгейі" value={`${summary.progressLevel}`} note={summary.progressLevelTitle} />
              <StatCard label="Tek Coin" value={new Intl.NumberFormat("kk-KZ").format(summary.coinBalance)} note={`${summary.totalCoinsEarned} барлығы жиналды`} />
            </div>
          </section>
        </div>
      </div>

      <section className="rounded-[1.75rem] bg-paper p-5 ring-1 ring-charcoal/5 sm:p-7" aria-labelledby="course-progress-title">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">КУРСТАР</p>
            <h2 id="course-progress-title" className="mt-2 text-xl font-semibold">Оқу жолыңыз</h2>
          </div>
          <Link href="/learn" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-charcoal hover:text-terracotta">Оқу орталығын ашу <AppIcon name="arrow" className="h-4 w-4" /></Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { title: "Пиньинь негіздері", done: pinyinCompleted, total: pinyinTotal, href: "/learn/pinyin" },
            { title: "HSK 1 бастау курсы", done: hskCompleted, total: hskTotal, href: "/learn/hsk" },
          ].map((course) => {
            const percent = course.total ? Math.round((course.done / course.total) * 100) : 0;
            return (
              <Link key={course.href} href={course.href} className="rounded-2xl bg-cream/45 p-4 transition hover:bg-cream/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{course.title}</span>
                  <span className="text-xs tabular-nums text-charcoal/55">{course.done} / {course.total}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-charcoal/10" role="progressbar" aria-label={`${course.title} барысы`} aria-valuemin={0} aria-valuemax={course.total} aria-valuenow={course.done}>
                  <div className="h-full rounded-full bg-steppe transition-[width] duration-500" style={{ width: `${percent}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <aside className="rounded-2xl border border-charcoal/8 bg-paper/55 p-4 text-xs leading-5 text-charcoal/60 sm:p-5">
        Бұл — жергілікті бета профиль. Тіркелгі, бұлттық сақтау және басқа құрылғымен синхрондау жоқ. Шын аты-жөніңіз, телефон нөміріңіз не электрондық поштаңыз сұралмайды.
      </aside>
    </div>
  );
}
