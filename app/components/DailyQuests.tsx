
"use client";

import { useSyncExternalStore } from "react";
import {
  claimDailyQuest,
  getDailyQuests,
  type DailyQuest,
} from "../data/dailyQuests";
import { createProgressStore } from "../data/progressStore";
import { TEK_COIN_REWARDS } from "../data/tekCoins";

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
    <section className="rounded-xl border border-charcoal/10 bg-paper p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-terracotta">
            ОҚУ МАҚСАТЫ
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-charcoal">
            Күнделікті тапсырмалар
          </h2>

          <p className="mt-2 text-sm text-charcoal/65">
            Орындалған тапсырмаға 15 Tek Coin беріледі.
          </p>
        </div>

        <p className="text-sm text-charcoal/65">
          {claimedCount} / {quests.length} сыйлық алынды
        </p>
      </div>

      <div className="grid gap-4">
        {quests.map((quest) => {
          const progressPercent = Math.min(
            (quest.progress / quest.target) * 100,
            100
          );

          return (
            <div
              key={quest.id}
              className="rounded-xl border border-charcoal/12 bg-paper p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-charcoal">
                    {quest.title}
                  </h3>

                  <p className="mt-1 text-sm text-charcoal/65">
                    {quest.description}
                  </p>
                </div>

                <p className="font-semibold text-terracotta">
                  +{TEK_COIN_REWARDS.dailyQuest} Tek Coin
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-charcoal/65">
                <span>
                  {quest.progress} / {quest.target}
                </span>

                <span>
                  {Math.round(progressPercent)}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-charcoal/10" role="progressbar" aria-label={`${quest.title} барысы`} aria-valuemin={0} aria-valuemax={quest.target} aria-valuenow={quest.progress}>
                <div
                  className="h-full bg-terracotta transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-5 flex justify-end">
                {quest.claimed ? (
                  <span className="text-sm font-medium text-charcoal/55">
                    Сыйлық алынды ✓
                  </span>
                ) : quest.completed ? (
                  <button
                    type="button"
                    onClick={() => handleClaim(quest.id)}
                    className="min-h-11 rounded-lg bg-charcoal px-5 py-2 text-sm text-white transition-colors hover:bg-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                  >
                    Сыйлықты алу
                  </button>
                ) : (
                  <span className="text-sm text-charcoal/55">
                    Орындалуда...
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
