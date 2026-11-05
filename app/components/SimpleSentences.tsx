
"use client";

const lessons = [
  {
    title: "1. Қарапайым сөйлем",
    structure: "主语 + 谓语 + 宾语",
    explanation:
      "Қытай тілінде қарапайым сөйлем көбіне бастауыш + баяндауыш + толықтауыш тәртібімен құрылады.",
    examples: [
      {
        hanzi: "我喝水。",
        pinyin: "Wǒ hē shuǐ.",
        translation: "Мен су ішемін.",
      },
      {
        hanzi: "我吃饭。",
        pinyin: "Wǒ chī fàn.",
        translation: "Мен тамақ ішемін.",
      },
      {
        hanzi: "我看书。",
        pinyin: "Wǒ kàn shū.",
        translation: "Мен кітап оқимын.",
      },
    ],
  },
  {
    title: "2. 是 — болу",
    structure: "主语 + 是 + зат есім",
    explanation:
      "是 сөзі адамды немесе затты сипаттайтын есім сөздерді байланыстырады. Қазақ тілінде көбіне «болу» мағынасын береді.",
    examples: [
      {
        hanzi: "我是学生。",
        pinyin: "Wǒ shì xuésheng.",
        translation: "Мен студентпін.",
      },
      {
        hanzi: "他是老师。",
        pinyin: "Tā shì lǎoshī.",
        translation: "Ол мұғалім.",
      },
      {
        hanzi: "你是朋友。",
        pinyin: "Nǐ shì péngyou.",
        translation: "Сен доссың.",
      },
    ],
  },
  {
    title: "3. 不 — болымсыздық",
    structure: "主语 + 不 + етістік",
    explanation:
      "不 сөзі етістіктің алдына қойылады. Ол іс-әрекеттің орындалмайтынын білдіреді.",
    examples: [
      {
        hanzi: "我不喝茶。",
        pinyin: "Wǒ bù hē chá.",
        translation: "Мен шай ішпеймін.",
      },
      {
        hanzi: "我不是老师。",
        pinyin: "Wǒ bú shì lǎoshī.",
        translation: "Мен мұғалім емеспін.",
      },
    ],
  },
  {
    title: "4. Сұраулы сөйлем",
    structure: "Сөйлем + 吗？",
    explanation:
      "吗 сұраулық шылауы сөйлемнің соңына қойылады. Ол иә немесе жоқ деп жауап беруге болатын сұрақ жасайды.",
    examples: [
      {
        hanzi: "你好吗？",
        pinyin: "Nǐ hǎo ma?",
        translation: "Қалың қалай?",
      },
      {
        hanzi: "你是学生吗？",
        pinyin: "Nǐ shì xuésheng ma?",
        translation: "Сен студентсің бе?",
      },
      {
        hanzi: "他是老师吗？",
        pinyin: "Tā shì lǎoshī ma?",
        translation: "Ол мұғалім бе?",
      },
    ],
  },
];

export default function SimpleSentences() {
  function speak(hanzi: string) {
    if (!("speechSynthesis" in window)) {
      alert("Бұл браузер дыбыстауды қолдамайды.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(hanzi);
    utterance.lang = "zh-CN";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }

  return (
    <section
      id="simple-sentences"
      className="border-t border-charcoal/20 px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-xs tracking-[0.25em] text-terracotta">
          05 / СӨЙЛЕМ ҚҰРАСТЫРУ
        </p>

        <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
          Алғашқы сөйлемдер
        </h2>

        <p className="mt-6 max-w-2xl text-base leading-8 text-charcoal/65">
          Бұл бөлімде қытай тіліндегі қарапайым сөйлемдердің құрылысын
          үйренесің. Сөздерді дұрыс ретпен орналастырып, өз ойыңды
          жеткізуді баста.
        </p>

        <div className="mt-12 space-y-8">
          {lessons.map((lesson, index) => (
            <article
              key={lesson.title}
              className="border border-charcoal/20 p-6 md:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs tracking-widest text-terracotta">
                  LESSON / 0{index + 1}
                </p>

                <span className="border border-charcoal/15 px-3 py-2 text-xs">
                  Қытай грамматикасы
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-semibold md:text-3xl">
                {lesson.title}
              </h3>

              <div className="mt-5 inline-block bg-charcoal/5 px-4 py-3">
                <p className="text-sm font-medium">
                  {lesson.structure}
                </p>
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-charcoal/65">
                {lesson.explanation}
              </p>

              <div className="mt-8 space-y-3">
                {lesson.examples.map((example) => (
                  <div
                    key={example.hanzi}
                    className="flex flex-col justify-between gap-4 border-t border-charcoal/10 py-5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="text-3xl font-semibold">
                        {example.hanzi}
                      </p>

                      <p className="mt-2 text-sm text-terracotta">
                        {example.pinyin}
                      </p>

                      <p className="mt-2 text-sm text-charcoal/65">
                        {example.translation}
                      </p>
                    </div>

                    <button
                      onClick={() => speak(example.hanzi)}
                      className="self-start border border-charcoal/20 px-4 py-3 text-sm transition hover:border-terracotta hover:text-terracotta sm:self-center"
                    >
                      🔊 Тыңдау
                    </button>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 border-l-2 border-terracotta bg-charcoal/5 p-6">
          <h3 className="text-lg font-semibold">
            Есте сақта
          </h3>

          <p className="mt-3 text-sm leading-7 text-charcoal/70">
            Қытай тілінде сөздердің орны өте маңызды. Алдымен сөйлемнің
            құрылысын түсін. Содан кейін сөздерді дұрыс ретпен қолданып,
            сөйлемді дауыстап оқы.
          </p>
        </div>
      </div>
    </section>
  );
}
