
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

  const saved = localStorage.getItem(STORAGE_KEY);

  return saved ? JSON.parse(saved) as CourseId[] : [];
}

export function isCourseCompleted(id: CourseId): boolean {
  return getCompletedCourses().includes(id);
}

export function completeCourse(id: CourseId): void {
  if (typeof window === "undefined") {
    return;
  }

  const completed = getCompletedCourses();

  if (completed.includes(id)) {
    return;
  }

  completed.push(id);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(completed)
  );

  window.dispatchEvent(
    new Event("tekshe-progress-updated")
  );
}
