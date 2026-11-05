"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  Curriculum,
  CurriculumExercise,
  VocabularyEntry,
} from "../data/curriculum";
import {
  completeCurriculumLesson,
  getCompletedCurriculumLessons,
} from "../data/curriculumProgress";
import { completeCourse } from "../data/courseProgress";
import { awardXP, COURSE_COMPLETION_XP } from "../data/xp";
import type { CourseId } from "../data/courseProgress";
import Link from "next/link";
import {
  awardCourseMilestoneCoins,
  awardLessonCoins,
  hasTekCoinTransaction,
  TEK_COIN_REWARDS,
} from "../data/tekCoins";

type Props = {
  curriculum: Curriculum;
  sectionId?: string;
  legacyCourseId?: CourseId;
  initialLessonId?: string;
  singleLessonMode?: boolean;
  lessonPathPrefix?: string;
  moduleHref?: string;
};

function answerIsCorrect(exercise: CurriculumExercise, selected: string): boolean {
  return Array.isArray(exercise.answer)
    ? exercise.answer.includes(selected)
    : exercise.answer === selected;
}

const partOfSpeechLabels: Record<string, string> = {
  noun: "зат есім",
  verb: "етістік",
  adjective: "сын есім",
  pronoun: "есімдік",
  adverb: "үстеу",
  particle: "демеулік",
  numeral: "сан есім",
  classifier: "санау сөзі",
  preposition: "септеулік",
  conjunction: "жалғаулық",
  phrase: "тіркес",
  interjection: "одағай",
};

export default function CurriculumCourseRunner({
  curriculum,
  sectionId,
  legacyCourseId,
  initialLessonId,
  singleLessonMode = false,
  lessonPathPrefix,
  moduleHref,
}: Props) {
  const lessonIds = useMemo(
    () => curriculum.lessons.map(({ id }) => id),
    [curriculum.lessons]
  );
  const [activeIndex, setActiveIndex] = useState(() => {
    const found = curriculum.lessons.findIndex((lesson) => lesson.id === initialLessonId);
    return found >= 0 ? found : 0;
  });
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [exerciseResults, setExerciseResults] = useState<Record<string, boolean>>({});
  const [audioNotice, setAudioNotice] = useState("");
  const [progressNotice, setProgressNotice] = useState("");
  const [rewardNotice, setRewardNotice] = useState("");

  useEffect(() => {
    const updateProgress = () => {
      setCompletedLessonIds(
        getCompletedCurriculumLessons(curriculum.id, curriculum.id, lessonIds)
      );
    };

    updateProgress();
    window.addEventListener("tekshe-progress-updated", updateProgress);
    window.addEventListener("storage", updateProgress);
    return () => {
      window.removeEventListener("tekshe-progress-updated", updateProgress);
      window.removeEventListener("storage", updateProgress);
    };
  }, [curriculum.id, lessonIds]);

  const activeLesson = curriculum.lessons[activeIndex];
  if (!activeLesson) return null;

  const vocabularyById = new Map(
    curriculum.vocabulary.map((entry) => [entry.id, entry])
  );
  const exercisesById = new Map(
    curriculum.exercises.map((exercise) => [exercise.id, exercise])
  );
  const lessonExercises = activeLesson.exerciseIds
    .map((id) => exercisesById.get(id))
    .filter((exercise): exercise is CurriculumExercise => Boolean(exercise));
  const lessonVocabulary = activeLesson.vocabularyIds
    .map((id) => vocabularyById.get(id))
    .filter((entry): entry is VocabularyEntry => Boolean(entry));
  const activeLessonComplete = completedLessonIds.includes(activeLesson.id);
  const activeLessonLocked = activeLesson.prerequisites.some(
    (prerequisite) => !completedLessonIds.includes(prerequisite)
  );
  const allExercisesCorrect =
    lessonExercises.length > 0 &&
    lessonExercises.every((exercise) => exerciseResults[exercise.id] === true);
  const courseComplete =
    lessonIds.length > 0 && lessonIds.every((id) => completedLessonIds.includes(id));
  const progressPercent = Math.round(
    (completedLessonIds.length / Math.max(lessonIds.length, 1)) * 100
  );

  function playAudio(text: string) {
    if (!("speechSynthesis" in window)) {
      setAudioNotice("Бұл браузерде дыбыстап оқу қолжетімсіз.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    window.speechSynthesis.speak(utterance);
    setAudioNotice("Дыбысты құрылғыдағы zh-CN дауысы оқып тұр.");
  }

  function checkAnswer(exercise: CurriculumExercise) {
    const selected = selectedAnswers[exercise.id];
    if (!selected) return;

    setExerciseResults((current) => ({
      ...current,
      [exercise.id]: answerIsCorrect(exercise, selected),
    }));
  }

  function completeLesson() {
    const result = completeCurriculumLesson(
      curriculum.id,
      curriculum.id,
      activeLesson.id,
      lessonIds,
      () =>
        legacyCourseId
          ? completeCourse(legacyCourseId)
          : awardXP(
              `curriculum-course:${curriculum.id}:${curriculum.id}`,
              "course",
              COURSE_COMPLETION_XP
            )
    );
    if (!result) {
      setProgressNotice("Сабақтың барысын сақтау мүмкін болмады. Қайталап көріңіз.");
      return;
    }
    awardLessonCoins(curriculum.id, activeLesson.id);
    if (result.courseCompleted) awardCourseMilestoneCoins(curriculum.id);

    const lessonCoinSaved = hasTekCoinTransaction(`lesson:${curriculum.id}:${activeLesson.id}`);
    const milestoneCoinSaved = result.courseCompleted && hasTekCoinTransaction(`milestone:${curriculum.id}:complete`);
    const rewardMessages = [
      lessonCoinSaved
        ? `+${TEK_COIN_REWARDS.lesson} Tek Coin`
        : "Tek Coin жазбасын сақтау мүмкін болмады",
      milestoneCoinSaved ? `+${TEK_COIN_REWARDS.milestone} курс межесі` : "",
      result.xpAwarded ? `+${COURSE_COMPLETION_XP} XP ішкі ілгерілеуге` : "",
    ].filter(Boolean);
    setProgressNotice("");
    setRewardNotice(`Сабақ сақталды. ${rewardMessages.join(" · ")}`);
    setCompletedLessonIds(result.completedLessonIds);
  }

  if (singleLessonMode && activeLessonLocked) {
    return (
      <section className="py-2" aria-labelledby={`${activeLesson.id}-locked-title`}>
        <div className="rounded-xl border border-charcoal/10 bg-paper p-5 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">САБАҚ ҚҰЛЫПТАУЛЫ</p>
          <h2 id={`${activeLesson.id}-locked-title`} className="mt-2 text-xl font-semibold">Алдыңғы сабақты аяқтаңыз</h2>
          <p className="mt-2 text-sm leading-6 text-charcoal/65">Бұл сабақтың алғышарты әлі орындалмаған.</p>
          {moduleHref && <Link href={moduleHref} className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-charcoal px-4 text-sm font-semibold text-white hover:bg-terracotta">Курс тізіміне оралу</Link>}
        </div>
      </section>
    );
  }

  return (
    <section
      id={sectionId ?? curriculum.id}
      className={`border-t border-charcoal/10 ${singleLessonMode ? "py-2" : "py-10 md:py-14"}`}
      aria-labelledby={singleLessonMode ? `${curriculum.id}-lesson-route-title` : `${curriculum.id}-title`}
    >
      <div className="mx-auto max-w-6xl">
        {singleLessonMode && <h2 id={`${curriculum.id}-lesson-route-title`} className="sr-only">{curriculum.title}</h2>}
        {!singleLessonMode && <div className="mb-10 max-w-4xl">
          <p className="text-xs tracking-[0.22em] text-terracotta">
            VERSIONED CURRICULUM · {curriculum.version}
          </p>
          <h2
            id={`${curriculum.id}-title`}
            className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl"
          >
            {curriculum.title}
          </h2>
          {curriculum.descriptionKazakh && (
            <p className="mt-4 text-base leading-7 text-charcoal/70">
              {curriculum.descriptionKazakh}
            </p>
          )}
          {curriculum.editorialNoteKazakh && (
            <p className="mt-5 border-l-2 border-terracotta bg-terracotta/5 px-4 py-3 text-sm leading-6 text-charcoal/70">
              {curriculum.editorialNoteKazakh}
            </p>
          )}
        </div>}

        <div className={`mb-5 flex flex-col gap-3 border-y border-charcoal/10 py-4 sm:flex-row sm:items-center sm:justify-between ${singleLessonMode ? "mt-2" : ""}`}>
          <p className="text-sm font-medium">
            Орындалған сабақ: {completedLessonIds.length} / {lessonIds.length}
          </p>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-charcoal/10 sm:max-w-xs"
            role="progressbar"
            aria-label="Курс барысы"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
          >
            <div
              className="h-full bg-terracotta transition-[width]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {courseComplete && (
            <span className="text-sm font-semibold text-steppe">
              Курс аяқталды · +{TEK_COIN_REWARDS.milestone} Tek Coin
            </span>
          )}
        </div>

        {!singleLessonMode && <nav
          aria-label={`${curriculum.title} сабақтары`}
          className="mb-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
        >
          {curriculum.lessons.map((lesson, index) => {
            const done = completedLessonIds.includes(lesson.id);
            const active = index === activeIndex;
            const unlocked = lesson.prerequisites.every((id) => completedLessonIds.includes(id));
            return (
              <button
                key={lesson.id}
                type="button"
                disabled={!unlocked}
                aria-label={!unlocked ? `${lesson.title} — алдымен алдыңғы сабақты аяқтаңыз` : undefined}
                aria-current={active ? "step" : undefined}
                onClick={() => setActiveIndex(index)}
                className={`min-h-16 border px-4 py-3 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:cursor-not-allowed disabled:opacity-45 ${
                  active
                    ? "border-terracotta bg-terracotta text-white"
                    : "border-charcoal/20 hover:border-terracotta"
                }`}
              >
                <span className="mr-2 font-semibold">
                  {done ? "✓" : !unlocked ? <span aria-hidden="true">🔒</span> : `${index + 1}.`}
                </span>
                {lesson.title}
              </button>
            );
          })}
        </nav>}

        <article
          id={activeLesson.id}
          className="rounded-xl border border-charcoal/10 bg-paper p-4 sm:p-6 md:p-8"
          aria-labelledby={`${activeLesson.id}-title`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] text-terracotta">
                САБАҚ {activeIndex + 1} / {curriculum.lessons.length}
              </p>
              <h3
                id={`${activeLesson.id}-title`}
                className="mt-3 text-2xl font-semibold md:text-3xl"
              >
                {activeLesson.title}
              </h3>
            </div>
            {activeLessonComplete && (
              <span className="rounded-full border border-terracotta/40 px-4 py-2 text-sm font-medium text-terracotta">
                Аяқталды ✓
              </span>
            )}
          </div>

          {activeLesson.introductionKazakh && (
            <p className="mt-4 max-w-4xl text-sm leading-7 text-charcoal/70">
              {activeLesson.introductionKazakh}
            </p>
          )}

          <div className="mt-7 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border border-charcoal/15 p-5">
              <h4 className="font-semibold">Оқу мақсаттары</h4>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-charcoal/70">
                {activeLesson.learningObjectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              {activeLesson.teachingSections?.map((section) => (
                <section key={section.id} className="border border-charcoal/15 p-5">
                  <h4 className="font-semibold">{section.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-charcoal/70">
                    {section.explanationKazakh}
                  </p>
                  {section.items && section.items.length > 0 && (
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {section.items.map((item) => (
                        <li key={item} className="break-words bg-charcoal/5 px-3 py-2 text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.examples && section.examples.length > 0 && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {section.examples.map((example) => (
                        <div key={`${section.id}-${example.hanzi}-${example.pinyin}`} className="bg-white/45 p-3">
                          <p className="text-xl font-semibold">{example.hanzi}</p>
                          <p className="mt-1 text-sm">{example.pinyin}</p>
                          <p className="mt-1 text-xs text-charcoal/60">{example.translationKazakh}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>

          {lessonVocabulary.length > 0 && (
            <section className="mt-8" aria-labelledby={`${activeLesson.id}-vocabulary`}>
              <h4 id={`${activeLesson.id}-vocabulary`} className="text-xl font-semibold">
                Осы сабақтың сөздері
              </h4>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {lessonVocabulary.map((entry) => (
                  <article key={entry.id} className="border border-charcoal/15 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-2xl font-semibold">{entry.hanzi}</p>
                      <span className="text-xs uppercase tracking-wider text-terracotta">
                        {partOfSpeechLabels[entry.partOfSpeech] ?? entry.partOfSpeech}
                      </span>
                    </div>
                    <p className="mt-1 text-lg">{entry.pinyin}</p>
                    <p className="mt-1 text-sm text-charcoal/70">{entry.translationKazakh}</p>
                    <div className="mt-4 border-t border-charcoal/10 pt-3">
                      <p className="text-lg font-medium">{entry.example.hanzi}</p>
                      <p className="mt-1 text-sm">{entry.example.pinyin}</p>
                      <p className="mt-1 text-xs leading-5 text-charcoal/60">
                        {entry.example.translationKazakh}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10 border-t border-charcoal/15 pt-7" aria-labelledby={`${activeLesson.id}-practice`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.2em] text-terracotta">ТҮСІНІКТІ ТЕКСЕРУ</p>
                <h4 id={`${activeLesson.id}-practice`} className="mt-2 text-xl font-semibold">
                  Жаттығу және кері байланыс
                </h4>
              </div>
              <span className="text-xs text-charcoal/55">
                {lessonExercises.filter((exercise) => exerciseResults[exercise.id]).length} / {lessonExercises.length} дұрыс
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {lessonExercises.map((exercise, index) => {
                const result = exerciseResults[exercise.id];
                const selected = selectedAnswers[exercise.id];
                return (
                  <fieldset key={exercise.id} className="min-w-0 border border-charcoal/15 p-5">
                    <legend className="px-2 text-xs tracking-wide text-charcoal/55">
                      ЖАТТЫҒУ {index + 1} · {exercise.type === "listening-selection" ? "ТЫҢДАУ" : "ТАҢДАУ"}
                    </legend>
                    <p className="mt-1 font-medium leading-6">{exercise.prompt}</p>
                    {exercise.audioText && (
                      <button
                        type="button"
                        onClick={() => playAudio(exercise.audioText ?? "")}
                        className="mt-3 rounded-full border border-charcoal/25 px-4 py-2 text-sm transition hover:border-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                      >
                        Қытайша тыңдау 🔊
                      </button>
                    )}
                    <div className="mt-4 grid gap-2">
                      {(exercise.options ?? []).map((option) => (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={selected === option}
                          onClick={() => {
                            setSelectedAnswers((current) => ({ ...current, [exercise.id]: option }));
                            setExerciseResults((current) => {
                              const next = { ...current };
                              delete next[exercise.id];
                              return next;
                            });
                          }}
                          className={`min-h-11 rounded-sm border px-3 py-2 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
                            selected === option
                              ? "border-terracotta bg-terracotta/10"
                              : "border-charcoal/15 hover:border-terracotta/70"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={!selected}
                      onClick={() => checkAnswer(exercise)}
                      className="mt-4 rounded-full bg-charcoal px-5 py-2.5 text-sm text-white transition hover:bg-terracotta disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                    >
                      Жауапты тексеру
                    </button>
                    {result !== undefined && (
                      <p aria-live="polite" className={`mt-3 text-sm leading-6 ${result ? "text-green-800" : "text-danger"}`}>
                        {result ? "Дұрыс! " : "Әлі дұрыс емес. "}{exercise.explanationKazakh}
                      </p>
                    )}
                  </fieldset>
                );
              })}
            </div>
            {audioNotice && <p aria-live="polite" className="mt-3 text-xs text-charcoal/55">{audioNotice}</p>}
          </section>

          <div className="mt-8 flex flex-col gap-4 border-t border-charcoal/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite" className="text-sm text-charcoal/65">
              {activeLessonComplete
                ? "Бұл сабақтың орындалуы сақталды. Қайталап оқуға болады."
                : allExercisesCorrect
                  ? "Барлық жаттығу дұрыс орындалды. Сабақты аяқтап, барысты сақтаңыз."
                  : "Сабақты аяқтау үшін барлық жаттығуға дұрыс жауап беріңіз."}
              {progressNotice && <span className="mt-1 block text-danger">{progressNotice}</span>}
              {rewardNotice && <span className="mt-1 block font-semibold text-steppe">{rewardNotice}</span>}
            </p>
            <button
              type="button"
              disabled={!allExercisesCorrect || activeLessonComplete}
              onClick={completeLesson}
              className="min-h-12 shrink-0 rounded-lg bg-terracotta px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-40"
            >
              {activeLessonComplete ? "Сабақ аяқталды ✓" : `Сабақты аяқтау · +${TEK_COIN_REWARDS.lesson} Tek Coin`}
            </button>
          </div>
        </article>

        {singleLessonMode && lessonPathPrefix && moduleHref && (
          <nav className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" aria-label="Сабақ навигациясы">
            <Link href={moduleHref} className="min-h-11 inline-flex items-center text-sm font-semibold text-charcoal/70 underline-offset-4 hover:text-terracotta hover:underline">Курс тізіміне оралу</Link>
            <div className="flex gap-2">
              {activeIndex > 0 && <Link href={`${lessonPathPrefix}/${curriculum.lessons[activeIndex - 1].id}`} className="min-h-11 inline-flex items-center rounded-lg border border-charcoal/15 px-4 text-sm font-medium hover:border-terracotta/50">Алдыңғы сабақ</Link>}
              {activeIndex < curriculum.lessons.length - 1 && (
                activeLessonComplete
                  ? <Link href={`${lessonPathPrefix}/${curriculum.lessons[activeIndex + 1].id}`} className="min-h-11 inline-flex items-center gap-2 rounded-lg bg-charcoal px-4 text-sm font-semibold text-white hover:bg-terracotta">Келесі сабақ <span aria-hidden="true">→</span></Link>
                  : <span aria-disabled="true" className="min-h-11 inline-flex items-center rounded-lg bg-charcoal/10 px-4 text-sm font-medium text-charcoal/45">Келесі сабақ құлыптаулы</span>
              )}
            </div>
          </nav>
        )}
      </div>
    </section>
  );
}
