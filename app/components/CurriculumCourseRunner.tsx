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

type Props = {
  curriculum: Curriculum;
  sectionId?: string;
  legacyCourseId?: CourseId;
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
}: Props) {
  const lessonIds = useMemo(
    () => curriculum.lessons.map(({ id }) => id),
    [curriculum.lessons]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [exerciseResults, setExerciseResults] = useState<Record<string, boolean>>({});
  const [audioNotice, setAudioNotice] = useState("");
  const [progressNotice, setProgressNotice] = useState("");

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
    setProgressNotice("");
    setCompletedLessonIds(result.completedLessonIds);
  }

  return (
    <section
      id={sectionId ?? curriculum.id}
      className="border-t border-[#242321]/20 px-6 py-20 md:px-12"
      aria-labelledby={`${curriculum.id}-title`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-4xl">
          <p className="text-xs tracking-[0.22em] text-[#B85F3D]">
            VERSIONED CURRICULUM · {curriculum.version}
          </p>
          <h2
            id={`${curriculum.id}-title`}
            className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl"
          >
            {curriculum.title}
          </h2>
          {curriculum.descriptionKazakh && (
            <p className="mt-4 text-base leading-7 text-[#242321]/70">
              {curriculum.descriptionKazakh}
            </p>
          )}
          {curriculum.editorialNoteKazakh && (
            <p className="mt-5 border-l-2 border-[#B85F3D] bg-[#B85F3D]/5 px-4 py-3 text-sm leading-6 text-[#242321]/70">
              {curriculum.editorialNoteKazakh}
            </p>
          )}
        </div>

        <div className="mb-8 flex flex-col gap-3 border-y border-[#242321]/15 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium">
            Орындалған сабақ: {completedLessonIds.length} / {lessonIds.length}
          </p>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-[#242321]/10 sm:max-w-xs"
            role="progressbar"
            aria-label="Курс барысы"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
          >
            <div
              className="h-full bg-[#B85F3D] transition-[width]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {courseComplete && (
            <span className="text-sm font-semibold text-[#B85F3D]">
              Курс аяқталды · бір реттік +{COURSE_COMPLETION_XP} XP
            </span>
          )}
        </div>

        <nav
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
                className={`min-h-16 border px-4 py-3 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B85F3D] disabled:cursor-not-allowed disabled:opacity-45 ${
                  active
                    ? "border-[#B85F3D] bg-[#B85F3D] text-white"
                    : "border-[#242321]/20 hover:border-[#B85F3D]"
                }`}
              >
                <span className="mr-2 font-semibold">
                  {done ? "✓" : !unlocked ? <span aria-hidden="true">🔒</span> : `${index + 1}.`}
                </span>
                {lesson.title}
              </button>
            );
          })}
        </nav>

        <article
          id={activeLesson.id}
          className="border border-[#242321]/20 bg-[#F3EDE1] p-5 md:p-8"
          aria-labelledby={`${activeLesson.id}-title`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] text-[#B85F3D]">
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
              <span className="rounded-full border border-[#B85F3D]/40 px-4 py-2 text-sm font-medium text-[#B85F3D]">
                Аяқталды ✓
              </span>
            )}
          </div>

          {activeLesson.introductionKazakh && (
            <p className="mt-4 max-w-4xl text-sm leading-7 text-[#242321]/70">
              {activeLesson.introductionKazakh}
            </p>
          )}

          <div className="mt-7 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border border-[#242321]/15 p-5">
              <h4 className="font-semibold">Оқу мақсаттары</h4>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#242321]/70">
                {activeLesson.learningObjectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              {activeLesson.teachingSections?.map((section) => (
                <section key={section.id} className="border border-[#242321]/15 p-5">
                  <h4 className="font-semibold">{section.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-[#242321]/70">
                    {section.explanationKazakh}
                  </p>
                  {section.items && section.items.length > 0 && (
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {section.items.map((item) => (
                        <li key={item} className="break-words bg-[#242321]/5 px-3 py-2 text-sm">
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
                          <p className="mt-1 text-xs text-[#242321]/60">{example.translationKazakh}</p>
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
                  <article key={entry.id} className="border border-[#242321]/15 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-2xl font-semibold">{entry.hanzi}</p>
                      <span className="text-xs uppercase tracking-wider text-[#B85F3D]">
                        {partOfSpeechLabels[entry.partOfSpeech] ?? entry.partOfSpeech}
                      </span>
                    </div>
                    <p className="mt-1 text-lg">{entry.pinyin}</p>
                    <p className="mt-1 text-sm text-[#242321]/70">{entry.translationKazakh}</p>
                    <div className="mt-4 border-t border-[#242321]/10 pt-3">
                      <p className="text-lg font-medium">{entry.example.hanzi}</p>
                      <p className="mt-1 text-sm">{entry.example.pinyin}</p>
                      <p className="mt-1 text-xs leading-5 text-[#242321]/60">
                        {entry.example.translationKazakh}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10 border-t border-[#242321]/15 pt-7" aria-labelledby={`${activeLesson.id}-practice`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.2em] text-[#B85F3D]">ТҮСІНІКТІ ТЕКСЕРУ</p>
                <h4 id={`${activeLesson.id}-practice`} className="mt-2 text-xl font-semibold">
                  Жаттығу және кері байланыс
                </h4>
              </div>
              <span className="text-xs text-[#242321]/55">
                {lessonExercises.filter((exercise) => exerciseResults[exercise.id]).length} / {lessonExercises.length} дұрыс
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {lessonExercises.map((exercise, index) => {
                const result = exerciseResults[exercise.id];
                const selected = selectedAnswers[exercise.id];
                return (
                  <fieldset key={exercise.id} className="min-w-0 border border-[#242321]/15 p-5">
                    <legend className="px-2 text-xs tracking-wide text-[#242321]/55">
                      ЖАТТЫҒУ {index + 1} · {exercise.type === "listening-selection" ? "ТЫҢДАУ" : "ТАҢДАУ"}
                    </legend>
                    <p className="mt-1 font-medium leading-6">{exercise.prompt}</p>
                    {exercise.audioText && (
                      <button
                        type="button"
                        onClick={() => playAudio(exercise.audioText ?? "")}
                        className="mt-3 rounded-full border border-[#242321]/25 px-4 py-2 text-sm transition hover:border-[#B85F3D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B85F3D]"
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
                          className={`min-h-11 rounded-sm border px-3 py-2 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B85F3D] ${
                            selected === option
                              ? "border-[#B85F3D] bg-[#B85F3D]/10"
                              : "border-[#242321]/15 hover:border-[#B85F3D]/70"
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
                      className="mt-4 rounded-full bg-[#242321] px-5 py-2.5 text-sm text-white transition hover:bg-[#B85F3D] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B85F3D]"
                    >
                      Жауапты тексеру
                    </button>
                    {result !== undefined && (
                      <p aria-live="polite" className={`mt-3 text-sm leading-6 ${result ? "text-green-800" : "text-[#9B3E28]"}`}>
                        {result ? "Дұрыс! " : "Әлі дұрыс емес. "}{exercise.explanationKazakh}
                      </p>
                    )}
                  </fieldset>
                );
              })}
            </div>
            {audioNotice && <p aria-live="polite" className="mt-3 text-xs text-[#242321]/55">{audioNotice}</p>}
          </section>

          <div className="mt-8 flex flex-col gap-4 border-t border-[#242321]/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite" className="text-sm text-[#242321]/65">
              {activeLessonComplete
                ? "Бұл сабақтың орындалуы сақталды. Қайталап оқуға болады."
                : allExercisesCorrect
                  ? "Барлық жаттығу дұрыс орындалды. Сабақты аяқтап, барысты сақтаңыз."
                  : "Сабақты аяқтау үшін барлық жаттығуға дұрыс жауап беріңіз."}
              {progressNotice && <span className="mt-1 block text-[#9B3E28]">{progressNotice}</span>}
            </p>
            <button
              type="button"
              disabled={!allExercisesCorrect || activeLessonComplete}
              onClick={completeLesson}
              className="min-h-12 shrink-0 rounded-full bg-[#B85F3D] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#242321] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B85F3D]"
            >
              {activeLessonComplete ? "Сабақ аяқталды ✓" : "Сабақты аяқтау"}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
