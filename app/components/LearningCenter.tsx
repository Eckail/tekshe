"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Curriculum } from "../data/curriculum";
import { getCompletedCurriculumLessons } from "../data/curriculumProgress";
import AppIcon from "./AppIcon";

function ModuleCard({ curriculum, href, label }: { curriculum: Curriculum; href: string; label: string }) {
  const [completed, setCompleted] = useState(0);
  const total = curriculum.lessons.length;

  useEffect(() => {
    const refresh = () => setCompleted(getCompletedCurriculumLessons(curriculum.id, curriculum.id, curriculum.lessons.map((lesson) => lesson.id)).length);
    refresh();
    window.addEventListener("tekshe-progress-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("tekshe-progress-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [curriculum]);

  const percent = total ? Math.round((completed / total) * 100) : 0;
  return (
    <Link href={href} className="group flex min-h-[220px] flex-col rounded-xl border border-charcoal/10 bg-paper p-5 transition-colors hover:border-terracotta/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">{label}</p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-charcoal">{curriculum.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-charcoal/65">{curriculum.descriptionKazakh}</p>
      <div className="mt-auto pt-6">
        <div className="mb-2 flex items-center justify-between text-xs text-charcoal/60"><span>{completed} / {total} сабақ</span><span>{percent}%</span></div>
        <div className="h-1.5 overflow-hidden rounded-full bg-charcoal/10" role="progressbar" aria-label={`${curriculum.title} барысы`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><div className="h-full bg-terracotta transition-[width]" style={{ width: `${percent}%` }} /></div>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-charcoal group-hover:text-terracotta">Модульді ашу <AppIcon name="arrow" className="h-4 w-4" /></span>
      </div>
    </Link>
  );
}

export default function LearningCenter({ pinyin, hsk }: { pinyin: Curriculum; hsk: Curriculum }) {
  const pinyinCount = pinyin.lessons.length;
  const hskLevel = hsk.levels[0];
  const hskWords = hsk.vocabulary.filter((entry) => entry.levelId === hskLevel?.id).length;
  const hskLessons = hsk.lessons.filter((lesson) => lesson.levelId === hskLevel?.id).length;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-section-title font-semibold">Қолжетімді бағдарламалар</h2>
        <p className="mt-1 text-sm text-charcoal/60">Қазір тек дерек пен сабақтары дайын модульдер көрсетілген.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ModuleCard curriculum={pinyin} href="/learn/pinyin" label={`ПАЙДАЛАНУҒА ДАЙЫН · ${pinyinCount} САБАҚ`} />
        <ModuleCard curriculum={hsk} href="/learn/hsk" label={`${hskLevel?.displayName ?? "HSK"} · ${hskLessons} САБАҚ · ${hskWords} СӨЗ`} />
      </div>
      <section className="rounded-xl border border-charcoal/10 bg-sand/30 p-5 sm:p-6" aria-labelledby="coming-soon-title">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/50">КЕЛЕСІ КЕЗЕҢДЕР</p>
        <h2 id="coming-soon-title" className="mt-2 text-lg font-semibold">Басқа модульдер әзірге қолжетімсіз</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal/65">HSK 2–9, оқу, жазу, айтылым және аралық қайталау жүйесі бойынша сабақ дерегі әлі жоқ. Дайын болмайынша оларды курс ретінде көрсетпейміз.</p>
      </section>
    </div>
  );
}
