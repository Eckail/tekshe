
"use client";

import { useState } from "react";
import { completeCourse } from "../data/courseProgress";

const questions = [
  {
    id: 1,
    prompt: "Мен су ішемін。",
    answer: "我喝水。",
    pinyin: "Wǒ hē shuǐ.",
    explanation: "我 — мен, 喝 — ішу, 水 — су.",
    options: ["我喝水。", "喝我水。", "水我喝。", "我水喝。"],
  },
  {
    id: 2,
    prompt: "Мен тамақ ішемін。",
    answer: "我吃饭。",
    pinyin: "Wǒ chī fàn.",
    explanation: "吃 — жеу, 饭 — тамақ.",
    options: ["饭吃我。", "我吃饭。", "吃饭我。", "我饭吃。"],
  },
  {
    id: 3,
    prompt: "Мен кітап оқимын。",
    answer: "我看书。",
    pinyin: "Wǒ kàn shū.",
    explanation: "看 — оқу немесе қарау, 书 — кітап.",
    options: ["我书看。", "书我看。", "我看书。", "看我书。"],
  },
  {
    id: 4,
    prompt: "Мен студентпін。",
    answer: "我是学生。",
    pinyin: "Wǒ shì xuésheng.",
    explanation: "是 сөзі бастауыш пен зат есімді байланыстырады.",
    options: ["我学生是。", "学生我是。", "我是学生。", "是我学生。"],
  },
  {
    id: 5,
    prompt: "Ол мұғалім。",
    answer: "他是老师。",
    pinyin: "Tā shì lǎoshī.",
    explanation: "他 — ол, 老师 — мұғалім.",
    options: ["他老师是。", "他是老师。", "是他老师。", "老师他是。"],
  },
  {
    id: 6,
    prompt: "Мен шай ішпеймін。",
    answer: "我不喝茶。",
    pinyin: "Wǒ bù hē chá.",
    explanation: "不 болымсыздық сөзі етістіктің алдына қойылады.",
    options: ["我喝不茶。", "不我喝茶。", "我不喝茶。", "我茶不喝。"],
  },
  {
    id: 7,
    prompt: "Мен мұғалім емеспін。",
    answer: "我不是老师。",
    pinyin: "Wǒ bú shì lǎoshī.",
    explanation: "不是 — болымсыз判断 құрылымы.",
    options: ["我不老师是。", "我不是老师。", "不是我老师。", "老师我不是。"],
  },
  {
    id: 8,
    prompt: "Сен студентсің бе?",
    answer: "你是学生吗？",
    pinyin: "Nǐ shì xuésheng ma?",
    explanation: "吗 сұраулық шылауы сөйлемнің соңына қойылады.",
    options: ["你吗是学生？", "吗你是学生？", "你是学生吗？", "你学生是吗？"],
  },
  {
    id: 9,
    prompt: "Қалың қалай?",
    answer: "你好吗？",
    pinyin: "Nǐ hǎo ma?",
    explanation: "吗 сөйлемді жалпы сұраққа айналдырады.",
    options: ["好吗你？", "你好吗？", "你吗好？", "吗你好？"],
  },
  {
    id: 10,
    prompt: "Бұл менің кітабым。",
    answer: "这是我的书。",
    pinyin: "Zhè shì wǒ de shū.",
    explanation: "这 — бұл, 我的 — менің, 书 — кітап.",
    options: ["这是我的书。", "我的是这书。", "书这是我的。", "这是书我的。"],
  },
  {
    id: 11,
    prompt: "Мен мектепке барамын。",
    answer: "我去学校。",
    pinyin: "Wǒ qù xuéxiào.",
    explanation: "去 — бару, 学校 — мектеп.",
    options: ["学校我去。", "我学校去。", "去我学校。", "我去学校。"],
  },
  {
    id: 12,
    prompt: "Сен доссың。",
    answer: "你是朋友。",
    pinyin: "Nǐ shì péngyou.",
    explanation: "朋友 — дос. 是 сөзі сөйлемдегі екі бөлікті байланыстырады.",
    options: ["朋友你是。", "你朋友是。", "你是朋友。", "是你朋友。"],
  },
];

export default function SentenceQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);

  const question = questions[current];
  const isCorrect = selected === question.answer;

  function selectAnswer(answer: string) {
    if (selected !== null) return;

    setSelected(answer);

    if (answer === question.answer) {
      setScore((previous) => previous + 1);
    }
  }

  function nextQuestion() {
    if (current < questions.length - 1) {
      setCurrent((previous) => previous + 1);
      setSelected(null);
      return;
    }

    const finalScore = score + (isCorrect ? 1 : 0);

const didPass = finalScore >= 9;
setScore(finalScore);

    setPassed(didPass);
    setFinished(true);

    if (didPass) {
      completeCourse("simple-sentences");
    }
  }

  function restartQuiz() {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setPassed(false);
  }

  const progress =
    ((current + (selected !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <section
      id="sentence-quiz"
      className="border-t border-[#242321]/20 px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-xs tracking-[0.25em] text-[#B85F3D]">
          05 / БІЛІМДІ ТЕКСЕРУ
        </p>

        <h2 className="mt-5 text-3xl font-semibold md:text-5xl">
          Сөйлем құрастыру
        </h2>

        <p className="mt-4 text-sm leading-7 text-[#242321]/60">
          Қазақша сөйлемге сәйкес келетін дұрыс қытайша сөйлемді таңда.
          Келесі кезеңге өту үшін кемінде 9 сұраққа дұрыс жауап бер.
        </p>

        {!finished ? (
          <div className="mt-10">
            <div className="flex items-center justify-between text-sm">
              <span>
                Сұрақ {current + 1} / {questions.length}
              </span>
              <span>{score} дұрыс жауап</span>
            </div>

            <div className="mt-3 h-2 bg-[#242321]/10">
              <div
                className="h-full bg-[#B85F3D] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-10 border border-[#242321]/20 p-7 md:p-10">
              <p className="text-sm text-[#242321]/50">
                Қытай тіліне аудар:
              </p>

              <h3 className="mt-5 text-3xl font-semibold">
                {question.prompt}
              </h3>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {question.options.map((option) => {
                  const isAnswer = option === question.answer;
                  const isSelected = selected === option;

                  let style =
                    "border-[#242321]/20 hover:border-[#B85F3D]";

                  if (selected !== null && isAnswer) {
                    style = "border-green-700 bg-green-700/10";
                  } else if (isSelected && !isAnswer) {
                    style = "border-red-700 bg-red-700/10";
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => selectAnswer(option)}
                      disabled={selected !== null}
                      className={`border p-5 text-left transition ${style}`}
                    >
                      <span className="block text-2xl font-semibold">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div className="mt-6 border-t border-[#242321]/10 pt-5">
                  <p
                    className={`font-semibold ${
                      isCorrect ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isCorrect ? "Дұрыс жауап!" : "Қате жауап."}
                  </p>

                  <p className="mt-3 text-2xl font-semibold">
                    {question.answer}
                  </p>

                  <p className="mt-2 text-sm text-[#B85F3D]">
                    {question.pinyin}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-[#242321]/65">
                    {question.explanation}
                  </p>

                  <button
                    onClick={nextQuestion}
                    className="mt-6 w-full bg-[#242321] px-6 py-4 text-sm text-white transition hover:bg-[#B85F3D]"
                  >
                    {current === questions.length - 1
                      ? "Нәтижені көру"
                      : "Келесі сұрақ →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-10 border border-[#242321]/20 p-8 text-center md:p-12">
            <p className="text-xs tracking-[0.25em] text-[#B85F3D]">
              TEST RESULTS
            </p>

            <h3 className="mt-6 text-5xl font-semibold">
              {score} / 12
            </h3>

            {passed ? (
              <>
                <p className="mt-6 text-2xl font-semibold">
                  Құттықтаймыз!
                </p>

                <p className="mt-3 text-sm leading-7 text-[#242321]/65">
                  Сен негізгі сөйлем құрылымдарын меңгердің.
                  Бесінші кезең аяқталды!
                </p>

                <p className="mt-5 text-sm font-semibold text-green-700">
                  05-кезең аяқталды ✓
                </p>
              </>
            ) : (
              <>
                <p className="mt-6 text-2xl font-semibold">
                  Тағы бір рет байқап көр!
                </p>

                <p className="mt-3 text-sm leading-7 text-[#242321]/65">
                  Келесі кезеңге өту үшін кемінде 9 дұрыс жауап қажет.
                  Сабақты қайталап, қайта сынақтан өт.
                </p>
              </>
            )}

            <button
              onClick={restartQuiz}
              className="mt-8 bg-[#242321] px-8 py-4 text-sm text-white transition hover:bg-[#B85F3D]"
            >
              Қайта бастау
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
