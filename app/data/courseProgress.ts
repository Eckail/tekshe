
import {
  awardXP,
  COURSE_COMPLETION_XP,
  initializeXPAwards,
} from "./xp";

export type CourseId =
  | "pinyin-basics"
  | "tone-practice"
  | "syllables"
  | "first-words"
  | "simple-sentences";

const STORAGE_KEY = "tekshe-course-progress";

export function getCompletedCourses(): CourseId[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const completed: unknown = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(completed)) return [];

    const knownCourses = new Set<CourseId>([
      "pinyin-basics",
      "tone-practice",
      "syllables",
      "first-words",
      "simple-sentences",
    ]);

    return completed.filter(
      (courseId): courseId is CourseId =>
        typeof courseId === "string" && knownCourses.has(courseId as CourseId)
    );
  } catch {
    return [];
  }
}

export function isCourseCompleted(id: CourseId): boolean {
  return getCompletedCourses().includes(id);
}

export function completeCourse(id: CourseId): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // Import prior XP before changing course progress, so existing completions
  // receive the same one-time award as new completions.
  initializeXPAwards();

  const completed = getCompletedCourses();

  if (!completed.includes(id)) {
    completed.push(id);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      return false;
    }
  }

  return awardXP(
    `course:${id}`,
    "course",
    COURSE_COMPLETION_XP
  );
}
