"use client";

import Link from "next/link";
import PageHeading from "./PageHeading";
import { useTheme, type ThemePreference } from "./ThemeProvider";

const themeOptions: {
  value: ThemePreference;
  title: string;
  description: string;
  symbol: string;
}[] = [
  {
    value: "light",
    title: "Жарық",
    description: "Ашық және таза көрініс",
    symbol: "☀",
  },
  {
    value: "dark",
    title: "Қараңғы",
    description: "Көзге жайлы қараңғы көрініс",
    symbol: "☾",
  },
  {
    value: "system",
    title: "Жүйелік",
    description: "Құрылғы тақырыбын автоматты қолдану",
    symbol: "◐",
  },
];

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

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
        title="Көрініс және тақырып"
        description="Tekshe қолданбасының түс режимін таңдаңыз."
      />

      <section className="space-y-3 rounded-card border border-border-soft bg-card p-5 shadow-card sm:p-6">
        <div>
          <h2 className="text-base font-bold text-text-primary">
            Түс режимі
          </h2>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            Таңдалған режим осы құрылғыда сақталады.
          </p>
        </div>

        <div className="grid gap-3">
          {themeOptions.map((option) => {
            const selected = theme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setTheme(option.value)}
                className={[
                  "flex min-h-[76px] items-center gap-3 rounded-secondary border p-4 text-left transition",
                  selected
                    ? "border-blue bg-blue/10"
                    : "border-border-soft bg-card-soft hover:border-blue/40",
                ].join(" ")}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-blue/10 text-xl text-blue-dark">
                  {option.symbol}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-text-primary">
                    {option.title}
                  </span>
                  <span className="mt-1 block text-xs text-text-secondary">
                    {option.description}
                  </span>
                </span>

                <span
                  className={[
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    selected
                      ? "border-blue bg-blue text-white"
                      : "border-border-soft bg-card",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {selected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="rounded-secondary border border-border-soft bg-card-soft p-4">
        <p className="text-xs leading-5 text-text-secondary">
          Қаріп өлшемін өзгерту әзірге қолжетімді емес. Бұл мүмкіндік кейінгі
          интерфейс жаңартуында қарастырылады.
        </p>
      </aside>
    </div>
  );
}
