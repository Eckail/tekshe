import { hsk1FoundationCurriculum } from "./hsk1Foundation";
import { pinyinCurriculum } from "./pinyinCurriculum";
import { getLearningRecords } from "./progress";
import { getCompletedCurriculumLessons } from "./curriculumProgress";
import { createProgressStore } from "./progressStore";
import { getTotalXP } from "./xp";
import { getWalletSnapshot } from "./tekCoins";
import { getXPLevel } from "./xpLevels";

export type LearningSummary = {
  coinBalance: number;
  totalCoinsEarned: number;
  totalXP: number;
  progressLevel: number;
  progressLevelTitle: string;
  practiceCount: number;
  completedPinyin: string[];
  completedHsk: string[];
  todayLessons: number;
  continueHref: string;
  continueTitle: string;
  lastModuleLabel: string;
  availableLevel: string;
};

const emptySummary: LearningSummary = {
  coinBalance: 0,
  totalCoinsEarned: 0,
  totalXP: 0,
  progressLevel: 1,
  progressLevelTitle: "Бастаушы",
  practiceCount: 0,
  completedPinyin: [],
  completedHsk: [],
  todayLessons: 0,
  continueHref: "/learn/pinyin/pinyin-initials",
  continueTitle: "声母: буынның бастапқы дыбыстары",
  lastModuleLabel: "Пиньинь",
  availableLevel: "HSK 1 бастау курсы қолжетімді",
};

function localDayKey(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFirstIncompleteRoute(
  coursePath: string,
  lessons: typeof pinyinCurriculum.lessons,
  completed: string[]
): { href: string; title: string } | null {
  const lesson = lessons.find(
    (item) =>
      !completed.includes(item.id) &&
      item.prerequisites.every((prerequisite) => completed.includes(prerequisite))
  );
  return lesson
    ? { href: `${coursePath}/${lesson.id}`, title: lesson.title }
    : null;
}

function getStoredLastRoute(): { href: string; title: string; module: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const route = window.localStorage.getItem("tekshe-last-learning-route:v1");
    if (!route) return null;
    if (route === "/learn") return { href: route, title: "Қолжетімді сабақтар", module: "Оқу орталығы" };
    if (route === "/learn/pinyin") return { href: route, title: pinyinCurriculum.title, module: "Пиньинь" };
    if (route === "/learn/hsk") return { href: route, title: "HSK академиясы", module: "HSK 1" };
    const pinyinPrefix = "/learn/pinyin/";
    if (route.startsWith(pinyinPrefix)) {
      const id = route.slice(pinyinPrefix.length);
      const lesson = pinyinCurriculum.lessons.find((item) => item.id === id);
      if (lesson) return { href: route, title: lesson.title, module: "Пиньинь" };
    }
    const hskPrefix = "/learn/hsk/";
    if (route.startsWith(hskPrefix)) {
      const [levelId, lessonId, ...extra] = route.slice(hskPrefix.length).split("/");
      const level = hsk1FoundationCurriculum.levels.find((item) => item.id === levelId);
      if (level && !lessonId && extra.length === 0) {
        return { href: route, title: `${level.displayName} курсы`, module: "HSK 1" };
      }
      if (levelId && lessonId && !extra.length) {
        const lesson = hsk1FoundationCurriculum.lessons.find(
          (item) => item.id === lessonId && item.levelId === levelId
        );
        if (lesson && hsk1FoundationCurriculum.levels.some((level) => level.id === levelId)) {
          return { href: route, title: lesson.title, module: "HSK 1" };
        }
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function readLearningSummary(): LearningSummary {
  if (typeof window === "undefined") return emptySummary;

  const completedPinyin = getCompletedCurriculumLessons(
    pinyinCurriculum.id,
    pinyinCurriculum.id,
    pinyinCurriculum.lessons.map((lesson) => lesson.id)
  );
  const completedHsk = getCompletedCurriculumLessons(
    hsk1FoundationCurriculum.id,
    hsk1FoundationCurriculum.id,
    hsk1FoundationCurriculum.lessons.map((lesson) => lesson.id)
  );
  const pinyinNext = getFirstIncompleteRoute(
    "/learn/pinyin",
    pinyinCurriculum.lessons,
    completedPinyin
  );
  const hskLevel = hsk1FoundationCurriculum.levels[0];
  const hskLessons = hsk1FoundationCurriculum.lessons.filter(
    (lesson) => lesson.levelId === hskLevel?.id
  );
  const hskNext = hskLevel
      ? getFirstIncompleteRoute(
        `/learn/hsk/${hskLevel.id}`,
        hskLessons,
        completedHsk
      )
    : null;
  const fallback = pinyinNext ?? hskNext ?? { href: "/learn", title: "Оқу орталығын ашу" };
  const last = getStoredLastRoute();
  const wallet = getWalletSnapshot();
  const totalXP = getTotalXP();
  const xpLevel = getXPLevel(totalXP);
  const today = localDayKey(new Date());
  const todayLessons = wallet.transactions.filter(
    (transaction) =>
      transaction.source === "lesson" &&
      localDayKey(new Date(transaction.createdAt)) === today
  ).length;

  return {
    coinBalance: wallet.balance,
    totalCoinsEarned: wallet.totalEarned,
    totalXP,
    progressLevel: xpLevel.level,
    progressLevelTitle: xpLevel.title,
    practiceCount: getLearningRecords().length,
    completedPinyin,
    completedHsk,
    todayLessons,
    continueHref: last?.href ?? fallback.href,
    continueTitle: last?.title ?? fallback.title,
    lastModuleLabel: last?.module ?? (pinyinNext ? "Пиньинь" : hskNext ? "HSK 1" : "Оқу орталығы"),
    availableLevel: hskLevel?.displayName ?? "Деңгей дерегі қолжетімсіз",
  };
}

export const learningSummaryStore = createProgressStore(readLearningSummary, emptySummary);
