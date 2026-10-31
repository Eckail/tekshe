
"use client";

import { useEffect, useState } from "react";
import {
  claimAchievement,
  getAchievements,
  type Achievement,
} from "../data/achievements";

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  function refreshAchievements() {
    setAchievements(getAchievements());
  }

  useEffect(() => {
    refreshAchievements();

    window.addEventListener(
      "tekshe-progress-updated",
      refreshAchievements
    );

    return () => {
      window.removeEventListener(
        "tekshe-progress-updated",
        refreshAchievements
      );
    };
  }, []);

  function handleClaim(id: string) {
    if (claimAchievement(id)) {
      refreshAchievements();
    }
  }

  const unlockedCount = achievements.filter(
    (item) => item.unlocked
  ).length;

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#B85F3D]">
            ACHIEVEMENTS
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#242321]">
            Жетістіктер
          </h2>

          <p className="mt-2 text-sm text-[#242321]/60">
            Әр жетістік — еңбегіңіздің белгісі.
          </p>
        </div>

        <p className="text-sm text-[#242321]/60">
          {unlockedCount} / {achievements.length} ашылды
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-2xl border p-6 transition ${
              achievement.unlocked
                ? "border-[#B85F3D]/40 bg-[#F3EDE1]"
                : "border-[#242321]/10 bg-[#242321]/[0.03]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
                  achievement.unlocked
                    ? "border-[#B85F3D] text-[#B85F3D]"
                    : "border-[#242321]/20 text-[#242321]/30"
                }`}
              >
                <span className="text-xl">
                  {achievement.unlocked ? "★" : "◇"}
                </span>
              </div>

              <p className="text-sm font-bold text-[#B85F3D]">
                +{achievement.reward} XP
              </p>
            </div>

            <h3
              className={`mt-5 text-lg font-semibold ${
                achievement.unlocked
                  ? "text-[#242321]"
                  : "text-[#242321]/40"
              }`}
            >
              {achievement.title}
            </h3>

            <p className="mt-2 text-sm text-[#242321]/60">
              {achievement.description}
            </p>

            <div className="mt-5 border-t border-[#242321]/10 pt-4">
              {achievement.claimed ? (
                <span className="text-sm font-medium text-[#242321]/50">
                  Сыйлық алынды ✓
                </span>
              ) : achievement.unlocked ? (
                <button
                  onClick={() => handleClaim(achievement.id)}
                  className="rounded-full bg-[#B85F3D] px-6 py-2 text-sm text-white transition hover:bg-[#242321]"
                >
                  Сыйлықты алу
                </button>
              ) : (
                <span className="text-sm text-[#242321]/40">
                  Әлі ашылған жоқ
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
