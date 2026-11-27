"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import AppIcon from "./AppIcon";
import PageHeading from "./PageHeading";
import { createLearningRecordId } from "../data/progress";
import {
  gradeDueReviewCard,
  getNextReviewIntervalMinutes,
  reviewProgressStore,
  type ReviewGrade,
} from "../data/reviewSystem";

const gradeOptions: Array<{
  grade: ReviewGrade;
  label: string;
  className: string;
}> = [
  { grade: "again", label: "Қайта", className: "border-danger/20 bg-danger-bg text-danger hover:border-danger/40" },
  { grade: "hard", label: "Қиын", className: "border-warning/25 bg-warning-bg text-warning hover:border-warning/50" },
  { grade: "good", label: "Жақсы", className: "border-blue/20 bg-blue/10 text-blue-dark hover:border-blue/40" },
  { grade: "easy", label: "Оңай", className: "border-success/20 bg-success-bg text-success hover:border-success/40" },
];

function intervalLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} мин.`;
  if (minutes < 24 * 60) return `${Math.round(minutes / 60)} сағ.`;
  const days = Math.round(minutes / (24 * 60));
  return `${days} күн`;
}

export default function ReviewDashboard() {
  const snapshot = useSyncExternalStore(
    reviewProgressStore.subscribe,
    reviewProgressStore.getSnapshot,
    reviewProgressStore.getServerSnapshot,
  );
  const [isRevealed, setIsRevealed] = useState(false);
  const [notice, setNotice] = useState("");
  const [audioNotice, setAudioNotice] = useState("");
  const activeCard = snapshot.dueCards[0];

  function gradeCard(grade: ReviewGrade) {
    if (!activeCard) return;
    const saved = gradeDueReviewCard({
      itemId: activeCard.id,
      grade,
      attemptId: createLearningRecordId(),
    });
    if (!saved) {
      setNotice("Қайталау нәтижесін сақтау мүмкін болмады. Браузер жадын тексеріңіз.");
      return;
    }
    setIsRevealed(false);
    setNotice("Жауабыңыз сақталды. Келесі карточка дайын.");
  }

  function playAudio(text: string) {
    if (!("speechSynthesis" in window)) {
      setAudioNotice("Бұл браузерде қытайша дыбыстау қолжетімсіз.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    window.speechSynthesis.speak(utterance);
    setAudioNotice("Дыбысты құрылғыдағы zh-CN дауысы оқып тұр.");
  }

  return (
    <div className="space-y-8 pb-6 sm:space-y-10">
      <PageHeading
        eyebrow="ЖАДЫҢДЫ БЕКІТ · АРАЛЫҚ ҚАЙТАЛАУ"
        title="Қайталау уақыты"
        description="Сөзді өзіңіз еске түсіріп көріңіз. Жауаптан кейінгі баға келесі қайталау уақытын есептейді."
      />

      {snapshot.storageStatus === "read-only" && (
        <div role="alert" className="rounded-2xl border border-warning/25 bg-warning-bg p-4 text-sm leading-6 text-warning">
          Бұрынғы немесе бүлінген қайталау дерегі өзгертілмеді. Оны сақтап қалу үшін бұл сессияда жаңа нәтиже жазу тоқтатылды.
        </div>
      )}
      {snapshot.storageStatus === "unavailable" && (
        <div role="status" className="rounded-2xl border border-border-soft bg-card p-4 text-sm leading-6 text-text-secondary">
          Браузер жадына қазір қолжетім жоқ. Қайталау нәтижесі сақталмауы мүмкін.
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Қайталау көрсеткіштері">
        <article className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
          <p className="text-xs text-text-secondary">Қазір қайталау керек</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{snapshot.dueCount}</p>
        </article>
        <article className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
          <p className="text-xs text-text-secondary">Үйренуге енгізілген сөз</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{snapshot.totalCards}</p>
        </article>
        <article className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
          <p className="text-xs text-text-secondary">Бүгін қайталанған</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{snapshot.reviewedToday}</p>
        </article>
      </section>

      {activeCard ? (
        <section className="mx-auto max-w-3xl" aria-labelledby="review-card-title">
          <div className="overflow-hidden rounded-[28px] border border-border-soft bg-card shadow-card">
            <div className="flex items-center justify-between gap-3 border-b border-border-soft bg-card-soft/70 px-5 py-4 sm:px-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-dark">
                {activeCard.levelName} · {activeCard.curriculumTitle}
              </p>
              <span className="rounded-full bg-ice px-3 py-1 text-xs font-medium text-text-secondary">
                {snapshot.dueCount} қалды
              </span>
            </div>

            <div className="px-5 py-8 text-center sm:px-10 sm:py-12">
              <p className="text-xs text-text-secondary">Қазақша мағынасын еске түсіріңіз</p>
              <h2 id="review-card-title" className="mt-5 text-5xl font-semibold tracking-wide text-text-primary sm:text-6xl">
                {activeCard.vocabulary.hanzi}
              </h2>

              {isRevealed ? (
                <div className="mx-auto mt-7 max-w-xl rounded-2xl bg-ice/70 p-5 text-left sm:p-6">
                  <p className="text-xl font-medium text-blue-dark">{activeCard.vocabulary.pinyin}</p>
                  <p className="mt-2 text-lg font-semibold text-text-primary">{activeCard.vocabulary.translationKazakh}</p>
                  <div className="mt-5 border-t border-border-soft pt-4">
                    <p className="text-xl font-medium">{activeCard.vocabulary.example.hanzi}</p>
                    <p className="mt-1 text-sm text-blue-dark">{activeCard.vocabulary.example.pinyin}</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{activeCard.vocabulary.example.translationKazakh}</p>
                    <button
                      type="button"
                      onClick={() => playAudio(activeCard.vocabulary.example.hanzi)}
                      className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-border-soft bg-card px-4 text-sm font-medium text-text-primary hover:border-blue/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                    >
                      <AppIcon name="practice" className="h-4 w-4" /> Қытайша тыңдау
                    </button>
                    {audioNotice && <p aria-live="polite" className="mt-2 text-xs text-text-secondary">{audioNotice}</p>}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {gradeOptions.map(({ grade, label, className }) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => gradeCard(grade)}
                        className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${className}`}
                        aria-label={`${label}, келесі қайталау шамамен ${intervalLabel(getNextReviewIntervalMinutes(activeCard.state, grade))}`}
                      >
                        <span className="block">{label}</span>
                        <span className="mt-0.5 block text-[10px] font-normal opacity-75">
                          {intervalLabel(getNextReviewIntervalMinutes(activeCard.state, grade))}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRevealed(true)}
                  className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-dark px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  Жауабын көрсету <AppIcon name="arrow" className="h-4 w-4 rotate-90" />
                </button>
              )}
            </div>
          </div>
          <p aria-live="polite" className="mt-4 min-h-6 text-center text-sm text-text-secondary">{notice}</p>
        </section>
      ) : (
        <section className="rounded-[28px] border border-border-soft bg-gradient-to-br from-card via-card-soft to-mint/20 p-6 shadow-card sm:p-9" aria-live="polite">
          <div className="mx-auto max-w-xl text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint/45 text-mint-dark">
              <AppIcon name="check" className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-text-primary">
              {snapshot.totalCards === 0 ? "Алғашқы сөздерді үйренуден бастаңыз" : "Қазір қайталайтын карточка жоқ"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {snapshot.totalCards === 0
                ? "HSK 1 сабағын аяқтаған соң, сол сабақтағы сөздер осында сақталып, қайталау уақыты келгенде көрсетіледі."
                : `Бүгін ${snapshot.reviewedToday} карточка қайталанды. Келесі сөздер белгіленген уақытта осы бетке шығады.`}
            </p>
            <Link href="/learn/hsk" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-blue/20 bg-blue/10 px-5 text-sm font-semibold text-blue-dark transition hover:bg-blue/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">
              HSK 1 курсын ашу <AppIcon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-border-soft bg-card p-5 sm:p-6" aria-labelledby="review-method-title">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue-dark">
            <AppIcon name="clock" className="h-5 w-5" />
          </span>
          <div>
            <h2 id="review-method-title" className="font-semibold">Қайталау уақыты қалай есептеледі?</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              «Қайта» — 10 минуттан кейін; «Қиын» — кемінде бір күннен кейін; «Жақсы» және «Оңай» бағалары өткен қайталаулар мен жеке есте сақтау қарқынына қарай келесі аралықты ұзартады. Нәтиже осы браузерде сақталады.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
