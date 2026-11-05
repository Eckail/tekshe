import type { HskCurriculum } from "./curriculum";

export type CurriculumIssue = {
  code:
    | "EMPTY_ID"
    | "DUPLICATE_ID"
    | "MISSING_REFERENCE"
    | "INCONSISTENT_PARENT"
    | "INVALID_SEQUENCE"
    | "INVALID_DURATION"
    | "PREREQUISITE_CYCLE";
  path: string;
  message: string;
};

type Identified = { id: string };

function collectUniqueIds(
  items: Identified[],
  path: string,
  issues: CurriculumIssue[]
): Set<string> {
  const ids = new Set<string>();

  items.forEach((item, index) => {
    const itemPath = `${path}[${index}].id`;
    if (!item.id.trim()) {
      issues.push({
        code: "EMPTY_ID",
        path: itemPath,
        message: "ID бос болмауы керек.",
      });
      return;
    }

    if (ids.has(item.id)) {
      issues.push({
        code: "DUPLICATE_ID",
        path: itemPath,
        message: `Қайталанатын ID: ${item.id}`,
      });
    }
    ids.add(item.id);
  });

  return ids;
}

function checkReferences(
  references: string[],
  available: Set<string>,
  path: string,
  issues: CurriculumIssue[]
): void {
  references.forEach((id, index) => {
    if (!available.has(id)) {
      issues.push({
        code: "MISSING_REFERENCE",
        path: `${path}[${index}]`,
        message: `Сілтеме табылмады: ${id}`,
      });
    }
  });
}

function hasPrerequisiteCycle(
  units: HskCurriculum["units"]
): boolean {
  const prerequisites = new Map(
    units.map((unit) => [unit.id, unit.prerequisites])
  );
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(id: string): boolean {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;

    visiting.add(id);
    for (const prerequisite of prerequisites.get(id) ?? []) {
      if (visit(prerequisite)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  }

  return units.some((unit) => visit(unit.id));
}

/**
 * Checks structural integrity before curriculum data is rendered or published.
 * This validates references and shape, not pedagogical correctness.
 */
export function validateCurriculum(
  curriculum: HskCurriculum
): CurriculumIssue[] {
  const issues: CurriculumIssue[] = [];

  if (!curriculum.id.trim()) {
    issues.push({
      code: "EMPTY_ID",
      path: "id",
      message: "Оқу бағдарламасының ID-і бос болмауы керек.",
    });
  }

  const levelIds = collectUniqueIds(curriculum.levels, "levels", issues);
  const moduleIds = collectUniqueIds(curriculum.modules, "modules", issues);
  const unitIds = collectUniqueIds(curriculum.units, "units", issues);
  const lessonIds = collectUniqueIds(curriculum.lessons, "lessons", issues);
  const vocabularyIds = collectUniqueIds(
    curriculum.vocabulary,
    "vocabulary",
    issues
  );
  const grammarIds = collectUniqueIds(
    curriculum.grammarPoints,
    "grammarPoints",
    issues
  );
  const readingIds = collectUniqueIds(curriculum.readings, "readings", issues);
  const audioIds = collectUniqueIds(
    curriculum.audioAssets,
    "audioAssets",
    issues
  );
  const exerciseIds = collectUniqueIds(
    curriculum.exercises,
    "exercises",
    issues
  );

  curriculum.levels.forEach((level, index) => {
    if (!Number.isInteger(level.sequence) || level.sequence < 1) {
      issues.push({
        code: "INVALID_SEQUENCE",
        path: `levels[${index}].sequence`,
        message: "Деңгей реті 1-ден басталатын бүтін сан болуы керек.",
      });
    }
    checkReferences(
      level.unitIds,
      unitIds,
      `levels[${index}].unitIds`,
      issues
    );
  });

  curriculum.modules.forEach((module, index) => {
    checkReferences(
      module.lessonIds,
      lessonIds,
      `modules[${index}].lessonIds`,
      issues
    );
  });

  curriculum.units.forEach((unit, index) => {
    if (!Number.isInteger(unit.sequence) || unit.sequence < 1) {
      issues.push({
        code: "INVALID_SEQUENCE",
        path: `units[${index}].sequence`,
        message: "Бөлім реті 1-ден басталатын бүтін сан болуы керек.",
      });
    }
    if (!levelIds.has(unit.levelId)) {
      issues.push({
        code: "MISSING_REFERENCE",
        path: `units[${index}].levelId`,
        message: `Деңгей табылмады: ${unit.levelId}`,
      });
    }
    checkReferences(
      unit.moduleIds,
      moduleIds,
      `units[${index}].moduleIds`,
      issues
    );
    checkReferences(
      unit.prerequisites,
      unitIds,
      `units[${index}].prerequisites`,
      issues
    );
  });

  curriculum.lessons.forEach((lesson, index) => {
    if (lesson.curriculumId !== curriculum.id) {
      issues.push({
        code: "INCONSISTENT_PARENT",
        path: `lessons[${index}].curriculumId`,
        message: "Сабақ басқа оқу бағдарламасына тиесілі деп көрсетілген.",
      });
    }
    if (!levelIds.has(lesson.levelId)) {
      issues.push({
        code: "MISSING_REFERENCE",
        path: `lessons[${index}].levelId`,
        message: `Деңгей табылмады: ${lesson.levelId}`,
      });
    }
    if (!unitIds.has(lesson.unitId)) {
      issues.push({
        code: "MISSING_REFERENCE",
        path: `lessons[${index}].unitId`,
        message: `Бөлім табылмады: ${lesson.unitId}`,
      });
    } else {
      const parentUnit = curriculum.units.find(
        (unit) => unit.id === lesson.unitId
      );
      if (parentUnit?.levelId !== lesson.levelId) {
        issues.push({
          code: "INCONSISTENT_PARENT",
          path: `lessons[${index}].levelId`,
          message: "Сабақ пен бөлімнің деңгейлері сәйкес емес.",
        });
      }
    }
    if (!moduleIds.has(lesson.moduleId)) {
      issues.push({
        code: "MISSING_REFERENCE",
        path: `lessons[${index}].moduleId`,
        message: `Модуль табылмады: ${lesson.moduleId}`,
      });
    } else {
      const parentModule = curriculum.modules.find(
        (module) => module.id === lesson.moduleId
      );
      if (!parentModule?.lessonIds.includes(lesson.id)) {
        issues.push({
          code: "INCONSISTENT_PARENT",
          path: `lessons[${index}].moduleId`,
          message: "Модуль сабақтың ID-ін өз тізімінде көрсетуі керек.",
        });
      }
    }
    if (!Number.isFinite(lesson.estimatedDurationMinutes) ||
        lesson.estimatedDurationMinutes <= 0) {
      issues.push({
        code: "INVALID_DURATION",
        path: `lessons[${index}].estimatedDurationMinutes`,
        message: "Сабақ ұзақтығы нөлден үлкен болуы керек.",
      });
    }

    checkReferences(
      lesson.vocabularyIds,
      vocabularyIds,
      `lessons[${index}].vocabularyIds`,
      issues
    );
    checkReferences(
      lesson.grammarPointIds,
      grammarIds,
      `lessons[${index}].grammarPointIds`,
      issues
    );
    checkReferences(
      lesson.readingMaterialIds,
      readingIds,
      `lessons[${index}].readingMaterialIds`,
      issues
    );
    checkReferences(
      lesson.exerciseIds,
      exerciseIds,
      `lessons[${index}].exerciseIds`,
      issues
    );
    checkReferences(
      lesson.prerequisites,
      lessonIds,
      `lessons[${index}].prerequisites`,
      issues
    );
  });

  curriculum.vocabulary.forEach((entry, index) => {
    if (entry.curriculumId !== curriculum.id) {
      issues.push({
        code: "INCONSISTENT_PARENT",
        path: `vocabulary[${index}].curriculumId`,
        message: "Сөз басқа оқу бағдарламасына тиесілі деп көрсетілген.",
      });
    }
    if (!levelIds.has(entry.levelId)) {
      issues.push({
        code: "MISSING_REFERENCE",
        path: `vocabulary[${index}].levelId`,
        message: `Деңгей табылмады: ${entry.levelId}`,
      });
    }
  });

  curriculum.grammarPoints.forEach((point, index) => {
    if (!levelIds.has(point.levelId)) {
      issues.push({
        code: "MISSING_REFERENCE",
        path: `grammarPoints[${index}].levelId`,
        message: `Деңгей табылмады: ${point.levelId}`,
      });
    }
  });

  curriculum.readings.forEach((reading, index) => {
    checkReferences(
      reading.vocabularyIds,
      vocabularyIds,
      `readings[${index}].vocabularyIds`,
      issues
    );
    checkReferences(
      reading.grammarPointIds,
      grammarIds,
      `readings[${index}].grammarPointIds`,
      issues
    );
  });

  curriculum.exercises.forEach((exercise, index) => {
    if (exercise.audioAssetId && !audioIds.has(exercise.audioAssetId)) {
      issues.push({
        code: "MISSING_REFERENCE",
        path: `exercises[${index}].audioAssetId`,
        message: `Аудио ресурсы табылмады: ${exercise.audioAssetId}`,
      });
    }
    if (
      exercise.readingMaterialId &&
      !readingIds.has(exercise.readingMaterialId)
    ) {
      issues.push({
        code: "MISSING_REFERENCE",
        path: `exercises[${index}].readingMaterialId`,
        message: `Оқу мәтіні табылмады: ${exercise.readingMaterialId}`,
      });
    }
  });

  if (hasPrerequisiteCycle(curriculum.units)) {
    issues.push({
      code: "PREREQUISITE_CYCLE",
      path: "units.prerequisites",
      message: "Бөлімдердің алғышарттарында цикл бар.",
    });
  }

  return issues;
}
