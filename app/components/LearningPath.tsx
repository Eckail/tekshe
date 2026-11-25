"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getCompletedCourses,
  type CourseId,
} from "../data/courseProgress";
import AppIcon from "./AppIcon";

type LearningStage = {
  id: number;
  courseId: CourseId;
  title: string;
  subtitle: string;
  description: string;
  href: string;
};

const stageDefinitions: LearningStage[] = [
  {
    id: 1,
    courseId: "pinyin-basics",
    title: "Пиньинь негіздері",
    subtitle: "PINYIN BASICS",
    description: "Қытай тілінің дыбыстары мен әріптерін үйреніңіз.",
    href: "/learn/pinyin",
  },
  {
    id: 2,
    courseId: "tone-practice",
    title: "Төрт тон",
    subtitle: "FOUR TONES",
    description: "Қытай тіліндегі төрт негізгі тонды ажыратыңыз.",
    href: "/practice#tone-practice",
  },
  {
    id: 3,
    courseId: "syllables",
    title: "Буындар",
    subtitle: "SYLLABLES",
    description: "Бастапқы дыбыстар мен соңғы дыбыстарды біріктіріңіз.",
    href: "/practice#syllables",
  },
  {
    id: 4,
    courseId: "first-words",
    title: "Алғашқы сөздер",
    subtitle: "FIRST WORDS",
    description: "Күнделікті өмірде қолданылатын сөздерді үйреніңіз.",
    href: "/practice#first-words",
  },
  {
    id: 5,
    courseId: "simple-sentences",
    title: "Қарапайым сөйлемдер",
    subtitle: "SIMPLE SENTENCES",
    description: "Алғашқы қытайша сөйлемдеріңізді құрастырыңыз.",
    href: "/practice#simple-sentences",
  },
];

export default function LearningPath() {
  const [completedCourses, setCompletedCourses] = useState<CourseId[]>([]);

  useEffect(() => {
    function updateProgress() {
      setCompletedCourses(getCompletedCourses());
    }

    updateProgress();

    window.addEventListener(
      "tekshe-progress-updated",
      updateProgress
    );

    return () => {
      window.removeEventListener(
        "tekshe-progress-updated",
        updateProgress
      );
    };
  }, []);

  const stages = stageDefinitions.map((stage, index) => {
    const completed = completedCourses.includes(stage.courseId);

    const previousCompleted =
      index === 0 ||
      completedCourses.includes(stageDefinitions[index - 1].courseId);

    const unlocked = completed || previousCompleted;

    return {
      ...stage,
      status: completed
        ? "completed"
        : unlocked
          ? "available"
          : "locked",
    } as const;
  });

  const completedCount = completedCourses.length;

  return (
    <section aria-labelledby="learning-path-title">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-blue-dark">
            YOUR LEARNING JOURNEY
          </p>

          <h2
            id="learning-path-title"
            className="mt-2 text-2xl font-semibold tracking-tight text-text-primary"
          >
            Оқу жолы
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
            Негізгі білімнен алғашқы сөйлемдерге дейінгі оқу кезеңдері.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ice px-3.5 py-2 text-xs font-semibold text-blue-dark">
          <AppIcon name="check" className="h-4 w-4" />
          {completedCount} / {stageDefinitions.length} курс аяқталды
        </span>
      </div>

      <div className="rounded-[1.75rem] border border-border-soft bg-card p-5 shadow-sm sm:p-7">
        <ol className="space-y-0">
          {stages.map((stage, index) => {
            const isCompleted = stage.status === "completed";
            const isAvailable = stage.status === "available";
            const isLocked = stage.status === "locked";

            const content = (
              <>
                <span
                  className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold ${
                    isCompleted
                      ? "border-success/20 bg-success-bg text-success"
                      : isAvailable
                        ? "border-blue/20 bg-ice text-blue-dark"
                        : "border-border-soft bg-card-soft text-text-secondary"
                  }`}
                >
                  {isCompleted ? (
                    <AppIcon name="check" className="h-5 w-5" />
                  ) : (
                    stage.id
                  )}
                </span>

                <span className="min-w-0 flex-1 py-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.16em] text-text-secondary">
                      {stage.subtitle}
                    </span>

                    {isCompleted && (
                      <span className="rounded-full bg-success-bg px-2 py-1 text-[10px] font-semibold text-success">
                        Аяқталды
                      </span>
                    )}

                    {isAvailable && (
                      <span className="rounded-full bg-ice px-2 py-1 text-[10px] font-semibold text-blue-dark">
                        Қолжетімді
                      </span>
                    )}

                    {isLocked && (
                      <span className="rounded-full bg-card-soft px-2 py-1 text-[10px] font-medium text-text-secondary">
                        Құлыптаулы
                      </span>
                    )}
                  </span>

                  <span className="mt-2 block font-semibold text-text-primary">
                    {stage.title}
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-text-secondary sm:text-sm">
                    {stage.description}
                  </span>
                </span>

                {!isLocked && (
                  <AppIcon
                    name="arrow"
                    className="h-4 w-4 shrink-0 text-blue-dark transition-transform group-hover:translate-x-1"
                  />
                )}
              </>
            );

            return (
              <li key={stage.id} className="relative flex gap-4 pb-5 last:pb-0 sm:gap-5">
                {index !== stages.length - 1 && (
                  <span
                    className={`absolute bottom-0 left-[21px] top-11 w-px ${
                      isCompleted ? "bg-success/30" : "bg-border-soft"
                    }`}
                    aria-hidden="true"
                  />
                )}

                {isLocked ? (
                  <div
                    aria-label={`${stage.title} — алдыңғы кезеңді аяқтаңыз`}
                    aria-disabled="true"
                    className="flex min-h-[94px] w-full items-center gap-3 rounded-2xl border border-border-soft/70 bg-card-soft/50 p-3 opacity-65 sm:gap-4 sm:p-4"
                  >
                    {content}
                  </div>
                ) : (
                  <Link
                    href={stage.href}
                    className="group flex min-h-[94px] w-full items-center gap-3 rounded-2xl border border-border-soft bg-card-soft/45 p-3 transition duration-200 hover:border-blue/30 hover:bg-ice/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:gap-4 sm:p-4"
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
