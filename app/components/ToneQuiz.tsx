
"use client";

import { useRef, useState } from "react";
import { toneQuestions } from "../data/toneQuestions";
import {
  calculateQuizXP,
  createLearningRecordId,
  saveQuizResult,
} from "../data/progress";
import { completeCourse } from "../data/courseProgress";
import { COURSE_COMPLETION_XP } from "../data/xp";


type ExerciseMode = "visual" | "listening";

function shuffleTones() {
  const tones = [1, 2, 3, 4];

  for (let i = tones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tones[i], tones[j]] = [tones[j], tones[i]];
  }

  return tones;
}

export default function ToneQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [optionOrder, setOptionOrder] = useState([1, 2, 3, 4]);
  const [mode, setMode] = useState<ExerciseMode>("visual");
  const [courseXPRewarded, setCourseXPRewarded] = useState(false);

  const recordSaved = useRef(false);
  const attemptId = useRef<string | null>(null);

  const currentQuestion = toneQuestions[currentIndex];
  const isFinished = currentIndex >= toneQuestions.length;

  const xp = calculateQuizXP(score);

  function playPronunciation() {
    if (!("speechSynthesis" in window)) {
      alert("Бұл браузер дыбыстық оқуды қолдамайды.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      currentQuestion.hanzi
    );

    utterance.lang = "zh-CN";
    utterance.rate = 0.75;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }

  function handleAnswer(tone: number) {
    if (answered) return;

    setSelectedTone(tone);
    setAnswered(true);

    if (tone === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  }

  function handleNext() {
    window.speechSynthesis?.cancel();

    if (currentIndex === toneQuestions.length - 1) {
      if (recordSaved.current) return;

      recordSaved.current = true;
      const currentAttemptId =
        attemptId.current ?? createLearningRecordId();
      attemptId.current = currentAttemptId;
      saveQuizResult({
        id: currentAttemptId,
        mode,
        score,
        total: toneQuestions.length,
      });

      const passed = score >= Math.ceil(toneQuestions.length * 0.75);
      setCourseXPRewarded(
        passed ? completeCourse("tone-practice") : false
      );
      setCurrentIndex(toneQuestions.length);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedTone(null);
    setAnswered(false);
    setOptionOrder(shuffleTones());
  }

  function handleRestart() {
    window.speechSynthesis?.cancel();

    recordSaved.current = false;
    attemptId.current = null;
    setCourseXPRewarded(false);

    setCurrentIndex(0);
    setSelectedTone(null);
    setScore(0);
    setAnswered(false);
    setOptionOrder(shuffleTones());
  }

  function changeMode(nextMode: ExerciseMode) {
    window.speechSynthesis?.cancel();

    setMode(nextMode);
    handleRestart();
  }

  if (isFinished) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-sm text-charcoal/60">
          {mode === "visual"
            ? "Көру арқылы жаттығу"
            : "Тыңдау арқылы жаттығу"}
        </p>

        <h2 className="mt-4 text-3xl font-bold text-charcoal">
          Жаттығу аяқталды!
        </h2>

        <p className="mt-4 text-lg text-charcoal/70">
          Сіздің нәтижеңіз:
        </p>

        <p className="mt-2 text-5xl font-bold text-terracotta">
          {score} / {toneQuestions.length}
        </p>

        <div className="mx-auto mt-8 max-w-sm rounded-3xl border border-charcoal/10 bg-white/50 p-8">
          <p className="text-sm uppercase tracking-widest text-charcoal/50">
            Жиналған тәжірибе
          </p>

          <p className="mt-3 text-5xl font-bold text-terracotta">
            +{xp} XP
          </p>

          <p className="mt-3 text-sm text-charcoal/60">
            Әр дұрыс жауап үшін 10 XP және
            жаттығуды аяқтағаныңыз үшін 20 XP.
          </p>

          {courseXPRewarded && (
            <p className="mt-3 text-sm font-medium text-terracotta">
              +{COURSE_COMPLETION_XP} XP — курсты аяқтағаныңыз үшін
            </p>
          )}
        </div>

        <button
          onClick={handleRestart}
          className="mt-8 rounded-full bg-charcoal px-8 py-3 text-white transition hover:bg-terracotta"
        >
          Қайта бастау
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-terracotta">
          Pinyin & Tones
        </p>

        <h2 className="mt-3 text-3xl font-semibold text-charcoal">
          Тондарды үйрену
        </h2>

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => changeMode("visual")}
            className={`rounded-full px-5 py-3 text-sm transition ${
              mode === "visual"
                ? "bg-charcoal text-white"
                : "border border-charcoal/20 text-charcoal"
            }`}
          >
            Көру арқылы
          </button>

          <button
            onClick={() => changeMode("listening")}
            className={`rounded-full px-5 py-3 text-sm transition ${
              mode === "listening"
                ? "bg-terracotta text-white"
                : "border border-charcoal/20 text-charcoal"
            }`}
          >
            Тыңдау арқылы
          </button>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between">
        <p className="text-sm text-charcoal/60">
          {mode === "visual"
            ? "Тондарды ажырату"
            : "Тыңдап, тонды анықта"}
        </p>

        <p className="text-sm font-medium text-charcoal">
          {currentIndex + 1} / {toneQuestions.length}
        </p>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-charcoal/10">
        <div
          className="h-full bg-terracotta transition-all"
          style={{
            width: `${((currentIndex + 1) / toneQuestions.length) * 100}%`,
          }}
        />
      </div>

      <div className="py-16 text-center">
        {mode === "visual" ? (
          <>
            <p className="text-sm text-charcoal/60">
              Бұл буында қай тон қолданылған?
            </p>

            <h3 className="mt-6 text-8xl font-semibold text-charcoal">
              {currentQuestion.pinyin}
            </h3>

            <p className="mt-3 text-3xl text-charcoal/70">
              {currentQuestion.hanzi}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-charcoal/60">
              Дыбысты тыңдаңыз. Қай тон екенін анықтаңыз.
            </p>

            <div className="mt-8 flex flex-col items-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border border-terracotta/30 bg-terracotta/5">
                <span className="text-5xl text-terracotta">♫</span>
              </div>

              <p className="mt-5 text-sm text-charcoal/50">
                Дыбысты бірнеше рет тыңдауға болады
              </p>
            </div>
          </>
        )}

        <button
          onClick={playPronunciation}
          className="mt-8 rounded-full bg-terracotta px-8 py-4 text-white transition hover:bg-charcoal"
        >
          ▶ Тыңдау
        </button>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {optionOrder.map((tone) => {
            const isSelected = selectedTone === tone;
            const isCorrect = currentQuestion.correctAnswer === tone;

            let buttonStyle =
              "border-charcoal/20 text-charcoal hover:border-terracotta";

            if (answered && isCorrect) {
              buttonStyle = "border-green-600 bg-green-600 text-white";
            } else if (answered && isSelected && !isCorrect) {
              buttonStyle = "border-red-600 bg-red-600 text-white";
            }

            return (
              <button
                key={tone}
                onClick={() => handleAnswer(tone)}
                disabled={answered}
                className={`rounded-2xl border-2 py-6 text-2xl font-semibold transition ${buttonStyle}`}
              >
                {tone}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-8">
            <p
              className={`text-lg font-medium ${
                selectedTone === currentQuestion.correctAnswer
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {selectedTone === currentQuestion.correctAnswer
                ? "Дұрыс! Жарайсыз!"
                : `Қате. Дұрыс жауап: ${currentQuestion.correctAnswer}-тон.`}
            </p>

            <div className="mt-4 rounded-2xl bg-charcoal/5 p-5">
              <p className="text-2xl font-semibold text-charcoal">
                {currentQuestion.pinyin}
              </p>

              <p className="mt-1 text-xl text-charcoal/70">
                {currentQuestion.hanzi}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="mt-6 rounded-full bg-charcoal px-8 py-3 text-white transition hover:bg-terracotta"
            >
              {currentIndex === toneQuestions.length - 1
                ? "Нәтижені көру"
                : "Келесі сұрақ"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
