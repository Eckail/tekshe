import { createProgressStore } from "./progressStore";
import { notifyProgressUpdated } from "./xp";

export const LEARNER_PROFILE_STORAGE_KEY = "tekshe-learner-profile:v1";

export const LEARNER_AVATAR_IDS = [
  "terracotta",
  "steppe",
  "charcoal",
  "sand",
] as const;

export type LearnerAvatarId = (typeof LEARNER_AVATAR_IDS)[number];
export type DailyLessonGoal = 1 | 2 | 3;

export type LearnerProfile = {
  version: 1;
  nickname: string;
  avatarId: LearnerAvatarId;
  dailyGoalLessons: DailyLessonGoal;
};

export type LearnerProfileStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export const DEFAULT_LEARNER_PROFILE: LearnerProfile = {
  version: 1,
  nickname: "Оқушы",
  avatarId: "terracotta",
  dailyGoalLessons: 1,
};

function isAvatarId(value: unknown): value is LearnerAvatarId {
  return LEARNER_AVATAR_IDS.some((avatarId) => avatarId === value);
}

function isDailyLessonGoal(value: unknown): value is DailyLessonGoal {
  return value === 1 || value === 2 || value === 3;
}

export function normalizeLearnerProfile(value: unknown): LearnerProfile | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<LearnerProfile>;
  const nickname = typeof candidate.nickname === "string"
    ? candidate.nickname.trim()
    : "";

  if (
    candidate.version !== 1 ||
    nickname.length < 1 ||
    nickname.length > 24 ||
    !isAvatarId(candidate.avatarId) ||
    !isDailyLessonGoal(candidate.dailyGoalLessons)
  ) {
    return null;
  }

  return {
    version: 1,
    nickname,
    avatarId: candidate.avatarId,
    dailyGoalLessons: candidate.dailyGoalLessons,
  };
}

export function loadLearnerProfileFromStorage(
  storage: Pick<LearnerProfileStorage, "getItem"> | null
): LearnerProfile {
  if (!storage) return { ...DEFAULT_LEARNER_PROFILE };

  try {
    const saved = storage.getItem(LEARNER_PROFILE_STORAGE_KEY);
    if (!saved) return { ...DEFAULT_LEARNER_PROFILE };

    const normalized = normalizeLearnerProfile(JSON.parse(saved));
    return normalized ?? { ...DEFAULT_LEARNER_PROFILE };
  } catch {
    return { ...DEFAULT_LEARNER_PROFILE };
  }
}

export function saveLearnerProfileToStorage(
  storage: Pick<LearnerProfileStorage, "setItem"> | null,
  value: unknown
): boolean {
  const profile = normalizeLearnerProfile(value);
  if (!storage || !profile) return false;

  try {
    storage.setItem(LEARNER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

function getBrowserStorage(): LearnerProfileStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readLearnerProfile(): LearnerProfile {
  return loadLearnerProfileFromStorage(getBrowserStorage());
}

export function saveLearnerProfile(value: unknown): boolean {
  const saved = saveLearnerProfileToStorage(getBrowserStorage(), value);
  if (saved) notifyProgressUpdated();
  return saved;
}

export const learnerProfileStore = createProgressStore(
  readLearnerProfile,
  DEFAULT_LEARNER_PROFILE
);
