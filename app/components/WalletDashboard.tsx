
"use client";

import { useSyncExternalStore } from "react";
import PageHeading from "./PageHeading";
import TekCoinMark from "./TekCoinMark";
import { createProgressStore } from "../data/progressStore";
import {
  getWalletSnapshot,
  TEK_COIN_REWARDS,
  type WalletSnapshot,
} from "../data/tekCoins";

const walletStore = createProgressStore<WalletSnapshot>(getWalletSnapshot, {
  balance: 0,
  totalEarned: 0,
  transactions: [],
});

const sourceLabels = {
  lesson: "Сабақ",
  quest: "Күнделікті тапсырма",
  milestone: "Оқу межесі",
  achievement: "Жетістік",
  streak: "Оқу тізбегі",
} as const;

const numberFormatter = new Intl.NumberFormat("kk-KZ");

const rewardItems = [
  {
    label: "Сабақты аяқтау",
    detail: "Әр аяқталған сабақ үшін",
    amount: TEK_COIN_REWARDS.lesson,
    icon: "book",
  },
  {
    label: "Күнделікті тапсырма",
    detail: "Күнделікті мақсатты орындау",
    amount: TEK_COIN_REWARDS.dailyQuest,
    icon: "target",
  },
  {
    label: "Курс межесі",
    detail: "Курсты толық аяқтау",
    amount: TEK_COIN_REWARDS.milestone,
    icon: "flag",
  },
  {
    label: "Жетістік",
    detail: "Жаңа жетістікті ашу",
    amount: TEK_COIN_REWARDS.achievement,
    icon: "trophy",
  },
] as const;

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("kk-KZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-blue-dark">
      {children}
    </p>
  );
}

function RewardIcon({ type }: { type: string }) {
  const iconClass = "h-5 w-5";

  switch (type) {
    case "book":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
          <path d="M4 5.5V21M8 7h8M8 11h7" />
        </svg>
      );

    case "target":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );

    case "flag":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 21V4m0 0c5-4 9 4 14 0v11c-5 4-9-4-14 0" />
        </svg>
      );

    default:
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
        </svg>
      );
  }
}

export default function WalletDashboard() {
  const wallet = useSyncExternalStore(
    walletStore.subscribe,
    walletStore.getSnapshot,
    walletStore.getServerSnapshot
  );

  return (
    <div className="space-y-8 pb-8 sm:space-y-10">
      <PageHeading
        eyebrow="TEK COIN · ВИРТУАЛДЫ ОҚУ СЫЙЛЫҒЫ"
        title="Tek әмияны"
        description="Оқу жолындағы еңбегіңді жина. Әр аяқталған сабақ пен жетістік саған Tek Coin сыйлайды."
      />

      {/* Balance and rewards */}
      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        {/* Main balance card */}
        <div className="relative isolate min-h-[270px] overflow-hidden rounded-[24px] border border-border-soft bg-gradient-to-br from-sky/45 via-card to-mint/35 p-6 shadow-card sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full border border-card/60" />
          <div className="pointer-events-none absolute -right-8 -top-12 -z-10 h-52 w-52 rounded-full border border-card/60" />
          <div className="pointer-events-none absolute -bottom-24 right-20 -z-10 h-56 w-56 rounded-full bg-card/30 blur-2xl" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border-soft bg-card/70 text-blue-dark shadow-sm">
                <TekCoinMark className="h-8 w-8 text-base" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-text-secondary">
                  TEKSHE WALLET
                </p>
                <p className="mt-0.5 text-sm font-semibold text-text-primary">
                  Tek Coin
                </p>
              </div>
            </div>

            <span className="rounded-full border border-border-soft bg-card/60 px-3 py-1.5 text-[10px] font-semibold text-blue-dark">
              Виртуалды сыйлық
            </span>
          </div>

          <div className="mt-9">
            <p className="text-xs font-medium text-text-secondary">
              Қолжетімді баланс
            </p>

            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <p className="text-5xl font-bold tracking-[-0.055em] text-text-primary sm:text-6xl">
                {numberFormatter.format(wallet.balance)}
              </p>
              <span className="text-sm font-semibold text-text-secondary">
                Tek Coin
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border-soft pt-5">
            <div>
              <p className="text-[11px] text-text-secondary">
                Барлығы жиналды
              </p>
              <p className="mt-1 text-lg font-bold text-blue-dark">
                {numberFormatter.format(wallet.totalEarned)}{" "}
                <span className="text-xs font-medium">Tek Coin</span>
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card/70 text-blue-dark">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 14 12 9l5 5" />
                <path d="M12 9v12" />
                <path d="M4 4h16" />
              </svg>
            </div>
          </div>
        </div>

        {/* Reward rules */}
        <div className="rounded-[24px] border border-border-soft bg-card p-5 shadow-card sm:p-7">
          <SectionLabel>TEK COIN ЖИНАУ</SectionLabel>

          <h2 className="mt-2 text-xl font-bold tracking-tight text-text-primary">
            Сыйлық ережелері
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Білім ал, тапсырмаларды орында және сыйлық жина.
          </p>

          <div className="mt-5 space-y-1">
            {rewardItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors duration-200 hover:bg-card-soft"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-blue/10 text-blue-dark">
                  <RewardIcon type={item.icon} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {item.detail}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-success-bg px-3 py-1.5 text-sm font-bold text-success">
                  +{item.amount}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-card-soft px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-border-soft/60 text-text-secondary">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>

            <div>
              <p className="text-xs font-semibold text-text-primary">
                Оқу тізбегі
              </p>
              <p className="mt-0.5 text-[11px] text-text-secondary">
                Бұл марапат жүйесі әзірге іске қосылмаған.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transaction history */}
      <section aria-labelledby="wallet-history-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionLabel>ӘМІЯН ЖУРНАЛЫ</SectionLabel>

            <h2
              id="wallet-history-title"
              className="mt-2 text-section-title font-bold tracking-tight text-text-primary"
            >
              Соңғы транзакциялар
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Tek Coin қозғалысының тарихы.
            </p>
          </div>

          <span className="rounded-full border border-border-soft bg-card/80 px-3 py-1.5 text-xs font-medium text-text-secondary">
            {wallet.transactions.length} жазба
          </span>
        </div>

        {wallet.transactions.length > 0 ? (
          <div className="overflow-hidden rounded-[24px] border border-border-soft bg-card shadow-card">
            <ol className="divide-y divide-border-soft">
              {wallet.transactions.slice(0, 20).map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex min-h-[82px] items-center gap-3 px-4 py-4 transition-colors duration-200 hover:bg-card-soft sm:gap-4 sm:px-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue/10 text-blue-dark">
                    <TekCoinMark className="h-8 w-8 text-sm" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {transaction.description}
                    </p>

                    <p className="mt-1 truncate text-xs text-text-secondary">
                      {sourceLabels[transaction.source]}
                      <span className="mx-1.5">·</span>
                      <time dateTime={transaction.createdAt}>
                        {dateLabel(transaction.createdAt)}
                      </time>
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-bold ${
                      transaction.type === "earn"
                        ? "bg-success-bg text-success"
                        : "bg-card-soft text-text-secondary"
                    }`}
                  >
                    {transaction.type === "earn" ? "+" : "−"}
                    {numberFormatter.format(transaction.amount)}
                  </span>
                </li>
              ))}
            </ol>

            {wallet.transactions.length > 20 && (
              <div className="border-t border-border-soft bg-card-soft px-5 py-3 text-center text-xs text-text-secondary">
                Соңғы 20 транзакция көрсетілді.
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-border-soft bg-card/70 px-5 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-blue/10 text-blue-dark">
              <TekCoinMark className="h-12 w-12 text-xl" />
            </div>

            <h3 className="mt-5 text-base font-bold text-text-primary">
              Әзірге транзакция жоқ
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
              Алғашқы сабақты аяқтағанда 20 Tek Coin аласың. Сыйлығың осы жерде
              пайда болады.
            </p>
          </div>
        )}
      </section>

      {/* Future store */}
      <section
        aria-labelledby="future-store-title"
        className="relative overflow-hidden rounded-[24px] border border-border-soft bg-gradient-to-r from-card-soft to-mint/15 p-5 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full border border-card/70" />
        <div className="pointer-events-none absolute -right-1 -top-5 h-24 w-24 rounded-full border border-card/70" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card/80 text-blue-dark shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 8h12l1 12H5L6 8Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
              <path d="M9 13h6" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <SectionLabel>КЕЛЕСІ КЕЗЕҢ</SectionLabel>

            <h2
              id="future-store-title"
              className="mt-1 text-lg font-bold text-text-primary"
            >
              Сыйлықтар дүкені
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">
              Болашақта Tek Coin арқылы жаңа тақырыптар, тұсқағаздар және оқу
              материалдарын ашуға болады. Дүкен әзірге қолжетімді емес.
            </p>
          </div>

          <span className="w-fit shrink-0 rounded-full border border-border-soft bg-card/70 px-4 py-2 text-xs font-semibold text-text-secondary">
            Жақында
          </span>
        </div>
      </section>

      {/* Storage notice */}
      <p className="flex items-start gap-2 px-1 text-xs leading-5 text-text-secondary">
        <svg
          viewBox="0 0 24 24"
          className="mt-0.5 h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>

        Әмиян деректері осы браузерде сақталады. Браузер деректерін тазалау
        транзакцияларды өшіруі мүмкін.
      </p>
    </div>
  );
}
