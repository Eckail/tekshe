"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import TekCoinMark from "./TekCoinMark";
import { createProgressStore } from "../data/progressStore";
import { getWalletSnapshot, type WalletSnapshot } from "../data/tekCoins";

const walletStore = createProgressStore<WalletSnapshot>(getWalletSnapshot, {
  balance: 0,
  totalEarned: 0,
  transactions: [],
});

export default function WalletBalanceLink({ compact = false }: { compact?: boolean }) {
  const wallet = useSyncExternalStore(
    walletStore.subscribe,
    walletStore.getSnapshot,
    walletStore.getServerSnapshot
  );

  return (
    <Link
      href="/wallet"
      aria-label={`Әмиян: ${wallet.balance} Tek Coin`}
      className={`inline-flex min-h-11 items-center gap-2 rounded-lg border border-charcoal/10 bg-paper px-3 text-sm font-semibold text-charcoal transition-colors hover:border-terracotta/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${compact ? "px-2.5" : ""}`}
    >
      <TekCoinMark className="h-6 w-6 text-[11px]" />
      <span>{new Intl.NumberFormat("kk-KZ").format(wallet.balance)}</span>
      {!compact && <span className="hidden text-charcoal/60 sm:inline">Tek Coin</span>}
    </Link>
  );
}
