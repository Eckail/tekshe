export type TekCoinSource =
  | "lesson"
  | "quest"
  | "milestone"
  | "achievement"
  | "streak";

export type TekCoinTransaction = {
  id: string;
  sourceActivityId: string;
  type: "earn" | "spend";
  source: TekCoinSource;
  amount: number;
  description: string;
  createdAt: string;
};

type WalletV1 = {
  version: 1;
  transactions: TekCoinTransaction[];
};

export type WalletSnapshot = {
  balance: number;
  totalEarned: number;
  transactions: TekCoinTransaction[];
};

export const TEK_COIN_REWARDS = {
  lesson: 20,
  dailyQuest: 15,
  milestone: 50,
  achievement: 30,
  streak: 10,
} as const;

const STORAGE_KEY = "tekshe-wallet:v1";
const emptyWallet: WalletV1 = { version: 1, transactions: [] };
function isSource(value: unknown): value is TekCoinSource {
  return (
    value === "lesson" ||
    value === "quest" ||
    value === "milestone" ||
    value === "achievement" ||
    value === "streak"
  );
}

function isTransaction(value: unknown): value is TekCoinTransaction {
  if (!value || typeof value !== "object") return false;
  const transaction = value as Partial<TekCoinTransaction>;
  return (
    typeof transaction.id === "string" &&
    transaction.id.length > 0 &&
    typeof transaction.sourceActivityId === "string" &&
    transaction.sourceActivityId.length > 0 &&
    (transaction.type === "earn" || transaction.type === "spend") &&
    isSource(transaction.source) &&
    Number.isSafeInteger(transaction.amount) &&
    Number(transaction.amount) > 0 &&
    typeof transaction.description === "string" &&
    transaction.description.length > 0 &&
    typeof transaction.createdAt === "string" &&
    Number.isFinite(Date.parse(transaction.createdAt))
  );
}

function readWallet(): { value: WalletV1; writable: boolean } {
  if (typeof window === "undefined") return { value: emptyWallet, writable: false };

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) return { value: emptyWallet, writable: true };

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") {
      return { value: emptyWallet, writable: false };
    }

    const candidate = parsed as Partial<WalletV1>;
    if (
      candidate.version !== 1 ||
      !Array.isArray(candidate.transactions) ||
      !candidate.transactions.every(isTransaction)
    ) {
      // Preserve unknown or damaged storage rather than overwriting it.
      return { value: emptyWallet, writable: false };
    }

    return { value: candidate as WalletV1, writable: true };
  } catch {
    return { value: emptyWallet, writable: false };
  }
}

function summarize(wallet: WalletV1): WalletSnapshot {
  const transactions = [...wallet.transactions].sort(
    (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
  );
  const balance = transactions.reduce(
    (total, transaction) =>
      total + (transaction.type === "earn" ? transaction.amount : -transaction.amount),
    0
  );
  const totalEarned = transactions
    .filter((transaction) => transaction.type === "earn")
    .reduce((total, transaction) => total + transaction.amount, 0);

  return { balance, totalEarned, transactions };
}

export function getWalletSnapshot(): WalletSnapshot {
  return summarize(readWallet().value);
}

export function getTekCoinTransactions(): TekCoinTransaction[] {
  return getWalletSnapshot().transactions;
}

export function getTekCoinBalance(): number {
  return getWalletSnapshot().balance;
}

export function getTotalTekCoinsEarned(): number {
  return getWalletSnapshot().totalEarned;
}

export function hasTekCoinTransaction(sourceActivityId: string): boolean {
  return readWallet().value.transactions.some(
    (transaction) => transaction.sourceActivityId === sourceActivityId
  );
}

export function awardTekCoins(input: {
  sourceActivityId: string;
  source: TekCoinSource;
  amount: number;
  description: string;
  createdAt?: string;
}): boolean {
  const sourceActivityId = input.sourceActivityId.trim();
  if (
    typeof window === "undefined" ||
    !sourceActivityId ||
    sourceActivityId.length > 180 ||
    !isSource(input.source) ||
    !Number.isSafeInteger(input.amount) ||
    input.amount <= 0 ||
    !input.description.trim()
  ) {
    return false;
  }

  const current = readWallet();
  if (!current.writable) return false;
  if (current.value.transactions.some((item) => item.sourceActivityId === sourceActivityId)) {
    return false;
  }

  const createdAt = input.createdAt ?? new Date().toISOString();
  if (!Number.isFinite(Date.parse(createdAt))) return false;

  const transaction: TekCoinTransaction = {
    id: `tek:${encodeURIComponent(sourceActivityId)}`,
    sourceActivityId,
    type: "earn",
    source: input.source,
    amount: input.amount,
    description: input.description.trim(),
    createdAt,
  };

  try {
    // Re-read immediately before writing so a second tab's prior write is seen.
    const latest = readWallet();
    if (
      !latest.writable ||
      latest.value.transactions.some((item) => item.sourceActivityId === sourceActivityId)
    ) {
      return false;
    }
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        transactions: [...latest.value.transactions, transaction],
      } satisfies WalletV1)
    );
  } catch {
    return false;
  }

  window.dispatchEvent(new Event("tekshe-progress-updated"));
  return true;
}

export function awardLessonCoins(curriculumId: string, lessonId: string): boolean {
  return awardTekCoins({
    sourceActivityId: `lesson:${curriculumId}:${lessonId}`,
    source: "lesson",
    amount: TEK_COIN_REWARDS.lesson,
    description: "Сабақ аяқталды",
  });
}

export function awardCourseMilestoneCoins(curriculumId: string): boolean {
  return awardTekCoins({
    sourceActivityId: `milestone:${curriculumId}:complete`,
    source: "milestone",
    amount: TEK_COIN_REWARDS.milestone,
    description: "Курс межесіне жеттіңіз",
  });
}
