"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  AssessmentResult, ContentBlock, CurriculumLesson, CurriculumRelease, Exercise,
  LearningEvent, LearningEventEntryPoint, ScoredExercise, SubmittedAnswer,
} from "../data/learningContracts";
import { isAssessmentAnswerCorrect, scoreAssessment } from "../data/assessmentService";
import { createLearningEventId, getOrCreateLocalLearnerId, learningEventRepository } from "../data/learningEventRepository";
import { completePathLessonIfEligible, createPathEvent, getKnowledgePointEvidence, getPathLessonState } from "../data/pathCompletionService";
import { hsk1FoundationCurriculum } from "../data/hsk1Foundation";
import { awardXP, COURSE_COMPLETION_XP } from "../data/xp";
import { awardCourseMilestoneCoins, awardLessonCoins, hasTekCoinTransaction, TEK_COIN_REWARDS } from "../data/tekCoins";

type Props = { release: CurriculumRelease; mode: "path" | "independent"; initialLessonId?: string; moduleId?: string };
type Feedback = { correct: boolean; explanation: string };
type Rating = "needs-practice" | "comfortable";

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  return result >>> 0;
}

function optionsFor(exercise: ScoredExercise): string[] {
  const source = exercise.options ?? (Array.isArray(exercise.answerKey) ? exercise.answerKey : []);
  const ordered = [...source].sort((a, b) => hash(exercise.id + a) - hash(exercise.id + b));
  if (ordered.length > 1 && ordered.every((item, index) => item === source[index])) ordered.reverse();
  return ordered;
}

function exerciseEvent(input: {
  release: CurriculumRelease; learnerId: string; entryPoint: LearningEventEntryPoint;
  exercise: ScoredExercise; answer: SubmittedAnswer; attemptId?: string;
}): LearningEvent {
  return {
    eventId: createLearningEventId(), schemaVersion: 1, type: "exercise_submitted",
    learnerId: input.learnerId, occurredAt: new Date().toISOString(),
    curriculumId: input.release.curriculumId, contentVersion: input.release.contentVersion,
    entryPoint: input.entryPoint, knowledgePointIds: input.exercise.knowledgePointIds,
    payload: {
      exerciseId: input.exercise.id, exerciseRevisionId: input.exercise.revisionId,
      attemptId: input.attemptId ?? createLearningEventId(), answer: input.answer,
      outcome: isAssessmentAnswerCorrect(input.exercise, input.answer) ? "correct" : "incorrect",
    },
  };
}

function vocabularyFor(release: CurriculumRelease, ids: string[]) {
  const selected = new Set(ids);
  const revisions = release.knowledgePointRevisions.filter((item) => selected.has(item.knowledgePointId));
  const legacyIds = new Set(revisions.flatMap((item) => item.legacyVocabularyIds));
  const legacy = hsk1FoundationCurriculum.vocabulary.filter((item) => legacyIds.has(item.id)).map((item) => ({
    id: item.id,
    knowledgePointId: revisions.find((revision) => revision.legacyVocabularyIds.includes(item.id))?.knowledgePointId ?? "",
    hanzi: item.hanzi, pinyin: item.pinyin, partOfSpeech: item.partOfSpeech,
    translationKazakh: item.translationKazakh, example: item.example,
  }));
  return [...legacy, ...release.vocabularyContent.filter((item) => selected.has(item.knowledgePointId))];
}

function playChinese(text: string, report: (message: string) => void) {
  if (!("speechSynthesis" in window)) {
    report("Бұл браузерде құрылғыдағы дыбыстау қолжетімсіз.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  window.speechSynthesis.speak(utterance);
  report("Қытайша мәтінді құрылғыдағы zh-CN дауысы оқып тұр.");
}

function ExerciseCard({
  exercise, answer, setAnswer, feedback, assessment, onCheck, onSpeak,
}: {
  exercise: ScoredExercise; answer?: SubmittedAnswer; setAnswer: (value: SubmittedAnswer) => void;
  feedback?: Feedback; assessment: boolean; onCheck?: () => void; onSpeak: (text: string) => void;
}) {
  const choice = answer?.kind === "choice" ? answer.value : "";
  const text = answer?.kind === "text" ? answer.value : "";
  const sequence = answer?.kind === "order" ? answer.value : [];
  const options = optionsFor(exercise);
  const groupName = exercise.id + (assessment ? "-measure" : "-practice");

  return (
    <fieldset className="rounded-2xl border border-border-soft bg-card p-4 shadow-card sm:p-5">
      <legend className="px-1 text-sm font-semibold leading-6 text-text-primary">{exercise.promptKazakh}</legend>
      {exercise.interaction === "listening-choice" && exercise.audioText && (
        <button type="button" onClick={() => onSpeak(exercise.audioText!)} className="mt-3 min-h-11 rounded-xl bg-sky/45 px-4 text-sm font-semibold text-blue-dark focus-visible:outline-2 focus-visible:outline-blue">▶ Тыңдау</button>
      )}
      {(exercise.interaction === "choice" || exercise.interaction === "listening-choice") && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {options.map((option, index) => (
            <label key={option + index} className={"flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm focus-within:ring-2 focus-within:ring-blue " + (choice === option ? "border-blue bg-ice" : "border-border-soft bg-card-soft hover:border-blue/50")}>
              <input type="radio" name={groupName} value={option} checked={choice === option} onChange={() => setAnswer({ kind: "choice", value: option })} className="accent-blue" />
              <span lang="zh">{option}</span>
            </label>
          ))}
        </div>
      )}
      {exercise.interaction === "text" && (
        <label className="mt-3 block text-xs font-semibold text-text-secondary">Жауабың
          <input value={text} onChange={(event) => setAnswer({ kind: "text", value: event.target.value })} className="mt-1.5 min-h-12 w-full rounded-xl border border-border-soft bg-card px-3 text-base text-text-primary outline-none focus:border-blue focus:ring-2 focus:ring-blue/20" lang="zh" autoComplete="off" />
        </label>
      )}
      {exercise.interaction === "order" && (
        <div className="mt-3">
          <p className="text-xs text-text-secondary">Сөздерді сөйлем ретімен таңда:</p>
          <div className="mt-2 flex min-h-12 flex-wrap gap-2 rounded-xl border border-dashed border-border-soft bg-card-soft p-2" aria-live="polite">
            {sequence.length ? sequence.map((item, index) => (
              <button type="button" key={item + index} onClick={() => setAnswer({ kind: "order", value: sequence.filter((_, i) => i !== index) })} className="min-h-9 rounded-lg bg-sky/55 px-3 text-sm font-medium text-text-primary focus-visible:outline-2 focus-visible:outline-blue" lang="zh">{item} ×</button>
            )) : <span className="px-2 py-1 text-sm text-text-secondary">Таңдалған бөліктер осында көрінеді.</span>}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {options.filter((option) => sequence.filter((item) => item === option).length < options.filter((item) => item === option).length).map((option, index) => (
              <button type="button" key={option + index} onClick={() => setAnswer({ kind: "order", value: [...sequence, option] })} className="min-h-11 rounded-xl border border-border-soft bg-card px-3 text-sm font-semibold text-text-primary hover:bg-ice focus-visible:outline-2 focus-visible:outline-blue" lang="zh">{option}</button>
            ))}
            {sequence.length > 0 && <button type="button" onClick={() => setAnswer({ kind: "order", value: [] })} className="min-h-11 px-3 text-sm font-semibold text-text-secondary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-blue">Тазалау</button>}
          </div>
        </div>
      )}
      {feedback && <p role="status" className={"mt-3 rounded-xl px-3 py-2.5 text-sm leading-6 " + (feedback.correct ? "bg-success-bg text-success" : "bg-danger-bg text-danger")}>{feedback.correct ? "Дұрыс. " : "Әлі дұрыс емес. "}{feedback.explanation}</p>}
      {!assessment && onCheck && <button type="button" onClick={onCheck} disabled={!answer} className="mt-4 min-h-11 rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Жауапты тексеру</button>}
    </fieldset>
  );
}

function SpeakingPractice({
  exercise, onSave,
}: {
  exercise: Extract<Exercise, { mode: "practice" }>;
  onSave: (seconds: number, rating: Rating) => boolean;
}) {
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const startedAt = useRef(0);
  const url = useRef<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [rating, setRating] = useState<Rating>("needs-practice");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  const stopTracks = useCallback(() => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }, []);
  const clearAudio = useCallback(() => {
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = null;
    setAudioUrl("");
    setSeconds(0);
    setSaved(false);
  }, []);
  useEffect(() => () => {
    if (recorder.current?.state === "recording") recorder.current.stop();
    stopTracks();
    if (url.current) URL.revokeObjectURL(url.current);
  }, [stopTracks]);

  async function begin() {
    setMessage("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMessage("Бұл браузерде дыбыс жазу қолжетімсіз. Мәтінді өз бетіңше дауыстап айтуға болады; баға қойылмайды.");
      return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      const current = new MediaRecorder(stream.current);
      recorder.current = current;
      current.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
      current.onstop = () => {
        stopTracks();
        const blob = new Blob(chunks.current, { type: current.mimeType || "audio/webm" });
        if (!blob.size) {
          setMessage("Жазба бос болды. Микрофонды тексеріп, қайта байқап көр.");
          setRecording(false);
          return;
        }
        if (url.current) URL.revokeObjectURL(url.current);
        url.current = URL.createObjectURL(blob);
        setAudioUrl(url.current);
        setSeconds(Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)));
        setRecording(false);
      };
      startedAt.current = Date.now();
      current.start();
      setRecording(true);
    } catch {
      stopTracks();
      setMessage("Микрофонға рұқсат берілмеді. Браузер рұқсатын тексер немесе мәтінді өз бетіңше оқы.");
    }
  }

  return (
    <section className="rounded-2xl border border-border-soft bg-card p-4 shadow-card sm:p-5">
      <p className="text-xs font-semibold text-mint-dark">СӨЙЛЕУ ЖАТТЫҒУЫ · АВТОМАТТЫ БАҒА ЖОҚ</p>
      <h3 className="mt-2 text-sm font-semibold leading-6 text-text-primary">{exercise.promptKazakh}</h3>
      <p lang="zh" className="mt-3 text-xl font-semibold text-text-primary">{exercise.recordingPromptChinese}</p>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{exercise.explanationKazakh} Жазба тек осы бетте уақытша тұрады және беттен шыққанда өшеді.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {!recording ? <button type="button" onClick={begin} disabled={saved} className="min-h-11 rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-blue">{audioUrl ? "Қайта жазу" : "Жазуды бастау"}</button> : <button type="button" onClick={() => recorder.current?.stop()} className="min-h-11 rounded-xl bg-danger px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-blue">Жазуды тоқтату</button>}
        {audioUrl && <button type="button" onClick={clearAudio} className="min-h-11 rounded-xl border border-border-soft bg-card px-4 text-sm font-semibold text-text-secondary focus-visible:outline-2 focus-visible:outline-blue">Жазбаны өшіру</button>}
      </div>
      {audioUrl && <div className="mt-4 rounded-xl bg-card-soft p-3">
        <audio controls src={audioUrl} className="w-full" aria-label="Өз жазбаңды тыңдау" />
        <p className="mt-2 text-xs text-text-secondary">Ұзақтығы: {seconds} секунд</p>
        <fieldset className="mt-3"><legend className="text-xs font-semibold text-text-primary">Өзіңді қалай сезіндің?</legend>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-text-secondary">
            <label className="inline-flex min-h-10 items-center gap-2"><input type="radio" name={exercise.id + "-rating"} checked={rating === "needs-practice"} onChange={() => setRating("needs-practice")} />Қайталап жаттығамын</label>
            <label className="inline-flex min-h-10 items-center gap-2"><input type="radio" name={exercise.id + "-rating"} checked={rating === "comfortable"} onChange={() => setRating("comfortable")} />Өзіме сенімдімін</label>
          </div>
        </fieldset>
        <button type="button" onClick={() => {
          if (onSave(seconds, rating)) { setSaved(true); setMessage("Жаттығу белгісі сақталды. Бұл баға емес, өзіңнің белгің."); }
          else setMessage("Оқу белгісін сақтау мүмкін болмады.");
        }} disabled={saved} className="mt-3 min-h-11 rounded-xl border border-mint-dark/30 bg-mint/35 px-4 text-sm font-semibold text-mint-dark disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-blue">Жаттығу белгісін сақтау</button>
      </div>}
      {message && <p role="status" className="mt-3 text-sm leading-6 text-text-secondary">{message}</p>}
    </section>
  );
}

export default function CurriculumLessonRuntime({ release, mode, initialLessonId, moduleId }: Props) {
  const [learnerId] = useState<string | null>(() => getOrCreateLocalLearnerId());
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [storageStatus, setStorageStatus] = useState<"loading" | "ready" | "unavailable" | "read-only">("loading");
  const [lessonId, setLessonId] = useState(initialLessonId ?? release.path.orderedLessonIds[0] ?? "");
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, SubmittedAnswer>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, Feedback>>({});
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, SubmittedAnswer>>({});
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [notice, setNotice] = useState("");
  const [audioNotice, setAudioNotice] = useState("");
  const [rewardNotice, setRewardNotice] = useState("");
  const opened = useRef(new Set<string>());

  const lesson = release.lessons.find((item) => item.id === lessonId) ?? null;
  const independentModule = release.independentModules.find((item) => item.id === moduleId) ?? null;
  const blocks = (mode === "path" ? lesson?.contentBlockIds : independentModule?.contentBlockIds) ?? [];
  const visibleBlocks = blocks.map((id) => release.contentBlocks.find((item) => item.id === id)).filter((item): item is ContentBlock => Boolean(item));
  const exerciseIds = mode === "path" ? lesson?.practiceExerciseIds ?? [] : independentModule?.exerciseIds ?? [];
  const practice = exerciseIds.map((id) => release.exercises.find((item) => item.id === id)).filter((item): item is Exercise => Boolean(item));
  const moduleHasContent = visibleBlocks.length > 0 || practice.length > 0;
  const knowledgePointIds = mode === "path" ? lesson?.knowledgePointIds ?? [] : independentModule?.knowledgePointIds ?? [];
  const vocabulary = vocabularyFor(release, knowledgePointIds);
  const evidence = useMemo(() => new Map(getKnowledgePointEvidence(release, learnerId ?? "", events).map((item) => [item.knowledgePointId, item])), [events, learnerId, release]);
  const pathStates = useMemo(() => new Map(release.path.orderedLessonIds.map((id) => [id, getPathLessonState(release, id, learnerId ?? "", events)])), [events, learnerId, release]);

  const refresh = useCallback(() => {
    const result = learningEventRepository.read();
    setEvents(result.events);
    setStorageStatus(result.status);
  }, []);
  const append = useCallback((event: LearningEvent): boolean => {
    const result = learningEventRepository.append(event);
    if (!result.ok) {
      setNotice(result.reason === "read-only"
        ? "Оқу деректерінің нұсқасы танылмады. Бар деректер сақталды, жаңа жазба қосылмады."
        : "Оқу дерегін сақтау мүмкін болмады. Браузер қоймасын тексеріп, қайта байқап көр.");
      refresh();
      return false;
    }
    refresh();
    return true;
  }, [refresh]);

  useEffect(() => {
    const refreshTimer = window.setTimeout(refresh, 0);
    window.addEventListener("tekshe-progress-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("tekshe-progress-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  useEffect(() => {
    if (!learnerId || storageStatus === "loading") return;
    if (mode === "independent" && independentModule?.status === "available") {
      const key = "module:" + independentModule.id;
      if (opened.current.has(key)) return;
      opened.current.add(key);
      append({
        eventId: createLearningEventId(), schemaVersion: 1, type: "module_opened",
        learnerId, occurredAt: new Date().toISOString(), curriculumId: release.curriculumId,
        contentVersion: release.contentVersion, entryPoint: { mode: "independent", moduleId: independentModule.id },
        knowledgePointIds: independentModule.knowledgePointIds, payload: null,
      });
    } else if (mode === "path" && lesson) {
      const key = "path:" + lesson.id;
      if (opened.current.has(key)) return;
      opened.current.add(key);
      append(createPathEvent({ type: "lesson_started", release, lesson, learnerId }));
    }
  }, [append, independentModule, learnerId, lesson, mode, release, storageStatus]);

  const locked = useCallback((item: CurriculumLesson) => item.prerequisiteLessonIds.some((id) => pathStates.get(id) !== "completed"), [pathStates]);
  const completedCount = release.path.orderedLessonIds.filter((id) => pathStates.get(id) === "completed").length;
  const progress = release.path.orderedLessonIds.length ? Math.round(completedCount * 100 / release.path.orderedLessonIds.length) : 0;

  function answerExercise(id: string, value: SubmittedAnswer, assessment = false) {
    if (assessment) setAssessmentAnswers((current) => ({ ...current, [id]: value }));
    else setPracticeAnswers((current) => ({ ...current, [id]: value }));
  }
  function entryPoint(): LearningEventEntryPoint {
    return mode === "path" && lesson
      ? { mode: "path", pathId: release.path.id, lessonId: lesson.id }
      : { mode: "independent", moduleId: independentModule?.id ?? "" };
  }
  function checkPractice(exercise: ScoredExercise) {
    if (!learnerId) return;
    const answer = practiceAnswers[exercise.id];
    if (!answer) return;
    const correct = isAssessmentAnswerCorrect(exercise, answer);
    if (append(exerciseEvent({ release, learnerId, entryPoint: entryPoint(), exercise, answer }))) {
      setPracticeFeedback((current) => ({ ...current, [exercise.id]: { correct, explanation: exercise.explanationKazakh } }));
      setNotice("");
    }
  }
  function saveSpeaking(exercise: Extract<Exercise, { mode: "practice" }>, durationSeconds: number, selfRating: Rating) {
    if (!learnerId) return false;
    return append({
      eventId: createLearningEventId(), schemaVersion: 1, type: "speaking_practice_completed",
      learnerId, occurredAt: new Date().toISOString(), curriculumId: release.curriculumId,
      contentVersion: release.contentVersion, entryPoint: entryPoint(),
      knowledgePointIds: exercise.knowledgePointIds,
      payload: { exerciseId: exercise.id, durationSeconds, selfRating },
    });
  }
  function submitAssessment(assessmentId: string) {
    if (!learnerId || !lesson) return;
    const assessment = release.assessments.find((item) => item.id === assessmentId);
    if (!assessment) return;
    const attemptId = createLearningEventId();
    const scored = scoreAssessment(release, assessment, assessmentAnswers, attemptId);
    if (scored.status === "incomplete") {
      setNotice("Барлық сұраққа жауап бер. Жауапсыз тармаққа баға қойылмайды.");
      return;
    }
    setAssessmentResult(scored.result);
    const pathEntry: LearningEventEntryPoint = { mode: "path", pathId: release.path.id, lessonId: lesson.id };
    for (const id of assessment.exerciseIds) {
      const exercise = release.exercises.find((item): item is ScoredExercise => item.id === id && item.mode === "scored");
      const answer = assessmentAnswers[id];
      if (exercise && answer && !append(exerciseEvent({ release, learnerId, entryPoint: pathEntry, exercise, answer, attemptId: attemptId + ":" + exercise.id }))) return;
    }
    if (!append({
      eventId: createLearningEventId(), schemaVersion: 1, type: "assessment_completed",
      learnerId, occurredAt: new Date().toISOString(), curriculumId: release.curriculumId,
      contentVersion: release.contentVersion, entryPoint: pathEntry,
      knowledgePointIds: lesson.knowledgePointIds, payload: scored.result,
    })) return;
    if (!scored.result.passed) {
      setNotice("Өту шарты орындалмады. Әр сұрақтың түсіндірмесін қарап, қайта өлшеуге болады.");
      setRewardNotice("");
      return;
    }
    const latest = learningEventRepository.read().events;
    const completion = completePathLessonIfEligible({ release, lessonId: lesson.id, learnerId, allEvents: latest, repository: learningEventRepository });
    refresh();
    if (!completion.completed) {
      setNotice("Өлшем нәтижесі өтті, бірақ негізгі жол аяқталмады: " + (completion.reason ?? "ереже орындалмады"));
      return;
    }
    awardLessonCoins(release.curriculumId, lesson.id);
    const allDone = release.path.orderedLessonIds.every((id) => id === lesson.id || getPathLessonState(release, id, learnerId, learningEventRepository.read().events) === "completed");
    if (allDone) {
      awardXP("course:" + release.curriculumId, "course", COURSE_COMPLETION_XP);
      awardCourseMilestoneCoins(release.curriculumId);
    }
    const coinKey = "lesson:" + release.curriculumId + ":" + lesson.id;
    setRewardNotice("Негізгі жолдағы аяқталу сақталды. " + (hasTekCoinTransaction(coinKey) ? "+" + TEK_COIN_REWARDS.lesson + " Tek Coin" : "Tek Coin жазбасы әлі сақталмаған") + (allDone ? " · курс сыйлығы тексерілді" : ""));
    setNotice("");
  }
  function selectLesson(id: string) {
    const item = release.lessons.find((candidate) => candidate.id === id);
    if (!item || locked(item)) return;
    setLessonId(id);
    setPracticeAnswers({});
    setPracticeFeedback({});
    setAssessmentAnswers({});
    setAssessmentResult(null);
    setNotice("");
    setRewardNotice("");
  }

  function renderExercise(item: Exercise, assessment = false) {
    if (item.mode === "practice") return <SpeakingPractice key={item.id + mode + lessonId} exercise={item} onSave={(seconds, rating) => saveSpeaking(item, seconds, rating)} />;
    const answer = assessment ? assessmentAnswers[item.id] : practiceAnswers[item.id];
    const feedback = assessmentResult && assessment
      ? { correct: Boolean(answer && isAssessmentAnswerCorrect(item, answer)), explanation: item.explanationKazakh }
      : practiceFeedback[item.id];
    return <ExerciseCard key={item.id + (assessment ? "-assessment" : "-practice")} exercise={item} answer={answer} setAnswer={(value) => answerExercise(item.id, value, assessment)} feedback={feedback} assessment={assessment} onCheck={assessment ? undefined : () => checkPractice(item)} onSpeak={(text) => playChinese(text, setAudioNotice)} />;
  }

  if (mode === "independent" && (!independentModule || independentModule.status !== "available" || !moduleHasContent)) return (
    <section className="rounded-card border border-border-soft bg-card p-6 shadow-card sm:p-8">
      <p className="text-xs font-semibold tracking-[0.16em] text-blue-dark">ТӘУЕЛСІЗ МОДУЛЬ</p>
      <h1 className="mt-2 text-2xl font-semibold text-text-primary">Бұл модуль әзірге дайындалып жатыр</h1>
      <p className="mt-3 text-sm leading-6 text-text-secondary">Материал дайын болғанда ғана модуль қолжетімді болады.</p>
      <Link href="/learn/modules" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white">Модульдерге қайту</Link>
    </section>
  );
  if (mode === "path" && !lesson) return <p className="rounded-xl bg-card p-5 text-text-secondary">Сабақ әзірге қолжетімсіз.</p>;
  if (mode === "path" && lesson && locked(lesson)) return (
    <section className="rounded-card border border-border-soft bg-card p-6 shadow-card sm:p-8">
      <h2 className="text-xl font-semibold text-text-primary">Алдыңғы сабақты аяқта</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">Негізгі жолдағы өлшем ережесі орындалғанда келесі сабақ ашылады.</p>
    </section>
  );

  const assessments = mode === "path" && lesson
    ? lesson.assessmentIds.map((id) => release.assessments.find((item) => item.id === id)).filter((item) => item !== undefined)
    : [];
  const pathState = lesson ? pathStates.get(lesson.id) ?? "not-started" : "not-started";

  return (
    <div className="space-y-5 sm:space-y-7">
      <section className="rounded-card border border-border-soft bg-card p-4 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-blue-dark">HSK 1 · U01 · {mode === "path" ? "ҚҰРЫЛЫМДЫ ЖОЛ" : "ТӘУЕЛСІЗ МОДУЛЬ"}</p>
            <h1 className="mt-2 break-words text-xl font-semibold leading-tight text-text-primary sm:text-2xl">{mode === "path" ? lesson?.titleKazakh : independentModule?.titleKazakh}</h1>
            <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-text-secondary">{mode === "path" ? lesson?.introductionKazakh : independentModule?.descriptionKazakh}</p>
          </div>
          <span className="rounded-full border border-warning/30 bg-warning-bg px-3 py-1.5 text-xs font-semibold text-warning">Редакциялық күй: draft</span>
        </div>
        <p className="mt-4 break-words rounded-xl bg-warning-bg/70 px-3 py-2.5 text-xs leading-5 text-warning">Бұл материал әлі ана тілді немесе кәсіби редактордан өтпеген. Оқу жобасы ретінде тексеру қажет.</p>
        {mode === "path" && <div className="mt-5">
          <div className="flex items-center justify-between gap-2 text-xs text-text-secondary"><span>U01 жолы</span><span>{completedCount}/{release.path.orderedLessonIds.length} сабақ · {progress}%</span></div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-ice" role="progressbar" aria-label="U01 жолының барысы" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div className="h-full rounded-full bg-mint-dark transition-[width]" style={{ width: progress + "%" }} /></div>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">{release.path.orderedLessonIds.map((id) => {
            const item = release.lessons.find((candidate) => candidate.id === id)!;
            const state = pathStates.get(id) ?? "not-started";
            const current = item.id === lesson?.id;
            const isLocked = locked(item);
            const label = state === "completed" ? "Аяқталды" : state === "assessment-passed" ? "Өлшем өтті" : isLocked ? "Құлыптаулы" : current ? "Қазір оқып жатыр" : "Бастауға болады";
            return <li key={id} className="min-w-0"><button type="button" onClick={() => selectLesson(id)} disabled={isLocked} aria-current={current ? "step" : undefined} className={"min-h-[76px] w-full min-w-0 rounded-xl border p-3 text-left disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue " + (current ? "border-blue bg-ice" : "border-border-soft bg-card-soft hover:bg-ice")}><span className="block break-words text-xs font-semibold text-text-primary">{item.titleKazakh}</span><span className="mt-1 block text-[11px] text-text-secondary">{label}</span></button></li>;
          })}</ol>
        </div>}
      </section>

      {storageStatus === "loading" && <p role="status" className="rounded-xl bg-card px-4 py-3 text-sm text-text-secondary">Оқу барысы жүктеліп жатыр…</p>}
      {storageStatus === "unavailable" && <p role="alert" className="rounded-xl bg-warning-bg px-4 py-3 text-sm text-warning">Сақтау орны қолжетімсіз. Оқуға болады, бірақ оқу деректері сақталмауы мүмкін.</p>}
      {notice && <p role="alert" className="rounded-xl bg-danger-bg px-4 py-3 text-sm leading-6 text-danger">{notice}</p>}
      {rewardNotice && <p role="status" className="rounded-xl bg-success-bg px-4 py-3 text-sm leading-6 text-success">{rewardNotice}</p>}

      {mode === "path" && lesson && <section className="rounded-2xl border border-border-soft bg-card p-4 shadow-card sm:p-6">
        <p className="text-xs font-semibold text-blue-dark">САБАҚТЫҢ МАҚСАТЫ</p>
        <ul className="mt-2 space-y-2">{lesson.learningObjectives.map((objective) => <li key={objective.id} className="text-sm leading-6 text-text-primary">• {objective.statementKazakh}</li>)}</ul>
        <div className="mt-4 flex flex-wrap gap-2">{lesson.knowledgePointIds.map((id) => {
          const item = evidence.get(id);
          const title = release.knowledgePointRevisions.find((revision) => revision.knowledgePointId === id)?.titleKazakh ?? id;
          const status = item?.passedAssessment ? "бағалау дәлелі" : item?.practiceCount ? item.practiceCount + " жаттығу дәлелі" : item?.exposed ? "танысқан" : "әлі ашылмаған";
          return <span key={id} title={id} className="rounded-full bg-card-soft px-3 py-1.5 text-xs text-text-secondary">{title} · {status}</span>;
        })}</div>
      </section>}

      {visibleBlocks.length > 0 && <section className="space-y-3" aria-labelledby="u01-content-title">
        <div><p className="text-xs font-semibold text-blue-dark">ТҮСІНДІРУ ЖӘНЕ МЫСАЛ</p><h2 id="u01-content-title" className="mt-1 text-lg font-semibold text-text-primary">Оқып көр</h2></div>
        {visibleBlocks.map((block) => <article key={block.id} className="rounded-2xl border border-border-soft bg-card p-4 shadow-card sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="text-sm font-semibold text-text-primary">{block.titleKazakh}</h3><span className="rounded-full bg-warning-bg px-2.5 py-1 text-[10px] font-semibold text-warning">draft</span></div>
          {block.textChinese && <p lang="zh" className="mt-3 whitespace-pre-line text-lg leading-8 text-text-primary sm:text-xl">{block.textChinese}</p>}
          {block.pinyin && <p className="mt-1 whitespace-pre-line text-sm leading-6 text-blue-dark">{block.pinyin}</p>}
          {block.translationKazakh && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-mint-dark">{block.translationKazakh}</p>}
          {block.explanationKazakh && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-text-secondary">{block.explanationKazakh}</p>}
          {block.kind === "dialogue" && block.textChinese && <button type="button" onClick={() => playChinese(block.textChinese ?? "", setAudioNotice)} className="mt-3 min-h-10 rounded-xl border border-border-soft bg-card-soft px-3 text-xs font-semibold text-blue-dark focus-visible:outline-2 focus-visible:outline-blue">Құрылғы дауысымен тыңдау</button>}
        </article>)}
        {audioNotice && <p role="status" className="text-xs text-text-secondary">{audioNotice} Бұл — құрылғы дауысы.</p>}
      </section>}

      {vocabulary.length > 0 && <section className="space-y-3" aria-labelledby="u01-vocab-title">
        <div><p className="text-xs font-semibold text-blue-dark">СӨЗДІК</p><h2 id="u01-vocab-title" className="mt-1 text-lg font-semibold text-text-primary">Осы тақырыптағы сөздер</h2></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{vocabulary.map((item) => <article key={item.id} className="rounded-2xl border border-border-soft bg-card p-4 shadow-card">
          <div className="flex items-start justify-between gap-2"><p lang="zh" className="text-2xl font-semibold text-text-primary">{item.hanzi}</p><span className="rounded-full bg-warning-bg px-2 py-1 text-[10px] font-semibold text-warning">draft</span></div>
          <p className="mt-1 text-sm text-blue-dark">{item.pinyin}</p>
          <p className="mt-1 text-xs text-text-secondary">{item.partOfSpeech} · {item.translationKazakh}</p>
          <div className="mt-3 border-t border-border-soft pt-3"><p lang="zh" className="text-sm text-text-primary">{item.example.hanzi}</p><p className="mt-1 text-xs text-blue-dark">{item.example.pinyin}</p><p className="mt-1 text-xs leading-5 text-text-secondary">{item.example.translationKazakh}</p></div>
        </article>)}</div>
      </section>}

      {practice.length > 0 && <section className="space-y-3" aria-labelledby="u01-practice-title">
        <div><p className="text-xs font-semibold text-blue-dark">ЖАТТЫҒУ</p><h2 id="u01-practice-title" className="mt-1 text-lg font-semibold text-text-primary">Қолданып көр</h2></div>
        {practice.map((item) => renderExercise(item))}
        <p className="text-xs text-text-secondary">Қытайша дыбыс болса, браузердің құрылғыдағы zh-CN дауысы арқылы оқылады.</p>
      </section>}

      {assessments.map((assessment) => {
        const items = assessment.exerciseIds.map((id) => release.exercises.find((item): item is ScoredExercise => item.id === id && item.mode === "scored")).filter((item): item is ScoredExercise => Boolean(item));
        const allAnswered = items.every((item) => Boolean(assessmentAnswers[item.id]));
        const alreadyComplete = pathState === "completed";
        const threshold = Math.min(...Object.values(assessment.rule.requiredObjectiveMinimumPercent));
        return <section key={assessment.id} className="space-y-3 rounded-card border border-blue/20 bg-sky/15 p-4 sm:p-6" aria-labelledby={assessment.id + "-title"}>
          <div><p className="text-xs font-semibold text-blue-dark">СОҢҒЫ ӨЛШЕМ · {assessment.rule.version}</p><h2 id={assessment.id + "-title"} className="mt-1 text-lg font-semibold text-text-primary">Сабақты тексеру</h2><p className="mt-1 text-sm leading-6 text-text-secondary">Өту шарты: жалпы кемінде {assessment.rule.minimumTotalPercent}%, әр міндетті мақсаттан кемінде {threshold}% және барлық {items.length} сұраққа жауап.</p></div>
          {items.map((item) => renderExercise(item, true))}
          {assessmentResult && <div role="status" className={"rounded-xl p-4 text-sm leading-6 " + (assessmentResult.passed ? "bg-success-bg text-success" : "bg-danger-bg text-danger")}>
            <p className="font-semibold">Нақты нәтиже: {assessmentResult.earnedPoints}/{assessmentResult.possiblePoints} · {Math.round(assessmentResult.earnedPoints * 100 / assessmentResult.possiblePoints)}%</p>
            <p>{assessmentResult.passed ? "Өту шарты орындалды." : "Өту шарты орындалмады. Түсіндірмелерді қарап, қайта өлше."}</p>
            {assessmentResult.objectiveScores.map((score) => <p key={score.objectiveId}>{lesson?.learningObjectives.find((item) => item.id === score.objectiveId)?.statementKazakh}: {score.earnedPoints}/{score.possiblePoints}</p>)}
          </div>}
          {alreadyComplete ? <p className="rounded-xl bg-success-bg px-4 py-3 text-sm font-semibold text-success">Бұл сабақ негізгі жолда аяқталды.</p> : <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => submitAssessment(assessment.id)} disabled={!allAnswered || storageStatus !== "ready"} className="min-h-11 rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">{assessmentResult ? "Қайта өлшеу" : "Жауаптарды тексеру"}</button>
            {assessmentResult && <button type="button" onClick={() => { setAssessmentAnswers({}); setAssessmentResult(null); setNotice(""); }} className="min-h-11 rounded-xl border border-border-soft bg-card px-4 text-sm font-semibold text-text-secondary focus-visible:outline-2 focus-visible:outline-blue">Жаңа әрекет</button>}
          </div>}
          {!allAnswered && <p className="text-xs text-text-secondary">Барлық жауап белгіленгеннен кейін тексеру батырмасы ашылады.</p>}
        </section>;
      })}

      {mode === "independent" && <section className="rounded-2xl border border-border-soft bg-card p-4 shadow-card sm:p-5">
        <h2 className="text-sm font-semibold text-text-primary">Негізгі жолмен ортақ білім дәлелі</h2>
        <p className="mt-1 text-xs leading-5 text-text-secondary">Екі кіру жолы бір KnowledgePoint пен оқиғалар қоймасын пайдаланады. Бұл модуль негізгі сабақты аяқтамайды және негізгі өлшемнің орнына жүрмейді.</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">{knowledgePointIds.map((id) => {
          const item = evidence.get(id);
          const title = release.knowledgePointRevisions.find((revision) => revision.knowledgePointId === id)?.titleKazakh ?? id;
          return <li key={id} className="rounded-xl bg-card-soft px-3 py-2.5 text-xs text-text-secondary"><span className="font-semibold text-text-primary">{title}</span><span className="mt-1 block">{item?.exposed ? "Танысқан" : "Жаңа"} · {item?.practiceCount ?? 0} жаттығу дәлелі</span></li>;
        })}</ul>
        <Link href={"/learn/hsk/" + release.path.levelId + "/units/" + release.units[0]?.id} className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-blue/25 bg-ice px-4 text-sm font-semibold text-blue-dark focus-visible:outline-2 focus-visible:outline-blue">U01 негізгі жолына өту</Link>
      </section>}

      {mode === "path" && lesson && pathState === "completed" && <section className="rounded-2xl border border-success/20 bg-success-bg p-4 sm:p-5">
        <h2 className="text-base font-semibold text-success">Сабақ негізгі жолда аяқталды</h2>
        <p className="mt-1 text-sm leading-6 text-success">Аяқталу тек осы жолдағы жарамды Assessment нәтижесімен есептеледі.</p>
        {release.path.orderedLessonIds[release.path.orderedLessonIds.indexOf(lesson.id) + 1] && <button type="button" onClick={() => selectLesson(release.path.orderedLessonIds[release.path.orderedLessonIds.indexOf(lesson.id) + 1])} className="mt-3 min-h-11 rounded-xl bg-blue-dark px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Келесі сабақ</button>}
      </section>}

      <div className="flex flex-wrap gap-3 text-sm">
        {mode === "independent" && <Link href="/learn/modules" className="inline-flex min-h-11 items-center rounded-xl border border-border-soft bg-card px-4 font-semibold text-text-secondary focus-visible:outline-2 focus-visible:outline-blue">Модульдер тізімі</Link>}
        {mode === "path" && <Link href={"/learn/hsk/" + release.path.levelId} className="inline-flex min-h-11 items-center rounded-xl border border-border-soft bg-card px-4 font-semibold text-text-secondary focus-visible:outline-2 focus-visible:outline-blue">HSK деңгейіне оралу</Link>}
      </div>
    </div>
  );
}
