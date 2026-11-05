/**
 * Versioned curriculum contracts. Level IDs belong to a curriculum version,
 * so a later HSK standard can add, rename, or regroup levels without changing
 * the application model.
 */
export type CurriculumModuleKind =
  | "pronunciation"
  | "vocabulary-characters"
  | "grammar"
  | "reading"
  | "listening"
  | "writing"
  | "speaking"
  | "exam-preparation"
  | "cultural-immersion";

export type ExerciseType =
  | "multiple-choice"
  | "matching"
  | "fill-in-the-blank"
  | "word-ordering"
  | "translation"
  | "listening-selection"
  | "dictation"
  | "character-recognition"
  | "sentence-construction"
  | "dialogue-completion"
  | "reading-comprehension";

export type CopyrightStatus =
  | "original"
  | "public-domain"
  | "licensed"
  | "excerpt"
  | "pending-review";

export type MandarinTone = 1 | 2 | 3 | 4 | "neutral";

export type CurriculumStandard = {
  id: string;
  name: string;
  version: string;
  publishedAt?: string;
  effectiveFrom?: string;
  sourceUrl?: string;
};

export type CurriculumLevel = {
  id: string;
  displayName: string;
  sequence: number;
  learningGoals: string[];
  unitIds: string[];
};

export type CurriculumModule = {
  id: string;
  kind: CurriculumModuleKind;
  title: string;
  learningObjectives: string[];
  lessonIds: string[];
};

export type CurriculumUnit = {
  id: string;
  levelId: string;
  title: string;
  sequence: number;
  moduleIds: string[];
  prerequisites: string[];
};

export type VocabularyExample = {
  hanzi: string;
  pinyin: string;
  translationKazakh: string;
};

export type VocabularyEntry = {
  id: string;
  curriculumId: string;
  levelId: string;
  hanzi: string;
  pinyin: string;
  tone: MandarinTone;
  translationKazakh: string;
  partOfSpeech: string;
  example: VocabularyExample;
  audioAssetId?: string;
  difficulty: number;
};

export type GrammarPoint = {
  id: string;
  curriculumId: string;
  levelId: string;
  title: string;
  explanationKazakh: string;
  examples: VocabularyExample[];
};

export type AudioAsset = {
  id: string;
  language: "zh-CN";
  transcript: string;
  pinyin?: string;
  durationSeconds?: number;
  speed: "slow" | "normal" | "native";
  source: string;
  copyrightStatus: CopyrightStatus;
};

export type ComprehensionQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanationKazakh: string;
};

export type ReadingMaterial = {
  id: string;
  curriculumId: string;
  levelId: string;
  title: string;
  originalText: string;
  translationKazakh?: string;
  vocabularyIds: string[];
  grammarPointIds: string[];
  comprehensionQuestions: ComprehensionQuestion[];
  culturalNotes: string[];
  source: string;
  copyrightStatus: CopyrightStatus;
};

export type CurriculumExercise = {
  id: string;
  type: ExerciseType;
  prompt: string;
  answer: string | string[];
  explanationKazakh: string;
  audioAssetId?: string;
  readingMaterialId?: string;
};

export type CurriculumLesson = {
  id: string;
  curriculumId: string;
  levelId: string;
  unitId: string;
  moduleId: string;
  title: string;
  learningObjectives: string[];
  vocabularyIds: string[];
  grammarPointIds: string[];
  readingMaterialIds: string[];
  exerciseIds: string[];
  estimatedDurationMinutes: number;
  prerequisites: string[];
};

export type HskCurriculum = {
  id: string;
  title: string;
  standard: CurriculumStandard;
  version: string;
  levels: CurriculumLevel[];
  modules: CurriculumModule[];
  units: CurriculumUnit[];
  lessons: CurriculumLesson[];
  vocabulary: VocabularyEntry[];
  grammarPoints: GrammarPoint[];
  readings: ReadingMaterial[];
  audioAssets: AudioAsset[];
  exercises: CurriculumExercise[];
};
