"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Curriculum } from "../data/curriculum";
import { getCompletedCurriculumLessons } from "../data/curriculumProgress";
import AppIcon from "./AppIcon";

export default function HskLevelCatalog({
  curriculum,
}: {
  curriculum: Curriculum;
}) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => {
      setCompletedIds(
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

  return (
    <div className="space-y-6">
      <section aria-labelledby="available-hsk-title">
        <div className="mb-5">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-mint-dark">
            HSK ОҚУ БАҒДАРЛАМАСЫ
          </p>

          <h2
            id="available-hsk-title"
            className="mt-2 text-xl font-semibold text-text-primary sm:text-2xl"
          >
            Бағдарлама деңгейлері
          </h2>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Әр деңгейдегі қолжетімді сабақтарды және сөздік қорды зерттеңіз.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {curriculum.levels.map((level) => {
            const lessons = curriculum.lessons.filter(
              (lesson) => lesson.levelId === level.id
            );

            const vocabularyCount = curriculum.vocabulary.filter(
              (entry) => entry.levelId === level.id
            ).length;

            const done = lessons.filter((lesson) =>
              completedIds.includes(lesson.id)
            ).length;

            const percent = lessons.length
              ? Math.round((done / lessons.length) * 100)
              : 0;

            return (
              <Link
                key={level.id}
                href={`/learn/hsk/${level.id}`}
                className="group relative flex min-h-[250px] flex-col overflow-hidden rounded-[1.75rem] border border-border-soft bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-mint-dark/30 hover:shadow-[0_16px_36px_rgba(57,121,107,0.10)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:p-6"
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-mint/35 blur-3xl"
                  aria-hidden="true"
                />

                <div className="relative flex items-center justify-between">
                  <span className="rounded-full bg-mint/40 px-3 py-1.5 text-xs font-semibold text-mint-dark">
                    {level.displayName}
                  </span>

                  <AppIcon
                    name="arrow"
                    className="h-5 w-5 text-mint-dark transition-transform group-hover:translate-x-1"
                  />
                </div>

                <div className="relative mt-6">
                  <h3 className="text-xl font-semibold text-text-primary">
                    {lessons.length} сабақтық бастау курсы
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
                    {level.learningGoals[0] ??
                      "Осы деңгейдің оқу мақсаттарын меңгеріңіз."}
                  </p>
                </div>

                <div className="relative mt-auto pt-6">
                  <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-secondary">
                    <span>{vocabularyCount} сөз</span>
                    <span>{lessons.length} сабақ</span>
                    <span>{done} аяқталды</span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full bg-ice"
                    role="progressbar"
                    aria-label={`${level.displayName} барысы`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-mint to-mint-dark transition-[width] duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="mt-2 text-right text-xs font-semibold tabular-nums text-mint-dark">
                    {percent}%
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border-soft bg-card-soft/70 p-4 sm:p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-text-secondary shadow-sm">
          <AppIcon name="clock" className="h-4 w-4" />
        </span>

        <p className="text-sm leading-6 text-text-secondary">
          Басқа HSK деңгейлерінің оқу деректері әзірге жоқ. Әр деңгей
          ресми тізім бойынша тексерілгеннен кейін ғана қосылады.
        </p>
      </div>
    </div>
  );
}
