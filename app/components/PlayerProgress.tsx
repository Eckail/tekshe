"use client";

import { useEffect, useState } from "react";
import { getLearningRecords } from "../data/progress";
import { getTotalXP, initializeXPAwards } from "../data/xp";
import { getXPLevel } from "../data/xpLevels";

export default function PlayerProgress() {
  const [totalXP, setTotalXP] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function updateProgress() {
      initializeXPAwards();
      setTotalXP(getTotalXP());
      setCompletedLessons(getLearningRecords().length);
      setLoaded(true);
    }

    updateProgress();
    window.addEventListener("tekshe-progress-updated", updateProgress);
    window.addEventListener("storage", updateProgress);
    return () => {
      window.removeEventListener("tekshe-progress-updated", updateProgress);
      window.removeEventListener("storage", updateProgress);
    };
  }, []);

  if (!loaded) return null;
  const current = getXPLevel(totalXP);

  return (
    <section className="rounded-3xl border border-border-soft bg-card p-5 shadow-sm sm:p-7" aria-labelledby="xp-progress-title">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-dark">ІШКІ ІЛГЕРІЛЕУ</p>
          <h2 id="xp-progress-title" className="mt-2 text-xl font-semibold">XP деңгейі · {current.level}</h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">{current.title} · XP — Tek Coin-нен бөлек ішкі оқу көрсеткіші.</p>
        </div>
        <p className="text-3xl font-semibold tabular-nums">{totalXP.toLocaleString("kk-KZ")} <span className="text-base text-text-secondary">XP</span></p>
      </div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-ice" role="progressbar" aria-label="Келесі XP деңгейіне дейінгі барыс" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(current.progress)}>
        <div className="h-full rounded-full bg-blue-dark transition-[width]" style={{ width: `${current.progress}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-text-secondary"><span>{completedLessons} жаттығу нәтижесі</span><span>{current.next ? `Келесі деңгейге ${current.remainingXP} XP қалды` : "Қазіргі ең жоғары деңгей"}</span></div>
    </section>
  );
}
