import assert from "node:assert/strict";
import test from "node:test";
import { beginnerCurriculum } from "./curriculumRegistry.ts";
import { validateCurriculum } from "./curriculumValidation.ts";

test("starter curriculum passes structural validation", () => {
  assert.deepEqual(validateCurriculum(beginnerCurriculum), []);
});

test("validator catches duplicate IDs and unresolved references", () => {
  const invalid = structuredClone(beginnerCurriculum);
  invalid.lessons.push({ ...invalid.lessons[0] });
  invalid.lessons[0].exerciseIds = ["missing-exercise"];

  const issues = validateCurriculum(invalid);
  assert.ok(issues.some((issue) => issue.code === "DUPLICATE_ID"));
  assert.ok(issues.some((issue) => issue.code === "MISSING_REFERENCE"));
});

test("validator catches inconsistent parent links and invalid duration", () => {
  const invalid = structuredClone(beginnerCurriculum);
  invalid.lessons[0].levelId = "missing-level";
  invalid.lessons[0].estimatedDurationMinutes = 0;

  const issues = validateCurriculum(invalid);
  assert.ok(issues.some((issue) => issue.code === "MISSING_REFERENCE"));
  assert.ok(issues.some((issue) => issue.code === "INVALID_DURATION"));
});

test("validator catches prerequisite cycles", () => {
  const invalid = structuredClone(beginnerCurriculum);
  invalid.units[0].prerequisites = ["pinyin-unit-1"];

  assert.ok(
    validateCurriculum(invalid).some(
      (issue) => issue.code === "PREREQUISITE_CYCLE"
    )
  );
});
