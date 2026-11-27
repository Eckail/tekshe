import assert from "node:assert/strict";
import test from "node:test";
import {
  gradeDueReviewCard,
  getReviewDashboardSnapshot,
  getTodayReviewCount,
  introduceVocabularyForReview,
  recordExerciseReviewResult,
  REVIEW_STORAGE_KEY,
} from "./reviewSystem.ts";
import { claimDailyQuest, getDailyQuests } from "./dailyQuests.ts";
import { getTotalXP } from "./xp.ts";
import { getTekCoinBalance } from "./tekCoins.ts";

function installLocalStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  globalThis.window = {
    localStorage: {
      get length() { return values.size; },
      key(index) { return [...values.keys()][index] ?? null; },
      getItem(key) { return values.get(key) ?? null; },
      setItem(key, value) { values.set(key, String(value)); },
    },
    dispatchEvent() { return true; },
  };
  return values;
}

const baseDate = new Date("2026-11-27T09:00:00.000Z");

test("lesson exposure creates only known vocabulary cards and does not reset prior progress", () => {
  const storage = installLocalStorage();
  assert.equal(introduceVocabularyForReview(["hsk1-pengyou", "missing"], "hsk-v1", "lesson-a", baseDate), 1);
  assert.equal(introduceVocabularyForReview(["hsk1-pengyou"], "hsk-v1", "lesson-a", baseDate), 0);
  const state = JSON.parse(storage.get(REVIEW_STORAGE_KEY));
  assert.deepEqual(state.cards.map((card) => card.itemId), ["hsk1-pengyou"]);
  assert.equal(state.history.length, 1);
  assert.equal(state.cards[0].dueAt, baseDate.toISOString());
});

test("exercise evidence schedules mistakes soon and records one result per attempt", () => {
  const storage = installLocalStorage();
  const input = {
    itemIds: ["hsk1-pengyou"],
    attemptId: "lesson-session:exercise-1:1",
    correct: false,
    now: baseDate,
  };
  assert.equal(recordExerciseReviewResult(input), 1);
  assert.equal(recordExerciseReviewResult(input), 0);
  let state = JSON.parse(storage.get(REVIEW_STORAGE_KEY));
  assert.equal(state.cards[0].dueAt, new Date(baseDate.getTime() + 10 * 60_000).toISOString());
  assert.equal(state.cards[0].attempts, 1);
  assert.equal(state.cards[0].correctAttempts, 0);

  assert.equal(recordExerciseReviewResult({ ...input, attemptId: "lesson-session:exercise-1:2", correct: true }), 1);
  state = JSON.parse(storage.get(REVIEW_STORAGE_KEY));
  assert.equal(state.cards[0].attempts, 2);
  assert.equal(state.cards[0].correctAttempts, 1);
  assert.equal(state.cards[0].intervalMinutes, 24 * 60);
});

test("review ratings move due dates according to recall quality", () => {
  installLocalStorage();
  introduceVocabularyForReview(["hsk1-pengyou"], "hsk-v1", "lesson-a", baseDate);
  assert.equal(gradeDueReviewCard({ itemId: "hsk1-pengyou", grade: "good", attemptId: "review-a", now: baseDate }), true);
  assert.equal(gradeDueReviewCard({ itemId: "hsk1-pengyou", grade: "easy", attemptId: "review-too-soon", now: baseDate }), false);

  const nextDay = new Date(baseDate.getTime() + 24 * 60 * 60_000);
  assert.equal(gradeDueReviewCard({ itemId: "hsk1-pengyou", grade: "again", attemptId: "review-b", now: nextDay }), true);
  const snapshot = getReviewDashboardSnapshot(nextDay);
  assert.equal(snapshot.dueCount, 0);
  assert.equal(snapshot.totalCards, 1);
  assert.equal(snapshot.reviewedToday, 1);
  assert.equal(getTodayReviewCount(nextDay), 1);

  const dueAgain = new Date(nextDay.getTime() + 10 * 60_000);
  assert.equal(getReviewDashboardSnapshot(dueAgain).dueCount, 1);
});

test("five spaced reviews complete the daily quest and the reward is one-time", () => {
  installLocalStorage();
  const itemIds = ["hsk1-ai", "hsk1-baba", "hsk1-cha", "hsk1-chi", "hsk1-he"];
  assert.equal(introduceVocabularyForReview(itemIds, "hsk-v1", "lesson-review", baseDate), itemIds.length);

  itemIds.forEach((itemId, index) => {
    assert.equal(gradeDueReviewCard({
      itemId,
      grade: "good",
      attemptId: `daily-review-${index}`,
      now: baseDate,
    }), true);
  });

  const quest = getDailyQuests(baseDate).find(({ id }) => id === "daily-review");
  assert.equal(quest?.progress, 5);
  assert.equal(quest?.completed, true);
  assert.equal(claimDailyQuest("daily-review", baseDate), true);
  assert.equal(claimDailyQuest("daily-review", baseDate), false);
  assert.equal(getTotalXP(), 25);
  assert.equal(getTekCoinBalance(), 15);
});

test("unknown or malformed stored versions remain untouched and read-only", () => {
  const unknownRaw = JSON.stringify({ version: 99, privateFutureData: [1, 2, 3] });
  const storage = installLocalStorage({ [REVIEW_STORAGE_KEY]: unknownRaw });
  assert.equal(introduceVocabularyForReview(["hsk1-pengyou"], "hsk-v1", "lesson-a", baseDate), 0);
  assert.equal(recordExerciseReviewResult({ itemIds: ["hsk1-pengyou"], attemptId: "try-1", correct: true, now: baseDate }), 0);
  assert.equal(storage.get(REVIEW_STORAGE_KEY), unknownRaw);
  assert.equal(getReviewDashboardSnapshot(baseDate).storageStatus, "read-only");

  const malformedRaw = "{not-json";
  const malformed = installLocalStorage({ [REVIEW_STORAGE_KEY]: malformedRaw });
  assert.equal(gradeDueReviewCard({ itemId: "hsk1-pengyou", grade: "good", attemptId: "try-2", now: baseDate }), false);
  assert.equal(malformed.get(REVIEW_STORAGE_KEY), malformedRaw);
});

test("invalid vocabulary IDs and empty review attempt IDs are ignored", () => {
  installLocalStorage();
  assert.equal(recordExerciseReviewResult({ itemIds: ["unknown"], attemptId: "try", correct: true, now: baseDate }), 0);
  assert.equal(recordExerciseReviewResult({ itemIds: ["hsk1-pengyou"], attemptId: "  ", correct: true, now: baseDate }), 0);
  assert.equal(gradeDueReviewCard({ itemId: "hsk1-pengyou", grade: "good", attemptId: "try", now: baseDate }), false);
});
