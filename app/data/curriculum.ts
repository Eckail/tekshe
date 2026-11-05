/**
 * Versioned curriculum contracts shared by pronunciation and HSK courses.
 * Level IDs belong to a curriculum version; no fixed number of levels is
 * assumed by the application.
 */
export type CurriculumModuleKind =
  | "phonetics"
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

export type WordPartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "pronoun"
  | "adverb"
  | "particle"
  | "numeral"
  | "classifier"
  | "preposition"
  | "conjunction"
  | "phrase"
  | "interjection";

export type CurriculumStandard = {
  id: string;
  name: string;
  version: string;
  publishedAt?: string;
  effectiveFrom?: string;
  sourceUrl?: string;
  publisher?: string;
};

export type CurriculumSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedAt?: string;
  consultedAt: string;
  locator?: string;
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

export type TeachingSection = {
  id: string;
  title: string;
  explanationKazakh: string;
  items?: string[];
  examples?: VocabularyExample[];
};

export type CharacterLearningMetadata = {
  character: string;
  strokeCount?: number;
  radical?: string;
  structure?: string;
  strokeOrderAssetId?: string;
  commonErrorsKazakh?: string[];
};

export type VocabularyEntry = {
  id: string;
  curriculumId: string;
  levelId: string;
  hanzi: string;
  pinyin: string;
  /** Lexical tone for each written syllable; sandhi is kept in pronunciation notes. */
  tones: MandarinTone[];
  translationKazakh: string;
  translationReview: "editorial-draft" | "native-reviewed";
  partOfSpeech: WordPartOfSpeech;
  example: VocabularyExample;
  sourceId: string;
  audioAssetId?: string;
  difficulty: number;
  characterDetails?: CharacterLearningMetadata[];
  collocations?: string[];
  grammarPointIds?: string[];
  commonErrorsKazakh?: string[];
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
  options?: string[];
  /** Mandarin text read aloud by the browser for listening-selection items. */
  audioText?: string;
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
  introductionKazakh?: string;
  learningObjectives: string[];
  teachingSections?: TeachingSection[];
  vocabularyIds: string[];
  grammarPointIds: string[];
  readingMaterialIds: string[];
  exerciseIds: string[];
  estimatedDurationMinutes: number;
  prerequisites: string[];
};

export type Curriculum = {
  id: string;
  title: string;
  descriptionKazakh?: string;
  editorialNoteKazakh?: string;
  standard: CurriculumStandard;
  version: string;
  sources: CurriculumSource[];
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

/** Backward-compatible name for callers that refer specifically to HSK data. */
export type HskCurriculum = Curriculum;
