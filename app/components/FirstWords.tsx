"use client";

import { useState } from "react";

const vocabulary = [
  {
    category: "Сәлемдесу және қарым-қатынас",
    words: [
      {
        hanzi: "你好",
        pinyin: "nǐ hǎo",
        meaning: "сәлем",
        example: "你好！",
        translation: "Сәлем!",
      },
      {
        hanzi: "再见",
        pinyin: "zài jiàn",
        meaning: "сау бол",
        example: "明天再见。",
        translation: "Ертең кездескенше.",
      },
      {
        hanzi: "谢谢",
        pinyin: "xiè xie",
        meaning: "рақмет",
        example: "谢谢你！",
        translation: "Саған рақмет!",
      },
      {
        hanzi: "不客气",
        pinyin: "bú kè qi",
        meaning: "оқасы жоқ",
        example: "不客气！",
        translation: "Оқасы жоқ!",
      },
    ],
  },
  {
    category: "Адамдар мен отбасы",
    words: [
      {
        hanzi: "我",
        pinyin: "wǒ",
        meaning: "мен",
        example: "我是学生。",
        translation: "Мен студентпін.",
      },
      {
        hanzi: "你",
        pinyin: "nǐ",
        meaning: "сен",
        example: "你好吗？",
        translation: "Қалың қалай?",
      },
      {
        hanzi: "他",
        pinyin: "tā",
        meaning: "ол (ер адам)",
        example: "他是老师。",
        translation: "Ол мұғалім.",
      },
      {
        hanzi: "妈妈",
        pinyin: "mā ma",
        meaning: "ана",
        example: "妈妈很好。",
        translation: "Анам жақсы.",
      },
    ],
  },
  {
    category: "Күнделікті өмір",
    words: [
      {
        hanzi: "水",
        pinyin: "shuǐ",
        meaning: "су",
        example: "我要水。",
        translation: "Маған су керек.",
      },
      {
        hanzi: "饭",
        pinyin: "fàn",
        meaning: "тамақ; күріш",
        example: "我吃饭。",
        translation: "Мен тамақ ішемін.",
      },
      {
        hanzi: "书",
        pinyin: "shū",
        meaning: "кітап",
        example: "这是我的书。",
        translation: "Бұл менің кітабым.",
      },
      {
        hanzi: "学校",
        pinyin: "xué xiào",
        meaning: "мектеп",
        example: "我去学校。",
        translation: "Мен мектепке барамын.",
      },
    ],
  },
];

export default function FirstWords() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [revealed, setRevealed] = useState<string[]>([]);

  const currentWords = vocabulary[activeCategory].words;

  function toggleReveal(hanzi: string) {
    setRevealed((previous) =>
      previous.includes(hanzi)
        ? previous.filter((word) => word !== hanzi)
        : [...previous, hanzi]
    );
  }

  // 使用汉字进行中文语音合成，不使用拼音
  function speak(hanzi: string) {
    if (!("speechSynthesis" in window)) {
      alert("Бұл браузер дыбыстауды қолдамайды.");
      return;
    }

    // 停止之前的播放
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(hanzi);

    // 指定普通话
    utterance.lang = "zh-CN";

    // 调整语速
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }

  return (
    <section
      id="first-words"
      className="border-t border-[#242321]/20 px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <div>
          <p className="text-xs tracking-[0.25em] text-[#B85F3D]">
            04 / СӨЗДІК ҚОР
          </p>

          <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
            Алғашқы сөздер
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#242321]/65">
            Бұл бөлімде күнделікті өмірде жиі қолданылатын қытай сөздерін
            үйренесің. Әр сөздің иероглифін, пиньинь жазылуын және
            қазақша мағынасын қарастыр. Дыбыстап тыңдап, мысал сөйлемдерді
            оқып көр.
          </p>
        </div>

        {/* Сөздік санаттары */}
        <div className="mt-12 flex flex-wrap gap-3">
          {vocabulary.map((category, index) => (
            <button
              key={category.category}
              onClick={() => setActiveCategory(index)}
              className={`border px-5 py-3 text-sm transition ${
                activeCategory === index
                  ? "border-[#B85F3D] bg-[#B85F3D] text-white"
                  : "border-[#242321]/20 hover:border-[#B85F3D]"
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Сөз карточкалары */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {currentWords.map((word, index) => {
            const isRevealed = revealed.includes(word.hanzi);

            return (
              <div
                key={word.hanzi}
                className="border border-[#242321]/20 p-6 transition hover:border-[#B85F3D]/60"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs tracking-widest text-[#B85F3D]">
                    WORD / {String(index + 1).padStart(2, "0")}
                  </span>

                  <button
                    onClick={() => speak(word.hanzi)}
                    className="border border-[#242321]/20 px-3 py-2 text-sm transition hover:border-[#B85F3D] hover:text-[#B85F3D]"
                    aria-label={`听取${word.hanzi}的发音`}
                  >
                    🔊 Тыңдау
                  </button>
                </div>

                <div className="mt-8">
                  <p className="text-5xl font-semibold">{word.hanzi}</p>

                  <p className="mt-3 text-lg tracking-wide text-[#B85F3D]">
                    {word.pinyin}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#242321]/10 pt-5">
                  <button
                    onClick={() => toggleReveal(word.hanzi)}
                    className="text-sm font-medium text-[#B85F3D]"
                  >
                    {isRevealed
                      ? "Мағынасын жасыру −"
                      : "Мағынасын көрсету +"}
                  </button>

                  {isRevealed && (
                    <div className="mt-4">
                      <p className="text-xl font-semibold">
                        {word.meaning}
                      </p>

                      <p className="mt-5 text-sm text-[#242321]/50">
                        Мысал сөйлем
                      </p>

                      <p className="mt-2 text-xl">{word.example}</p>

                      <p className="mt-2 text-sm text-[#242321]/65">
                        {word.translation}
                      </p>

                      <button
                        onClick={() => speak(word.example)}
                        className="mt-4 border border-[#242321]/20 px-3 py-2 text-sm transition hover:border-[#B85F3D] hover:text-[#B85F3D]"
                      >
                        🔊 Сөйлемді тыңдау
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Оқу нұсқаулығы */}
        <div className="mt-12 border-l-2 border-[#B85F3D] bg-[#242321]/5 p-6">
          <h3 className="text-lg font-semibold">Оқу тәсілі</h3>

          <p className="mt-3 text-sm leading-7 text-[#242321]/70">
            Алдымен иероглифке қара. Содан кейін пиньинь бойынша
            дыбысталуын тыңда. Қазақша мағынасын есіңе түсіріп көр.
            Соңында мысал сөйлемді дауыстап оқы.
          </p>
        </div>
      </div>
    </section>
  );
}