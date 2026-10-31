
import { getLearningRecords } from "./progress";
import { getTotalBonusXP } from "./dailyQuests";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  reward: number;
  unlocked: boolean;
  claimed: boolean;
};

const CLAIMED_KEY = "tekshe-achievement-claims";
const UNLOCKED_KEY = "tekshe-achievement-unlocked";

export function getAchievements(): Achievement[] {
  const records = getLearningRecords();

  const totalXP =
    records.reduce((total, record) => total + record.xp, 0) +
    getTotalBonusXP();

  const hasListening = records.some(
    (record) => record.mode === "listening"
  );

  const hasPerfectScore = records.some(
    (record) => record.score === record.total
  );

  const definitions = [
    {
      id: "first-step",
      title: "Алғашқы қадам",
      description: "Алғашқы жаттығуды аяқтаңыз.",
      reward: 20,
      unlocked: records.length >= 1,
    },
    {
      id: "listener",
      title: "Тыңдаушы",
      description: "Алғашқы тыңдау жаттығуын аяқтаңыз.",
      reward: 30,
      unlocked: hasListening,
    },
    {
      id: "perfect-score",
      title: "Дәл мерген",
      description: "Бір жаттығуда 40/40 нәтиже көрсетіңіз.",
      reward: 50,
      unlocked: hasPerfectScore,
    },
    {
      id: "dedicated-learner",
      title: "Табанды оқушы",
      description: "Барлығы 10 жаттығуды аяқтаңыз.",
      reward: 100,
      unlocked: records.length >= 10,
    },
    {
      id: "xp-master",
      title: "Жүздік",
      description: "Кемінде 1000 XP жинаңыз.",
      reward: 100,
      unlocked: totalXP >= 1000,
    },
  ];

  const claimedIds: string[] = JSON.parse(
    localStorage.getItem(CLAIMED_KEY) || "[]"
  );

  const unlockedIds: string[] = JSON.parse(
    localStorage.getItem(UNLOCKED_KEY) || "[]"
  );

  const newlyUnlocked = definitions
    .filter((item) => item.unlocked)
    .map((item) => item.id);

  const allUnlocked = Array.from(
    new Set([...unlockedIds, ...newlyUnlocked])
  );

  localStorage.setItem(UNLOCKED_KEY, JSON.stringify(allUnlocked));

  return definitions.map((item) => ({
    ...item,
    unlocked: allUnlocked.includes(item.id),
    claimed: claimedIds.includes(item.id),
  }));
}

export function claimAchievement(id: string): boolean {
  const achievement = getAchievements().find(
    (item) => item.id === id
  );

  if (!achievement || !achievement.unlocked || achievement.claimed) {
    return false;
  }

  const claimedIds: string[] = JSON.parse(
    localStorage.getItem(CLAIMED_KEY) || "[]"
  );

  claimedIds.push(id);

  localStorage.setItem(CLAIMED_KEY, JSON.stringify(claimedIds));

  const rewardsKey = "tekshe-achievement-rewards";
  const rewards: Record<string, number> = JSON.parse(
    localStorage.getItem(rewardsKey) || "{}"
  );

  rewards[id] = achievement.reward;

  localStorage.setItem(rewardsKey, JSON.stringify(rewards));

  window.dispatchEvent(new Event("tekshe-progress-updated"));

  return true;
}

export function getTotalAchievementXP(): number {
  const rewards: Record<string, number> = JSON.parse(
    localStorage.getItem("tekshe-achievement-rewards") || "{}"
  );

  return Object.values(rewards).reduce(
    (total, reward) => total + reward,
    0
  );
}
