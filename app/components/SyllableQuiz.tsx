
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
    question: "Қытай буынының негізгі үш бөлігі қайсы?",
    options: [
      "声母, 韵母, 声调",
      "汉字, 标点, 声调",
      "声母, 汉字, 韵母",
      "声调, 汉字, 拼音",
    ],
    answer: "声母, 韵母, 声调",
    explanation:
      "Қытай буыны әдетте声母 (бастапқы дыбыс), 韵母 (негізгі дыбыстық бөлік) және声调 (тон) арқылы талданады.",
  },
  {
    question: "mǎ (马 — жылқы) сөзіндегі声母 қайсы?",
    options: ["m", "a", "ǎ", "ma"],
    answer: "m",
    explanation:
      "mǎ сөзінде m —声母, a —韵母, ал үшінші тон ǎ белгісімен көрсетіледі.",
  },
  {
    question: "hǎo (好 — жақсы) сөзіндегі韵母 қайсы?",
    options: ["h", "ao", "ǎ", "hao"],
    answer: "ao",
    explanation:
      "hǎo сөзінде h —声母, ao — күрделі韵母, ал үшінші тон дауыстыға қойылған белгімен көрсетіледі.",
  },
  {
    question: "ài (爱 — сүю) буынында声母 бар ма?",
    options: [
      "Иә, a",
      "Иә, i",
      "Жоқ, бұл零声母",
      "Иә, à",
    ],
    answer: "Жоқ, бұл零声母",
    explanation:
      "ài буыны дауыссыз дыбыстан басталмайды. Сондықтан ол零声母 деп аталады. Оның韵母 бөлігі — ai.",
  },
  {
    question: "Төмендегі қайсысы бірінші тонмен айтылады?",
    options: ["mā", "má", "mǎ", "mà"],
    answer: "mā",
    explanation:
      "mā сөзіндегі ā белгісі бірінші тонды көрсетеді. Бірінші тон жоғары әрі бірқалыпты айтылады.",
  },
  {
    question: "shū (书 — кітап) сөзіндегі声母 қайсы?",
    options: ["s", "h", "sh", "u"],
    answer: "sh",
    explanation:
      "sh — қытай тіліндегі біртұтас声母. Оны жеке s және h дыбыстарына бөлуге болмайды.",
  },
  {
    question: "guó (国 — ел) сөзінің声母 бөлігі қайсы?",
    options: ["g", "u", "uo", "o"],
    answer: "g",
    explanation:
      "guó сөзінде g —声母, uo —韵母, ал ó — екінші тон.",
  },
  {
    question: "Қай қатарда тек қарапайым韵母 берілген?",
    options: [
      "a, o, e, i, u, ü",
      "ai, ei, ao, ou",
      "an, en, ang, eng",
      "ia, ie, ua, uo",
    ],
    answer: "a, o, e, i, u, ü",
    explanation:
      "a, o, e, i, u және ü — қарапайым韵母. Қалған қатарларда күрделі韵母 түрлері кездеседі.",
  },
  {
    question: "Қай қатарда күрделі韵母 берілген?",
    options: [
      "a, o, e, i",
      "ai, ei, ao, ou",
      "b, p, m, f",
      "zh, ch, sh, r",
    ],
    answer: "ai, ei, ao, ou",
    explanation:
      "ai, ei, ao және ou — бірнеше дауысты дыбыстың бірігуінен жасалған күрделі韵母.",
  },
  {
    question: "yī (衣 — киім) буыны қалай талданады?",
    options: [
      "y + i + 1",
      "零声母 + i + 1",
      "i + y + 1",
      "零声母 + y + 1",
    ],
    answer: "零声母 + i + 1",
    explanation:
      "Бұл мысалда y — пиньинь жазуындағы көмекші әріп. Дыбыстық талдауда буын零声母 + i + бірінші тон түрінде қарастырылады.",
  },
  {
    question: "Қытай тіліндегі үшінші тонның негізгі ерекшелігі қандай?",
    options: [
      "Жоғары әрі бірқалыпты айтылады",
      "Төменнен жоғары көтеріледі",
      "Алдымен төмендеп, кейін көтеріледі",
      "Жоғарыдан төмен тез түседі",
    ],
    answer: "Алдымен төмендеп, кейін көтеріледі",
    explanation:
      "Үшінші тонның жеке айтылатын негізгі үлгісі алдымен төмендеп, кейін көтеріледі. Сөйлеу барысында оның айтылуы өзгеруі мүмкін.",
  },
  {
    question: "dōng (东 — шығыс) сөзіндегі韵母 қайсы?",
    options: ["d", "o", "ong", "ng"],
    answer: "ong",
    explanation:
      "dōng сөзінде d —声母, ong —韵母, ал ō — бірінші тон.",
  },
];

export default function SyllableQuiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [courseXPRewarded, setCourseXPRewarded] = useState(false);
  const recordSaved = useRef(false);
  const attemptId = useRef<string | null>(null);

  const question = questions[current];
  const isCorrect = selected === question.answer;
  const passedScore = Math.ceil(questions.length * 0.75);

  function handleAnswer() {
    if (!selected || answered) return;

    if (isCorrect) {
      setScore((previous) => previous + 1);
    }

    setAnswered(true);
  }

  function handleNext() {
    if (current === questions.length - 1) {
      if (recordSaved.current) return;

      recordSaved.current = true;
      const currentAttemptId =
        attemptId.current ?? createLearningRecordId();
      attemptId.current = currentAttemptId;
      const currentScore = score;

      saveQuizResult({
        id: currentAttemptId,
        mode: "quiz",
        score: currentScore,
        total: questions.length,
      });

      if (currentScore >= passedScore) {
        setCourseXPRewarded(completeCourse("syllables"));
      } else {
        setCourseXPRewarded(false);
      }

      setScore(currentScore);
      setFinished(true);
      return;
    }

    setCurrent((previous) => previous + 1);
    setSelected("");
    setAnswered(false);
  }

  function restart() {
    recordSaved.current = false;
    attemptId.current = null;
    setCourseXPRewarded(false);
    setCurrent(0);
    setSelected("");
    setScore(0);
    setAnswered(false);
    setFinished(false);
  }

  if (finished) {
    const passed = score >= passedScore;

    return (
      <section className="border-t border-charcoal/20 px-6 py-20 md:px-12">
        <div className="mx-auto max-w-3xl border border-charcoal/20 p-8 md:p-12">
          <p className="text-xs tracking-[0.2em] text-terracotta">
            03 / НӘТИЖЕ
          </p>

          <h2 className="mt-6 text-4xl font-semibold">
            {passed ? "Жарайсың!" : "Қайта байқап көр!"}
          </h2>

          <p className="mt-4 text-lg">
            {score} / {questions.length}
          </p>

          <p className="mt-2 font-semibold text-terracotta">
            +{calculateQuizXP(score)} XP
          </p>

          {courseXPRewarded && (
            <p className="mt-1 text-sm text-charcoal/60">
              +{COURSE_COMPLETION_XP} XP — курсты аяқтағаныңыз үшін
            </p>
          )}

          <div className="mt-6 h-2 bg-charcoal/10">
            <div
              className="h-full bg-terracotta"
              style={{
                width: `${(score / questions.length) * 100}%`,
              }}
            />
          </div>

          <p className="mt-6 text-sm leading-7 text-charcoal/65">
            {passed
              ? "Сен қытай буынының құрылысын меңгердің. Келесі курс ашылды!"
              : `Курсты аяқтау үшін кемінде ${passedScore} сұраққа дұрыс жауап беру керек. Қайта дайындалып көр!`}
          </p>

          <button
            onClick={restart}
            className="mt-8 bg-terracotta px-6 py-3 text-sm text-white transition hover:bg-charcoal"
          >
            Қайта орындау
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-charcoal/20 px-6 py-20 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <p className="text-xs tracking-[0.2em] text-terracotta">
            03 / БІЛІМДІ ТЕКСЕРУ
          </p>
          <p className="text-sm">
            {current + 1} / {questions.length}
          </p>
        </div>

        <div className="mt-5 h-1 bg-charcoal/10">
          <div
            className="h-full bg-terracotta transition-all"
            style={{
              width: `${((current + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <h2 className="mt-12 text-2xl font-semibold leading-relaxed md:text-3xl">
          {question.question}
        </h2>

        <div className="mt-8 grid gap-3">
          {question.options.map((option) => {
            const active = selected === option;
            const correct = answered && option === question.answer;
            const wrong = answered && active && !isCorrect;

            return (
              <button
                key={option}
                disabled={answered}
                onClick={() => setSelected(option)}
                className={`border p-5 text-left transition ${
                  correct
                    ? "border-green-700 bg-green-700/10"
                    : wrong
                      ? "border-red-700 bg-red-700/10"
                      : active
                        ? "border-terracotta bg-terracotta/10"
                        : "border-charcoal/20 hover:border-terracotta"
                }`}
              >
                {option}
                {correct && (
                  <span className="ml-2 text-green-700">✓</span>
                )}
                {wrong && (
                  <span className="ml-2 text-red-700">✕</span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-6 border-l-2 border-terracotta bg-charcoal/5 p-5">
            <p className="font-semibold">
              {isCorrect ? "Дұрыс жауап!" : "Дұрыс жауап: " + question.answer}
            </p>
            <p className="mt-3 text-sm leading-7 text-charcoal/70">
              {question.explanation}
            </p>
          </div>
        )}

        {!answered ? (
          <button
            onClick={handleAnswer}
            disabled={!selected}
            className="mt-8 bg-terracotta px-8 py-3 text-sm text-white transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-30"
          >
            Жауапты тексеру
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="mt-8 bg-terracotta px-8 py-3 text-sm text-white transition hover:bg-charcoal"
          >
            {current === questions.length - 1
              ? "Нәтижені көру"
              : "Келесі сұрақ"}
          </button>
        )}
      </div>
    </section>
  );
}
