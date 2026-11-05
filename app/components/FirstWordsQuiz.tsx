
"use client";

import { useRef, useState } from "react";
import { completeCourse } from "../data/courseProgress";
import {
  calculateQuizXP,
  createLearningRecordId,
  saveQuizResult,
} from "../data/progress";
import { COURSE_COMPLETION_XP } from "../data/xp";

const questions = [
  {
    id: 1,
    meaning: "сәлем",
    answer: "你好",
    pinyin: "nǐ hǎo",
    options: [
      { hanzi: "你好", pinyin: "nǐ hǎo" },
      { hanzi: "再见", pinyin: "zài jiàn" },
      { hanzi: "谢谢", pinyin: "xiè xie" },
      { hanzi: "不客气", pinyin: "bú kè qi" },
    ],
  },
  {
    id: 2,
    meaning: "сау бол",
    answer: "再见",
    pinyin: "zài jiàn",
    options: [
      { hanzi: "妈妈", pinyin: "mā ma" },
      { hanzi: "再见", pinyin: "zài jiàn" },
      { hanzi: "你好", pinyin: "nǐ hǎo" },
      { hanzi: "谢谢", pinyin: "xiè xie" },
    ],
  },
  {
    id: 3,
    meaning: "рақмет",
    answer: "谢谢",
    pinyin: "xiè xie",
    options: [
      { hanzi: "不客气", pinyin: "bú kè qi" },
      { hanzi: "你好", pinyin: "nǐ hǎo" },
      { hanzi: "谢谢", pinyin: "xiè xie" },
      { hanzi: "再见", pinyin: "zài jiàn" },
    ],
  },
  {
    id: 4,
    meaning: "оқасы жоқ",
    answer: "不客气",
    pinyin: "bú kè qi",
    options: [
      { hanzi: "谢谢", pinyin: "xiè xie" },
      { hanzi: "不客气", pinyin: "bú kè qi" },
      { hanzi: "再见", pinyin: "zài jiàn" },
      { hanzi: "你好", pinyin: "nǐ hǎo" },
    ],
  },
  {
    id: 5,
    meaning: "мен",
    answer: "我",
    pinyin: "wǒ",
    options: [
      { hanzi: "你", pinyin: "nǐ" },
      { hanzi: "他", pinyin: "tā" },
      { hanzi: "我", pinyin: "wǒ" },
      { hanzi: "妈妈", pinyin: "mā ma" },
    ],
  },
  {
    id: 6,
    meaning: "сен",
    answer: "你",
    pinyin: "nǐ",
    options: [
      { hanzi: "我", pinyin: "wǒ" },
      { hanzi: "你", pinyin: "nǐ" },
      { hanzi: "他", pinyin: "tā" },
      { hanzi: "妈妈", pinyin: "mā ma" },
    ],
  },
  {
    id: 7,
    meaning: "ол (ер адам)",
    answer: "他",
    pinyin: "tā",
    options: [
      { hanzi: "妈妈", pinyin: "mā ma" },
      { hanzi: "我", pinyin: "wǒ" },
      { hanzi: "他", pinyin: "tā" },
      { hanzi: "你", pinyin: "nǐ" },
    ],
  },
  {
    id: 8,
    meaning: "ана",
    answer: "妈妈",
    pinyin: "mā ma",
    options: [
      { hanzi: "妈妈", pinyin: "mā ma" },
      { hanzi: "学校", pinyin: "xué xiào" },
      { hanzi: "他", pinyin: "tā" },
      { hanzi: "我", pinyin: "wǒ" },
    ],
  },
  {
    id: 9,
    meaning: "су",
    answer: "水",
    pinyin: "shuǐ",
    options: [
      { hanzi: "饭", pinyin: "fàn" },
      { hanzi: "书", pinyin: "shū" },
      { hanzi: "水", pinyin: "shuǐ" },
      { hanzi: "学校", pinyin: "xué xiào" },
    ],
  },
  {
    id: 10,
    meaning: "тамақ; күріш",
    answer: "饭",
    pinyin: "fàn",
    options: [
      { hanzi: "水", pinyin: "shuǐ" },
      { hanzi: "饭", pinyin: "fàn" },
      { hanzi: "书", pinyin: "shū" },
      { hanzi: "学校", pinyin: "xué xiào" },
    ],
  },
  {
    id: 11,
    meaning: "кітап",
    answer: "书",
    pinyin: "shū",
    options: [
      { hanzi: "学校", pinyin: "xué xiào" },
      { hanzi: "饭", pinyin: "fàn" },
      { hanzi: "水", pinyin: "shuǐ" },
      { hanzi: "书", pinyin: "shū" },
    ],
  },
  {
    id: 12,
    meaning: "мектеп",
    answer: "学校",
    pinyin: "xué xiào",
    options: [
      { hanzi: "书", pinyin: "shū" },
      { hanzi: "妈妈", pinyin: "mā ma" },
      { hanzi: "学校", pinyin: "xué xiào" },
      { hanzi: "饭", pinyin: "fàn" },
    ],
  },
];

export default function FirstWordsQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);
  const [courseXPRewarded, setCourseXPRewarded] = useState(false);
  const recordSaved = useRef(false);
  const attemptId = useRef<string | null>(null);

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
    if (current + 1 < questions.length) {
      setCurrent((previous) => previous + 1);
      setSelected(null);
      return;
    }

    if (recordSaved.current) return;
    recordSaved.current = true;
    const currentAttemptId =
      attemptId.current ?? createLearningRecordId();
    attemptId.current = currentAttemptId;

    const finalScore = score;
    const didPass = finalScore >= 9;

    setPassed(didPass);
    setFinished(true);

    saveQuizResult({
      id: currentAttemptId,
      mode: "quiz",
      score: finalScore,
      total: questions.length,
    });

    if (didPass) {
      setCourseXPRewarded(completeCourse("first-words"));
    } else {
      setCourseXPRewarded(false);
    }
  }

  function restartQuiz() {
    recordSaved.current = false;
    attemptId.current = null;
    setCourseXPRewarded(false);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setPassed(false);
  }

  const progress = ((current + (selected ? 1 : 0)) / questions.length) * 100;

  return (
    <section
      id="first-words-quiz"
      className="border-t border-charcoal/20 px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-xs tracking-[0.25em] text-terracotta">
          04 / БІЛІМДІ ТЕКСЕРУ
        </p>

        <h2 className="mt-5 text-3xl font-semibold md:text-5xl">
          Сөздік сынағы
        </h2>

        <p className="mt-4 text-sm leading-7 text-charcoal/60">
          Қазақша мағынаға сәйкес келетін қытай сөзін таңда.
          Келесі кезеңге өту үшін кемінде 9 сұраққа дұрыс жауап беру керек.
        </p>

        {!finished ? (
          <div className="mt-10">
            <div className="flex items-center justify-between text-sm">
              <span>Сұрақ {current + 1} / {questions.length}</span>
              <span>{score} дұрыс жауап</span>
            </div>

            <div className="mt-3 h-2 bg-charcoal/10">
              <div
                className="h-full bg-terracotta transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-10 border border-charcoal/20 p-7 md:p-10">
              <p className="text-sm text-charcoal/50">
                Мына сөздің қытайша аудармасын тап:
              </p>

              <h3 className="mt-5 text-4xl font-semibold md:text-5xl">
                {question.meaning}
              </h3>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {question.options.map((option) => {
                  const isAnswer = option.hanzi === question.answer;
                  const isSelected = selected === option.hanzi;

                  let style =
                    "border-charcoal/20 hover:border-terracotta";

                  if (selected !== null && isAnswer) {
                    style = "border-green-700 bg-green-700/10";
                  } else if (isSelected && !isAnswer) {
                    style = "border-red-700 bg-red-700/10";
                  }

                  return (
                    <button
                      key={option.hanzi}
                      onClick={() => selectAnswer(option.hanzi)}
                      disabled={selected !== null}
                      className={`border p-5 text-left transition ${style}`}
                    >
                      <span className="block text-3xl font-semibold">
                        {option.hanzi}
                      </span>
                      <span className="mt-2 block text-sm text-terracotta">
                        {option.pinyin}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div className="mt-6 border-t border-charcoal/10 pt-5">
                  <p className={`font-semibold ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}>
                    {isCorrect ? "Дұрыс жауап!" : "Қате жауап."}
                  </p>

                  <p className="mt-2 text-sm text-charcoal/70">
                    Дұрыс жауап: {question.answer} ({question.pinyin})
                  </p>

                  <button
                    onClick={nextQuestion}
                    className="mt-6 w-full bg-charcoal px-6 py-4 text-sm text-white transition hover:bg-terracotta"
                  >
                    {current + 1 === questions.length
                      ? "Нәтижені көру"
                      : "Келесі сұрақ →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-10 border border-charcoal/20 p-8 text-center md:p-12">
            <p className="text-xs tracking-[0.25em] text-terracotta">
              TEST RESULTS
            </p>

            <h3 className="mt-6 text-5xl font-semibold">
              {score} / 12
            </h3>

            <p className="mt-2 font-semibold text-terracotta">
              +{calculateQuizXP(score)} XP
            </p>

            {courseXPRewarded && (
              <p className="mt-1 text-sm text-charcoal/60">
                +{COURSE_COMPLETION_XP} XP — курсты аяқтағаныңыз үшін
              </p>
            )}

            {passed ? (
              <>
                <p className="mt-6 text-2xl font-semibold">
                  Керемет! Кезең аяқталды.
                </p>
                <p className="mt-3 text-sm leading-7 text-charcoal/65">
                  Сен сөздерді жақсы меңгердің. Келесі кезең ашылды!
                </p>
                <p className="mt-5 text-sm font-semibold text-green-700">
                  04-кезең аяқталды ✓
                </p>
              </>
            ) : (
              <>
                <p className="mt-6 text-2xl font-semibold">
                  Тағы бір рет байқап көр!
                </p>
                <p className="mt-3 text-sm leading-7 text-charcoal/65">
                  Келесі кезеңге өту үшін кемінде 9 дұрыс жауап қажет.
                  Сөздерді қайталап, қайта сынақтан өт.
                </p>
              </>
            )}

            <button
              onClick={restartQuiz}
              className="mt-8 bg-charcoal px-8 py-4 text-sm text-white transition hover:bg-terracotta"
            >
              Қайта бастау
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
