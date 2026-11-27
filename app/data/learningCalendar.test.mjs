import assert from "node:assert/strict";
import test from "node:test";
import { getLearningCalendarMonth } from "./learningCalendar.ts";
import { hsk1FoundationCurriculum } from "./hsk1Foundation.ts";
import { pinyinCurriculum } from "./pinyinCurriculum.ts";

function installStorage(entries) {
  const values = new Map(Object.entries(entries));
  globalThis.window = {
    localStorage: {
      get length() {
        return values.size;
      },
      getItem(key) {
        return values.get(key) ?? null;
      },
      setItem(key, value) {
        values.set(key, value);
      },
      key(index) {
        return [...values.keys()][index] ?? null;
      },
    },
  };
}

function iso(year, monthIndex, day, hour = 12) {
  return new Date(year, monthIndex, day, hour).toISOString();
}

function createWalletTransaction(source, sourceActivityId, createdAt, id) {
  return {
    id,
    sourceActivityId,
    type: "earn",
    source,
    amount: 20,
    description: "test",
    createdAt,
  };
}

test("builds a real calendar from lesson, saved exercise, and review dates", () => {
  const day = iso(2026, 0, 15);
  const lesson = pinyinCurriculum.lessons[0];
  const vocabulary = hsk1FoundationCurriculum.vocabulary[0];
  installStorage({
    "tekshe-wallet:v1": JSON.stringify({
      version: 1,
      transactions: [
        createWalletTransaction("lesson", `lesson:${pinyinCurriculum.id}:${lesson.id}`, day, "lesson-1"),
        createWalletTransaction("quest", "quest:unrelated", day, "quest-1"),
      ],
    }),
    "tekshe-learning-progress": JSON.stringify([
      { id: "exercise-1", date: day, mode: "listening", score: 4, total: 5 },
    ]),
    "tekshe-review:v1": JSON.stringify({
      version: 1,
      cards: [],
      history: [
        {
          id: "review-1",
          itemId: vocabulary.id,
          occurredAt: day,
          source: "review",
          grade: "good",
          correct: true,
        },
        {
          id: "exercise-evidence",
          itemId: vocabulary.id,
          occurredAt: day,
          source: "exercise",
          grade: "good",
          correct: true,
        },
      ],
    }),
  });

  const month = getLearningCalendarMonth(2026, 0, new Date(2026, 0, 15, 15));
  const activeDay = month.days.find((item) => item.dayOfMonth === 15);

  assert.equal(month.monthDayCount, 31);
  assert.ok(activeDay);
  assert.equal(activeDay.lessonCount, 1);
  assert.equal(activeDay.exerciseCount, 1);
  assert.equal(activeDay.reviewCount, 1);
  assert.equal(activeDay.activities.length, 3);
  assert.equal(activeDay.isToday, true);
  assert.equal(month.activeDayCount, 1);
  assert.equal(month.lessonCount, 1);
  assert.equal(month.exerciseCount, 1);
  assert.equal(month.reviewCount, 1);
});

test("uses a Monday-first calendar and marks leap-month length", () => {
  installStorage({});
  const february = getLearningCalendarMonth(2024, 1, new Date(2024, 1, 29));
  assert.equal(february.monthDayCount, 29);
  assert.equal(february.days.length, 29);
  assert.equal(february.days[28].isToday, true);
  assert.equal(february.leadingBlankCount, (new Date(2024, 1, 1).getDay() + 6) % 7);
});

test("does not invent dates for invalid records or old undated lesson flags", () => {
  installStorage({
    "tekshe-wallet:v1": JSON.stringify({
      version: 1,
      transactions: [
        createWalletTransaction(
          "lesson",
          `lesson:${pinyinCurriculum.id}:${pinyinCurriculum.lessons[0].id}`,
          "not-a-date",
          "invalid-date",
        ),
      ],
    }),
    "tekshe-learning-progress": JSON.stringify([
      { id: "invalid-exercise", date: "not-a-date", mode: "quiz", score: 1, total: 1 },
    ]),
    "tekshe-curriculum-progress:v1:any-course": JSON.stringify(["old-completed-lesson"]),
  });

  const month = getLearningCalendarMonth(2026, 0, new Date(2026, 0, 15));
  assert.equal(month.activeDayCount, 0);
  assert.equal(month.lessonCount + month.exerciseCount + month.reviewCount, 0);
});
