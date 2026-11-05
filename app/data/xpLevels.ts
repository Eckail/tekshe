export const xpLevels = [
  { level: 1, title: "Бастаушы", xp: 0 },
  { level: 2, title: "Ізденуші", xp: 300 },
  { level: 3, title: "Үйренуші", xp: 800 },
  { level: 4, title: "Зерттеуші", xp: 1500 },
  { level: 5, title: "Шебер", xp: 2500 },
] as const;

export function getXPLevel(totalXP: number) {
  const current = [...xpLevels].reverse().find((item) => totalXP >= item.xp) ?? xpLevels[0];
  const next = xpLevels.find((item) => item.level === current.level + 1);
  const progress = next
    ? Math.max(0, Math.min(100, ((totalXP - current.xp) / (next.xp - current.xp)) * 100))
    : 100;

  return {
    ...current,
    next,
    progress,
    remainingXP: next ? Math.max(0, next.xp - totalXP) : 0,
  };
}
