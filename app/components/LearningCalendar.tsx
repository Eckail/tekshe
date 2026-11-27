"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getLearningCalendarMonth,
  type LearningCalendarDay,
} from "../data/learningCalendar";

const WEEKDAYS = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сн", "Жс"];
const PROGRESS_EVENT = "tekshe-progress-updated";
const subscribeHydration = () => () => {};
const getHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatSelectedDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("kk-KZ", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(new Date(year, month - 1, day));
}

function ActivityMarkers({ day }: { day: LearningCalendarDay }) {
  const markers = [
    day.lessonCount > 0 ? "bg-blue-dark" : null,
    day.exerciseCount > 0 ? "bg-mint-dark" : null,
    day.reviewCount > 0 ? "bg-amber-600" : null,
  ].filter((item): item is string => item !== null);

  return (
    <span className="mt-1 flex h-1.5 items-center justify-center gap-1" aria-hidden="true">
      {markers.map((color) => <span key={color} className={`h-1.5 w-1.5 rounded-full ${color}`} />)}
    </span>
  );
}

export default function LearningCalendar() {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const [todayDate, setTodayDate] = useState<Date | null>(null);
  const [monthDate, setMonthDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [, setRevision] = useState(0);

  useEffect(() => {
    const initializeFrame = window.requestAnimationFrame(() => {
      const today = new Date();
      setTodayDate(today);
      setMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
      setSelectedDate(dateKey(today));
    });
    const refresh = () => setRevision((current) => current + 1);
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.cancelAnimationFrame(initializeFrame);
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const calendar = monthDate && todayDate
    ? getLearningCalendarMonth(monthDate.getFullYear(), monthDate.getMonth(), todayDate)
    : null;

  if (!hydrated || !monthDate || !todayDate || !calendar) {
    return (
      <section aria-labelledby="learning-calendar-title" className="rounded-3xl border border-border-soft bg-card p-5 shadow-sm sm:p-6">
        <h2 id="learning-calendar-title" className="text-section-title font-semibold">Оқу күнтізбесі</h2>
        <div className="mt-5 h-56 animate-pulse rounded-2xl bg-ice" aria-label="Күнтізбе жүктелуде" />
      </section>
    );
  }

  const currentMonth = todayDate;
  const isCurrentMonth =
    monthDate.getFullYear() === currentMonth.getFullYear() &&
    monthDate.getMonth() === currentMonth.getMonth();
  const selected = calendar.days.find((day) => day.dateKey === selectedDate) ?? null;
  const monthLabel = new Intl.DateTimeFormat("kk-KZ", { month: "long", year: "numeric" }).format(monthDate);

  function moveMonth(offset: -1 | 1) {
    if (!monthDate) return;
    const next = new Date(monthDate.getFullYear(), monthDate.getMonth() + offset, 1);
    setMonthDate(next);
    setSelectedDate(dateKey(next));
  }

  return (
    <section aria-labelledby="learning-calendar-title" className="rounded-3xl border border-border-soft bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-dark">НАҒЫЗ ОҚУ БЕЛСЕНДІЛІГІ</p>
          <h2 id="learning-calendar-title" className="mt-2 text-section-title font-semibold">Оқу күнтізбесі</h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-text-secondary">Сақталған сабақтар, жаттығулар мен карточка қайталаулары күндері бойынша көрсетіледі.</p>
        </div>
        <div className="flex items-center gap-2" aria-label="Айды таңдау">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border-soft text-lg transition hover:bg-ice focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            aria-label="Алдыңғы ай"
          >
            ‹
          </button>
          <p className="min-w-32 text-center text-sm font-semibold capitalize" aria-live="polite">{monthLabel}</p>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            disabled={isCurrentMonth}
            className="grid h-10 w-10 place-items-center rounded-full border border-border-soft text-lg transition hover:bg-ice focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Келесі ай"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <article className="rounded-2xl bg-ice/70 px-3 py-3"><p className="text-[11px] text-text-secondary">Белсенді күн</p><p className="mt-1 text-xl font-semibold">{calendar.activeDayCount}</p></article>
        <article className="rounded-2xl bg-ice/70 px-3 py-3"><p className="text-[11px] text-text-secondary">Сабақ</p><p className="mt-1 text-xl font-semibold">{calendar.lessonCount}</p></article>
        <article className="rounded-2xl bg-ice/70 px-3 py-3"><p className="text-[11px] text-text-secondary">Жаттығу</p><p className="mt-1 text-xl font-semibold">{calendar.exerciseCount}</p></article>
        <article className="rounded-2xl bg-ice/70 px-3 py-3"><p className="text-[11px] text-text-secondary">Қайталау</p><p className="mt-1 text-xl font-semibold">{calendar.reviewCount}</p></article>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1 sm:gap-2" role="group" aria-label={`${monthLabel} күндері`}>
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="pb-1 text-center text-[11px] font-medium text-text-secondary">{weekday}</div>
        ))}
        {Array.from({ length: calendar.leadingBlankCount }, (_, index) => (
          <span key={`blank-${index}`} aria-hidden="true" />
        ))}
        {calendar.days.map((day) => {
          const selectedDay = selectedDate === day.dateKey;
          const accessibleActivity = [
            `${day.lessonCount} сабақ`,
            `${day.exerciseCount} жаттығу`,
            `${day.reviewCount} қайталау`,
          ].join(", ");
          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => setSelectedDate(day.dateKey)}
              aria-pressed={selectedDay}
              aria-label={`${formatSelectedDate(day.dateKey)}. ${accessibleActivity}`}
              className={`min-h-11 rounded-xl px-1 py-1 text-center text-sm transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue sm:min-h-12 ${selectedDay ? "bg-blue-dark font-semibold text-white" : day.isToday ? "bg-ice font-semibold text-blue-dark" : "hover:bg-ice"}`}
            >
              <span>{day.dayOfMonth}</span>
              <ActivityMarkers day={day} />
            </button>
          );
        })}
      </div>

      <div className="mt-6 border-t border-border-soft pt-5" aria-live="polite">
        <h3 className="text-sm font-semibold capitalize">{selectedDate ? formatSelectedDate(selectedDate) : "Күнді таңдаңыз"}</h3>
        {selected?.activities.length ? (
          <ul className="mt-3 space-y-2">
            {selected.activities.slice(0, 8).map((activity) => (
              <li key={activity.id} className="flex items-start justify-between gap-3 rounded-2xl bg-ice/55 px-3 py-3">
                <div className="min-w-0"><p className="break-words text-sm font-medium">{activity.title}</p><p className="mt-1 text-xs text-text-secondary">{activity.detail}</p></div>
                <time className="shrink-0 text-xs text-text-secondary" dateTime={activity.occurredAt}>{new Intl.DateTimeFormat("kk-KZ", { hour: "2-digit", minute: "2-digit" }).format(new Date(activity.occurredAt))}</time>
              </li>
            ))}
            {selected.activities.length > 8 && <li className="px-3 text-xs text-text-secondary">Тағы {selected.activities.length - 8} әрекет</li>}
          </ul>
        ) : (
          <p className="mt-2 rounded-2xl bg-ice/55 px-3 py-4 text-sm text-text-secondary">Бұл күнге сақталған оқу әрекеті жоқ.</p>
        )}
      </div>

      <p className="mt-4 text-[11px] leading-5 text-text-secondary">Бұрын аяқталған кей сабақтарда күн белгісі сақталмаған. Олар күнтізбеге болжамды күнмен енгізілмейді.</p>
    </section>
  );
}
