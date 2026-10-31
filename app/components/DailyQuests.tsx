
"use client";

import { useEffect, useState } from "react";
import {
  claimDailyQuest,
  getDailyQuests,
  type DailyQuest,
} from "../data/dailyQuests";

export default function DailyQuests() {
  const [quests, setQuests] = useState<DailyQuest[]>([]);

  function refreshQuests() {
    setQuests(getDailyQuests());
  }

  useEffect(() => {
    refreshQuests();
  }, []);

  function handleClaim(id: string) {
    const success = claimDailyQuest(id);

    if (success) {
      refreshQuests();
    }
  }

  const claimedCount = quests.filter((quest) => quest.claimed).length;

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#B85F3D]">
            DAILY QUESTS
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#242321]">
            Күнделікті тапсырмалар
          </h2>

          <p className="mt-2 text-sm text-[#242321]/60">
            Күн сайын жаңа мақсаттар мен сыйлықтар.
          </p>
        </div>

        <p className="text-sm text-[#242321]/60">
          {claimedCount} / {quests.length} орындалды
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
              className="rounded-2xl border border-[#242321]/15 bg-[#F3EDE1] p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#242321]">
                    {quest.title}
                  </h3>

                  <p className="mt-1 text-sm text-[#242321]/60">
                    {quest.description}
                  </p>
                </div>

                <p className="font-bold text-[#B85F3D]">
                  +{quest.reward} XP
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-[#242321]/60">
                <span>
                  {quest.progress} / {quest.target}
                </span>

                <span>
                  {Math.round(progressPercent)}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#242321]/10">
                <div
                  className="h-full rounded-full bg-[#B85F3D] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-5 flex justify-end">
                {quest.claimed ? (
                  <span className="text-sm font-medium text-[#242321]/50">
                    Сыйлық алынды ✓
                  </span>
                ) : quest.completed ? (
                  <button
                    onClick={() => handleClaim(quest.id)}
                    className="rounded-full bg-[#B85F3D] px-6 py-2 text-sm text-white transition hover:bg-[#242321]"
                  >
                    Сыйлықты алу
                  </button>
                ) : (
                  <span className="text-sm text-[#242321]/50">
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
