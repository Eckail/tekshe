import type {
  Assessment,
  AssessmentResult,
  CurriculumRelease,
  ScoredExercise,
  SubmittedAnswer,
} from "./learningContracts";

export type AssessmentScoreResult =
  | { status: "incomplete"; missingExerciseIds: string[] }
  | { status: "scored"; result: AssessmentResult };

function normalizeText(value: string): string {
  return value.normalize("NFC").trim().replace(/\s+/g, " ").toLocaleLowerCase("zh-CN");
}

export function isAssessmentAnswerCorrect(exercise: ScoredExercise, answer: SubmittedAnswer): boolean {
  if (exercise.interaction === "choice" || exercise.interaction === "listening-choice") {
    return answer.kind === "choice" && answer.value === exercise.answerKey;
  }
  if (exercise.interaction === "order") {
    return answer.kind === "order" && Array.isArray(exercise.answerKey) &&
      answer.value.length === exercise.answerKey.length &&
      answer.value.every((item, index) => item === exercise.answerKey[index]);
  }
  if (answer.kind !== "text" || typeof exercise.answerKey !== "string") return false;
  const expected = [exercise.answerKey, ...(exercise.acceptedAnswers ?? [])].map(normalizeText);
  return expected.includes(normalizeText(answer.value));
}

export function scoreAssessment(
  release: CurriculumRelease,
  assessment: Assessment,
  answers: Record<string, SubmittedAnswer>,
  attemptId: string,
): AssessmentScoreResult {
  const exercises = assessment.exerciseIds.map((id) => release.exercises.find((item) => item.id === id));
  if (exercises.some((exercise) => !exercise || exercise.mode !== "scored")) {
    return { status: "incomplete", missingExerciseIds: assessment.exerciseIds };
  }
  const scoredExercises = exercises as ScoredExercise[];
  const missingExerciseIds = scoredExercises
    .filter((exercise) => !answers[exercise.id])
    .map((exercise) => exercise.id);
  if (missingExerciseIds.length) return { status: "incomplete", missingExerciseIds };

  let earnedPoints = 0;
  let possiblePoints = 0;
  const objectiveScores = assessment.requiredObjectiveIds.map((objectiveId) => ({
    objectiveId,
    earnedPoints: 0,
    possiblePoints: 0,
  }));

  for (const exercise of scoredExercises) {
    const correct = isAssessmentAnswerCorrect(exercise, answers[exercise.id]);
    possiblePoints += exercise.points;
    if (correct) earnedPoints += exercise.points;
    for (const objectiveId of exercise.objectiveIds) {
      const objective = objectiveScores.find((item) => item.objectiveId === objectiveId);
      if (!objective) continue;
      objective.possiblePoints += exercise.points;
      if (correct) objective.earnedPoints += exercise.points;
    }
  }

  const totalPasses = possiblePoints > 0 &&
    earnedPoints * 100 >= possiblePoints * assessment.rule.minimumTotalPercent;
  const objectivesPass = objectiveScores.every((score) => {
    const threshold = assessment.rule.requiredObjectiveMinimumPercent[score.objectiveId];
    return score.possiblePoints > 0 &&
      typeof threshold === "number" &&
      score.earnedPoints * 100 >= score.possiblePoints * threshold;
  });

  return {
    status: "scored",
    result: {
      assessmentId: assessment.id,
      assessmentRevisionId: assessment.revisionId,
      attemptId,
      scoringRuleVersion: assessment.rule.version,
      earnedPoints,
      possiblePoints,
      objectiveScores,
      passed: totalPasses && objectivesPass,
    },
  };
}
