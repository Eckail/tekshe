
"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import PageHeading from "./PageHeading";
import {
  appSettingsStore,
  updateAppSettings,
} from "../data/appSettings";

function SettingSwitch({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        <p className="mt-1 text-xs leading-5 text-text-secondary">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-7 w-12 shrink-0 overflow-hidden rounded-full transition-colors",
          checked ? "bg-blue" : "bg-border-soft",
        ].join(" ")}
      >
        <span
          className={[
            "absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out",
           checked ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export default function NotificationSettings() {
  const settings = useSyncExternalStore(
    appSettingsStore.subscribe,
    appSettingsStore.getSnapshot,
    appSettingsStore.getServerSnapshot
  );

  return (
    <div className="space-y-7 pb-6">
      <Link
  href="/profile"
        className="inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-blue-dark transition hover:opacity-75"
      >
        <span aria-hidden="true">←</span>
       Профиль
      </Link>

      <PageHeading
        eyebrow="БАПТАУЛАР"
        title="Хабарландырулар"
        description="Оқу әдеттері мен марапаттарға қатысты хабарландыру қалауларын басқарыңыз."
      />

      <section className="space-y-6 rounded-card border border-border-soft bg-card p-5 shadow-card sm:p-6">
        <div>
          <h2 className="text-base font-bold text-text-primary">
            Күнделікті оқу
          </h2>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            Күн сайын сабақ оқуды еске түсіруге арналған уақытты таңдаңыз.
          </p>
        </div>

        <SettingSwitch
          checked={settings.dailyReminderEnabled}
          label="Күнделікті еске салу"
          description="Оқу уақыты келгенде еске салу параметрін қосу."
          onChange={(value) =>
            updateAppSettings({ dailyReminderEnabled: value })
          }
        />

        <div className="border-t border-border-soft" />

        <div className="space-y-2">
          <label
            htmlFor="daily-reminder-time"
            className="text-sm font-semibold text-text-primary"
          >
            Еске салу уақыты
          </label>

          <input
            id="daily-reminder-time"
            type="time"
            value={settings.dailyReminderTime}
            disabled={!settings.dailyReminderEnabled}
            onChange={(event) =>
              updateAppSettings({
                dailyReminderTime: event.target.value,
              })
            }
            className="min-h-12 w-full rounded-control border border-border-soft bg-card-soft px-4 text-sm text-text-primary outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10 disabled:cursor-not-allowed disabled:opacity-40"
          />

          <p className="text-xs text-text-secondary">
            Уақыт құрылғыңыздың жергілікті уақытымен көрсетіледі.
          </p>
        </div>

        <div className="border-t border-border-soft" />

        <SettingSwitch
          checked={settings.streakWarningEnabled}
          label="Үздіксіз оқу туралы ескерту"
          description="Оқу тізбегін сақтауға арналған ескерту қалауы."
          onChange={(value) =>
            updateAppSettings({ streakWarningEnabled: value })
          }
        />
      </section>

      <section className="space-y-5 rounded-card border border-border-soft bg-card p-5 shadow-card sm:p-6">
        <div>
          <h2 className="text-base font-bold text-text-primary">
            Tek Coin
          </h2>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            Виртуалды монеталарға қатысты хабарландыру қалауы.
          </p>
        </div>

        <SettingSwitch
          checked={settings.coinNotificationsEnabled}
          label="Монета хабарландырулары"
          description="Tek Coin сыйақылары мен операциялары туралы хабарландыруды қосу қалауы."
          onChange={(value) =>
            updateAppSettings({ coinNotificationsEnabled: value })
          }
        />
      </section>

      <aside className="rounded-secondary border border-border-soft bg-card-soft p-4">
        <p className="text-sm font-semibold text-text-primary">
          Қазіргі мүмкіндік шектеулері
        </p>
        <p className="mt-1 text-xs leading-5 text-text-secondary">
          Бұл параметрлер осы құрылғыда сақталады. Нақты push-хабарландырулар
          мен фондық еске салулар серверлік хабарландыру жүйесі қосылғаннан
          кейін жұмыс істейді.
        </p>
      </aside>
    </div>
  );
}
