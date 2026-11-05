import type { HskCurriculum } from "./curriculum";

/**
 * Tekshe's own beginner curriculum. This is not an official HSK syllabus.
 * Content is deliberately small while the curriculum model is being validated.
 */
export const beginnerCurriculum: HskCurriculum = {
  id: "tekshe-mandarin-beginner",
  title: "Қытай тіліне алғашқы қадам",
  standard: {
    id: "tekshe-beginner",
    name: "Tekshe 初学者课程标准",
    version: "1.0",
  },
  version: "1.0.0",
  levels: [
    {
      id: "beginner-1",
      displayName: "Бастапқы деңгей",
      sequence: 1,
      learningGoals: [
        "Пиньинь жүйесінің негізгі қызметін түсіну",
        "Төрт негізгі тонды ажырату",
      ],
      unitIds: ["pinyin-unit-1"],
    },
  ],
  modules: [
    {
      id: "pinyin-module",
      kind: "vocabulary-characters",
      title: "Пиньинь және дыбыстау",
      learningObjectives: [
        "Пиньинь буынының бастапқы дауыссыз және соңғы бөлігін тану",
        "Тон белгілерін ажырату",
      ],
      lessonIds: ["pinyin-lesson-1"],
    },
  ],
  units: [
    {
      id: "pinyin-unit-1",
      levelId: "beginner-1",
      title: "Пиньиньге кіріспе",
      sequence: 1,
      moduleIds: ["pinyin-module"],
      prerequisites: [],
    },
  ],
  lessons: [
    {
      id: "pinyin-lesson-1",
      curriculumId: "tekshe-mandarin-beginner",
      levelId: "beginner-1",
      unitId: "pinyin-unit-1",
      moduleId: "pinyin-module",
      title: "Пиньинь дегеніміз не?",
      learningObjectives: [
        "Пиньиньнің қытай дыбыстарын белгілеу жүйесі екенін түсіндіру",
        "mā буынындағы m, a және бірінші тонды ажырату",
      ],
      vocabularyIds: ["word-ma"],
      grammarPointIds: [],
      readingMaterialIds: [],
      exerciseIds: ["identify-tone-ma"],
      estimatedDurationMinutes: 8,
      prerequisites: [],
    },
  ],
  vocabulary: [
    {
      id: "word-ma",
      curriculumId: "tekshe-mandarin-beginner",
      levelId: "beginner-1",
      hanzi: "妈",
      pinyin: "mā",
      tone: 1,
      translationKazakh: "ана",
      partOfSpeech: "зат есім",
      example: {
        hanzi: "妈妈",
        pinyin: "māma",
        translationKazakh: "ана",
      },
      difficulty: 1,
    },
  ],
  grammarPoints: [],
  readings: [],
  audioAssets: [],
  exercises: [
    {
      id: "identify-tone-ma",
      type: "multiple-choice",
      prompt: "mā буынында қай тон қолданылады?",
      answer: "Бірінші тон",
      explanationKazakh: "Бірінші тон жоғары әрі бірқалыпты айтылады.",
    },
  ],
};

export const curriculumRegistry: HskCurriculum[] = [beginnerCurriculum];

export function getCurriculumById(id: string): HskCurriculum | undefined {
  return curriculumRegistry.find((curriculum) => curriculum.id === id);
}
