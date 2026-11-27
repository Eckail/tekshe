export type EditorialStatus = "draft" | "pending-review" | "reviewed" | "published";

export type KnowledgePointKind =
  | "pinyin"
  | "character"
  | "vocabulary"
  | "grammar"
  | "listening"
  | "speaking"
  | "reading"
  | "writing";

export type Skill = "pinyin" | "listening" | "speaking" | "reading" | "writing" | "language-form";

export type StandardReference = {
  id: string;
  edition: string;
  levelId: string;
  sourceUrl: string;
  locator: string;
};

export type CoverageRequirement = {
  id: string;
  standardReferenceId: string;
  section: "task" | "topic" | "vocabulary";
  officialItemKey: string;
  sourceLocator: string;
  knowledgePointIds: string[];
  unitIds: string[];
  coverageStatus: "mapped" | "partial" | "accepted";
};

export type LearningObjective = {
  id: string;
  statementKazakh: string;
  knowledgePointIds: string[];
  requirementIds: string[];
};

export type KnowledgePoint = {
  id: string;
  kind: KnowledgePointKind;
  lifecycle: "active" | "deprecated";
  supersedes?: string;
};

export type KnowledgePointRevision = {
  id: string;
  knowledgePointId: string;
  revision: number;
  titleKazakh: string;
  explanationKazakh: string;
  contentBlockIds: string[];
  prerequisiteIds: string[];
  legacyVocabularyIds: string[];
  sourceRequirementIds: string[];
  editorialStatus: EditorialStatus;
};

export type VocabularyContentRevision = {
  id: string;
  knowledgePointId: string;
  hanzi: string;
  pinyin: string;
  tones: Array<1 | 2 | 3 | 4 | "neutral">;
  partOfSpeech: string;
  translationKazakh: string;
  scope: "hsk-standard" | "contextual-extension";
  example: { hanzi: string; pinyin: string; translationKazakh: string };
  sourceRequirementIds: string[];
  editorialStatus: EditorialStatus;
};

export type KnowledgePointPin = {
  knowledgePointId: string;
  revisionId: string;
};

export type ContentBlock = {
  id: string;
  revisionId: string;
  kind: "explanation" | "example" | "dialogue" | "reading" | "listening" | "writing-model" | "speaking-prompt";
  titleKazakh: string;
  textChinese?: string;
  pinyin?: string;
  translationKazakh?: string;
  explanationKazakh?: string;
  sourceRequirementIds: string[];
  editorialStatus: EditorialStatus;
};

type ExerciseBase = {
  id: string;
  revisionId: string;
  lessonId: string;
  knowledgePointIds: string[];
  objectiveIds: string[];
  skill: Skill;
  promptKazakh: string;
  explanationKazakh: string;
  editorialStatus: EditorialStatus;
};

export type ScoredExercise = ExerciseBase & {
  mode: "scored";
  interaction: "choice" | "order" | "text" | "listening-choice";
  points: number;
  options?: string[];
  answerKey: string | string[];
  acceptedAnswers?: string[];
  audioText?: string;
};

export type RecordingExercise = ExerciseBase & {
  mode: "practice";
  interaction: "recording";
  recordingPromptChinese: string;
};

export type Exercise = ScoredExercise | RecordingExercise;

export type AssessmentRule = {
  version: string;
  minimumTotalPercent: number;
  requiredObjectiveMinimumPercent: Record<string, number>;
  allRequiredItemsMustBeScored: true;
};

export type Assessment = {
  id: string;
  revisionId: string;
  lessonId: string;
  exerciseIds: string[];
  requiredObjectiveIds: string[];
  rule: AssessmentRule;
  editorialStatus: EditorialStatus;
};

export type AssessmentObjectiveScore = {
  objectiveId: string;
  earnedPoints: number;
  possiblePoints: number;
};

export type AssessmentResult = {
  assessmentId: string;
  assessmentRevisionId: string;
  attemptId: string;
  scoringRuleVersion: string;
  earnedPoints: number;
  possiblePoints: number;
  objectiveScores: AssessmentObjectiveScore[];
  passed: boolean;
};

export type CurriculumLevel = {
  id: string;
  titleKazakh: string;
  sequence: number;
  unitIds: string[];
};

export type CurriculumUnit = {
  id: string;
  levelId: string;
  titleKazakh: string;
  sequence: number;
  lessonIds: string[];
  assessmentIds: string[];
};

export type CurriculumLesson = {
  id: string;
  unitId: string;
  sequence: number;
  titleKazakh: string;
  introductionKazakh: string;
  learningObjectives: LearningObjective[];
  knowledgePointIds: string[];
  contentBlockIds: string[];
  practiceExerciseIds: string[];
  exerciseIds: string[];
  assessmentIds: string[];
  prerequisiteLessonIds: string[];
  editorialStatus: EditorialStatus;
};

export type StructuredLearningPath = {
  id: string;
  levelId: string;
  orderedLessonIds: string[];
};

export type IndependentModule = {
  id: string;
  kind: KnowledgePointKind;
  titleKazakh: string;
  descriptionKazakh: string;
  status: "available" | "building";
  knowledgePointIds: string[];
  contentBlockIds: string[];
  exerciseIds: string[];
};

export type CurriculumRelease = {
  id: string;
  curriculumId: string;
  contentVersion: string;
  status: EditorialStatus;
  standardReferences: StandardReference[];
  coverageRequirements: CoverageRequirement[];
  levelIds: string[];
  levels: CurriculumLevel[];
  units: CurriculumUnit[];
  lessons: CurriculumLesson[];
  knowledgePoints: KnowledgePoint[];
  knowledgePointRevisions: KnowledgePointRevision[];
  knowledgePointPins: KnowledgePointPin[];
  vocabularyContent: VocabularyContentRevision[];
  contentBlocks: ContentBlock[];
  exercises: Exercise[];
  assessments: Assessment[];
  path: StructuredLearningPath;
  independentModules: IndependentModule[];
};

export type LearningEventEntryPoint =
  | { mode: "path"; pathId: string; lessonId: string }
  | { mode: "independent"; moduleId: string };

export type SubmittedAnswer =
  | { kind: "choice"; value: string }
  | { kind: "text"; value: string }
  | { kind: "order"; value: string[] };

type LearningEventBase<TType extends string, TPayload, TEntryPoint extends LearningEventEntryPoint = LearningEventEntryPoint> = {
  eventId: string;
  schemaVersion: 1;
  type: TType;
  learnerId: string;
  occurredAt: string;
  curriculumId: string;
  contentVersion: string;
  entryPoint: TEntryPoint;
  knowledgePointIds: string[];
  payload: TPayload;
};

type PathEntryPoint = Extract<LearningEventEntryPoint, { mode: "path" }>;
type IndependentEntryPoint = Extract<LearningEventEntryPoint, { mode: "independent" }>;

export type LearningEvent =
  | LearningEventBase<"module_opened", null, IndependentEntryPoint>
  | LearningEventBase<"lesson_started", null, PathEntryPoint>
  | LearningEventBase<"exercise_submitted", {
      exerciseId: string;
      exerciseRevisionId: string;
      attemptId: string;
      answer: SubmittedAnswer;
      outcome: "correct" | "incorrect";
    }>
  | LearningEventBase<"assessment_completed", AssessmentResult>
  | LearningEventBase<"lesson_completed", {
      completionRuleVersion: string;
      qualifyingAssessmentAttemptIds: string[];
    }, PathEntryPoint>
  | LearningEventBase<"speaking_practice_completed", {
      exerciseId: string;
      durationSeconds: number;
      selfRating: "needs-practice" | "comfortable";
    }>
  | LearningEventBase<"review_graded", {
      reviewItemId: string;
      grade: "again" | "hard" | "good" | "easy";
      algorithmVersion: string;
    }>;

export function isSubmittedAnswer(value: unknown): value is SubmittedAnswer {
  if (!value || typeof value !== "object") return false;
  const answer = value as Partial<SubmittedAnswer>;
  if (answer.kind === "choice" || answer.kind === "text") {
    return typeof answer.value === "string";
  }
  return answer.kind === "order" && Array.isArray(answer.value) && answer.value.every((item) => typeof item === "string");
}

function isEntryPoint(value: unknown): value is LearningEventEntryPoint {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return entry.mode === "path"
    ? typeof entry.pathId === "string" && Boolean(entry.pathId.trim()) && typeof entry.lessonId === "string" && Boolean(entry.lessonId.trim())
    : entry.mode === "independent" && typeof entry.moduleId === "string" && Boolean(entry.moduleId.trim());
}

function isAssessmentObjectiveScore(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const score = value as Record<string, unknown>;
  return typeof score.objectiveId === "string" && Boolean(score.objectiveId.trim()) &&
    Number.isSafeInteger(score.earnedPoints) && Number.isSafeInteger(score.possiblePoints) &&
    Number(score.possiblePoints) > 0 && Number(score.earnedPoints) >= 0 &&
    Number(score.earnedPoints) <= Number(score.possiblePoints);
}

export function isLearningEvent(value: unknown): value is LearningEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Record<string, unknown>;
  if (
    typeof event.eventId !== "string" || !event.eventId.trim() ||
    event.schemaVersion !== 1 ||
    typeof event.learnerId !== "string" || !event.learnerId.trim() ||
    typeof event.occurredAt !== "string" || !Number.isFinite(Date.parse(event.occurredAt)) ||
    typeof event.curriculumId !== "string" || !event.curriculumId.trim() ||
    typeof event.contentVersion !== "string" || !event.contentVersion.trim() ||
    !isEntryPoint(event.entryPoint) ||
    !Array.isArray(event.knowledgePointIds) ||
    !event.knowledgePointIds.every((id) => typeof id === "string" && Boolean(id.trim())) ||
    new Set(event.knowledgePointIds).size !== event.knowledgePointIds.length
  ) return false;

  const payload = event.payload;
  if (event.type === "module_opened") return event.entryPoint.mode === "independent" && payload === null;
  if (event.type === "lesson_started") return event.entryPoint.mode === "path" && payload === null;
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Record<string, unknown>;

  if (event.type === "exercise_submitted") {
    return typeof data.exerciseId === "string" && Boolean(data.exerciseId.trim()) &&
      typeof data.exerciseRevisionId === "string" && Boolean(data.exerciseRevisionId.trim()) &&
      typeof data.attemptId === "string" && Boolean(data.attemptId.trim()) && isSubmittedAnswer(data.answer) &&
      (data.outcome === "correct" || data.outcome === "incorrect");
  }
  if (event.type === "assessment_completed") {
    return typeof data.assessmentId === "string" && Boolean(data.assessmentId.trim()) &&
      typeof data.assessmentRevisionId === "string" && Boolean(data.assessmentRevisionId.trim()) &&
      typeof data.attemptId === "string" && Boolean(data.attemptId.trim()) &&
      typeof data.scoringRuleVersion === "string" && Boolean(data.scoringRuleVersion.trim()) &&
      Number.isSafeInteger(data.earnedPoints) && Number.isSafeInteger(data.possiblePoints) &&
      Number(data.possiblePoints) > 0 && Number(data.earnedPoints) >= 0 &&
      Number(data.earnedPoints) <= Number(data.possiblePoints) &&
      Array.isArray(data.objectiveScores) && data.objectiveScores.length > 0 &&
      data.objectiveScores.every(isAssessmentObjectiveScore) && typeof data.passed === "boolean";
  }
  if (event.type === "lesson_completed") {
    return event.entryPoint.mode === "path" && typeof data.completionRuleVersion === "string" &&
      Array.isArray(data.qualifyingAssessmentAttemptIds) &&
      data.qualifyingAssessmentAttemptIds.every((id) => typeof id === "string");
  }
  if (event.type === "speaking_practice_completed") {
    return typeof data.exerciseId === "string" && Boolean(data.exerciseId.trim()) &&
      Number.isFinite(data.durationSeconds) && Number(data.durationSeconds) > 0 &&
      (data.selfRating === "needs-practice" || data.selfRating === "comfortable");
  }
  if (event.type === "review_graded") {
    return typeof data.reviewItemId === "string" &&
      (data.grade === "again" || data.grade === "hard" || data.grade === "good" || data.grade === "easy") &&
      typeof data.algorithmVersion === "string";
  }
  return false;
}
