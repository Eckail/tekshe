import assert from "node:assert/strict";
import test from "node:test";
import { completeCurriculumLesson, getCompletedCurriculumLessons } from "./curriculumProgress.ts";
import { awardXP, getTotalXP, getXPAwards } from "./xp.ts";

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

test("curriculum progress stores lessons and gates the one-time XP reward", () => {
  installLocalStorage();
  const ids = ["lesson-a", "lesson-b"];
  let rewardCalls = 0;
  const award = () => {
    rewardCalls += 1;
    return awardXP("curriculum-course:hsk-2025-v1:foundation", "course", 50);
  };

  const first = completeCurriculumLesson("hsk-2025-v1", "foundation", "lesson-a", ids, award);
  assert.deepEqual(first, {
    lessonCompleted: true,
    courseCompleted: false,
    xpAwarded: false,
    completedLessonIds: ["lesson-a"],
  });
  assert.equal(getTotalXP(), 0);

  const repeatedFirst = completeCurriculumLesson("hsk-2025-v1", "foundation", "lesson-a", ids, award);
  assert.equal(repeatedFirst.lessonCompleted, false);
  assert.equal(repeatedFirst.courseCompleted, false);
  assert.equal(getTotalXP(), 0);

  const finalLesson = completeCurriculumLesson("hsk-2025-v1", "foundation", "lesson-b", ids, award);
  assert.equal(finalLesson.courseCompleted, true);
  assert.equal(finalLesson.xpAwarded, true);
  assert.deepEqual(getCompletedCurriculumLessons("hsk-2025-v1", "foundation", ids), ids);
  assert.equal(getTotalXP(), 50);

  const repeatedFinal = completeCurriculumLesson("hsk-2025-v1", "foundation", "lesson-b", ids, award);
  assert.equal(repeatedFinal.lessonCompleted, false);
  assert.equal(repeatedFinal.courseCompleted, true);
  assert.equal(repeatedFinal.xpAwarded, false);
  assert.equal(rewardCalls, 2);
  assert.equal(getXPAwards().length, 1);
});

test("invalid and unknown curriculum completion requests are rejected", () => {
  installLocalStorage();
  const award = () => false;
  assert.equal(completeCurriculumLesson("", "foundation", "lesson-a", ["lesson-a"], award), null);
  assert.equal(completeCurriculumLesson("hsk-v1", "foundation", "missing", ["lesson-a"], award), null);
  assert.equal(completeCurriculumLesson("hsk-v1", "foundation", "lesson-a", [], award), null);
  assert.equal(getTotalXP(), 0);
});

test("unknown stored lesson IDs are preserved for forward-compatible progress", () => {
  const key = "tekshe-curriculum-progress:v1:hsk-2025-v1:foundation";
  const storage = installLocalStorage({ [key]: JSON.stringify(["future-lesson"]) });
  const result = completeCurriculumLesson(
    "hsk-2025-v1",
    "foundation",
    "lesson-a",
    ["lesson-a", "lesson-b"],
    () => false
  );

  assert.deepEqual(result.completedLessonIds, ["lesson-a"]);
  assert.deepEqual(JSON.parse(storage.get(key)), ["future-lesson", "lesson-a"]);
});
