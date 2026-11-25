
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

export default function WalletBalanceLink({
  compact = false,
}: {
  compact?: boolean;
}) {
  const wallet = useSyncExternalStore(
    walletStore.subscribe,
    walletStore.getSnapshot,
    walletStore.getServerSnapshot,
  );

  return (
    <Link
      href="/wallet"
      aria-label={`Әмиян: ${wallet.balance} Tek Coin`}
      className={[
        "inline-flex min-h-11 items-center gap-2 rounded-2xl border",
        "border-border-soft bg-card px-3 text-sm font-semibold text-text-primary",
        "shadow-card transition-all duration-200 active:scale-[0.97]",
        "hover:border-blue/40 hover:bg-card-soft hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue",
        compact ? "px-2.5" : "",
      ].join(" ")}
    >
      <TekCoinMark className="h-6 w-6 text-[11px]" />

      <span>
        {new Intl.NumberFormat("kk-KZ").format(wallet.balance)}
      </span>

      {!compact && (
        <span className="hidden text-text-secondary sm:inline">
          Tek Coin
        </span>
      )}
    </Link>
  );
}
