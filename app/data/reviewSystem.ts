import { createProgressStore } from "./progressStore";
import { hsk1FoundationCurriculum } from "./hsk1Foundation";
import type { VocabularyEntry } from "./curriculum";

export const REVIEW_STORAGE_KEY = "tekshe-review:v1";
const REVIEW_HISTORY_LIMIT = 500;
const RECENT_ATTEMPT_LIMIT = 100;
const MIN_EASE = 1.3;

export type ReviewGrade = "again" | "hard" | "good" | "easy";
export type ReviewSource = "lesson" | "exercise" | "review";
export type ReviewStorageStatus = "ready" | "unavailable" | "read-only";

export type ReviewCardState = {
  itemId: string;
  introducedAt: string;
  lastReviewedAt: string | null;
  dueAt: string;
  intervalMinutes: number;
  repetitions: number;
  easeFactor: number;
  attempts: number;
  correctAttempts: number;
  recentAttemptIds: string[];
};

export type ReviewHistoryEntry = {
  id: string;
  itemId: string;
  occurredAt: string;
  source: ReviewSource;
  grade: ReviewGrade | null;
  correct: boolean | null;
};

type ReviewDatabase = {
  version: 1;
  cards: ReviewCardState[];
  history: ReviewHistoryEntry[];
};

export type ReviewVocabularyCard = {
  id: string;
  curriculumTitle: string;
  levelName: string;
  vocabulary: VocabularyEntry;
};

export type ReviewDashboardSnapshot = {
  dueCards: Array<ReviewVocabularyCard & { state: ReviewCardState }>;
  totalCards: number;
  dueCount: number;
  reviewedToday: number;
  storageStatus: ReviewStorageStatus;
};

type ReviewStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

const vocabularyCards: ReviewVocabularyCard[] = hsk1FoundationCurriculum.vocabulary.map(
  (vocabulary) => ({
    id: vocabulary.id,
    curriculumTitle: hsk1FoundationCurriculum.title,
    levelName:
      hsk1FoundationCurriculum.levels.find((level) => level.id === vocabulary.levelId)
        ?.displayName ?? vocabulary.levelId,
    vocabulary,
  }),
);
const vocabularyById = new Map(vocabularyCards.map((card) => [card.id, card]));

const emptyDatabase: ReviewDatabase = { version: 1, cards: [], history: [] };
const emptySnapshot: ReviewDashboardSnapshot = {
  dueCards: [],
  totalCards: 0,
  dueCount: 0,
  reviewedToday: 0,
  storageStatus: "unavailable",
};

function isGrade(value: unknown): value is ReviewGrade {
  return value === "again" || value === "hard" || value === "good" || value === "easy";
}

function isSource(value: unknown): value is ReviewSource {
  return value === "lesson" || value === "exercise" || value === "review";
}

function isReviewCardState(value: unknown): value is ReviewCardState {
  if (!value || typeof value !== "object") return false;
  const card = value as Partial<ReviewCardState>;
  return (
    typeof card.itemId === "string" &&
    typeof card.introducedAt === "string" &&
    Number.isFinite(Date.parse(card.introducedAt)) &&
    (card.lastReviewedAt === null ||
      (typeof card.lastReviewedAt === "string" && Number.isFinite(Date.parse(card.lastReviewedAt)))) &&
    typeof card.dueAt === "string" &&
    Number.isFinite(Date.parse(card.dueAt)) &&
    Number.isSafeInteger(card.intervalMinutes) &&
    Number(card.intervalMinutes) >= 0 &&
    Number.isSafeInteger(card.repetitions) &&
    Number(card.repetitions) >= 0 &&
    typeof card.easeFactor === "number" &&
    Number.isFinite(card.easeFactor) &&
    card.easeFactor >= MIN_EASE &&
    card.easeFactor <= 5 &&
    Number.isSafeInteger(card.attempts) &&
    Number(card.attempts) >= 0 &&
    Number.isSafeInteger(card.correctAttempts) &&
    Number(card.correctAttempts) >= 0 &&
    Number(card.correctAttempts) <= Number(card.attempts) &&
    Array.isArray(card.recentAttemptIds) &&
    card.recentAttemptIds.every((id) => typeof id === "string")
  );
}

function isReviewHistoryEntry(value: unknown): value is ReviewHistoryEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<ReviewHistoryEntry>;
  return (
    typeof entry.id === "string" &&
    entry.id.length > 0 &&
    typeof entry.itemId === "string" &&
    typeof entry.occurredAt === "string" &&
    Number.isFinite(Date.parse(entry.occurredAt)) &&
    isSource(entry.source) &&
    (entry.grade === null || isGrade(entry.grade)) &&
    (entry.correct === null || typeof entry.correct === "boolean")
  );
}

function getBrowserStorage(): ReviewStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function readDatabaseFromStorage(
  storage: Pick<ReviewStorage, "getItem"> | null,
): { value: ReviewDatabase; status: ReviewStorageStatus } {
  if (!storage) return { value: emptyDatabase, status: "unavailable" };

  try {
    const serialized = storage.getItem(REVIEW_STORAGE_KEY);
    if (serialized === null) return { value: emptyDatabase, status: "ready" };
    const parsed: unknown = JSON.parse(serialized);
    if (!parsed || typeof parsed !== "object") {
      return { value: emptyDatabase, status: "read-only" };
    }

    const candidate = parsed as Partial<ReviewDatabase>;
    if (
      candidate.version !== 1 ||
      !Array.isArray(candidate.cards) ||
      !candidate.cards.every(isReviewCardState) ||
      !Array.isArray(candidate.history) ||
      !candidate.history.every(isReviewHistoryEntry)
    ) {
      return { value: emptyDatabase, status: "read-only" };
    }

    return { value: candidate as ReviewDatabase, status: "ready" };
  } catch {
    return { value: emptyDatabase, status: "read-only" };
  }
}

function writeDatabase(update: (current: ReviewDatabase) => ReviewDatabase): boolean {
  const storage = getBrowserStorage();
  const current = readDatabaseFromStorage(storage);
  if (!storage || current.status !== "ready") return false;

  try {
    // Re-read immediately before writing so a second tab's completed update is seen.
    const latest = readDatabaseFromStorage(storage);
    if (latest.status !== "ready") return false;
    storage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(update(latest.value)));
  } catch {
    return false;
  }

  window.dispatchEvent(new Event("tekshe-progress-updated"));
  return true;
}

function createNewCard(itemId: string, now: Date): ReviewCardState {
  return {
    itemId,
    introducedAt: now.toISOString(),
    lastReviewedAt: null,
    dueAt: now.toISOString(),
    intervalMinutes: 0,
    repetitions: 0,
    easeFactor: 2.5,
    attempts: 0,
    correctAttempts: 0,
    recentAttemptIds: [],
  };
}

function scheduleGrade(
  card: ReviewCardState,
  grade: ReviewGrade,
  now: Date,
): ReviewCardState {
  const next = { ...card };
  let intervalMinutes: number;

  if (grade === "again") {
    next.repetitions = 0;
    next.easeFactor = Math.max(MIN_EASE, next.easeFactor - 0.2);
    intervalMinutes = 10;
  } else if (grade === "hard") {
    next.repetitions += 1;
    next.easeFactor = Math.max(MIN_EASE, next.easeFactor - 0.15);
    intervalMinutes =
      card.intervalMinutes < 24 * 60
        ? 24 * 60
        : Math.ceil(card.intervalMinutes * 1.2);
  } else if (grade === "good") {
    next.repetitions += 1;
    intervalMinutes =
      card.repetitions === 0
        ? 24 * 60
        : card.repetitions === 1
          ? 3 * 24 * 60
          : Math.ceil(card.intervalMinutes * card.easeFactor);
  } else {
    next.repetitions += 1;
    next.easeFactor = Math.min(5, next.easeFactor + 0.15);
    intervalMinutes =
      card.repetitions === 0
        ? 4 * 24 * 60
        : card.repetitions === 1
          ? 7 * 24 * 60
          : Math.ceil(card.intervalMinutes * next.easeFactor);
  }

  next.intervalMinutes = intervalMinutes;
  next.lastReviewedAt = now.toISOString();
  next.dueAt = new Date(now.getTime() + intervalMinutes * 60_000).toISOString();
  return next;
}

export function getNextReviewIntervalMinutes(
  card: ReviewCardState,
  grade: ReviewGrade,
  now = new Date(),
): number {
  return scheduleGrade(card, grade, now).intervalMinutes;
}

function localDayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function buildSnapshot(now: Date): ReviewDashboardSnapshot {
  const result = readDatabaseFromStorage(getBrowserStorage());
  const cards = result.value.cards
    .map((state) => {
      const content = vocabularyById.get(state.itemId);
      return content ? { ...content, state } : null;
    })
    .filter((card): card is ReviewVocabularyCard & { state: ReviewCardState } => Boolean(card));
  const today = localDayKey(now);
  const reviewedToday = result.value.history.filter(
    (entry) => entry.source === "review" && localDayKey(new Date(entry.occurredAt)) === today,
  ).length;
  const dueCards = cards
    .filter((card) => Date.parse(card.state.dueAt) <= now.getTime())
    .sort((left, right) => Date.parse(left.state.dueAt) - Date.parse(right.state.dueAt));

  return {
    dueCards,
    totalCards: cards.length,
    dueCount: dueCards.length,
    reviewedToday,
    storageStatus: result.status,
  };
}

export function getReviewDashboardSnapshot(now = new Date()): ReviewDashboardSnapshot {
  return buildSnapshot(now);
}

export function introduceVocabularyForReview(
  itemIds: string[],
  curriculumId: string,
  lessonId: string,
  now = new Date(),
): number {
  if (!curriculumId.trim() || !lessonId.trim() || !Array.isArray(itemIds)) return 0;
  const validIds = [...new Set(itemIds)].filter((id) => vocabularyById.has(id));
  if (validIds.length === 0) return 0;
  let added = 0;

  const saved = writeDatabase((current) => {
    const cards = [...current.cards];
    const history = [...current.history];
    const knownCards = new Set(cards.map((card) => card.itemId));
    const knownEvents = new Set(history.map((entry) => entry.id));

    for (const itemId of validIds) {
      const eventId = `lesson:${curriculumId}:${lessonId}:${itemId}`;
      if (knownCards.has(itemId)) continue;
      cards.push(createNewCard(itemId, now));
      knownCards.add(itemId);
      if (!knownEvents.has(eventId)) {
        history.unshift({
          id: eventId,
          itemId,
          occurredAt: now.toISOString(),
          source: "lesson",
          grade: null,
          correct: null,
        });
        added += 1;
      }
    }

    return {
      version: 1,
      cards,
      history: history.slice(0, REVIEW_HISTORY_LIMIT),
    };
  });

  return saved ? added : 0;
}

export function recordExerciseReviewResult(input: {
  itemIds: string[];
  attemptId: string;
  correct: boolean;
  now?: Date;
}): number {
  const attemptId = input.attemptId.trim();
  if (!attemptId || attemptId.length > 160 || !Array.isArray(input.itemIds)) return 0;
  const itemIds = [...new Set(input.itemIds)].filter((id) => vocabularyById.has(id));
  if (itemIds.length === 0) return 0;
  const now = input.now ?? new Date();
  let recorded = 0;

  const saved = writeDatabase((current) => {
    const cards = current.cards.map((card) => ({
      ...card,
      recentAttemptIds: [...card.recentAttemptIds],
    }));
    const history = [...current.history];

    for (const itemId of itemIds) {
      const attemptKey = `exercise:${attemptId}:${itemId}`;
      let index = cards.findIndex((card) => card.itemId === itemId);
      if (index < 0) {
        cards.push(createNewCard(itemId, now));
        index = cards.length - 1;
      }
      const card = cards[index];
      if (card.recentAttemptIds.includes(attemptKey)) continue;

      const next = scheduleGrade(card, input.correct ? "good" : "again", now);
      next.attempts += 1;
      if (input.correct) next.correctAttempts += 1;
      next.recentAttemptIds = [...card.recentAttemptIds, attemptKey].slice(-RECENT_ATTEMPT_LIMIT);
      cards[index] = next;
      history.unshift({
        id: attemptKey,
        itemId,
        occurredAt: now.toISOString(),
        source: "exercise",
        grade: input.correct ? "good" : "again",
        correct: input.correct,
      });
      recorded += 1;
    }

    return {
      version: 1,
      cards,
      history: history.slice(0, REVIEW_HISTORY_LIMIT),
    };
  });

  return saved ? recorded : 0;
}

export function gradeDueReviewCard(input: {
  itemId: string;
  grade: ReviewGrade;
  attemptId: string;
  now?: Date;
}): boolean {
  const attemptId = input.attemptId.trim();
  const now = input.now ?? new Date();
  if (
    !vocabularyById.has(input.itemId) ||
    !isGrade(input.grade) ||
    !attemptId ||
    attemptId.length > 160
  ) {
    return false;
  }

  let graded = false;
  const saved = writeDatabase((current) => {
    const cards = current.cards.map((card) => ({
      ...card,
      recentAttemptIds: [...card.recentAttemptIds],
    }));
    const index = cards.findIndex((card) => card.itemId === input.itemId);
    if (index < 0) return current;

    const attemptKey = `review:${attemptId}:${input.itemId}`;
    const card = cards[index];
    if (card.recentAttemptIds.includes(attemptKey) || Date.parse(card.dueAt) > now.getTime()) {
      return current;
    }

    const correct = input.grade !== "again";
    const next = scheduleGrade(card, input.grade, now);
    next.attempts += 1;
    if (correct) next.correctAttempts += 1;
    next.recentAttemptIds = [...card.recentAttemptIds, attemptKey].slice(-RECENT_ATTEMPT_LIMIT);
    cards[index] = next;
    graded = true;

    return {
      version: 1,
      cards,
      history: [
        {
          id: attemptKey,
          itemId: input.itemId,
          occurredAt: now.toISOString(),
          source: "review" as const,
          grade: input.grade,
          correct,
        },
        ...current.history,
      ].slice(0, REVIEW_HISTORY_LIMIT),
    };
  });

  return saved && graded;
}

export function getTodayReviewCount(now = new Date()): number {
  const today = localDayKey(now);
  return readDatabaseFromStorage(getBrowserStorage()).value.history.filter(
    (entry) => entry.source === "review" && localDayKey(new Date(entry.occurredAt)) === today,
  ).length;
}

export function getReviewHistory(): ReviewHistoryEntry[] {
  return readDatabaseFromStorage(getBrowserStorage()).value.history;
}

export const reviewProgressStore = createProgressStore(
  () => getReviewDashboardSnapshot(),
  emptySnapshot,
);
