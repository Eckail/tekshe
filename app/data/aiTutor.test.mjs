import assert from "node:assert/strict";
import test from "node:test";
import {
  validateAiTutorRequest,
} from "./aiTutor.ts";
import {
  AiTutorServiceError,
  generateAiTutorReply,
  getAiTutorStatus,
} from "../server/aiTutor.ts";

const request = {
  conversationId: "session-1",
  messages: [{ role: "user", content: "你好 的意思是什么？" }],
  context: {
    instructionalLanguage: "kk",
    targetLanguage: "zh-CN",
    levelId: "hsk-2025-level-1",
    completedLessonIds: ["hsk1-introductions"],
    knownVocabularyIds: ["hsk1-nihao"],
  },
};

test("validates a concise learning context and removes duplicate IDs", () => {
  const parsed = validateAiTutorRequest({
    ...request,
    context: {
      ...request.context,
      knownVocabularyIds: ["hsk1-nihao", "hsk1-nihao"],
      privateEmail: "not-forwarded@example.invalid",
    },
    privateProfileName: "not-forwarded",
  });
  assert.deepEqual(parsed?.context.knownVocabularyIds, ["hsk1-nihao"]);
  assert.equal("privateEmail" in parsed.context, false);
  assert.equal("privateProfileName" in parsed, false);
});

test("rejects wrong languages, malformed IDs, too many messages, and oversized text", () => {
  assert.equal(validateAiTutorRequest({ ...request, context: { ...request.context, targetLanguage: "en" } }), null);
  assert.equal(validateAiTutorRequest({ ...request, context: { ...request.context, levelId: "bad level" } }), null);
  assert.equal(validateAiTutorRequest({ ...request, messages: Array(13).fill(request.messages[0]) }), null);
  assert.equal(validateAiTutorRequest({ ...request, messages: [{ role: "user", content: "x".repeat(1501) }] }), null);
  assert.equal(validateAiTutorRequest({ ...request, messages: [{ role: "assistant", content: "Жауап" }] }), null);
});

test("configuration status never returns or implies an API key", () => {
  assert.deepEqual(getAiTutorStatus({}), { available: false, reason: "credentials_missing" });
  assert.deepEqual(
    getAiTutorStatus({ TEKSHE_AI_PROVIDER: "custom", TEKSHE_AI_API_KEY: "secret", TEKSHE_AI_API_URL: "https://example.invalid" }),
    { available: false, reason: "provider_not_supported" },
  );
  assert.equal("TEKSHE_AI_API_KEY" in getAiTutorStatus({ TEKSHE_AI_API_KEY: "secret" }), false);
});

test("reports missing provider, normalizes provider errors, and enforces timeout", async () => {
  await assert.rejects(
    generateAiTutorReply(request, null),
    (error) => error instanceof AiTutorServiceError && error.code === "not_configured",
  );
  await assert.rejects(
    generateAiTutorReply(request, { id: "test", async generateReply() { throw new Error("secret-bearing provider error"); } }),
    (error) => error instanceof AiTutorServiceError && error.code === "provider_error" && !error.message.includes("secret-bearing"),
  );
  await assert.rejects(
    generateAiTutorReply(request, { id: "test", generateReply: () => new Promise(() => {}) }, 5),
    (error) => error instanceof AiTutorServiceError && error.code === "timeout",
  );
});
