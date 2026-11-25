
"use client";

import { useSyncExternalStore } from "react";
import {
  claimAchievement,
  getAchievements,
  type Achievement,
} from "../data/achievements";
import { createProgressStore } from "../data/progressStore";
import { TEK_COIN_REWARDS } from "../data/tekCoins";

const achievementStore = createProgressStore<Achievement[]>(
  getAchievements,
  []
);

export default function Achievements() {
  const achievements = useSyncExternalStore(
    achievementStore.subscribe,
    achievementStore.getSnapshot,
    achievementStore.getServerSnapshot
  );

  function handleClaim(id: string) {
    claimAchievement(id);
  }

  const unlockedCount = achievements.filter(
    (item) => item.unlocked
  ).length;

  return (
    <section className="mx-auto w-full max-w-5xl rounded-3xl border border-border-soft bg-card p-5 shadow-sm sm:p-7">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-dark">
            ОҚУ БЕЛГІЛЕРІ
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-text-primary">
            Жетістіктер
          </h2>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Әр жетістік — еңбегіңіздің белгісі.
          </p>
        </div>

        <p className="text-sm leading-6 text-text-secondary">
          {unlockedCount} / {achievements.length} ашылды
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-xl border p-5 transition-colors ${
              achievement.unlocked
                ? "border-blue/30 bg-card shadow-sm"
                : "border-border-soft bg-ice/50"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${
                  achievement.unlocked
                    ? "border-blue/30 bg-ice text-blue-dark"
                    : "border-border-soft bg-ice/60 text-text-secondary"
                }`}
              >
                <span className="text-xl">
                  {achievement.unlocked ? "★" : "◇"}
                </span>
              </div>

              <p className="text-sm font-semibold text-blue-dark">
                +{TEK_COIN_REWARDS.achievement} Tek Coin
              </p>
            </div>

            <h3
              className={`mt-5 text-lg font-semibold ${
                achievement.unlocked
                  ? "text-text-primary"
                  : "text-text-secondary"
              }`}
            >
              {achievement.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {achievement.description}
            </p>

            <div className="mt-5 border-t border-border-soft pt-4">
              {achievement.claimed ? (
                <span className="text-sm font-medium text-mint-dark">
                  Сыйлық алынды ✓
                </span>
              ) : achievement.unlocked ? (
                <button
                    type="button"
                  onClick={() => handleClaim(achievement.id)}
                    className="min-h-11 min-h-11 rounded-xl bg-blue-dark px-5 py-2 text-sm font-semibold text-white transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  Сыйлықты алу
                </button>
              ) : (
                <span className="text-sm text-text-secondary">
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
