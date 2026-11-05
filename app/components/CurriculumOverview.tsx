"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Curriculum } from "../data/curriculum";
import { getCompletedCurriculumLessons } from "../data/curriculumProgress";
import AppIcon from "./AppIcon";

export default function CurriculumOverview({
  curriculum,
  basePath,
  levelId,
}: {
  curriculum: Curriculum;
  basePath: string;
  levelId?: string;
}) {
  const lessons = curriculum.lessons.filter((lesson) => !levelId || lesson.levelId === levelId);
  const lessonIds = lessons.map((lesson) => lesson.id);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () =>
      setCompleted(
        getCompletedCurriculumLessons(curriculum.id, curriculum.id, curriculum.lessons.map((lesson) => lesson.id))
      );
    refresh();
    window.addEventListener("tekshe-progress-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("tekshe-progress-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [curriculum]);

  const completedInLevel = lessonIds.filter((id) => completed.includes(id)).length;
  const progress = lessonIds.length ? Math.round((completedInLevel / lessonIds.length) * 100) : 0;

  return (
    <section aria-labelledby="lesson-list-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="lesson-list-title" className="text-section-title font-semibold">Сабақтар</h2>
          <p className="mt-1 text-sm text-charcoal/60">
            {completedInLevel} / {lessonIds.length} аяқталды
          </p>
        </div>
        <div className="w-full sm:w-48">
          <div className="mb-1 flex justify-between text-xs text-charcoal/60"><span>Оқу барысы</span><span>{progress}%</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-charcoal/10" role="progressbar" aria-label="Курс барысы" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className="h-full bg-terracotta transition-[width]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <ol className="grid gap-3">
        {lessons.map((lesson, index) => {
          const isComplete = completed.includes(lesson.id);
          const isUnlocked = lesson.prerequisites.every((id) => completed.includes(id));
          const href = `${basePath}/${lesson.id}`;
          const contents = (
            <>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold ${isComplete ? "border-steppe/30 bg-steppe/10 text-steppe" : "border-charcoal/10 bg-cream text-charcoal/65"}`}>
                {isComplete ? <AppIcon name="check" className="h-5 w-5" /> : String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-charcoal">{lesson.title}</span>
                <span className="mt-1 block text-xs leading-5 text-charcoal/60 sm:text-sm">
                  {lesson.introductionKazakh ?? lesson.learningObjectives[0] ?? "Қысқа сабақ"}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-charcoal/50">
                <span className="hidden sm:inline">{lesson.estimatedDurationMinutes} мин</span>
                {isComplete ? "Аяқталды" : isUnlocked ? <AppIcon name="arrow" className="h-4 w-4" /> : "Құлыптаулы"}
              </span>
            </>
          );

          return (
            <li key={lesson.id}>
              {isUnlocked ? (
                <Link href={href} className="flex min-h-[76px] items-center gap-3 rounded-xl border border-charcoal/10 bg-paper p-3 transition-colors hover:border-terracotta/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta sm:gap-4 sm:p-4">
                  {contents}
                </Link>
              ) : (
                <div aria-label={`${lesson.title} — алдыңғы сабақты аяқтаңыз`} className="flex min-h-[76px] items-center gap-3 rounded-xl border border-charcoal/8 bg-charcoal/[0.025] p-3 opacity-60 sm:gap-4 sm:p-4">
                  {contents}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
