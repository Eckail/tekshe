
"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  completeCourse,
  isCourseCompleted,
  type CourseId,
} from "../data/courseProgress";
import { COURSE_COMPLETION_XP } from "../data/xp";
import { createProgressStore } from "../data/progressStore";

type Props = {
  courseId: CourseId;
  label?: string;
};

export default function CourseCompletionButton({
  courseId,
  label = "Курсты аяқтау",
}: Props) {
  const courseStore = useMemo(
    () => createProgressStore(() => isCourseCompleted(courseId), false),
    [courseId]
  );
  const completed = useSyncExternalStore(
    courseStore.subscribe,
    courseStore.getSnapshot,
    courseStore.getServerSnapshot
  );

  function handleComplete() {
    completeCourse(courseId);
  }

  if (completed) {
    return (
      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-terracotta/30 px-5 py-3 text-sm font-medium text-terracotta">
        <span>✓</span>
        <span>Курс аяқталды · +{COURSE_COMPLETION_XP} XP</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleComplete}
      className="mt-6 rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-white transition hover:bg-charcoal"
    >
      {label} · +{COURSE_COMPLETION_XP} XP
    </button>
  );
}
