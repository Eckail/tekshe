
"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import PageHeading from "./PageHeading";
import AppIcon from "./AppIcon";
import { appSettingsStore } from "../data/appSettings";
import { useTheme } from "./ThemeProvider";

const languageNames = {
  kk: "Қазақша",
  ru: "Русский",
  en: "English",
  zh: "中文",
};

const themeNames = {
  light: "Жарық",
  dark: "Қараңғы",
  system: "Жүйелік",
};

function SettingsLink({
  href,
  title,
  description,
  value,
  symbol,
}: {
  href: string;
  title: string;
  description: string;
  value?: string;
  symbol: string;
}) {
  return (
    <Link
  href={href}
  replace
  className="group flex min-h-[76px] items-center gap-3 rounded-secondary border border-border-soft bg-card p-4 shadow-card transition hover:border-blue/40 hover:bg-card-soft active:scale-[0.99]"
>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-border-soft bg-blue/10 text-xl text-blue-dark">
        {symbol}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-text-primary">
          {title}
        </span>
        <span className="mt-1 block text-xs text-text-secondary">
          {description}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-2">
        {value && (
          <span className="hidden text-xs text-text-secondary sm:inline">
            {value}
          </span>
        )}

        <AppIcon
          name="arrow"
          className="h-4 w-4 text-text-secondary transition group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

export default function SettingsHome() {
  const settings = useSyncExternalStore(
    appSettingsStore.subscribe,
    appSettingsStore.getSnapshot,
    appSettingsStore.getServerSnapshot
  );

  const { theme } = useTheme();

  return (
    <div className="space-y-7 pb-6">
      <Link
        href="/profile"
        className="inline-flex min-h-9 items-center gap-2 rounded-full px-2 text-sm font-semibold text-blue-dark transition hover:bg-card-soft"
      >
        <span aria-hidden="true">←</span>
        Профиль
      </Link>

      <PageHeading
        eyebrow="TEKSHE · SETTINGS"
        title="Баптаулар"
        description="Қолданбаның көрінісі мен оқу тәжірибесін өзіңізге бейімдеңіз."
      />

      <section className="space-y-3" aria-labelledby="preferences-heading">
        <div className="px-1">
          <h2
            id="preferences-heading"
            className="text-xs font-bold tracking-[0.14em] text-text-secondary"
          >
            ҚОЛДАНБА ПАРАМЕТРЛЕРІ
          </h2>
        </div>

        <SettingsLink
          href="/settings/appearance"
          title="Көрініс және тақырып"
          description="Жарық, қараңғы немесе жүйелік режим"
          value={themeNames[theme]}
          symbol="◐"
        />

        <SettingsLink
          href="/settings/language"
          title="Тіл және оқу қалаулары"
          description="Интерфейс тілі, түсіндіру тілі және пиньинь"
          value={languageNames[settings.appLanguage]}
          symbol="文"
        />

        <SettingsLink
          href="/settings/notifications"
          title="Хабарландырулар"
          description="Оқу еске салулары мен Tek Coin хабарландырулары"
          value={settings.dailyReminderEnabled ? "Қосулы" : "Өшірулі"}
          symbol="♧"
        />
      </section>

      <aside className="rounded-secondary border border-border-soft bg-card-soft p-4">
        <p className="text-sm font-semibold text-text-primary">
          Баптаулар бір жерде
        </p>

        <p className="mt-1 text-xs leading-5 text-text-secondary">
          Қолжетімді параметрлер осы бөлімде жиналады. Серверлік қызметтер
          қосылғанға дейін бұл бет тек құрылғыда сақталатын баптауларды
          басқарады.
        </p>
      </aside>
    </div>
  );
}
