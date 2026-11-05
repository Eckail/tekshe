"use client";

import { useState } from "react";
import { pinyinData, pinyinToneDescriptions } from "../data/pinyin";

const toneDescriptions = Object.fromEntries(
  pinyinToneDescriptions.map(({ toneNumber, description }) => [
    toneNumber,
    description,
  ])
);

export default function PinyinList() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
      <h2 className="mb-4 text-3xl font-bold">Pinyin & Tones</h2>

      <p className="mb-10 text-sm text-charcoal/60">
        Қытай тілінің дыбыстары мен үндерін үйрен.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {pinyinData.map((item) => {
          const isExpanded = expandedId === item.id;
          const detailId = `pinyin-detail-${item.id}`;

          return (
            <article
              key={item.id}
              className="border border-charcoal/20 p-6 transition-colors hover:bg-terracotta/10"
            >
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={detailId}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
              >
                <span className="mb-4 block text-4xl font-semibold">
                  {item.syllable}
                </span>

                <span className="block text-sm">{item.example}</span>

                <span className="mt-2 block text-xs text-charcoal/60">
                  {item.meaning}
                </span>
              </button>

              <div
                id={detailId}
                role="region"
                aria-label={`${item.syllable} туралы мәлімет`}
                hidden={!isExpanded}
                className="mt-6 border-t border-charcoal/20 pt-4 text-sm"
              >
                <p>Бастапқы дыбыс (声母): {item.initial}</p>
                <p>Соңғы дыбыс (韵母): {item.final}</p>
                <p>
                  Тон:
                  {item.tone === 5
                    ? " Жеңіл тон (轻声)"
                    : ` ${item.tone}-тон`}
                </p>

                <p className="mt-2 text-xs text-charcoal/60">
                  {toneDescriptions[item.tone]}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
