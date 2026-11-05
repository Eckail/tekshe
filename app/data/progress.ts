import {
  awardXP,
  initializeXPAwards,
  notifyProgressUpdated,
} from "./xp";

export type LearningRecord = {
  id: string;
  date: string;
  mode: "visual" | "listening" | "quiz";
  score: number;
  total: number;
};

const STORAGE_KEY = "tekshe-learning-progress";

export function createLearningRecordId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getLearningRecords(): LearningRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const records: unknown = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(records)) return [];

    return records.filter(isLearningRecord);
  } catch {
    return [];
  }
}

function isLearningRecord(record: unknown): record is LearningRecord {
  if (!record || typeof record !== "object") return false;

  const candidate = record as Partial<LearningRecord>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.date === "string" &&
    (candidate.mode === "visual" ||
      candidate.mode === "listening" ||
      candidate.mode === "quiz") &&
    typeof candidate.score === "number" &&
    typeof candidate.total === "number"
  );
}

export function saveLearningRecord(
  record: Omit<LearningRecord, "id"> & { id?: string; xp: number }
): string | null {
  if (typeof window === "undefined") return null;

  // Run the one-time import before writing a new record so it is not treated
  // as legacy data on its first XP read.
  initializeXPAwards();

  const { xp, ...recordData } = record;
  const nextRecord: LearningRecord = {
    ...recordData,
    id: record.id ?? createLearningRecordId(),
  };
  const records = getLearningRecords();

  if (records.some((existing) => existing.id === nextRecord.id)) {
    return nextRecord.id;
  }

  records.unshift(nextRecord);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    return null;
  }

  const wasAwarded = awardXP(
    `exercise:${nextRecord.id}`,
    "exercise",
    xp
  );

  if (!wasAwarded && xp <= 0) {
    notifyProgressUpdated();
  }

  return nextRecord.id;
}

export function calculateQuizXP(score: number): number {
  return score * 10 + 20;
}

export function saveQuizResult(result: {
  id: string;
  mode: LearningRecord["mode"];
  score: number;
  total: number;
}): string | null {
  return saveLearningRecord({
    ...result,
    date: new Date().toISOString(),
    xp: calculateQuizXP(result.score),
  });
}
