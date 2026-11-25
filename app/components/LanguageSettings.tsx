"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import PageHeading from "./PageHeading";
import {
  appSettingsStore,
  updateAppSettings,
  type AppLanguage,
} from "../data/appSettings";

const languages: { value: AppLanguage; label: string; native: string }[] = [
  { value: "kk", label: "Қазақша", native: "Қазақ тілі" },
  { value: "ru", label: "Русский", native: "Русский язык" },
  { value: "en", label: "English", native: "English" },
  { value: "zh", label: "中文", native: "中文" },
];

function LanguageSelect({
  id,
  label,
  description,
  value,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  value: AppLanguage;
  onChange: (value: AppLanguage) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-text-primary"
      >
        {label}
      </label>
      <p className="mt-1 text-xs leading-5 text-text-secondary">
        {description}
      </p>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as AppLanguage)}
        className="mt-3 min-h-12 w-full rounded-control border border-border-soft bg-card-soft px-4 text-sm text-text-primary outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
      >
        {languages.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function LanguageSettings() {
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
        title="Тіл және оқу қалаулары"
        description="Интерфейс пен қытай тілін үйрену кезіндегі түсіндіру тілін таңдаңыз."
      />

      <section className="space-y-6 rounded-card border border-border-soft bg-card p-5 shadow-card sm:p-6">
        <LanguageSelect
          id="app-language"
          label="Интерфейс тілі"
          description="Қолданба мәзірлері мен батырмаларының тілі."
          value={settings.appLanguage}
          onChange={(value) => updateAppSettings({ appLanguage: value })}
        />

        <div className="border-t border-border-soft" />

        <LanguageSelect
          id="native-language"
          label="Ана тілі / түсіндіру тілі"
          description="Жаңа сөздер мен грамматиканы түсіндіру үшін қолданылатын тіл."
          value={settings.nativeLanguage}
          onChange={(value) => updateAppSettings({ nativeLanguage: value })}
        />

        <div className="border-t border-border-soft" />

        <div className="flex items-center justify-between gap-4">
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-text-primary">
              Пиньиньді көрсету
            </span>
            <span className="mt-1 block text-xs leading-5 text-text-secondary">
              Қытайша мысалдарда пиньиньді әдепкіде көрсету.
            </span>
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={settings.showPinyin}
            aria-label="Пиньиньді көрсету"
            onClick={() =>
              updateAppSettings({ showPinyin: !settings.showPinyin })
            }
            className={[
             "relative h-7 w-12 shrink-0 overflow-hidden rounded-full transition-colors",
              settings.showPinyin ? "bg-blue" : "bg-border-soft",
            ].join(" ")}
          >
            <span
              className={[
                "absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out",
                settings.showPinyin ? "translate-x-5" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </div>
      </section>

      <aside className="rounded-secondary border border-border-soft bg-card-soft p-4">
        <p className="text-xs leading-5 text-text-secondary">
          Таңдаулар осы құрылғыда сақталады. Интерфейстің толық төрт тілдегі
          аудармасы және пиньинь параметрінің барлық сабақтарға таралуы
          келесі интеграция кезеңінде орындалады.
        </p>
      </aside>
    </div>
  );
}
