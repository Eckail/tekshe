import assert from "node:assert/strict";
import test from "node:test";
import {
  awardCourseMilestoneCoins,
  awardLessonCoins,
  awardTekCoins,
  getTekCoinBalance,
  getTekCoinTransactions,
  getTotalTekCoinsEarned,
} from "./tekCoins.ts";
import { awardXP, getTotalXP, initializeXPAwards } from "./xp.ts";
import { completeCurriculumLesson } from "./curriculumProgress.ts";
import { claimDailyQuest, getDailyQuests } from "./dailyQuests.ts";
import { claimAchievement } from "./achievements.ts";

function installWindow(initial = {}) {
  const values = new Map(Object.entries(initial));
  globalThis.window = {
    localStorage: {
      get length() {
        return values.size;
      },
      key(index) {
        return [...values.keys()][index] ?? null;
      },
      getItem(key) {
        return values.get(key) ?? null;
      },
      setItem(key, value) {
        values.set(key, String(value));
      },
      removeItem(key) {
        values.delete(key);
      },
    },
    dispatchEvent() {
      return true;
    },
  };
  return values;
}

test("wallet records rewards once and calculates balance from its ledger", () => {
  installWindow();
  assert.equal(awardLessonCoins("pinyin-v1", "initials"), true);
  assert.equal(awardLessonCoins("pinyin-v1", "initials"), false);
  assert.equal(awardCourseMilestoneCoins("pinyin-v1"), true);
  assert.equal(getTekCoinBalance(), 70);
  assert.equal(getTotalTekCoinsEarned(), 70);
  assert.equal(getTekCoinTransactions().length, 2);
  assert.equal(getTekCoinTransactions()[0].sourceActivityId, "milestone:pinyin-v1:complete");
});

test("invalid rewards are rejected and unknown wallet schemas are preserved", () => {
  const values = installWindow({
    "tekshe-wallet:v1": JSON.stringify({ version: 2, transactions: [{ id: "future" }] }),
  });
  assert.equal(awardTekCoins({ sourceActivityId: "bad", source: "lesson", amount: 0, description: "x" }), false);
  assert.equal(awardLessonCoins("pinyin-v1", "initials"), false);
  assert.equal(values.get("tekshe-wallet:v1"), JSON.stringify({ version: 2, transactions: [{ id: "future" }] }));
});

test("legacy XP remains intact and is not converted into Tek Coins", () => {
  installWindow({
    "tekshe-learning-progress": JSON.stringify([
      { id: "old-quiz", date: "2026-11-05T12:00:00.000Z", xp: 80 },
    ]),
  });
  assert.equal(initializeXPAwards(), true);
  assert.equal(getTotalXP(), 80);
  assert.equal(getTekCoinBalance(), 0);
  assert.equal(awardLessonCoins("pinyin-v1", "initials"), true);
  assert.equal(getTotalXP(), 80);
  assert.equal(getTekCoinBalance(), 20);
});

test("lesson completion keeps XP and Tek Coin ledgers separate and idempotent", () => {
  installWindow();
  const complete = () =>
    completeCurriculumLesson(
      "curriculum-v1",
      "curriculum-v1",
      "lesson-one",
      ["lesson-one"],
      () => awardXP("course:curriculum-v1", "course", 50)
    );

  const first = complete();
  assert.equal(first.lessonCompleted, true);
  assert.equal(first.courseCompleted, true);
  assert.equal(awardLessonCoins("curriculum-v1", "lesson-one"), true);
  assert.equal(awardCourseMilestoneCoins("curriculum-v1"), true);

  const repeated = complete();
  assert.equal(repeated.lessonCompleted, false);
  assert.equal(awardLessonCoins("curriculum-v1", "lesson-one"), false);
  assert.equal(awardCourseMilestoneCoins("curriculum-v1"), false);
  assert.equal(getTotalXP(), 50);
  assert.equal(getTekCoinBalance(), 70);
});

test("a daily quest pays once and keeps its XP award in the existing ledger", () => {
  const today = new Date().toISOString();
  installWindow({
    "tekshe-learning-progress": JSON.stringify([
      { id: "today-listening", date: today, mode: "listening", score: 30, total: 40 },
    ]),
  });

  assert.equal(getDailyQuests().find((quest) => quest.id === "complete-exercise").completed, true);
  assert.equal(claimDailyQuest("complete-exercise"), true);
  assert.equal(claimDailyQuest("complete-exercise"), false);
  assert.equal(getTekCoinBalance(), 15);
  assert.equal(getTotalXP(), 20);
});

test("an achievement pays one separate coin transaction", () => {
  installWindow({
    "tekshe-learning-progress": JSON.stringify([
      { id: "first-exercise", date: new Date().toISOString(), mode: "visual", score: 1, total: 2 },
    ]),
  });

  assert.equal(claimAchievement("first-step"), true);
  assert.equal(claimAchievement("first-step"), false);
  assert.equal(getTekCoinBalance(), 30);
  assert.equal(getTotalXP(), 20);
});
