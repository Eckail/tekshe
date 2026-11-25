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
  const lessons = curriculum.lessons.filter(
    (lesson) => !levelId || lesson.levelId === levelId
  );

  const lessonIds = lessons.map((lesson) => lesson.id);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => {
      setCompleted(
        getCompletedCurriculumLessons(
          curriculum.id,
          curriculum.id,
          curriculum.lessons.map((lesson) => lesson.id)
        )
      );
    };

    refresh();
    window.addEventListener("tekshe-progress-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("tekshe-progress-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [curriculum]);

  const completedInLevel = lessonIds.filter((id) =>
    completed.includes(id)
  ).length;

  const progress = lessonIds.length
    ? Math.round((completedInLevel / lessonIds.length) * 100)
    : 0;

  return (
    <section aria-labelledby="lesson-list-title">
      <div className="mb-5 rounded-2xl border border-border-soft bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-blue-dark">
              КУРС ПРОГРЕСІ
            </p>

            <h2
              id="lesson-list-title"
              className="mt-2 text-xl font-semibold text-text-primary"
            >
              Сабақтар
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              {completedInLevel} / {lessonIds.length} сабақ аяқталды
            </p>
          </div>

          <div className="w-full sm:w-56">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-text-secondary">Жалпы прогресс</span>
              <span className="font-semibold tabular-nums text-blue-dark">
                {progress}%
              </span>
            </div>

            <div
              className="h-2.5 overflow-hidden rounded-full bg-ice"
              role="progressbar"
              aria-label="Курс барысы"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue to-mint-dark transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <ol className="grid gap-3">
        {lessons.map((lesson, index) => {
          const isComplete = completed.includes(lesson.id);

          const isUnlocked = lesson.prerequisites.every((id) =>
            completed.includes(id)
          );

          const href = `${basePath}/${lesson.id}`;

          const description =
            lesson.introductionKazakh ??
            lesson.learningObjectives[0] ??
            "Қысқа сабақ";

          const contents = (
            <>
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold ${
                  isComplete
                    ? "border-success/20 bg-success-bg text-success"
                    : isUnlocked
                      ? "border-blue/15 bg-ice text-blue-dark"
                      : "border-border-soft bg-card-soft text-text-secondary"
                }`}
              >
                {isComplete ? (
                  <AppIcon name="check" className="h-5 w-5" />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-text-primary">
                  {lesson.title}
                </span>

                <span className="mt-1 block text-xs leading-5 text-text-secondary sm:text-sm">
                  {description}
                </span>
              </span>

              <span className="flex shrink-0 items-center gap-2 text-xs">
                <span className="hidden text-text-secondary sm:inline">
                  {lesson.estimatedDurationMinutes} мин
                </span>

                {isComplete ? (
                  <span className="font-semibold text-success">
                    Аяқталды
                  </span>
                ) : isUnlocked ? (
                  <AppIcon
                    name="arrow"
                    className="h-4 w-4 text-blue-dark transition-transform group-hover:translate-x-1"
                  />
                ) : (
                  <span className="inline-flex items-center gap-1 text-text-secondary">
                    <AppIcon name="clock" className="h-3.5 w-3.5" />
                    Құлыптаулы
                  </span>
                )}
              </span>
            </>
          );

          return (
            <li key={lesson.id}>
              {isUnlocked ? (
                <Link
                  href={href}
                  className="group flex min-h-[82px] items-center gap-3 rounded-2xl border border-border-soft bg-card p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue/35 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:gap-4 sm:p-4"
                >
                  {contents}
                </Link>
              ) : (
                <div
                  aria-label={`${lesson.title} — алдыңғы сабақты аяқтаңыз`}
                  className="flex min-h-[82px] items-center gap-3 rounded-2xl border border-border-soft/70 bg-card-soft/60 p-3 opacity-65 sm:gap-4 sm:p-4"
                >
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
