
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
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-terracotta">
            ОҚУ БЕЛГІЛЕРІ
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-charcoal">
            Жетістіктер
          </h2>

          <p className="mt-2 text-sm text-charcoal/65">
            Әр жетістік — еңбегіңіздің белгісі.
          </p>
        </div>

        <p className="text-sm text-charcoal/65">
          {unlockedCount} / {achievements.length} ашылды
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-xl border p-5 transition-colors ${
              achievement.unlocked
                ? "border-terracotta/40 bg-paper"
                : "border-charcoal/10 bg-charcoal/[0.03]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${
                  achievement.unlocked
                    ? "border-terracotta text-terracotta"
                    : "border-charcoal/20 text-charcoal/35"
                }`}
              >
                <span className="text-xl">
                  {achievement.unlocked ? "★" : "◇"}
                </span>
              </div>

              <p className="text-sm font-semibold text-terracotta">
                +{TEK_COIN_REWARDS.achievement} Tek Coin
              </p>
            </div>

            <h3
              className={`mt-5 text-lg font-semibold ${
                achievement.unlocked
                  ? "text-charcoal"
                  : "text-charcoal/45"
              }`}
            >
              {achievement.title}
            </h3>

            <p className="mt-2 text-sm text-charcoal/65">
              {achievement.description}
            </p>

            <div className="mt-5 border-t border-charcoal/10 pt-4">
              {achievement.claimed ? (
                <span className="text-sm font-medium text-charcoal/55">
                  Сыйлық алынды ✓
                </span>
              ) : achievement.unlocked ? (
                <button
                    type="button"
                  onClick={() => handleClaim(achievement.id)}
                    className="min-h-11 rounded-lg bg-charcoal px-5 py-2 text-sm text-white transition-colors hover:bg-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  Сыйлықты алу
                </button>
              ) : (
                <span className="text-sm text-charcoal/45">
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
