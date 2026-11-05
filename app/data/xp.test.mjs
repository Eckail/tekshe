import assert from "node:assert/strict";
import test from "node:test";
import {
  awardXP,
  getTotalXP,
  getXPForSource,
  initializeXPAwards,
} from "./xp.ts";

function installLocalStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  let progressEvents = 0;

  globalThis.window = {
    localStorage: {
      get length() {
        return values.size;
      },
      key(index) {
        return Array.from(values.keys())[index] ?? null;
      },
      getItem(key) {
        return values.get(key) ?? null;
      },
      setItem(key, value) {
        values.set(key, String(value));
      },
    },
    dispatchEvent() {
      progressEvents += 1;
      return true;
    },
  };

  return {
    get progressEvents() {
      return progressEvents;
    },
    values,
  };
}

test("XP awards are recorded once per id", () => {
  const storage = installLocalStorage();

  assert.equal(awardXP("exercise:attempt-1", "exercise", 70), true);
  assert.equal(awardXP("exercise:attempt-1", "exercise", 70), false);
  assert.equal(awardXP("daily-quest:2026-11-05:complete-exercise", "daily-quest", 20), true);
  assert.equal(getTotalXP(), 90);
  assert.equal(getXPForSource("exercise"), 70);
  assert.equal(getXPForSource("daily-quest"), 20);
  assert.equal(storage.progressEvents, 2);
});

test("invalid and zero-value awards are rejected", () => {
  installLocalStorage();

  assert.equal(awardXP("", "exercise", 10), false);
  assert.equal(awardXP("exercise:zero", "exercise", 0), false);
  assert.equal(awardXP("exercise:fraction", "exercise", 1.5), false);
  assert.equal(getTotalXP(), 0);
});

test("legacy XP is imported once without changing the existing total", () => {
  installLocalStorage({
    "tekshe-learning-progress": JSON.stringify([
      { id: "old-attempt", date: "2026-11-04T12:00:00.000Z", xp: 140 },
    ]),
    "tekshe-daily-rewards": JSON.stringify({ "2026-11-04": 50 }),
    "tekshe-achievement-rewards": JSON.stringify({ "first-step": 20 }),
    "tekshe-course-progress": JSON.stringify(["pinyin-basics"]),
  });

  assert.equal(initializeXPAwards(), true);
  assert.equal(getTotalXP(), 260);
  assert.equal(getXPForSource("exercise"), 140);
  assert.equal(getXPForSource("daily-quest"), 50);
  assert.equal(getXPForSource("achievement"), 20);
  assert.equal(getXPForSource("course"), 50);
  assert.equal(awardXP("course:pinyin-basics", "course", 50), false);
  assert.equal(getTotalXP(), 260);
  assert.equal(initializeXPAwards(), false);
});
