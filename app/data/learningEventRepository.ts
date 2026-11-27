import { isLearningEvent, type LearningEvent } from "./learningContracts";

export const LEARNING_EVENT_STORAGE_KEY = "tekshe-learning-events:v1";

export type LearningEventReadResult = {
  status: "ready" | "unavailable" | "read-only";
  events: LearningEvent[];
};

export type AppendLearningEventResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; reason: "unavailable" | "read-only" | "invalid-event" | "attempt-id-reused" };

export interface LearningEventRepository {
  read(): LearningEventReadResult;
  append(event: LearningEvent): AppendLearningEventResult;
}

type LocalStoragePort = Pick<Storage, "getItem" | "setItem">;
type EventEnvelope = { version: 1; events: LearningEvent[] };

function localStoragePort(): LocalStoragePort | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function attemptKey(event: LearningEvent): string | null {
  if (event.type === "exercise_submitted" || event.type === "assessment_completed") {
    return `${event.learnerId}:${event.type}:${event.payload.attemptId}`;
  }
  return null;
}

export class LocalLearningEventRepository implements LearningEventRepository {
  private readonly storage: LocalStoragePort | null;

  constructor(storage: LocalStoragePort | null = localStoragePort()) {
    this.storage = storage;
  }

  read(): LearningEventReadResult {
    if (!this.storage) return { status: "unavailable", events: [] };
    try {
      const raw = this.storage.getItem(LEARNING_EVENT_STORAGE_KEY);
      if (raw === null) return { status: "ready", events: [] };
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return { status: "read-only", events: [] };
      const envelope = parsed as Partial<EventEnvelope>;
      if (envelope.version !== 1 || !Array.isArray(envelope.events) || !envelope.events.every(isLearningEvent)) {
        return { status: "read-only", events: [] };
      }
      return { status: "ready", events: envelope.events };
    } catch {
      return { status: "read-only", events: [] };
    }
  }

  append(event: LearningEvent): AppendLearningEventResult {
    if (!isLearningEvent(event)) return { ok: false, reason: "invalid-event" };
    if (!this.storage) return { ok: false, reason: "unavailable" };
    const current = this.read();
    if (current.status === "read-only") return { ok: false, reason: "read-only" };
    if (current.status === "unavailable") return { ok: false, reason: "unavailable" };
    if (current.events.some((item) => item.eventId === event.eventId)) return { ok: true, duplicate: true };

    const newAttemptKey = attemptKey(event);
    if (newAttemptKey && current.events.some((item) => attemptKey(item) === newAttemptKey)) {
      return { ok: false, reason: "attempt-id-reused" };
    }

    try {
      // Re-read before the write so a second tab's preceding event is retained.
      const latest = this.read();
      if (latest.status !== "ready") return { ok: false, reason: latest.status };
      if (latest.events.some((item) => item.eventId === event.eventId)) return { ok: true, duplicate: true };
      if (newAttemptKey && latest.events.some((item) => attemptKey(item) === newAttemptKey)) {
        return { ok: false, reason: "attempt-id-reused" };
      }
      this.storage.setItem(LEARNING_EVENT_STORAGE_KEY, JSON.stringify({ version: 1, events: [...latest.events, event] } satisfies EventEnvelope));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("tekshe-progress-updated"));
      return { ok: true, duplicate: false };
    } catch {
      return { ok: false, reason: "unavailable" };
    }
  }
}

export const learningEventRepository: LearningEventRepository = new LocalLearningEventRepository();

const LOCAL_LEARNER_ID_KEY = "tekshe-learning-learner-id:v1";

export function getOrCreateLocalLearnerId(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const existing = window.localStorage.getItem(LOCAL_LEARNER_ID_KEY);
    if (existing?.trim()) return existing;
    const created = `local:${createLearningEventId()}`;
    window.localStorage.setItem(LOCAL_LEARNER_ID_KEY, created);
    return created;
  } catch {
    return null;
  }
}

export function createLearningEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
