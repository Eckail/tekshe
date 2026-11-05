
"use client";

import { useEffect, useState } from "react";
import {
  getCompletedCourses,
  type CourseId,
} from "../data/courseProgress";

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
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-terracotta">
          YOUR LEARNING JOURNEY
        </p>

        <h2 className="mt-3 text-3xl font-bold text-charcoal">
          Оқу жолы
        </h2>

        <p className="mt-2 text-sm text-charcoal/60">
          Әр кезең жаңа білімге бастайды.
        </p>

        <p className="mt-4 text-sm text-charcoal/60">
          {completedCount} / {stageDefinitions.length} курс аяқталды
        </p>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <a
            key={stage.id}
            href={stage.status !== "locked" ? stage.href : undefined}
            onClick={(event) => {
              if (stage.status === "locked") {
                event.preventDefault();
              }
            }}
            aria-disabled={stage.status === "locked"}
            className={`relative flex gap-5 rounded-2xl border p-5 transition sm:p-6 ${
              stage.status === "locked"
                ? "cursor-not-allowed border-charcoal/10 bg-charcoal/[0.02]"
                : "cursor-pointer border-terracotta/30 bg-cream hover:border-terracotta hover:shadow-sm"
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                  stage.status === "locked"
                    ? "border-charcoal/20 text-charcoal/30"
                    : stage.status === "completed"
                      ? "border-terracotta bg-terracotta text-white"
                      : "border-terracotta text-terracotta"
                }`}
              >
                {stage.status === "completed" ? "✓" : stage.id}
              </div>

              {index !== stages.length - 1 && (
                <div className="mt-2 h-full min-h-8 w-px bg-charcoal/15" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[10px] tracking-[0.2em] text-terracotta">
                  {stage.subtitle}
                </p>

                <span className="text-xs text-charcoal/50">
                  {stage.status === "completed"
                    ? "Аяқталды ✓"
                    : stage.status === "available"
                      ? "Қолжетімді"
                      : "Құлыптаулы"}
                </span>
              </div>

              <h3
                className={`mt-2 text-lg font-semibold ${
                  stage.status === "locked"
                    ? "text-charcoal/40"
                    : "text-charcoal"
                }`}
              >
                {stage.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-charcoal/60">
                {stage.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
