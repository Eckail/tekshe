import assert from "node:assert/strict";
import test from "node:test";
import { hsk1FoundationCurriculum, hsk1FoundationVocabulary, hsk1SourceId } from "./hsk1Foundation.ts";
import { pinyinCurriculum, pinyinFinalGroups, pinyinInitials, pinyinToneInventory } from "./pinyinCurriculum.ts";
import { u01Release, validateU01DraftStatuses } from "./u01Curriculum.ts";
import { validateCurriculumRelease } from "./curriculumRepository.ts";
import { scoreAssessment } from "./assessmentService.ts";
import { completePathLessonIfEligible, getKnowledgePointEvidence, getPathLessonState } from "./pathCompletionService.ts";
import { LocalLearningEventRepository } from "./learningEventRepository.ts";
import { transitionEditorialRevision } from "./editorialWorkflow.ts";

function validateCurriculum(curriculum) {
  const ids = (items) => items.map(({ id }) => id);
  const levelIds = new Set(ids(curriculum.levels));
  const unitIds = new Set(ids(curriculum.units));
  const moduleIds = new Set(ids(curriculum.modules));
  const lessonIds = new Set(ids(curriculum.lessons));
  const vocabularyIds = new Set(ids(curriculum.vocabulary));
  const exerciseIds = new Set(ids(curriculum.exercises));
  const sourceIds = new Set(ids(curriculum.sources));
  const validPinyin = /^[A-Za-züÜāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ' -→.,!?]+$/u;

  for (const level of curriculum.levels) {
    for (const id of level.unitIds) assert.ok(unitIds.has(id), `${level.id}: unknown unit ${id}`);
  }
  for (const unit of curriculum.units) {
    assert.ok(levelIds.has(unit.levelId), `${unit.id}: unknown level`);
    for (const id of unit.moduleIds) assert.ok(moduleIds.has(id), `${unit.id}: unknown module ${id}`);
  }
  for (const curriculumModule of curriculum.modules) {
    for (const id of curriculumModule.lessonIds) assert.ok(lessonIds.has(id), `${curriculumModule.id}: unknown lesson ${id}`);
  }

  for (const lesson of curriculum.lessons) {
    assert.equal(lesson.curriculumId, curriculum.id, `${lesson.id}: curriculum ID mismatch`);
    assert.ok(levelIds.has(lesson.levelId), `${lesson.id}: unknown level`);
    assert.ok(unitIds.has(lesson.unitId), `${lesson.id}: unknown unit`);
    assert.ok(moduleIds.has(lesson.moduleId), `${lesson.id}: unknown module`);
    assert.ok(lesson.title.trim(), `${lesson.id}: missing title`);
    assert.ok(lesson.learningObjectives.length > 0, `${lesson.id}: missing objectives`);
    assert.ok(lesson.introductionKazakh?.trim(), `${lesson.id}: missing Kazakh introduction`);
    assert.ok((lesson.teachingSections?.length ?? 0) > 0, `${lesson.id}: missing teaching content`);
    assert.ok(lesson.exerciseIds.length > 0, `${lesson.id}: missing exercises`);
    for (const id of lesson.prerequisites) assert.ok(lessonIds.has(id), `${lesson.id}: unknown prerequisite ${id}`);
    for (const id of lesson.vocabularyIds) assert.ok(vocabularyIds.has(id), `${lesson.id}: unknown vocabulary ${id}`);
    for (const id of lesson.exerciseIds) assert.ok(exerciseIds.has(id), `${lesson.id}: unknown exercise ${id}`);
    for (const section of lesson.teachingSections ?? []) {
      assert.ok(section.title.trim(), `${lesson.id}/${section.id}: missing section title`);
      assert.ok(section.explanationKazakh.trim(), `${lesson.id}/${section.id}: missing explanation`);
      for (const example of section.examples ?? []) {
        assert.ok(example.hanzi.trim(), `${lesson.id}/${section.id}: missing example characters`);
        assert.ok(example.pinyin.trim(), `${lesson.id}/${section.id}: missing example pinyin`);
        assert.ok(example.translationKazakh.trim(), `${lesson.id}/${section.id}: missing example translation`);
        assert.match(example.pinyin, validPinyin, `${lesson.id}/${section.id}: invalid example pinyin`);
      }
    }
  }

  for (const exercise of curriculum.exercises) {
    assert.ok(exercise.prompt.trim(), `${exercise.id}: missing prompt`);
    assert.ok(exercise.explanationKazakh.trim(), `${exercise.id}: missing answer feedback`);
    assert.ok(Array.isArray(exercise.options) && exercise.options.length >= 2, `${exercise.id}: missing answer options`);
    const answers = Array.isArray(exercise.answer) ? exercise.answer : [exercise.answer];
    assert.ok(answers.length > 0, `${exercise.id}: empty answer`);
    for (const answer of answers) assert.ok(exercise.options.includes(answer), `${exercise.id}: answer not present in choices`);
    for (const reviewItemId of exercise.reviewItemIds ?? []) {
      assert.ok(vocabularyIds.has(reviewItemId), `${exercise.id}: unknown review vocabulary ${reviewItemId}`);
    }
    if (exercise.type === "listening-selection") assert.ok(exercise.audioText?.trim(), `${exercise.id}: listening prompt has no audio text`);
  }

  for (const entry of curriculum.vocabulary) {
    assert.ok(entry.hanzi.trim(), `${entry.id}: missing characters`);
    assert.ok(entry.pinyin.trim(), `${entry.id}: missing pinyin`);
    assert.match(entry.pinyin, validPinyin, `${entry.id}: invalid pinyin`);
    assert.ok(entry.tones.length > 0, `${entry.id}: missing tones`);
    assert.ok(entry.translationKazakh.trim(), `${entry.id}: missing Kazakh translation`);
    assert.ok(entry.partOfSpeech, `${entry.id}: missing part of speech`);
    assert.ok(entry.example.hanzi.trim() && entry.example.pinyin.trim() && entry.example.translationKazakh.trim(), `${entry.id}: incomplete example`);
    assert.match(entry.example.pinyin, validPinyin, `${entry.id}: invalid example pinyin`);
    assert.ok(sourceIds.has(entry.sourceId), `${entry.id}: unknown source ${entry.sourceId}`);
    assert.ok(levelIds.has(entry.levelId), `${entry.id}: unknown level`);
    assert.equal(entry.curriculumId, curriculum.id, `${entry.id}: curriculum ID mismatch`);
  }
}

test("Pinyin curriculum covers the complete initial, final and tone inventories", () => {
  assert.deepEqual([...pinyinInitials], ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s"]);
  assert.equal(new Set(pinyinInitials).size, 21);
  assert.deepEqual([...pinyinFinalGroups.simple], ["a", "o", "e", "i", "u", "ü"]);
  const allFinals = Object.values(pinyinFinalGroups).flat();
  assert.equal(allFinals.length, 36);
  assert.equal(new Set(allFinals).size, 36);
  assert.deepEqual([...pinyinToneInventory], [1, 2, 3, 4, "neutral"]);
  assert.equal(pinyinCurriculum.lessons.length, 5);
  const toneLesson = pinyinCurriculum.lessons.find(({ id }) => id === "tone-practice");
  assert.ok(toneLesson.teachingSections.some(({ title, explanationKazakh }) => title.includes("сөйлеуде") && explanationKazakh.includes("你好")));
  validateCurriculum(pinyinCurriculum);
});

test("HSK beginner vocabulary is sourced, versioned and structurally complete", () => {
  assert.equal(hsk1FoundationVocabulary.length, 29);
  assert.equal(new Set(hsk1FoundationVocabulary.map(({ id }) => id)).size, 29);
  assert.equal(new Set(hsk1FoundationVocabulary.map(({ hanzi }) => hanzi)).size, 29);
  assert.ok(hsk1FoundationCurriculum.standard.name.includes("2025 edition"));
  assert.equal(hsk1FoundationCurriculum.standard.publishedAt, "2025-11");
  assert.equal(hsk1FoundationCurriculum.standard.effectiveFrom, "2026-07");
  assert.ok(hsk1FoundationCurriculum.sources.some(({ id, locator }) => id === hsk1SourceId && locator.includes("一级")));

  for (const entry of hsk1FoundationVocabulary) {
    assert.equal(entry.sourceId, hsk1SourceId);
    assert.equal(entry.levelId, "hsk-2025-level-1");
    assert.equal(entry.tones.length, Array.from(entry.hanzi).length, `${entry.id}: one lexical tone is required per character/syllable`);
    assert.equal(entry.translationReview, "editorial-draft");
  }

  validateCurriculum(hsk1FoundationCurriculum);
});

function answersFor(assessment, release = u01Release) {
  return Object.fromEntries(assessment.exerciseIds.map((id) => {
    const exercise = release.exercises.find((item) => item.id === id);
    const value = exercise.answerKey;
    const answer = exercise.interaction === "order"
      ? { kind: "order", value }
      : exercise.interaction === "text"
        ? { kind: "text", value }
        : { kind: "choice", value };
    return [id, answer];
  }));
}

function memoryRepository() {
  const values = new Map();
  const storage = {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value),
  };
  return new LocalLearningEventRepository(storage);
}

test("U01 release pins unique KnowledgePoint revisions and has shared path/module references", () => {
  assert.deepEqual(validateCurriculumRelease(u01Release), { valid: true });
  assert.equal(u01Release.lessons.length, 4);
  assert.equal(u01Release.independentModules.length, 8);
  assert.equal(new Set(u01Release.knowledgePoints.map(({ id }) => id)).size, u01Release.knowledgePoints.length);
  assert.equal(new Set(u01Release.knowledgePointRevisions.map(({ id }) => id)).size, u01Release.knowledgePointRevisions.length);
  for (const point of u01Release.knowledgePoints) {
    const pin = u01Release.knowledgePointPins.filter((item) => item.knowledgePointId === point.id);
    assert.equal(pin.length, 1);
    assert.equal(u01Release.knowledgePointRevisions.find(({ id }) => id === pin[0].revisionId).knowledgePointId, point.id);
  }
  for (const independentModule of u01Release.independentModules) {
    assert.ok(independentModule.knowledgePointIds.length > 0);
    assert.ok(independentModule.contentBlockIds.length > 0 || independentModule.exerciseIds.length > 0);
    for (const id of independentModule.knowledgePointIds) assert.ok(u01Release.knowledgePoints.some((point) => point.id === id));
  }
  assert.deepEqual(validateU01DraftStatuses(), []);
});

test("U01 greetings map to official HSK 1 interaction sources without copying legacy words", () => {
  const task = u01Release.coverageRequirements.find(({ officialItemKey }) => officialItemKey === "T06");
  const topic = u01Release.coverageRequirements.find(({ officialItemKey }) => officialItemKey === "日常生活 > 交往 > 基本礼貌行为");
  assert.equal(task.section, "task");
  assert.match(task.sourceLocator, /PDF 第 2–5 页/);
  assert.equal(task.coverageStatus, "partial");
  assert.equal(topic.section, "topic");
  assert.match(topic.sourceLocator, /PDF 第 56 页/);
  assert.equal(topic.coverageStatus, "partial");

  const dialogue = u01Release.contentBlocks.find(({ id }) => id === "u01-dialogue-first-meeting");
  assert.ok(dialogue.sourceRequirementIds.includes(task.id));
  assert.ok(dialogue.sourceRequirementIds.includes(topic.id));
  for (const [knowledgePointId, legacyVocabularyId, lessonIndex] of [
    ["kp.vocabulary.0016", "hsk1-hao", 2],
    ["kp.vocabulary.0017", "hsk1-zaijian", 1],
  ]) {
    const revision = u01Release.knowledgePointRevisions.find(({ knowledgePointId: id }) => id === knowledgePointId);
    assert.ok(revision.legacyVocabularyIds.includes(legacyVocabularyId));
    assert.ok(task.knowledgePointIds.includes(knowledgePointId));
    assert.ok(topic.knowledgePointIds.includes(knowledgePointId));
    assert.ok(u01Release.independentModules.find(({ id }) => id === "u01-module-vocabulary").knowledgePointIds.includes(knowledgePointId));
    assert.ok(u01Release.lessons[lessonIndex].knowledgePointIds.includes(knowledgePointId));
  }
});

test("U01 assessments are fixed to the 80/70 rule and require every scored item", () => {
  assert.equal(u01Release.assessments.length, 4);
  for (const assessment of u01Release.assessments) {
    assert.equal(assessment.rule.minimumTotalPercent, 80);
    assert.equal(assessment.rule.allRequiredItemsMustBeScored, true);
    assert.ok(Object.values(assessment.rule.requiredObjectiveMinimumPercent).every((value) => value === 70));
    assert.equal(assessment.exerciseIds.length, 5);
    const missing = scoreAssessment(u01Release, assessment, {}, "missing-attempt");
    assert.equal(missing.status, "incomplete");
    const answers = answersFor(assessment);
    const passed = scoreAssessment(u01Release, assessment, answers, "passing-attempt");
    assert.equal(passed.status, "scored");
    assert.equal(passed.result.passed, true);
    const belowThreshold = { ...answers };
    for (const incorrectId of assessment.exerciseIds.slice(0, 2)) {
      belowThreshold[incorrectId] = { kind: "choice", value: "definitely-wrong" };
    }
    const below = scoreAssessment(u01Release, assessment, belowThreshold, "failing-attempt");
    assert.equal(below.status, "scored");
    assert.equal(below.result.passed, false);
  }
});

test("independent module evidence is visible to U01 but cannot complete its path lesson", () => {
  const repository = memoryRepository();
  const learnerId = "learner-test";
  const vocabularyModule = u01Release.independentModules.find(({ id }) => id === "u01-module-vocabulary");
  const opened = {
    eventId: "module-opened-vocabulary", schemaVersion: 1, type: "module_opened",
    learnerId, occurredAt: "2026-01-01T00:00:00.000Z", curriculumId: u01Release.curriculumId,
    contentVersion: u01Release.contentVersion, entryPoint: { mode: "independent", moduleId: vocabularyModule.id },
    knowledgePointIds: ["kp.vocabulary.0001"], payload: null,
  };
  assert.equal(repository.append(opened).ok, true);
  assert.equal(repository.append(opened).duplicate, true);
  const exercise = u01Release.exercises.find(({ id }) => id === "u01-l1-practice-greeting");
  assert.equal(repository.append({
    eventId: "independent-answer-1", schemaVersion: 1, type: "exercise_submitted",
    learnerId, occurredAt: "2026-01-01T00:01:00.000Z", curriculumId: u01Release.curriculumId,
    contentVersion: u01Release.contentVersion, entryPoint: { mode: "independent", moduleId: vocabularyModule.id },
    knowledgePointIds: exercise.knowledgePointIds,
    payload: {
      exerciseId: exercise.id, exerciseRevisionId: exercise.revisionId, attemptId: "module-attempt-1",
      answer: { kind: "choice", value: "Сәлем" }, outcome: "correct",
    },
  }).ok, true);
  assert.deepEqual(repository.append({
    eventId: "independent-answer-duplicate", schemaVersion: 1, type: "exercise_submitted",
    learnerId, occurredAt: "2026-01-01T00:01:30.000Z", curriculumId: u01Release.curriculumId,
    contentVersion: u01Release.contentVersion, entryPoint: { mode: "independent", moduleId: vocabularyModule.id },
    knowledgePointIds: exercise.knowledgePointIds,
    payload: {
      exerciseId: exercise.id, exerciseRevisionId: exercise.revisionId, attemptId: "module-attempt-1",
      answer: { kind: "choice", value: "Сәлем" }, outcome: "correct",
    },
  }), { ok: false, reason: "attempt-id-reused" });
  const events = repository.read().events;
  const evidence = getKnowledgePointEvidence(u01Release, learnerId, events).find(({ knowledgePointId }) => knowledgePointId === "kp.vocabulary.0001");
  assert.equal(evidence.exposed, true);
  assert.equal(evidence.practiceCount, 1);
  const lesson = u01Release.lessons[0];
  const assessment = u01Release.assessments.find(({ lessonId }) => lessonId === lesson.id);
  const result = scoreAssessment(u01Release, assessment, answersFor(assessment), "independent-assessment-attempt");
  assert.equal(result.status, "scored");
  assert.equal(repository.append({
    eventId: "independent-assessment-1", schemaVersion: 1, type: "assessment_completed",
    learnerId, occurredAt: "2026-01-01T00:02:00.000Z", curriculumId: u01Release.curriculumId,
    contentVersion: u01Release.contentVersion, entryPoint: { mode: "independent", moduleId: vocabularyModule.id },
    knowledgePointIds: lesson.knowledgePointIds, payload: result.result,
  }).ok, true);
  const completion = completePathLessonIfEligible({
    release: u01Release, lessonId: lesson.id, learnerId,
    allEvents: repository.read().events, repository,
  });
  assert.equal(completion.completed, false);
  assert.equal(completion.reason, "required-path-assessment-not-passed");
  assert.equal(getPathLessonState(u01Release, lesson.id, learnerId, repository.read().events), "not-started");
  assert.equal(repository.read().events.filter(({ type }) => type === "lesson_completed").length, 0);
});

test("only a passing path assessment derives path completion, and the event is idempotent", () => {
  const repository = memoryRepository();
  const learnerId = "learner-path";
  const lesson = u01Release.lessons[0];
  const assessment = u01Release.assessments.find(({ lessonId }) => lessonId === lesson.id);
  const answerSet = answersFor(assessment);
  const result = scoreAssessment(u01Release, assessment, answerSet, "path-assessment-attempt");
  assert.equal(result.status, "scored");
  for (const exerciseId of assessment.exerciseIds) {
    const exercise = u01Release.exercises.find(({ id }) => id === exerciseId);
    assert.equal(repository.append({
      eventId: "path-answer-" + exerciseId, schemaVersion: 1, type: "exercise_submitted",
      learnerId, occurredAt: "2026-01-01T00:00:00.000Z", curriculumId: u01Release.curriculumId,
      contentVersion: u01Release.contentVersion,
      entryPoint: { mode: "path", pathId: u01Release.path.id, lessonId: lesson.id },
      knowledgePointIds: exercise.knowledgePointIds,
      payload: {
        exerciseId, exerciseRevisionId: exercise.revisionId,
        attemptId: result.result.attemptId + ":" + exerciseId,
        answer: answerSet[exerciseId], outcome: "correct",
      },
    }).ok, true);
  }
  const event = {
    eventId: "path-assessment-1", schemaVersion: 1, type: "assessment_completed",
    learnerId, occurredAt: "2026-01-01T00:00:00.000Z", curriculumId: u01Release.curriculumId,
    contentVersion: u01Release.contentVersion,
    entryPoint: { mode: "path", pathId: u01Release.path.id, lessonId: lesson.id },
    knowledgePointIds: lesson.knowledgePointIds, payload: result.result,
  };
  assert.equal(repository.append(event).ok, true);
  const completed = completePathLessonIfEligible({
    release: u01Release, lessonId: lesson.id, learnerId,
    allEvents: repository.read().events, repository,
  });
  assert.equal(completed.completed, true);
  assert.equal(getPathLessonState(u01Release, lesson.id, learnerId, repository.read().events), "completed");
  completePathLessonIfEligible({ release: u01Release, lessonId: lesson.id, learnerId, allEvents: repository.read().events, repository });
  assert.equal(repository.read().events.filter(({ type }) => type === "lesson_completed").length, 1);
});

test("a bare or forged lesson-completed event cannot unlock the next path lesson", () => {
  const repository = memoryRepository();
  const learnerId = "learner-forged-event";
  const lesson = u01Release.lessons[0];
  assert.equal(repository.append({
    eventId: "forged-completion", schemaVersion: 1, type: "lesson_completed",
    learnerId, occurredAt: "2026-01-01T00:00:00.000Z", curriculumId: u01Release.curriculumId,
    contentVersion: u01Release.contentVersion,
    entryPoint: { mode: "path", pathId: u01Release.path.id, lessonId: lesson.id },
    knowledgePointIds: lesson.knowledgePointIds,
    payload: { completionRuleVersion: "u01-path-completion-v1", qualifyingAssessmentAttemptIds: ["not-real"] },
  }).ok, true);
  assert.equal(getPathLessonState(u01Release, lesson.id, learnerId, repository.read().events), "not-started");
  assert.equal(getPathLessonState(u01Release, u01Release.lessons[1].id, learnerId, repository.read().events), "not-started");
  const result = completePathLessonIfEligible({
    release: u01Release, lessonId: lesson.id, learnerId,
    allEvents: repository.read().events, repository,
  });
  assert.equal(result.completed, false);
  assert.equal(result.reason, "required-path-assessment-not-passed");
});

test("editorial status requires independent review and release checks", () => {
  const initial = { entityId: "kp.example", revisionId: "kp.example-r1", authorId: "author-1", status: "draft", reviews: [] };
  const pending = transitionEditorialRevision(initial, "pending-review");
  assert.equal(pending.ok, true);
  assert.equal(transitionEditorialRevision(pending.revision, "published", true).ok, false);
  const reviewed = transitionEditorialRevision({
    ...pending.revision,
    reviews: [
      { reviewerId: "reviewer-kz", role: "kazakh-language", decision: "pass", checklistVersion: "v1" },
      { reviewerId: "reviewer-cn", role: "chinese-pedagogy", decision: "pass", checklistVersion: "v1" },
      { reviewerId: "reviewer-standard", role: "standards", decision: "pass", checklistVersion: "v1" },
    ],
  }, "reviewed");
  assert.equal(reviewed.ok, true);
  assert.equal(transitionEditorialRevision(reviewed.revision, "published", false).ok, false);
  const published = transitionEditorialRevision(reviewed.revision, "published", true);
  assert.equal(published.ok, true);
  assert.equal(transitionEditorialRevision(published.revision, "draft").ok, false);
});
