
import { getLearningRecords } from "./progress";
import { awardXP, getXPForSource, hasXPAward } from "./xp";

export type DailyQuest = {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
};

function getTodayKey() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayRecords() {
  const today = getTodayKey();

  return getLearningRecords().filter(
    (record) => record.date.slice(0, 10) === today
  );
}

export function getDailyQuests(): DailyQuest[] {
  const records = getTodayRecords();

  const today = getTodayKey();
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

  return [
    {
      id: "complete-exercise",
      title: "Алғашқы жаттығу",
      description: "Бір жаттығуды толық аяқтаңыз.",
      reward: 20,
      progress: Math.min(records.length, 1),
      target: 1,
      completed: hasExercise,
      claimed:
        claimedIds.includes("complete-exercise") ||
        hasXPAward(`daily-quest:${today}:complete-exercise`),
    },
    {
      id: "score-30",
      title: "Дәлдік шебері",
      description: "Бір жаттығуда кемінде 30 дұрыс жауап беріңіз.",
      reward: 30,
      progress: Math.min(bestScore, 30),
      target: 30,
      completed: bestScore >= 30,
      claimed:
        claimedIds.includes("score-30") ||
        hasXPAward(`daily-quest:${today}:score-30`),
    },
    {
      id: "listening-exercise",
      title: "Мұқият тыңдаушы",
      description: "Бір тыңдау жаттығуын аяқтаңыз.",
      reward: 30,
      progress: hasListening ? 1 : 0,
      target: 1,
      completed: hasListening,
      claimed:
        claimedIds.includes("listening-exercise") ||
        hasXPAward(`daily-quest:${today}:listening-exercise`),
    },
  ];
}

export function claimDailyQuest(id: string): boolean {
  const quests = getDailyQuests();
  const quest = quests.find((item) => item.id === id);

  if (!quest || !quest.completed || quest.claimed) {
    return false;
  }

  const today = getTodayKey();
  const claimedKey = `tekshe-daily-claims-${today}`;
  if (typeof window === "undefined") return false;

  const awardId = `daily-quest:${today}:${id}`;
  const awarded = awardXP(awardId, "daily-quest", quest.reward);
  if (!awarded && !hasXPAward(awardId)) return false;

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

  return awarded;
}

export function getTotalBonusXP(): number {
  return getXPForSource("daily-quest");
}
