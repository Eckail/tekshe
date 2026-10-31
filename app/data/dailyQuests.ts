
import { getLearningRecords } from "./progress";

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

  const claimedKey = `tekshe-daily-claims-${getTodayKey()}`;
  const claimedIds: string[] = JSON.parse(
    localStorage.getItem(claimedKey) || "[]"
  );

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
      claimed: claimedIds.includes("complete-exercise"),
    },
    {
      id: "score-30",
      title: "Дәлдік шебері",
      description: "Бір жаттығуда кемінде 30 дұрыс жауап беріңіз.",
      reward: 30,
      progress: Math.min(bestScore, 30),
      target: 30,
      completed: bestScore >= 30,
      claimed: claimedIds.includes("score-30"),
    },
    {
      id: "listening-exercise",
      title: "Мұқият тыңдаушы",
      description: "Бір тыңдау жаттығуын аяқтаңыз.",
      reward: 30,
      progress: hasListening ? 1 : 0,
      target: 1,
      completed: hasListening,
      claimed: claimedIds.includes("listening-exercise"),
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

  const claimedIds: string[] = JSON.parse(
    localStorage.getItem(claimedKey) || "[]"
  );

  claimedIds.push(id);
  localStorage.setItem(claimedKey, JSON.stringify(claimedIds));

  const rewardsKey = "tekshe-daily-rewards";
  const rewards: Record<string, number> = JSON.parse(
    localStorage.getItem(rewardsKey) || "{}"
  );

  rewards[today] = (rewards[today] || 0) + quest.reward;

  localStorage.setItem(rewardsKey, JSON.stringify(rewards));

  window.dispatchEvent(new Event("tekshe-progress-updated"));

  return true;
}

export function getTotalBonusXP(): number {
  const rewards = JSON.parse(
    localStorage.getItem("tekshe-daily-rewards") || "{}"
  ) as Record<string, number>;

  return Object.values(rewards).reduce(
    (total, reward) => total + reward,
    0
  );
}
