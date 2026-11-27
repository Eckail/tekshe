export type AiTutorRole = "user" | "assistant";

export type AiTutorMessage = {
  role: AiTutorRole;
  content: string;
};

/** IDs only: never send profile names, contact details, or browser storage. */
export type AiTutorLearningContext = {
  instructionalLanguage: "kk";
  targetLanguage: "zh-CN";
  levelId: string;
  completedLessonIds: string[];
  knownVocabularyIds: string[];
};

export type AiTutorRequest = {
  conversationId?: string;
  messages: AiTutorMessage[];
  context: AiTutorLearningContext;
};

export interface AiTutorProvider {
  readonly id: string;
  generateReply(
    request: AiTutorRequest,
    signal: AbortSignal,
  ): Promise<string>;
}

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1_500;
const MAX_CONTEXT_IDS = 100;
const SAFE_ID = /^[\p{L}\p{N}._:-]{1,100}$/u;

function isStringArray(value: unknown, maximum: number): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= maximum &&
    value.every((item) => typeof item === "string" && SAFE_ID.test(item))
  );
}

export function validateAiTutorRequest(value: unknown): AiTutorRequest | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<AiTutorRequest>;
  const context = candidate.context;

  if (
    !Array.isArray(candidate.messages) ||
    candidate.messages.length < 1 ||
    candidate.messages.length > MAX_MESSAGES ||
    !context ||
    context.instructionalLanguage !== "kk" ||
    context.targetLanguage !== "zh-CN" ||
    typeof context.levelId !== "string" ||
    !SAFE_ID.test(context.levelId) ||
    !isStringArray(context.completedLessonIds, MAX_CONTEXT_IDS) ||
    !isStringArray(context.knownVocabularyIds, MAX_CONTEXT_IDS) ||
    (candidate.conversationId !== undefined &&
      (typeof candidate.conversationId !== "string" ||
        candidate.conversationId.length > 100 ||
        !SAFE_ID.test(candidate.conversationId)))
  ) {
    return null;
  }

  const messages: AiTutorMessage[] = [];
  for (const item of candidate.messages) {
    if (
      !item ||
      typeof item !== "object" ||
      ((item as AiTutorMessage).role !== "user" &&
        (item as AiTutorMessage).role !== "assistant") ||
      typeof (item as AiTutorMessage).content !== "string" ||
      !(item as AiTutorMessage).content.trim() ||
      (item as AiTutorMessage).content.length > MAX_MESSAGE_LENGTH
    ) {
      return null;
    }
    messages.push({
      role: (item as AiTutorMessage).role,
      content: (item as AiTutorMessage).content.trim(),
    });
  }

  if (messages.at(-1)?.role !== "user") return null;

  return {
    ...(candidate.conversationId ? { conversationId: candidate.conversationId } : {}),
    messages,
    context: {
      instructionalLanguage: "kk",
      targetLanguage: "zh-CN",
      levelId: context.levelId,
      completedLessonIds: [...new Set(context.completedLessonIds)],
      knownVocabularyIds: [...new Set(context.knownVocabularyIds)],
    },
  };
}
