import { hsk1FoundationCurriculum } from "./hsk1Foundation";
import { pinyinCurriculum } from "./pinyinCurriculum";
import { getLearningRecords } from "./progress";
import { getReviewHistory } from "./reviewSystem";
import { getTekCoinTransactions } from "./tekCoins";

export type LearningActivityKind = "lesson" | "exercise" | "review";

export type LearningCalendarActivity = {
  id: string;
  kind: LearningActivityKind;
  occurredAt: string;
  title: string;
  detail: string;
};

export type LearningCalendarDay = {
  dateKey: string;
  dayOfMonth: number;
  isToday: boolean;
  activities: LearningCalendarActivity[];
  lessonCount: number;
  exerciseCount: number;
  reviewCount: number;
};

export type LearningCalendarMonth = {
  year: number;
  monthIndex: number;
  monthDayCount: number;
  leadingBlankCount: number;
  todayKey: string;
  days: LearningCalendarDay[];
  activeDayCount: number;
  lessonCount: number;
  exerciseCount: number;
  reviewCount: number;
};

const lessonsByActivityId = new Map<string, string>();
for (const curriculum of [pinyinCurriculum, hsk1FoundationCurriculum]) {
  for (const lesson of curriculum.lessons) {
    lessonsByActivityId.set(`lesson:${curriculum.id}:${lesson.id}`, lesson.title);
  }
}

const vocabularyById = new Map(
  hsk1FoundationCurriculum.vocabulary.map((item) => [item.id, item]),
);

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parsedDate(value: string): Date | null {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp) : null;
}

function activityDay(date: Date, days: Map<string, LearningCalendarDay>): LearningCalendarDay | null {
  return days.get(localDateKey(date)) ?? null;
}

function addActivity(day: LearningCalendarDay, activity: LearningCalendarActivity): void {
  if (day.activities.some((existing) => existing.id === activity.id)) return;
  day.activities.push(activity);
  if (activity.kind === "lesson") day.lessonCount += 1;
  if (activity.kind === "exercise") day.exerciseCount += 1;
  if (activity.kind === "review") day.reviewCount += 1;
}

/**
 * Builds a month from dated learning records already stored by the app.
 * Older lesson completion flags do not contain timestamps and are deliberately
 * not assigned an invented date.
 */
export function getLearningCalendarMonth(
  year: number,
  monthIndex: number,
  now = new Date(),
): LearningCalendarMonth {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const normalizedYear = firstOfMonth.getFullYear();
  const normalizedMonth = firstOfMonth.getMonth();
  const monthDayCount = new Date(normalizedYear, normalizedMonth + 1, 0).getDate();
  const todayKey = localDateKey(now);
  const days: LearningCalendarDay[] = Array.from({ length: monthDayCount }, (_, index) => {
    const dayOfMonth = index + 1;
    const dateKey = localDateKey(new Date(normalizedYear, normalizedMonth, dayOfMonth));
    return {
      dateKey,
      dayOfMonth,
      isToday: dateKey === todayKey,
      activities: [],
      lessonCount: 0,
      exerciseCount: 0,
      reviewCount: 0,
    };
  });
  const daysByKey = new Map(days.map((day) => [day.dateKey, day]));

  for (const transaction of getTekCoinTransactions()) {
    if (transaction.source !== "lesson" || transaction.type !== "earn") continue;
    const title = lessonsByActivityId.get(transaction.sourceActivityId);
    const date = parsedDate(transaction.createdAt);
    const day = date ? activityDay(date, daysByKey) : null;
    if (!title || !date || !day) continue;
    addActivity(day, {
      id: transaction.id,
      kind: "lesson",
      occurredAt: date.toISOString(),
      title,
      detail: "Сабақ аяқталды",
    });
  }

  const exerciseTitles = {
    visual: "Көру жаттығуы",
    listening: "Тыңдау жаттығуы",
    quiz: "Тест жаттығуы",
  } as const;
  for (const record of getLearningRecords()) {
    const date = parsedDate(record.date);
    const day = date ? activityDay(date, daysByKey) : null;
    if (!date || !day) continue;
    addActivity(day, {
      id: `exercise:${record.id}`,
      kind: "exercise",
      occurredAt: date.toISOString(),
      title: exerciseTitles[record.mode],
      detail: `${record.score} / ${record.total} дұрыс жауап`,
    });
  }

  for (const entry of getReviewHistory()) {
    if (entry.source !== "review") continue;
    const date = parsedDate(entry.occurredAt);
    const day = date ? activityDay(date, daysByKey) : null;
    const vocabulary = vocabularyById.get(entry.itemId);
    if (!date || !day || !vocabulary) continue;
    addActivity(day, {
      id: entry.id,
      kind: "review",
      occurredAt: date.toISOString(),
      title: `${vocabulary.hanzi} · ${vocabulary.pinyin}`,
      detail: "Қайталау аяқталды",
    });
  }

  for (const day of days) {
    day.activities.sort((left, right) => Date.parse(right.occurredAt) - Date.parse(left.occurredAt));
  }

  return {
    year: normalizedYear,
    monthIndex: normalizedMonth,
    monthDayCount,
    leadingBlankCount: (firstOfMonth.getDay() + 6) % 7,
    todayKey,
    activeDayCount: days.filter((day) => day.activities.length > 0).length,
    lessonCount: days.reduce((total, day) => total + day.lessonCount, 0),
    exerciseCount: days.reduce((total, day) => total + day.exerciseCount, 0),
    reviewCount: days.reduce((total, day) => total + day.reviewCount, 0),
    days,
  };
}
