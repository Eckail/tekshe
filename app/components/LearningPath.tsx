
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
    href: "#pinyin-basics",
  },
  {
    id: 2,
    courseId: "tone-practice",
    title: "Төрт тон",
    subtitle: "FOUR TONES",
    description: "Қытай тіліндегі төрт негізгі тонды ажыратыңыз.",
    href: "#tone-practice",
  },
  {
    id: 3,
    courseId: "syllables",
    title: "Буындар",
    subtitle: "SYLLABLES",
    description: "Бастапқы дыбыстар мен соңғы дыбыстарды біріктіріңіз.",
    href: "#syllables",
  },
  {
    id: 4,
    courseId: "first-words",
    title: "Алғашқы сөздер",
    subtitle: "FIRST WORDS",
    description: "Күнделікті өмірде қолданылатын сөздерді үйреніңіз.",
    href: "#first-words",
  },
  {
    id: 5,
    courseId: "simple-sentences",
    title: "Қарапайым сөйлемдер",
    subtitle: "SIMPLE SENTENCES",
    description: "Алғашқы қытайша сөйлемдеріңізді құрастырыңыз.",
    href: "#simple-sentences",
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
        <p className="text-xs uppercase tracking-[0.25em] text-[#B85F3D]">
          YOUR LEARNING JOURNEY
        </p>

        <h2 className="mt-3 text-3xl font-bold text-[#242321]">
          Оқу жолы
        </h2>

        <p className="mt-2 text-sm text-[#242321]/60">
          Әр кезең жаңа білімге бастайды.
        </p>

        <p className="mt-4 text-sm text-[#242321]/60">
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
                ? "cursor-not-allowed border-[#242321]/10 bg-[#242321]/[0.02]"
                : "cursor-pointer border-[#B85F3D]/30 bg-[#F3EDE1] hover:border-[#B85F3D] hover:shadow-sm"
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                  stage.status === "locked"
                    ? "border-[#242321]/20 text-[#242321]/30"
                    : stage.status === "completed"
                      ? "border-[#B85F3D] bg-[#B85F3D] text-white"
                      : "border-[#B85F3D] text-[#B85F3D]"
                }`}
              >
                {stage.status === "completed" ? "✓" : stage.id}
              </div>

              {index !== stages.length - 1 && (
                <div className="mt-2 h-full min-h-8 w-px bg-[#242321]/15" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[10px] tracking-[0.2em] text-[#B85F3D]">
                  {stage.subtitle}
                </p>

                <span className="text-xs text-[#242321]/50">
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
                    ? "text-[#242321]/40"
                    : "text-[#242321]"
                }`}
              >
                {stage.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#242321]/60">
                {stage.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
