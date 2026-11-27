
import { getLearningRecords } from "./progress";
import { getTodayReviewCount } from "./reviewSystem";
import { awardXP, getXPForSource, hasXPAward } from "./xp";
import {
  awardTekCoins,
  hasTekCoinTransaction,
  TEK_COIN_REWARDS,
} from "./tekCoins";

export type DailyQuest = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
};

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayKey(now = new Date()) {
  return getDateKey(now);
}

function getTodayRecords(now = new Date()) {
  const today = getDateKey(now);

  return getLearningRecords().filter(
    (record) => getDateKey(new Date(record.date)) === today
  );
}

export function getDailyQuests(now = new Date()): DailyQuest[] {
  const records = getTodayRecords(now);

  const today = getTodayKey(now);
  const claimedKey = `tekshe-daily-claims-${today}`;
  let claimedIds: string[] = [];

  if (typeof window !== "undefined") {
    try {
      const saved: unknown = JSON.parse(
        window.localStorage.getItem(claimedKey) || "[]"
      );
      if (Array.isArray(saved)) {
        claimedIds = saved.filter(
          (id): id is string => typeof id === "string"
        );
      }
    } catch {
      claimedIds = [];
    }
  }

  const hasExercise = records.length >= 1;
  const bestScore = Math.max(0, ...records.map((r) => r.score));
  const hasListening = records.some(
    (record) => record.mode === "listening"
  );
  const reviewCount = getTodayReviewCount(now);

  return [
    {
      id: "complete-exercise",
      title: "Алғашқы жаттығу",
      description: "Бір жаттығуды толық аяқтаңыз.",
      xpReward: 20,
      progress: Math.min(records.length, 1),
      target: 1,
      completed: hasExercise,
      claimed:
        claimedIds.includes("complete-exercise") ||
        hasXPAward(`daily-quest:${today}:complete-exercise`) ||
        hasTekCoinTransaction(`quest:${today}:complete-exercise`),
    },
    {
      id: "score-30",
      title: "Дәлдік шебері",
      description: "Бір жаттығуда кемінде 30 дұрыс жауап беріңіз.",
      xpReward: 30,
      progress: Math.min(bestScore, 30),
      target: 30,
      completed: bestScore >= 30,
      claimed:
        claimedIds.includes("score-30") ||
        hasXPAward(`daily-quest:${today}:score-30`) ||
        hasTekCoinTransaction(`quest:${today}:score-30`),
    },
    {
      id: "listening-exercise",
      title: "Мұқият тыңдаушы",
      description: "Бір тыңдау жаттығуын аяқтаңыз.",
      xpReward: 30,
      progress: hasListening ? 1 : 0,
      target: 1,
      completed: hasListening,
      claimed:
        claimedIds.includes("listening-exercise") ||
        hasXPAward(`daily-quest:${today}:listening-exercise`) ||
        hasTekCoinTransaction(`quest:${today}:listening-exercise`),
    },
    {
      id: "daily-review",
      title: "Білгеніңді бекіт",
      description: "Бес карточканы аралық қайталаудан өткізіңіз.",
      xpReward: 25,
      progress: Math.min(reviewCount, 5),
      target: 5,
      completed: reviewCount >= 5,
      claimed:
        claimedIds.includes("daily-review") ||
        hasXPAward(`daily-quest:${today}:daily-review`) ||
        hasTekCoinTransaction(`quest:${today}:daily-review`),
    },
  ];
}

export function claimDailyQuest(id: string, now = new Date()): boolean {
  const quests = getDailyQuests(now);
  const quest = quests.find((item) => item.id === id);

  if (!quest || !quest.completed || quest.claimed) {
    return false;
  }

  const today = getTodayKey(now);
  const claimedKey = `tekshe-daily-claims-${today}`;
  if (typeof window === "undefined") return false;

  const awardId = `daily-quest:${today}:${id}`;
  const awarded = awardXP(awardId, "daily-quest", quest.xpReward);
  if (!awarded && !hasXPAward(awardId)) return false;

  const coinAwarded = awardTekCoins({
    sourceActivityId: `quest:${today}:${id}`,
    source: "quest",
    amount: TEK_COIN_REWARDS.dailyQuest,
    description: `Күнделікті тапсырма: ${quest.title}`,
  });

  try {
    const saved: unknown = JSON.parse(
      window.localStorage.getItem(claimedKey) || "[]"
    );
    const claimedIds = Array.isArray(saved)
      ? saved.filter((claimId): claimId is string => typeof claimId === "string")
      : [];

    if (!claimedIds.includes(id)) {
      claimedIds.push(id);
      window.localStorage.setItem(claimedKey, JSON.stringify(claimedIds));
    }
  } catch {
    // The XP event is authoritative; getDailyQuests also checks it directly.
  }

  return awarded || coinAwarded;
}

export function getTotalBonusXP(): number {
  return getXPForSource("daily-quest");
}
