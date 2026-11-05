
import { getLearningRecords } from "./progress";
import { awardXP, getTotalXP, getXPForSource, hasXPAward } from "./xp";
import { awardTekCoins, hasTekCoinTransaction, TEK_COIN_REWARDS } from "./tekCoins";

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

  const totalXP = getTotalXP();

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

  if (typeof window === "undefined") {
    return definitions.map((item) => ({ ...item, claimed: false }));
  }

  let claimedIds: string[] = [];
  let unlockedIds: string[] = [];
  try {
    const savedClaims: unknown = JSON.parse(
      window.localStorage.getItem(CLAIMED_KEY) || "[]"
    );
    const savedUnlocks: unknown = JSON.parse(
      window.localStorage.getItem(UNLOCKED_KEY) || "[]"
    );
    if (Array.isArray(savedClaims)) {
      claimedIds = savedClaims.filter(
        (id): id is string => typeof id === "string"
      );
    }
    if (Array.isArray(savedUnlocks)) {
      unlockedIds = savedUnlocks.filter(
        (id): id is string => typeof id === "string"
      );
    }
  } catch {
    claimedIds = [];
    unlockedIds = [];
  }

  const newlyUnlocked = definitions
    .filter((item) => item.unlocked)
    .map((item) => item.id);

  const allUnlocked = Array.from(
    new Set([...unlockedIds, ...newlyUnlocked])
  );

  return definitions.map((item) => ({
    ...item,
    unlocked: allUnlocked.includes(item.id),
    claimed:
      claimedIds.includes(item.id) ||
      hasXPAward(`achievement:${item.id}`) ||
      hasTekCoinTransaction(`achievement:${item.id}`),
  }));
}

export function claimAchievement(id: string): boolean {
  const achievement = getAchievements().find(
    (item) => item.id === id
  );

  if (!achievement || !achievement.unlocked || achievement.claimed) {
    return false;
  }

  if (typeof window === "undefined") return false;

  const awardId = `achievement:${id}`;
  const awarded = awardXP(awardId, "achievement", achievement.reward);
  if (!awarded && !hasXPAward(awardId)) return false;

  const coinAwarded = awardTekCoins({
    sourceActivityId: `achievement:${id}`,
    source: "achievement",
    amount: TEK_COIN_REWARDS.achievement,
    description: `Жетістік ашылды: ${achievement.title}`,
  });

  try {
    const saved: unknown = JSON.parse(
      window.localStorage.getItem(CLAIMED_KEY) || "[]"
    );
    const claimedIds = Array.isArray(saved)
      ? saved.filter((claimedId): claimedId is string => typeof claimedId === "string")
      : [];

    if (!claimedIds.includes(id)) {
      claimedIds.push(id);
      window.localStorage.setItem(CLAIMED_KEY, JSON.stringify(claimedIds));
    }
  } catch {
    // The XP event is authoritative; getAchievements also checks it directly.
  }

  return awarded || coinAwarded;
}

export function getTotalAchievementXP(): number {
  return getXPForSource("achievement");
}
