const STORAGE_PREFIX = "tekshe-curriculum-progress:v1:";

function storageKey(curriculumId: string, courseId: string): string {
  return `${STORAGE_PREFIX}${encodeURIComponent(curriculumId)}:${encodeURIComponent(courseId)}`;
}

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0))];
  } catch {
    return [];
  }
}

export type CurriculumCompletionResult = {
  lessonCompleted: boolean;
  courseCompleted: boolean;
  xpAwarded: boolean;
  completedLessonIds: string[];
};

export function getCompletedCurriculumLessons(
  curriculumId: string,
  courseId: string,
  validLessonIds: string[]
): string[] {
  if (!curriculumId.trim() || !courseId.trim() || validLessonIds.length === 0) {
    return [];
  }

  const validIds = new Set(validLessonIds);
  return readIds(storageKey(curriculumId, courseId)).filter((id) => validIds.has(id));
}

export function completeCurriculumLesson(
  curriculumId: string,
  courseId: string,
  lessonId: string,
  lessonIds: string[],
  awardCourseCompletion: () => boolean
): CurriculumCompletionResult | null {
  const uniqueLessonIds = [...new Set(lessonIds)];
  if (
    typeof window === "undefined" ||
    !curriculumId.trim() ||
    !courseId.trim() ||
    !lessonId.trim() ||
    uniqueLessonIds.length === 0 ||
    !uniqueLessonIds.includes(lessonId)
  ) {
    return null;
  }

  const key = storageKey(curriculumId, courseId);
  const storedIds = readIds(key);
  const validIds = new Set(uniqueLessonIds);
  const completed = storedIds.filter((id) => validIds.has(id));
  const wasAlreadyCompleted = completed.includes(lessonId);
  if (!wasAlreadyCompleted) completed.push(lessonId);

  if (!wasAlreadyCompleted) {
    try {
      window.localStorage.setItem(key, JSON.stringify([...new Set([...storedIds, lessonId])]));
    } catch {
      return null;
    }
  }

  const courseCompleted = uniqueLessonIds.every((id) => completed.includes(id));
  let xpAwarded = false;
  if (courseCompleted) {
    xpAwarded = awardCourseCompletion();
  }

  if (!wasAlreadyCompleted && !xpAwarded) {
    window.dispatchEvent(new Event("tekshe-progress-updated"));
  }

  return {
    lessonCompleted: !wasAlreadyCompleted,
    courseCompleted,
    xpAwarded,
    completedLessonIds: completed,
  };
}
