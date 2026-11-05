
"use client";

import { useEffect, useState } from "react";
import { getLearningRecords } from "../data/progress";
import { getTotalXP, initializeXPAwards } from "../data/xp";

const levels = [
  { level: 1, title: "Бастаушы", xp: 0 },
  { level: 2, title: "Ізденуші", xp: 300 },
  { level: 3, title: "Үйренуші", xp: 800 },
  { level: 4, title: "Зерттеуші", xp: 1500 },
  { level: 5, title: "Шебер", xp: 2500 },
];

export default function PlayerProgress() {
  const [totalXP, setTotalXP] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function updateProgress() {
      initializeXPAwards();
      const records = getLearningRecords();

      setTotalXP(getTotalXP());
      setCompletedLessons(records.length);
      setLoaded(true);
    }

    updateProgress();

    window.addEventListener("tekshe-progress-updated", updateProgress);

    return () => {
      window.removeEventListener("tekshe-progress-updated", updateProgress);
    };
  }, []);

  if (!loaded) return null;

  const currentLevel = [...levels]
    .reverse()
    .find((item) => totalXP >= item.xp) ?? levels[0];

  const nextLevel = levels.find(
    (item) => item.level === currentLevel.level + 1
  );

  const progress = nextLevel
    ? ((totalXP - currentLevel.xp) /
        (nextLevel.xp - currentLevel.xp)) * 100
    : 100;

  const remainingXP = nextLevel
    ? nextLevel.xp - totalXP
    : 0;

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="overflow-hidden rounded-3xl border border-[#242321]/15 bg-[#F3EDE1] p-7 sm:p-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#B85F3D]">
              TEKSHE PLAYER
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#242321]">
              Ойыншы профилі
            </h2>

            <p className="mt-2 text-[#242321]/60">
              Әр сабақ — жаңа мүмкіндік.
            </p>
          </div>

          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#B85F3D]">
            <div className="text-center">
              <p className="text-xs text-[#242321]/60">LEVEL</p>
              <p className="text-4xl font-bold text-[#B85F3D]">
                {currentLevel.level}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-[#242321]/50">
                Қазіргі деңгей
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-[#242321]">
                {currentLevel.title}
              </h3>
            </div>

            <p className="text-xl font-bold text-[#B85F3D]">
              {totalXP.toLocaleString()} XP
            </p>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#242321]/10">
            <div
              className="h-full rounded-full bg-[#B85F3D] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-[#242321]/60">
            <span>LV. {currentLevel.level}</span>
            {nextLevel ? (
              <span>
                Келесі деңгейге {remainingXP} XP қалды
              </span>
            ) : (
              <span>Ең жоғары деңгей!</span>
            )}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-[#242321]/15 pt-7">
          <div>
            <p className="text-3xl font-bold text-[#242321]">
              {completedLessons}
            </p>
            <p className="mt-1 text-sm text-[#242321]/60">
              Аяқталған жаттығулар
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold text-[#242321]">
              {totalXP.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-[#242321]/60">
              Жиналған тәжірибе
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
