"use client";

import { useSyncExternalStore } from "react";
import {
  claimDailyQuest,
  getDailyQuests,
  type DailyQuest,
} from "../data/dailyQuests";
import { createProgressStore } from "../data/progressStore";
import { TEK_COIN_REWARDS } from "../data/tekCoins";
import AppIcon from "./AppIcon";

const dailyQuestStore = createProgressStore<DailyQuest[]>(
  getDailyQuests,
  []
);

export default function DailyQuests() {
  const quests = useSyncExternalStore(
    dailyQuestStore.subscribe,
    dailyQuestStore.getSnapshot,
    dailyQuestStore.getServerSnapshot
  );

  function handleClaim(id: string) {
    claimDailyQuest(id);
  }

  const claimedCount = quests.filter((quest) => quest.claimed).length;

  return (
    <section
      className="rounded-[1.75rem] border border-border-soft bg-card p-5 shadow-sm sm:p-7"
      aria-labelledby="daily-quests-title"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-blue-dark">
            КҮНДЕЛІКТІ БЕЛСЕНДІЛІК
          </p>

          <h2
            id="daily-quests-title"
            className="mt-2 text-xl font-semibold tracking-tight text-text-primary sm:text-2xl"
          >
            Күнделікті тапсырмалар
          </h2>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Тапсырмаларды орындап, XP және Tek Coin жинаңыз.
          </p>
        </div>

        <div className="rounded-xl bg-ice px-3.5 py-2">
          <p className="text-xs font-semibold tabular-nums text-blue-dark">
            {claimedCount} / {quests.length}
          </p>
          <p className="mt-0.5 text-[10px] text-text-secondary">
            Сыйлық алынды
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {quests.map((quest) => {
          const safeTarget = Math.max(1, quest.target);
          const safeProgress = Math.min(
            Math.max(0, quest.progress),
            safeTarget
          );
          const progressPercent = Math.round(
            (safeProgress / safeTarget) * 100
          );

          return (
            <article
              key={quest.id}
              className="rounded-2xl border border-border-soft bg-card-soft/70 p-4 transition-colors hover:border-blue/25 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-text-primary sm:text-base">
                      {quest.title}
                    </h3>

                    {quest.claimed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2.5 py-1 text-[10px] font-semibold text-success">
                        <AppIcon name="check" className="h-3 w-3" />
                        Алынды
                      </span>
                    ) : quest.completed ? (
                      <span className="rounded-full bg-mint/60 px-2.5 py-1 text-[10px] font-semibold text-mint-dark">
                        Дайын
                      </span>
                    ) : (
                      <span className="rounded-full bg-ice px-2.5 py-1 text-[10px] font-medium text-text-secondary">
                        Орындалуда
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    {quest.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
                  <span className="text-xs font-semibold text-blue-dark">
                    +{TEK_COIN_REWARDS.dailyQuest} Tek Coin
                  </span>
                  <span className="text-[10px] text-text-secondary">
                    +{quest.xpReward} XP
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                  <span className="text-text-secondary">
                    Прогресс
                  </span>
                  <span className="font-semibold tabular-nums text-text-primary">
                    {safeProgress} / {safeTarget} · {progressPercent}%
                  </span>
                </div>

                <div
                  className="h-2 overflow-hidden rounded-full bg-ice"
                  role="progressbar"
                  aria-label={`${quest.title} барысы`}
                  aria-valuemin={0}
                  aria-valuemax={safeTarget}
                  aria-valuenow={safeProgress}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue to-mint-dark transition-[width] duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                {quest.claimed ? (
                  <span className="inline-flex min-h-10 items-center gap-2 text-xs font-medium text-success">
                    <AppIcon name="check" className="h-4 w-4" />
                    Сыйлық сәтті алынды
                  </span>
                ) : quest.completed ? (
                  <button
                    type="button"
                    onClick={() => handleClaim(quest.id)}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-dark px-4 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2F6E87] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
                  >
                    Сыйлықты алу
                    <AppIcon name="arrow" className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="text-xs text-text-secondary">
                    Тапсырманы аяқтаңыз
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
