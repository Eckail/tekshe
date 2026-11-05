"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Curriculum } from "../data/curriculum";
import { getCompletedCurriculumLessons } from "../data/curriculumProgress";
import AppIcon from "./AppIcon";

export default function HskLevelCatalog({ curriculum }: { curriculum: Curriculum }) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  useEffect(() => {
    const refresh = () => setCompletedIds(getCompletedCurriculumLessons(curriculum.id, curriculum.id, curriculum.lessons.map((lesson) => lesson.id)));
    refresh();
    window.addEventListener("tekshe-progress-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("tekshe-progress-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [curriculum]);

  return (
    <div className="space-y-5">
      <section aria-labelledby="available-hsk-title">
        <div className="mb-4"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">ҚОЛЖЕТІМДІ ДЕҢГЕЙ</p><h2 id="available-hsk-title" className="mt-2 text-section-title font-semibold">Бағдарлама деңгейлері</h2></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {curriculum.levels.map((level) => {
            const lessons = curriculum.lessons.filter((lesson) => lesson.levelId === level.id);
            const vocabularyCount = curriculum.vocabulary.filter((entry) => entry.levelId === level.id).length;
            const done = lessons.filter((lesson) => completedIds.includes(lesson.id)).length;
            return (
              <Link key={level.id} href={`/learn/hsk/${level.id}`} className="group rounded-xl border border-charcoal/10 bg-paper p-5 transition-colors hover:border-terracotta/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta sm:p-6">
                <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">{level.displayName}</p><h3 className="mt-2 text-xl font-semibold">{lessons.length} сабақтық бастау курсы</h3><p className="mt-1 text-sm leading-5 text-charcoal/60">{level.learningGoals[0]}</p></div><AppIcon name="arrow" className="h-5 w-5 shrink-0 text-charcoal/50 group-hover:text-terracotta" /></div>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-charcoal/60"><span>{vocabularyCount} сөз</span><span>{lessons.length} сабақ</span><span>{done} аяқталды</span></div>
              </Link>
            );
          })}
        </div>
      </section>
      <p className="rounded-xl border border-dashed border-charcoal/20 bg-paper/50 p-4 text-sm leading-6 text-charcoal/60">Басқа HSK деңгейлерінің оқу деректері әзірге жоқ. Әр деңгей ресми тізім бойынша тексерілгеннен кейін ғана қосылады.</p>
    </div>
  );
}
