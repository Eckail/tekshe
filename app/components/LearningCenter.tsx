"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Curriculum } from "../data/curriculum";
import { getCompletedCurriculumLessons } from "../data/curriculumProgress";
import AppIcon from "./AppIcon";

function ModuleCard({
  curriculum,
  href,
  label,
  icon,
  accent,
  detail,
}: {
  curriculum: Curriculum;
  href: string;
  label: string;
  icon: "book" | "spark";
  accent: "blue" | "mint";
  detail: string;
}) {
  const [completed, setCompleted] = useState(0);
  const total = curriculum.lessons.length;
  const isMint = accent === "mint";

  useEffect(() => {
    const refresh = () => {
      setCompleted(
        getCompletedCurriculumLessons(
          curriculum.id,
          curriculum.id,
          curriculum.lessons.map((lesson) => lesson.id)
        ).length
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

  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <Link
      href={href}
      className="group relative flex min-h-[310px] flex-col overflow-hidden rounded-card border border-border-soft bg-card p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-floating focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:p-7"
    >
      <div
        className={`pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-90 ${
          isMint ? "bg-mint/45" : "bg-sky/40"
        }`}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            isMint
              ? "bg-mint/45 text-mint-dark"
              : "bg-blue/10 text-blue-dark"
          }`}
        >
          <AppIcon name={icon} className="h-6 w-6" />
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] ${
            isMint
              ? "bg-mint/35 text-mint-dark"
              : "bg-ice text-blue-dark"
          }`}
        >
          {label}
        </span>
      </div>

      <div className="relative mt-7">
        <h3 className="text-2xl font-semibold tracking-tight text-text-primary">
          {curriculum.title}
        </h3>

        <p className="mt-3 max-w-md text-sm leading-6 text-text-secondary">
          {curriculum.descriptionKazakh}
        </p>

        <p className="mt-3 text-xs font-medium text-text-secondary">
          {detail}
        </p>
      </div>

      <div className="relative mt-auto pt-7">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs">
          <span className="text-text-secondary">
            {completed} / {total} сабақ аяқталды
          </span>
          <span className="font-semibold tabular-nums text-text-primary">
            {percent}%
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-ice"
          role="progressbar"
          aria-label={`${curriculum.title} барысы`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div
            className={`h-full rounded-full transition-[width] duration-500 ${
              isMint
                ? "bg-gradient-to-r from-mint to-mint-dark"
                : "bg-gradient-to-r from-sky to-blue-dark"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <div
          className={`mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold ${
            isMint ? "text-mint-dark" : "text-blue-dark"
          }`}
        >
          Курсты ашу
          <AppIcon
            name="arrow"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

export default function LearningCenter({
  pinyin,
  hsk,
}: {
  pinyin: Curriculum;
  hsk: Curriculum;
}) {
  const pinyinCount = pinyin.lessons.length;
  const hskLevel = hsk.levels[0];

  const hskWords = hsk.vocabulary.filter(
    (entry) => entry.levelId === hskLevel?.id
  ).length;

  const hskLessons = hsk.lessons.filter(
    (lesson) => lesson.levelId === hskLevel?.id
  ).length;

  return (
    <div className="space-y-9">
      <section className="relative isolate overflow-hidden rounded-card border border-border-soft bg-gradient-to-br from-card via-card-soft to-sky/25 p-6 shadow-card sm:p-8 lg:p-10">
        <div
          className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-sky/25 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-28 right-1/3 -z-10 h-64 w-64 rounded-full bg-mint/30 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-2 bottom-0 -z-10 select-none font-serif text-[11rem] leading-none text-blue-dark/[0.08] sm:right-10 sm:text-[15rem]"
          aria-hidden="true"
        >
          学
        </div>

        <p className="text-[10px] font-semibold tracking-[0.22em] text-blue-dark sm:text-xs">
          YOUR CHINESE LEARNING JOURNEY
        </p>

        <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
          Қытай тілін бір қадамнан бастаңыз.
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-7 text-text-secondary sm:text-base">
          Алдымен дыбыстарды меңгеріңіз. Содан кейін сөздерге, сөйлемдерге
          және күнделікті қарым-қатынасқа өтіңіз.
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          <span className="rounded-full border border-border-soft bg-card/75 px-3 py-2 text-xs font-medium text-blue-dark backdrop-blur-sm">
            {pinyinCount} пиньинь сабағы
          </span>

          <span className="rounded-full border border-border-soft bg-card/75 px-3 py-2 text-xs font-medium text-mint-dark backdrop-blur-sm">
            {hskLessons} HSK сабағы
          </span>

          <span className="rounded-full border border-border-soft bg-card/75 px-3 py-2 text-xs font-medium text-text-secondary backdrop-blur-sm">
            {hskWords} сөз
          </span>
        </div>
      </section>

      <section aria-labelledby="available-programs-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-blue-dark">
              ОҚУ БАҒДАРЛАМАЛАРЫ
            </p>

            <h2
              id="available-programs-title"
              className="mt-2 text-xl font-semibold tracking-tight text-text-primary sm:text-2xl"
            >
              Қолжетімді курстар
            </h2>
          </div>

          <span className="text-xs text-text-secondary">
            {pinyinCount + hskLessons} дайын сабақ
          </span>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <ModuleCard
            curriculum={pinyin}
            href="/learn/pinyin"
            label="БАСТАПҚЫ ДЕҢГЕЙ"
            icon="book"
            accent="blue"
            detail="Дыбыстар · Буындар · Тондар"
          />

          <ModuleCard
            curriculum={hsk}
            href="/learn/hsk"
            label={hskLevel?.displayName ?? "HSK"}
            icon="spark"
            accent="mint"
            detail="Сөздік · Қарапайым сөйлемдер · HSK"
          />
        </div>
      </section>

      <section
        className="rounded-secondary border border-dashed border-border-soft bg-card-soft/80 p-5 sm:p-6"
        aria-labelledby="coming-soon-title"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-soft bg-card text-blue-dark shadow-card">
            <AppIcon name="clock" className="h-5 w-5" />
          </span>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-text-secondary">
              КЕЛЕСІ КЕЗЕҢДЕР
            </p>

            <h2
              id="coming-soon-title"
              className="mt-2 font-semibold text-text-primary"
            >
              Оқу бағдарламасы біртіндеп кеңейеді
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              HSK 2–9, оқу, жазу, айтылым және аралық қайталау сабақтары
              дайындалғаннан кейін ғана платформаға қосылады.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
