import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_LEARNER_PROFILE,
  LEARNER_PROFILE_STORAGE_KEY,
  loadLearnerProfileFromStorage,
  saveLearnerProfileToStorage,
} from "./learnerProfile.ts";

function createMemoryStorage(initial = null) {
  const values = new Map();
  if (initial !== null) values.set(LEARNER_PROFILE_STORAGE_KEY, initial);

  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

test("uses a safe default when the profile is missing", () => {
  assert.deepEqual(loadLearnerProfileFromStorage(createMemoryStorage()), DEFAULT_LEARNER_PROFILE);
  assert.deepEqual(loadLearnerProfileFromStorage(null), DEFAULT_LEARNER_PROFILE);
});

test("falls back to the default for malformed or unsupported profile data", () => {
  assert.deepEqual(loadLearnerProfileFromStorage(createMemoryStorage("{")), DEFAULT_LEARNER_PROFILE);
  assert.deepEqual(
    loadLearnerProfileFromStorage(createMemoryStorage(JSON.stringify({ version: 2 }))),
    DEFAULT_LEARNER_PROFILE
  );
  assert.deepEqual(
    loadLearnerProfileFromStorage(createMemoryStorage(JSON.stringify({
      version: 1,
      nickname: "   ",
      avatarId: "unknown",
      dailyGoalLessons: 8,
    }))),
    DEFAULT_LEARNER_PROFILE
  );
});

test("saves validated local settings and reloads them", () => {
  const storage = createMemoryStorage();
  const profile = {
    version: 1,
    nickname: "  Айдана  ",
    avatarId: "steppe",
    dailyGoalLessons: 2,
  };

  assert.equal(saveLearnerProfileToStorage(storage, profile), true);
  assert.deepEqual(loadLearnerProfileFromStorage(storage), {
    ...profile,
    nickname: "Айдана",
  });
});

test("reports unavailable or failing browser storage without throwing", () => {
  const throwingStorage = {
    getItem() {
      throw new Error("storage unavailable");
    },
    setItem() {
      throw new Error("storage unavailable");
    },
  };

  assert.deepEqual(loadLearnerProfileFromStorage(throwingStorage), DEFAULT_LEARNER_PROFILE);
  assert.equal(saveLearnerProfileToStorage(throwingStorage, DEFAULT_LEARNER_PROFILE), false);
  assert.equal(saveLearnerProfileToStorage(null, DEFAULT_LEARNER_PROFILE), false);
});
