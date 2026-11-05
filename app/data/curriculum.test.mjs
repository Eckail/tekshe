import assert from "node:assert/strict";
import test from "node:test";
import { hsk1FoundationCurriculum, hsk1FoundationVocabulary, hsk1SourceId } from "./hsk1Foundation.ts";
import { pinyinCurriculum, pinyinFinalGroups, pinyinInitials, pinyinToneInventory } from "./pinyinCurriculum.ts";

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
