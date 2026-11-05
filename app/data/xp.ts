export type XPSource = "exercise" | "course" | "daily-quest" | "achievement";

export type XPAward = {
  id: string;
  source: XPSource;
  amount: number;
  awardedAt: string;
};

const XP_STORAGE_PREFIX = "tekshe-xp-award:v1:";
const MIGRATION_KEY = "tekshe-xp-migration-v1";
const PROGRESS_EVENT = "tekshe-progress-updated";
const COURSE_COMPLETION_XP = 50;

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function isXPAward(value: unknown): value is XPAward {
  if (!value || typeof value !== "object") return false;

  const award = value as Partial<XPAward>;
  return (
    typeof award.id === "string" &&
    typeof award.amount === "number" &&
    Number.isSafeInteger(award.amount) &&
    award.amount > 0 &&
    typeof award.awardedAt === "string" &&
    (award.source === "exercise" ||
      award.source === "course" ||
      award.source === "daily-quest" ||
      award.source === "achievement")
  );
}

function readStoredAwards(): XPAward[] {
  if (typeof window === "undefined") return [];

  try {
    const awards: XPAward[] = [];
    const storage = window.localStorage;

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key?.startsWith(XP_STORAGE_PREFIX)) continue;

      const award = parseJson<unknown>(storage.getItem(key), null);
      if (isXPAward(award)) awards.push(award);
    }

    return awards;
  } catch {
    return [];
  }
}

function getAwardStorageKey(id: string): string {
  return `${XP_STORAGE_PREFIX}${encodeURIComponent(id)}`;
}

function migrateLegacyAwards(): boolean {
  if (typeof window === "undefined") return false;

  try {
    if (window.localStorage.getItem(MIGRATION_KEY) === "complete") return false;

    const awards = readStoredAwards();
    const awardIds = new Set(awards.map((award) => award.id));
    const addLegacyAward = (
      award: XPAward
    ) => {
      if (award.amount > 0 && !awardIds.has(award.id)) {
        awards.push(award);
        awardIds.add(award.id);
      }
    };

    const legacyRecords = parseJson<unknown>(
      window.localStorage.getItem("tekshe-learning-progress"),
      []
    );

    if (Array.isArray(legacyRecords)) {
      legacyRecords.forEach((record: unknown, index) => {
        if (!record || typeof record !== "object") return;

        const legacyRecord = record as {
          id?: unknown;
          date?: unknown;
          xp?: unknown;
        };
        if (
          typeof legacyRecord.xp !== "number" ||
          !Number.isSafeInteger(legacyRecord.xp) ||
          legacyRecord.xp <= 0
        ) {
          return;
        }

        const stableId =
          typeof legacyRecord.id === "string"
            ? legacyRecord.id
            : `${String(legacyRecord.date ?? "unknown")}:${index}`;

        addLegacyAward({
          id: `legacy:exercise:${stableId}`,
          source: "exercise",
          amount: legacyRecord.xp,
          awardedAt:
            typeof legacyRecord.date === "string"
              ? legacyRecord.date
              : new Date(0).toISOString(),
        });
      });
    }

    const legacyDailyRewards = parseJson<unknown>(
      window.localStorage.getItem("tekshe-daily-rewards"),
      {}
    );

    if (legacyDailyRewards && typeof legacyDailyRewards === "object") {
      Object.entries(legacyDailyRewards).forEach(([date, amount]) => {
        if (
          typeof amount === "number" &&
          Number.isSafeInteger(amount) &&
          amount > 0
        ) {
          addLegacyAward({
            id: `legacy:daily-quest:${date}`,
            source: "daily-quest",
            amount,
            awardedAt: `${date}T00:00:00.000Z`,
          });
        }
      });
    }

    const legacyAchievementRewards = parseJson<unknown>(
      window.localStorage.getItem("tekshe-achievement-rewards"),
      {}
    );

    if (
      legacyAchievementRewards &&
      typeof legacyAchievementRewards === "object"
    ) {
      Object.entries(legacyAchievementRewards).forEach(([id, amount]) => {
        if (
          typeof amount === "number" &&
          Number.isSafeInteger(amount) &&
          amount > 0
        ) {
          addLegacyAward({
            id: `legacy:achievement:${id}`,
            source: "achievement",
            amount,
            awardedAt: new Date(0).toISOString(),
          });
        }
      });
    }

    const legacyCourses = parseJson<unknown>(
      window.localStorage.getItem("tekshe-course-progress"),
      []
    );
    const knownCourses = new Set([
      "pinyin-basics",
      "tone-practice",
      "syllables",
      "first-words",
      "simple-sentences",
    ]);

    if (Array.isArray(legacyCourses)) {
      legacyCourses.forEach((courseId) => {
        if (typeof courseId === "string" && knownCourses.has(courseId)) {
          addLegacyAward({
            id: `course:${courseId}`,
            source: "course",
            amount: COURSE_COMPLETION_XP,
            awardedAt: new Date(0).toISOString(),
          });
        }
      });
    }

    awards.forEach((award) => {
      window.localStorage.setItem(
        getAwardStorageKey(award.id),
        JSON.stringify(award)
      );
    });
    window.localStorage.setItem(MIGRATION_KEY, "complete");
    return true;
  } catch {
    // Keep legacy data intact and retry migration the next time XP is read.
    return false;
  }
}

export function initializeXPAwards(): boolean {
  const migrated = migrateLegacyAwards();
  if (migrated) notifyProgressUpdated();
  return migrated;
}

export function getXPAwards(): XPAward[] {
  return readStoredAwards();
}

export function hasXPAward(id: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const award = parseJson<unknown>(
      window.localStorage.getItem(getAwardStorageKey(id)),
      null
    );
    return isXPAward(award) && award.id === id;
  } catch {
    return false;
  }
}

export function awardXP(
  id: string,
  source: XPSource,
  amount: number
): boolean {
  if (
    typeof window === "undefined" ||
    !id.trim() ||
    !Number.isSafeInteger(amount) ||
    amount <= 0
  ) {
    return false;
  }

  migrateLegacyAwards();

  const storageKey = getAwardStorageKey(id);
  if (hasXPAward(id)) return false;

  const nextAward: XPAward = {
    id,
    source,
    amount,
    awardedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(nextAward));
  } catch {
    return false;
  }

  notifyProgressUpdated();
  return true;
}

export function getTotalXP(): number {
  return getXPAwards().reduce((total, award) => total + award.amount, 0);
}

export function getXPForSource(source: XPSource): number {
  return getXPAwards()
    .filter((award) => award.source === source)
    .reduce((total, award) => total + award.amount, 0);
}

export function notifyProgressUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  }
}

export { COURSE_COMPLETION_XP };
