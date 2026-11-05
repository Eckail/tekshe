"use client";

import { useSyncExternalStore } from "react";
import PageHeading from "./PageHeading";
import TekCoinMark from "./TekCoinMark";
import { createProgressStore } from "../data/progressStore";
import { getWalletSnapshot, TEK_COIN_REWARDS, type WalletSnapshot } from "../data/tekCoins";

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

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("kk-KZ", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function WalletDashboard() {
  const wallet = useSyncExternalStore(walletStore.subscribe, walletStore.getSnapshot, walletStore.getServerSnapshot);

  return (
    <div className="space-y-9">
      <PageHeading eyebrow="TEK COIN · ВИРТУАЛДЫ ОҚУ СЫЙЛЫҒЫ" title="Tek әмияны" description="Tek Coin — тек оқу платформасындағы виртуалды белгі. Оның ақшалай құны жоқ және сатып алу функциясы жоқ." />

      <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="relative overflow-hidden rounded-2xl bg-charcoal p-6 text-cream sm:p-8">
          <div className="absolute -right-5 -top-8 h-36 w-36 rounded-full border border-cream/15" aria-hidden="true" />
          <div className="relative flex items-center gap-3"><TekCoinMark className="h-10 w-10 border-cream/35 text-lg text-cream" /><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/65">ҚОЛЖЕТІМДІ БАЛАНС</p></div>
          <p className="relative mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">{new Intl.NumberFormat("kk-KZ").format(wallet.balance)}</p>
          <p className="relative mt-3 text-sm text-cream/65">Жиналғаны: {new Intl.NumberFormat("kk-KZ").format(wallet.totalEarned)} Tek Coin</p>
          <p className="relative mt-8 border-t border-cream/15 pt-4 text-xs leading-5 text-cream/60">Дерек тек осы браузерде сақталады. Браузер дерегін тазалау әмиян жазбаларын өшіруі мүмкін.</p>
        </div>

        <div className="rounded-2xl border border-charcoal/10 bg-paper p-5 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">ТАБУ ЖОЛДАРЫ</p>
          <h2 className="mt-2 text-xl font-semibold">Сыйлық ережелері</h2>
          <ul className="mt-5 divide-y divide-charcoal/10">
            <li className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm"><span>Сабақты аяқтау</span><strong className="text-terracotta">+{TEK_COIN_REWARDS.lesson}</strong></li>
            <li className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm"><span>Күнделікті тапсырма</span><strong className="text-terracotta">+{TEK_COIN_REWARDS.dailyQuest}</strong></li>
            <li className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm"><span>Курс межесін аяқтау</span><strong className="text-terracotta">+{TEK_COIN_REWARDS.milestone}</strong></li>
            <li className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm"><span>Жетістікті ашу</span><strong className="text-terracotta">+{TEK_COIN_REWARDS.achievement}</strong></li>
            <li className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm"><span>Оқу тізбегі</span><span className="text-xs text-charcoal/50">Санағы әзірге жоқ</span></li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="wallet-history-title">
        <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">ӘМІЯН ЖУРНАЛЫ</p><h2 id="wallet-history-title" className="mt-2 text-section-title font-semibold">Соңғы транзакциялар</h2></div><span className="text-xs text-charcoal/55">{wallet.transactions.length} жазба</span></div>
        {wallet.transactions.length ? (
          <ol className="divide-y divide-charcoal/10 rounded-xl border border-charcoal/10 bg-paper px-4 sm:px-6">
            {wallet.transactions.slice(0, 20).map((transaction) => (
              <li key={transaction.id} className="flex min-h-[76px] items-center gap-3 py-3">
                <TekCoinMark className="h-9 w-9 text-sm" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{transaction.description}</p><p className="mt-1 text-xs text-charcoal/55">{sourceLabels[transaction.source]} · {dateLabel(transaction.createdAt)}</p></div>
                <span className={`shrink-0 text-sm font-semibold ${transaction.type === "earn" ? "text-steppe" : "text-charcoal"}`}>{transaction.type === "earn" ? "+" : "−"}{transaction.amount}</span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-xl border border-dashed border-charcoal/20 bg-paper/55 px-5 py-8 text-center"><p className="font-medium">Әзірге транзакция жоқ</p><p className="mt-2 text-sm text-charcoal/60">Алғашқы сабақты аяқтағанда 20 Tek Coin осы жерде көрсетіледі.</p></div>
        )}
      </section>

      <section className="rounded-xl border border-charcoal/10 bg-sand/30 p-5 sm:p-6" aria-labelledby="future-store-title">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/50">КЕЛЕСІ КЕЗЕҢ</p>
        <h2 id="future-store-title" className="mt-2 text-lg font-semibold">Сыйлықтар дүкені</h2>
        <p className="mt-2 text-sm leading-6 text-charcoal/65">Кейін Tek Coin-ге оқу материалдарын ашу мүмкіндігі қарастырылады. Қазір сатып алу, жұмсау немесе ақшаға айырбастау жоқ.</p>
      </section>
    </div>
  );
}
