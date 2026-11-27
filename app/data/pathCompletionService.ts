import type { CurriculumLesson, CurriculumRelease, LearningEvent, LearningEventEntryPoint } from "./learningContracts";
import { createLearningEventId, type LearningEventRepository } from "./learningEventRepository";
import { scoreAssessment } from "./assessmentService";

export const PATH_COMPLETION_RULE_VERSION = "u01-path-completion-v1";

export type PathLessonState = "not-started" | "in-progress" | "assessment-passed" | "completed";

export type KnowledgePointEvidence = {
  knowledgePointId: string;
  exposed: boolean;
  practiceCount: number;
  passedAssessment: boolean;
};

function relevantEvents(events: LearningEvent[], release: CurriculumRelease, learnerId: string): LearningEvent[] {
  return events.filter((event) =>
    event.learnerId === learnerId &&
    event.curriculumId === release.curriculumId &&
    event.contentVersion === release.contentVersion,
  );
}

function sameAssessmentResult(
  stored: Extract<LearningEvent, { type: "assessment_completed" }>["payload"],
  computed: Extract<LearningEvent, { type: "assessment_completed" }>["payload"],
): boolean {
  const storedObjectives = [...stored.objectiveScores].sort((left, right) => left.objectiveId.localeCompare(right.objectiveId));
  const computedObjectives = [...computed.objectiveScores].sort((left, right) => left.objectiveId.localeCompare(right.objectiveId));
  return stored.assessmentId === computed.assessmentId &&
    stored.assessmentRevisionId === computed.assessmentRevisionId &&
    stored.attemptId === computed.attemptId &&
    stored.scoringRuleVersion === computed.scoringRuleVersion &&
    stored.earnedPoints === computed.earnedPoints &&
    stored.possiblePoints === computed.possiblePoints &&
    stored.passed === computed.passed &&
    storedObjectives.length === computedObjectives.length &&
    storedObjectives.every((score, index) =>
      score.objectiveId === computedObjectives[index].objectiveId &&
      score.earnedPoints === computedObjectives[index].earnedPoints &&
      score.possiblePoints === computedObjectives[index].possiblePoints,
    );
}

function qualifyingAssessmentEvent(
  release: CurriculumRelease,
  lesson: CurriculumLesson,
  assessmentId: string,
  pathId: string,
  events: LearningEvent[],
): Extract<LearningEvent, { type: "assessment_completed" }> | null {
  const assessment = release.assessments.find((item) => item.id === assessmentId);
  if (!assessment) return null;
  for (const event of events) {
    if (event.type !== "assessment_completed" ||
      event.payload.assessmentId !== assessment.id ||
      event.payload.assessmentRevisionId !== assessment.revisionId ||
      event.payload.scoringRuleVersion !== assessment.rule.version ||
      !event.payload.passed ||
      event.entryPoint.mode !== "path" ||
      event.entryPoint.pathId !== pathId ||
      event.entryPoint.lessonId !== lesson.id) continue;

    const answers: Record<string, Extract<LearningEvent, { type: "exercise_submitted" }>["payload"]["answer"]> = {};
    let allItemsSubmitted = true;
    for (const exerciseId of assessment.exerciseIds) {
      let submission: Extract<LearningEvent, { type: "exercise_submitted" }> | undefined;
      for (const candidate of events) {
        if (candidate.type === "exercise_submitted" &&
          candidate.learnerId === event.learnerId &&
          candidate.entryPoint.mode === "path" &&
          candidate.entryPoint.pathId === pathId &&
          candidate.entryPoint.lessonId === lesson.id &&
          candidate.payload.exerciseId === exerciseId &&
          candidate.payload.attemptId === event.payload.attemptId + ":" + exerciseId) {
          submission = candidate;
          break;
        }
      }
      const exercise = release.exercises.find((item) => item.id === exerciseId);
      if (!submission || !exercise || submission.payload.exerciseRevisionId !== exercise.revisionId) {
        allItemsSubmitted = false;
        break;
      }
      answers[exerciseId] = submission.payload.answer;
    }
    if (!allItemsSubmitted) continue;
    const recomputed = scoreAssessment(release, assessment, answers, event.payload.attemptId);
    if (recomputed.status === "scored" && recomputed.result.passed && sameAssessmentResult(event.payload, recomputed.result)) return event;
  }
  return null;
}

export function getPathLessonState(
  release: CurriculumRelease,
  lessonId: string,
  learnerId: string,
  allEvents: LearningEvent[],
): PathLessonState {
  const lesson = release.lessons.find((item) => item.id === lessonId);
  if (!lesson) return "not-started";
  const events = relevantEvents(allEvents, release, learnerId);
  const pathId = release.path.id;
  const completionEvent = events.find((event): event is Extract<LearningEvent, { type: "lesson_completed" }> => {
    return event.type === "lesson_completed" &&
      event.entryPoint.mode === "path" && event.entryPoint.pathId === pathId &&
      event.entryPoint.lessonId === lesson.id &&
      event.payload.completionRuleVersion === PATH_COMPLETION_RULE_VERSION;
  });
  if (completionEvent) {
    const qualifyingAttemptIds = lesson.assessmentIds.map((id) =>
      qualifyingAssessmentEvent(release, lesson, id, pathId, events)?.payload.attemptId ?? null,
    );
    const savedAttemptIds = completionEvent.payload.qualifyingAssessmentAttemptIds;
    if (qualifyingAttemptIds.length > 0 &&
      qualifyingAttemptIds.every((id) => id !== null) &&
      savedAttemptIds.length === qualifyingAttemptIds.length &&
      savedAttemptIds.every((id, index) => id === qualifyingAttemptIds[index])) return "completed";
  }
  if (lesson.assessmentIds.length > 0 && lesson.assessmentIds.every((id) => qualifyingAssessmentEvent(release, lesson, id, pathId, events) !== null)) {
    return "assessment-passed";
  }
  if (events.some((event) => event.type === "lesson_started" && event.entryPoint.mode === "path" &&
    event.entryPoint.pathId === pathId && event.entryPoint.lessonId === lesson.id)) return "in-progress";
  return "not-started";
}

export function getKnowledgePointEvidence(
  release: CurriculumRelease,
  learnerId: string,
  allEvents: LearningEvent[],
): KnowledgePointEvidence[] {
  const events = relevantEvents(allEvents, release, learnerId);
  return release.knowledgePoints.map(({ id }) => {
    const related = events.filter((event) => event.knowledgePointIds.includes(id));
    return {
      knowledgePointId: id,
      exposed: related.some((event) => event.type === "module_opened" || event.type === "lesson_started"),
      practiceCount: related.filter((event) => event.type === "exercise_submitted" || event.type === "speaking_practice_completed").length,
      passedAssessment: related.some((event) => event.type === "assessment_completed" && event.payload.passed && event.entryPoint.mode === "path"),
    };
  });
}

export function completePathLessonIfEligible(input: {
  release: CurriculumRelease;
  lessonId: string;
  learnerId: string;
  allEvents: LearningEvent[];
  repository: LearningEventRepository;
  occurredAt?: string;
}): { completed: boolean; reason?: string; eventId?: string } {
  const { release, lessonId, learnerId, repository } = input;
  const lesson = release.lessons.find((item) => item.id === lessonId);
  if (!lesson || !learnerId.trim()) return { completed: false, reason: "unknown-lesson-or-learner" };
  if (!lesson.assessmentIds.length) return { completed: false, reason: "lesson-has-no-required-assessment" };

  const events = relevantEvents(input.allEvents, release, learnerId);
  for (const prerequisiteId of lesson.prerequisiteLessonIds) {
    if (getPathLessonState(release, prerequisiteId, learnerId, events) !== "completed") {
      return { completed: false, reason: `prerequisite-not-complete:${prerequisiteId}` };
    }
  }

  const qualifying = lesson.assessmentIds.map((assessmentId) =>
    qualifyingAssessmentEvent(release, lesson, assessmentId, release.path.id, events),
  );
  if (qualifying.some((event) => !event)) return { completed: false, reason: "required-path-assessment-not-passed" };

  const entryPoint: LearningEventEntryPoint = { mode: "path", pathId: release.path.id, lessonId: lesson.id };
  const eventId = `lesson-completed:${learnerId}:${release.contentVersion}:${release.path.id}:${lesson.id}:${PATH_COMPLETION_RULE_VERSION}`;
  const existingStore = repository.read();
  if (existingStore.status !== "ready") return { completed: false, reason: "event-store-" + existingStore.status };
  if (existingStore.events.some((event) => event.eventId === eventId)) {
    return getPathLessonState(release, lesson.id, learnerId, existingStore.events) === "completed"
      ? { completed: true, eventId }
      : { completed: false, reason: "conflicting-completion-event" };
  }
  const appended = repository.append({
    eventId,
    schemaVersion: 1,
    type: "lesson_completed",
    learnerId,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    curriculumId: release.curriculumId,
    contentVersion: release.contentVersion,
    entryPoint,
    knowledgePointIds: lesson.knowledgePointIds,
    payload: {
      completionRuleVersion: PATH_COMPLETION_RULE_VERSION,
      qualifyingAssessmentAttemptIds: qualifying.flatMap((event) => event?.type === "assessment_completed" ? [event.payload.attemptId] : []),
    },
  });
  if (!appended.ok) return { completed: false, reason: "event-store-" + appended.reason };
  const savedStore = repository.read();
  if (savedStore.status !== "ready" || getPathLessonState(release, lesson.id, learnerId, savedStore.events) !== "completed") {
    return { completed: false, reason: "completion-event-not-verified" };
  }
  return { completed: true, eventId };
}

export function createPathEvent(input: {
  type: "lesson_started";
  release: CurriculumRelease;
  lesson: CurriculumLesson;
  learnerId: string;
}): LearningEvent {
  return {
    eventId: createLearningEventId(),
    schemaVersion: 1,
    type: input.type,
    learnerId: input.learnerId,
    occurredAt: new Date().toISOString(),
    curriculumId: input.release.curriculumId,
    contentVersion: input.release.contentVersion,
    entryPoint: { mode: "path", pathId: input.release.path.id, lessonId: input.lesson.id },
    knowledgePointIds: input.lesson.knowledgePointIds,
    payload: null,
  };
}
