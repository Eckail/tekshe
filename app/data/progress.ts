export type LearningRecord = {
  id: string;
  date: string;
  mode: "visual" | "listening";
  score: number;
  total: number;
  xp: number;
};

const STORAGE_KEY = "tekshe-learning-progress";

export function getLearningRecords(): LearningRecord[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);

  return saved ? JSON.parse(saved) : [];
}

export function saveLearningRecord(
  record: LearningRecord
): void {
  const records = getLearningRecords();

  records.unshift(record);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records)
  );
}