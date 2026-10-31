"use client";
import { useState } from "react";
import { pinyinData } from "../data/pinyin";
const toneDescriptions: Record<number, string> = {
  1: "Бірінші тон: жоғары және бірқалыпты айтылады.",
  2: "Екінші тон: дауыс төменнен жоғары көтеріледі.",
  3: "Үшінші тон: дауыс төмен түсіп, қайта көтеріледі.",
  4: "Төртінші тон: дауыс жоғарыдан төмен күрт түседі.",
  5: "Жеңіл тон: қысқа әрі жеңіл айтылады.",
};


export default function PinyinList() {
    const [expandedId, setExpandedId] = useState<number | null>(null);
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
      <h2 className="mb-4 text-3xl font-bold">
        Pinyin & Tones
      </h2>

      <p className="mb-10 text-sm text-[#242321]/60">
        Қытай тілінің дыбыстары мен үндерін үйрен.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {pinyinData.map((item) => (

          <div
  key={item.id}
  onClick={() =>
    setExpandedId(expandedId === item.id ? null : item.id)
  }
  className="cursor-pointer border border-[#242321]/20 p-6 transition-colors hover:bg-[#B85F3D]/10"
>
            <h3 className="mb-4 text-4xl font-semibold">
              {item.syllable}
            </h3>

            <p className="text-sm">
              {item.example}
            </p>

            <p className="mt-2 text-xs text-[#242321]/60">
              {item.meaning}
            </p>

{expandedId === item.id && (
  <div className="mt-6 border-t border-[#242321]/20 pt-4 text-sm">
    <p>Бастапқы дыбыс (声母): {item.initial}</p>
    <p>Соңғы дыбыс (韵母): {item.final}</p>
    <p>
      Тон:
      {item.tone === 5
        ? " Жеңіл тон (轻声)"
        : ` ${item.tone}-тон`}
    </p>

<p className="mt-2 text-xs text-[#242321]/60">
  {toneDescriptions[item.tone]}
</p>

  </div>
)}

          </div>
        ))}
      </div>
    </section>
  );
}