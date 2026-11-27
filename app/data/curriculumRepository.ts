import { u01Release } from "./u01Curriculum";
import type {
  CurriculumRelease,
  IndependentModule,
  CurriculumLesson,
  KnowledgePoint,
  KnowledgePointRevision,
} from "./learningContracts";

export interface CurriculumRepository {
  getRelease(releaseId: string): CurriculumRelease | null;
  getLesson(releaseId: string, lessonId: string): CurriculumLesson | null;
  getKnowledgePoint(releaseId: string, knowledgePointId: string): KnowledgePoint | null;
  getKnowledgePointRevision(releaseId: string, revisionId: string): KnowledgePointRevision | null;
  getIndependentModule(releaseId: string, moduleId: string): IndependentModule | null;
}

export type CurriculumValidationResult = { valid: true } | { valid: false; errors: string[] };

function uniqueIds(values: Array<{ id: string }>, label: string, errors: string[]): Set<string> {
  const ids = new Set<string>();
  for (const value of values) {
    if (!value.id.trim()) errors.push(`${label}: empty ID`);
    else if (ids.has(value.id)) errors.push(`${label}: duplicate ID ${value.id}`);
    ids.add(value.id);
  }
  return ids;
}

export function validateCurriculumRelease(release: CurriculumRelease): CurriculumValidationResult {
  const errors: string[] = [];
  const standardReferenceIds = uniqueIds(release.standardReferences, "standard reference", errors);
  const levelIds = uniqueIds(release.levels, "level", errors);
  const unitIds = uniqueIds(release.units, "unit", errors);
  const lessonIds = uniqueIds(release.lessons, "lesson", errors);
  const knowledgePointIds = uniqueIds(release.knowledgePoints, "knowledge point", errors);
  const revisionIds = uniqueIds(release.knowledgePointRevisions, "knowledge point revision", errors);
  const contentBlockIds = uniqueIds(release.contentBlocks, "content block", errors);
  const exerciseIds = uniqueIds(release.exercises, "exercise", errors);
  const assessmentIds = uniqueIds(release.assessments, "assessment", errors);
  uniqueIds(release.independentModules, "independent module", errors);
  const requirementIds = uniqueIds(release.coverageRequirements, "coverage requirement", errors);
  const objectiveIds = new Set(release.lessons.flatMap((lesson) => lesson.learningObjectives.map(({ id }) => id)));

  if (!release.id.trim() || !release.curriculumId.trim() || !release.contentVersion.trim()) {
    errors.push("release: ID, curriculum ID and content version are required");
  }
  if (release.path.id.trim() === "" || !levelIds.has(release.path.levelId)) errors.push("path: invalid ID or level reference");
  for (const id of release.levelIds) if (!levelIds.has(id)) errors.push(`release: unknown level ${id}`);
  for (const level of release.levels) {
    for (const id of level.unitIds) {
      const unit = release.units.find((candidate) => candidate.id === id);
      if (!unit || unit.levelId !== level.id) errors.push(`${level.id}: invalid unit ${id}`);
    }
  }
  for (const unit of release.units) {
    if (!levelIds.has(unit.levelId)) errors.push(`${unit.id}: unknown level ${unit.levelId}`);
    for (const id of unit.lessonIds) {
      const lesson = release.lessons.find((candidate) => candidate.id === id);
      if (!lesson || lesson.unitId !== unit.id) errors.push(`${unit.id}: invalid lesson ${id}`);
    }
    for (const id of unit.assessmentIds) if (!assessmentIds.has(id)) errors.push(`${unit.id}: unknown assessment ${id}`);
  }

  const revisionById = new Map(release.knowledgePointRevisions.map((revision) => [revision.id, revision]));
  for (const pin of release.knowledgePointPins) {
    const revision = revisionById.get(pin.revisionId);
    if (!revisionIds.has(pin.revisionId) || !knowledgePointIds.has(pin.knowledgePointId) || revision?.knowledgePointId !== pin.knowledgePointId) {
      errors.push(`knowledge point pin: invalid ${pin.knowledgePointId}/${pin.revisionId}`);
    }
  }
  for (const id of knowledgePointIds) {
    const pins = release.knowledgePointPins.filter((pin) => pin.knowledgePointId === id);
    if (pins.length !== 1) errors.push("knowledge point " + id + ": expected exactly one pinned revision");
  }
  for (const revision of release.knowledgePointRevisions) {
    for (const id of revision.sourceRequirementIds) if (!requirementIds.has(id)) errors.push(revision.id + ": unknown coverage requirement " + id);
    if (!knowledgePointIds.has(revision.knowledgePointId)) errors.push(`${revision.id}: unknown knowledge point`);
    for (const id of revision.contentBlockIds) if (!contentBlockIds.has(id)) errors.push(`${revision.id}: unknown content block ${id}`);
    for (const id of revision.prerequisiteIds) if (!knowledgePointIds.has(id)) errors.push(`${revision.id}: unknown prerequisite ${id}`);
    for (const id of revision.legacyVocabularyIds) {
      if (!release.knowledgePoints.some((point) => point.id === revision.knowledgePointId)) errors.push(`${revision.id}: missing vocabulary knowledge point`);
      if (!id.trim()) errors.push(`${revision.id}: empty legacy vocabulary reference`);
    }
  }

  for (const requirement of release.coverageRequirements) {
    if (!standardReferenceIds.has(requirement.standardReferenceId)) errors.push(requirement.id + ": unknown standard reference");
    if (!requirement.sourceLocator.trim()) errors.push(requirement.id + ": missing source locator");
    for (const id of requirement.knowledgePointIds) if (!knowledgePointIds.has(id)) errors.push(requirement.id + ": unknown knowledge point " + id);
    for (const id of requirement.unitIds) if (!unitIds.has(id)) errors.push(requirement.id + ": unknown unit " + id);
  }
  for (const block of release.contentBlocks) {
    if (!block.revisionId.trim() || !block.titleKazakh.trim()) errors.push(block.id + ": missing content revision or title");
    if (block.editorialStatus === "published" && release.status !== "published") errors.push(block.id + ": published block is outside a published release");
    for (const id of block.sourceRequirementIds) if (!requirementIds.has(id)) errors.push(block.id + ": unknown coverage requirement " + id);
  }

  for (const lesson of release.lessons) {
    if (!unitIds.has(lesson.unitId)) errors.push(`${lesson.id}: unknown unit`);
    for (const id of lesson.prerequisiteLessonIds) if (!lessonIds.has(id)) errors.push(`${lesson.id}: unknown prerequisite lesson ${id}`);
    for (const id of lesson.knowledgePointIds) if (!knowledgePointIds.has(id)) errors.push(`${lesson.id}: unknown knowledge point ${id}`);
    for (const id of lesson.contentBlockIds) if (!contentBlockIds.has(id)) errors.push(`${lesson.id}: unknown content block ${id}`);
    for (const id of lesson.practiceExerciseIds) if (!lesson.exerciseIds.includes(id)) errors.push(`${lesson.id}: practice exercise is not in lesson exercises ${id}`);
    for (const id of lesson.exerciseIds) if (!exerciseIds.has(id)) errors.push(`${lesson.id}: unknown exercise ${id}`);
    for (const id of lesson.assessmentIds) if (!assessmentIds.has(id)) errors.push(`${lesson.id}: unknown assessment ${id}`);
    for (const objective of lesson.learningObjectives) {
      for (const id of objective.knowledgePointIds) if (!knowledgePointIds.has(id)) errors.push(`${objective.id}: unknown knowledge point ${id}`);
    }
  }

  for (const exercise of release.exercises) {
    if (!lessonIds.has(exercise.lessonId)) errors.push(`${exercise.id}: unknown lesson ${exercise.lessonId}`);
    for (const id of exercise.knowledgePointIds) if (!knowledgePointIds.has(id)) errors.push(`${exercise.id}: unknown knowledge point ${id}`);
    for (const id of exercise.objectiveIds) if (!objectiveIds.has(id)) errors.push(`${exercise.id}: unknown objective ${id}`);
    if (exercise.mode === "scored" && (!Number.isSafeInteger(exercise.points) || exercise.points <= 0)) {
      errors.push(`${exercise.id}: scored exercise needs positive integer points`);
    }
  }

  for (const assessment of release.assessments) {
    if (!lessonIds.has(assessment.lessonId)) errors.push(`${assessment.id}: unknown lesson`);
    for (const id of assessment.exerciseIds) {
      const exercise = release.exercises.find((item) => item.id === id);
      if (!exercise || exercise.mode !== "scored" || exercise.lessonId !== assessment.lessonId) errors.push(`${assessment.id}: invalid scored exercise ${id}`);
    }
    for (const id of assessment.requiredObjectiveIds) {
      if (!objectiveIds.has(id) || !Number.isInteger(assessment.rule.requiredObjectiveMinimumPercent[id])) {
        errors.push(`${assessment.id}: missing threshold for required objective ${id}`);
      }
      if (!assessment.exerciseIds.some((exerciseId) => release.exercises.find((item) => item.id === exerciseId)?.objectiveIds.includes(id))) {
        errors.push(`${assessment.id}: no scored item for required objective ${id}`);
      }
    }
    if (!Number.isInteger(assessment.rule.minimumTotalPercent) || assessment.rule.minimumTotalPercent < 0 || assessment.rule.minimumTotalPercent > 100) {
      errors.push(`${assessment.id}: total threshold must be an integer from 0 to 100`);
    }
  }

  for (const id of release.path.orderedLessonIds) if (!lessonIds.has(id)) errors.push(`path: unknown lesson ${id}`);
  for (const independentModule of release.independentModules) {
    for (const id of independentModule.knowledgePointIds) if (!knowledgePointIds.has(id)) errors.push(independentModule.id + ": unknown knowledge point " + id);
    for (const id of independentModule.contentBlockIds) if (!contentBlockIds.has(id)) errors.push(independentModule.id + ": unknown content block " + id);
    for (const id of independentModule.exerciseIds) if (!exerciseIds.has(id)) errors.push(independentModule.id + ": unknown exercise " + id);
    if (independentModule.status === "available" && independentModule.contentBlockIds.length === 0 && independentModule.exerciseIds.length === 0) {
      errors.push(independentModule.id + ": empty module cannot be available");
    }
  }
  for (const item of release.vocabularyContent) {
    if (item.scope === "hsk-standard" && item.sourceRequirementIds.length === 0) errors.push(item.id + ": standard vocabulary needs a source requirement");
    if (item.scope === "contextual-extension" && item.sourceRequirementIds.some((id) => release.coverageRequirements.find((requirement) => requirement.id === id)?.section === "vocabulary")) errors.push(item.id + ": contextual extension cannot claim official vocabulary coverage");
    for (const id of item.sourceRequirementIds) if (!requirementIds.has(id)) errors.push(item.id + ": unknown coverage requirement " + id);
    if (!knowledgePointIds.has(item.knowledgePointId)) errors.push(`${item.id}: unknown vocabulary knowledge point`);
    if (!item.hanzi.trim() || !item.pinyin.trim() || !item.translationKazakh.trim()) errors.push(`${item.id}: incomplete vocabulary content`);
    if (!item.example.hanzi.trim() || !item.example.pinyin.trim() || !item.example.translationKazakh.trim()) errors.push(`${item.id}: incomplete example`);
    if (item.editorialStatus !== "draft") errors.push(`${item.id}: unreviewed U01 content must remain draft`);
  }

  return errors.length ? { valid: false, errors } : { valid: true };
}

export class StaticCurriculumRepository implements CurriculumRepository {
  private readonly releases: CurriculumRelease[];

  constructor(releases: CurriculumRelease[] = [u01Release]) {
    this.releases = releases;
  }

  getRelease(releaseId: string): CurriculumRelease | null {
    return this.releases.find((release) => release.id === releaseId) ?? null;
  }

  getLesson(releaseId: string, lessonId: string): CurriculumLesson | null {
    return this.getRelease(releaseId)?.lessons.find((lesson) => lesson.id === lessonId) ?? null;
  }

  getKnowledgePoint(releaseId: string, knowledgePointId: string): KnowledgePoint | null {
    return this.getRelease(releaseId)?.knowledgePoints.find((point) => point.id === knowledgePointId) ?? null;
  }

  getKnowledgePointRevision(releaseId: string, revisionId: string): KnowledgePointRevision | null {
    return this.getRelease(releaseId)?.knowledgePointRevisions.find((revision) => revision.id === revisionId) ?? null;
  }

  getIndependentModule(releaseId: string, moduleId: string): IndependentModule | null {
    return this.getRelease(releaseId)?.independentModules.find((module) => module.id === moduleId) ?? null;
  }
}

export const curriculumRepository: CurriculumRepository = new StaticCurriculumRepository();
