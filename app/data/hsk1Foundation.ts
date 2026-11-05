import type {
  Curriculum,
  CurriculumExercise,
  CurriculumLesson,
  VocabularyEntry,
  VocabularyExample,
} from "./curriculum";

export const hsk2025SyllabusUrl =
  "https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf";

export const hsk1FoundationId = "hsk-2025-syllabus-level-1-foundation";
export const hsk1LevelId = "hsk-2025-level-1";
export const hsk1SourceId = "clec-hsk-exam-syllabus-2025-level-1-vocabulary";

const sample = (
  hanzi: string,
  pinyin: string,
  translationKazakh: string
): VocabularyExample => ({ hanzi, pinyin, translationKazakh });

function word(
  id: string,
  hanzi: string,
  pinyin: string,
  tones: VocabularyEntry["tones"],
  partOfSpeech: VocabularyEntry["partOfSpeech"],
  translationKazakh: string,
  example: VocabularyExample
): VocabularyEntry {
  return {
    id,
    curriculumId: hsk1FoundationId,
    levelId: hsk1LevelId,
    hanzi,
    pinyin,
    tones,
    translationKazakh,
    translationReview: "editorial-draft",
    partOfSpeech,
    example,
    sourceId: hsk1SourceId,
    difficulty: 1,
  };
}

export const hsk1FoundationVocabulary: VocabularyEntry[] = [
  word("hsk1-ai", "爱", "ài", [4], "verb", "жақсы көру", sample("我爱妈妈。", "Wǒ ài māma.", "Мен анамды жақсы көремін.")),
  word("hsk1-baba", "爸爸", "bàba", [4, "neutral"], "noun", "әке", sample("爸爸爱我。", "Bàba ài wǒ.", "Әкем мені жақсы көреді.")),
  word("hsk1-bu", "不", "bù", [4], "adverb", "емес; болымсыздық мәнін береді", sample("我不喝茶。", "Wǒ bù hē chá.", "Мен шай ішпеймін.")),
  word("hsk1-cha", "茶", "chá", [2], "noun", "шай", sample("我喝茶。", "Wǒ hē chá.", "Мен шай ішемін.")),
  word("hsk1-chi", "吃", "chī", [1], "verb", "жеу", sample("我吃饭。", "Wǒ chī fàn.", "Мен тамақ жеймін.")),
  word("hsk1-he", "喝", "hē", [1], "verb", "ішу", sample("你喝水吗？", "Nǐ hē shuǐ ma?", "Сен су ішесің бе?")),
  word("hsk1-hao", "好", "hǎo", [3], "adjective", "жақсы", sample("你好！", "Nǐ hǎo!", "Сәлем!")),
  word("hsk1-hanyu", "汉语", "Hànyǔ", [4, 3], "noun", "қытай тілі", sample("我学习汉语。", "Wǒ xuéxí Hànyǔ.", "Мен қытай тілін үйреніп жүрмін.")),
  word("hsk1-jia", "家", "jiā", [1], "noun", "үй; отбасы", sample("我家有三个人。", "Wǒ jiā yǒu sān ge rén.", "Менің отбасымда үш адам бар.")),
  word("hsk1-jintian", "今天", "jīntiān", [1, 1], "noun", "бүгін", sample("今天我学习。", "Jīntiān wǒ xuéxí.", "Бүгін мен оқимын.")),
  word("hsk1-laoshi", "老师", "lǎoshī", [3, 1], "noun", "мұғалім", sample("老师好！", "Lǎoshī hǎo!", "Сәлеметсіз бе, мұғалім!")),
  word("hsk1-mama", "妈妈", "māma", [1, "neutral"], "noun", "ана", sample("妈妈爱我。", "Māma ài wǒ.", "Анам мені жақсы көреді.")),
  word("hsk1-nihao", "你好", "nǐhǎo", [3, 3], "phrase", "сәлем", sample("你好！", "Nǐ hǎo!", "Сәлем!")),
  word("hsk1-ni", "你", "nǐ", [3], "pronoun", "сен", sample("你是老师吗？", "Nǐ shì lǎoshī ma?", "Сен мұғалімсің бе?")),
  word("hsk1-pengyou", "朋友", "péngyou", [2, "neutral"], "noun", "дос", sample("你是我的朋友。", "Nǐ shì wǒ de péngyou.", "Сен менің досымсың.")),
  word("hsk1-qing", "请", "qǐng", [3], "verb", "өтіну; сыпайы өтініш білдіру", sample("请喝水。", "Qǐng hē shuǐ.", "Су ішіңізші.")),
  word("hsk1-qingwen", "请问", "qǐngwèn", [3, 4], "phrase", "айтыңызшы; рұқсат болса сұрасам", sample("请问，你是老师吗？", "Qǐngwèn, nǐ shì lǎoshī ma?", "Айтыңызшы, сіз мұғалімсіз бе?")),
  word("hsk1-shenme", "什么", "shénme", [2, "neutral"], "pronoun", "не; қандай", sample("你叫什么？", "Nǐ jiào shénme?", "Атың кім?")),
  word("hsk1-shi", "是", "shì", [4], "verb", "болу; болып табылу", sample("我是学生。", "Wǒ shì xuéshēng.", "Мен студентпін.")),
  word("hsk1-shui", "水", "shuǐ", [3], "noun", "су", sample("请喝水。", "Qǐng hē shuǐ.", "Су ішіңізші.")),
  word("hsk1-xiexie", "谢谢", "xièxie", [4, "neutral"], "verb", "рақмет айту", sample("谢谢你。", "Xièxie nǐ.", "Саған рақмет.")),
  word("hsk1-xue", "学", "xué", [2], "verb", "оқу; үйрену", sample("我学汉语。", "Wǒ xué Hànyǔ.", "Мен қытай тілін үйреніп жүрмін.")),
  word("hsk1-xuesheng", "学生", "xuéshēng", [2, 1], "noun", "оқушы; студент", sample("学生在学校学习。", "Xuéshēng zài xuéxiào xuéxí.", "Оқушы мектепте оқиды.")),
  word("hsk1-xuexi", "学习", "xuéxí", [2, 2], "verb", "оқу; білім алу", sample("我学习汉语。", "Wǒ xuéxí Hànyǔ.", "Мен қытай тілін үйреніп жүрмін.")),
  word("hsk1-yi", "一", "yī", [1], "numeral", "бір", sample("我有一个朋友。", "Wǒ yǒu yí ge péngyou.", "Менің бір досым бар.")),
  word("hsk1-zaijian", "再见", "zàijiàn", [4, 4], "phrase", "сау бол; қош бол", sample("老师，再见！", "Lǎoshī, zàijiàn!", "Сау болыңыз, мұғалім!")),
  word("hsk1-zhongguo", "中国", "Zhōngguó", [1, 2], "noun", "Қытай", sample("我爱中国。", "Wǒ ài Zhōngguó.", "Мен Қытайды жақсы көремін.")),
  word("hsk1-wo", "我", "wǒ", [3], "pronoun", "мен", sample("我是老师。", "Wǒ shì lǎoshī.", "Мен мұғаліммін.")),
  word("hsk1-ta", "他", "tā", [1], "pronoun", "ол (ер адам)", sample("他是我的朋友。", "Tā shì wǒ de péngyou.", "Ол менің досым.")),
];

const curriculumId = hsk1FoundationId;
const unitId = "hsk-2025-level-1-unit-foundations";
const moduleId = "hsk-2025-level-1-vocabulary-module";

const lessonOneIds = [
  "hsk1-ai", "hsk1-baba", "hsk1-jia", "hsk1-mama", "hsk1-nihao", "hsk1-ni", "hsk1-pengyou", "hsk1-ta", "hsk1-wo",
];
const lessonTwoIds = [
  "hsk1-hanyu", "hsk1-hao", "hsk1-laoshi", "hsk1-shi", "hsk1-xue", "hsk1-xuesheng", "hsk1-xuexi", "hsk1-zhongguo",
];
const lessonThreeIds = [
  "hsk1-bu", "hsk1-cha", "hsk1-chi", "hsk1-he", "hsk1-jintian", "hsk1-qing", "hsk1-qingwen", "hsk1-shenme", "hsk1-shui", "hsk1-xiexie", "hsk1-yi", "hsk1-zaijian",
];

const lessons: CurriculumLesson[] = [
  {
    id: "hsk1-introductions",
    curriculumId,
    levelId: hsk1LevelId,
    unitId,
    moduleId,
    title: "Өзіңді және отбасыңды таныстыру",
    introductionKazakh: "Жақын адамдар мен отбасы туралы қарапайым сөйлемдерді оқып, қолдануды бастаңыз.",
    learningObjectives: ["你好 арқылы амандасу.", "我, 你, 他 есімдіктерін ажырату.", "Отбасы және дос туралы қысқа сөйлем құрау."],
    teachingSections: [{
      id: "hsk1-introductions-note",
      title: "Сөйлем үлгісі",
      explanationKazakh: "Қарапайым таныстыруда есімдік + 是 + адам атауы үлгісін қолдануға болады. Жақын адамды сипаттағанда 家 және 朋友 сөздерін пайдаланыңыз.",
      examples: [sample("我是学生。", "Wǒ shì xuéshēng.", "Мен студентпін."), sample("他是我的朋友。", "Tā shì wǒ de péngyou.", "Ол менің досым.")],
    }],
    vocabularyIds: lessonOneIds,
    grammarPointIds: [],
    readingMaterialIds: [],
    exerciseIds: ["hsk1-intro-friend", "hsk1-intro-pronoun"],
    estimatedDurationMinutes: 12,
    prerequisites: [],
  },
  {
    id: "hsk1-classroom",
    curriculumId,
    levelId: hsk1LevelId,
    unitId,
    moduleId,
    title: "Сабақ және қытай тілін үйрену",
    introductionKazakh: "Оқушы, мұғалім және қытай тілін үйрену туралы сөздерді бір тақырыпқа біріктіріңіз.",
    learningObjectives: ["Мұғалім мен оқушыны атау.", "学, 学习 және 汉语 сөздерін сөйлемде қолдану.", "Өзіңнің кім екеніңді 是 үлгісімен айту."],
    teachingSections: [{
      id: "hsk1-classroom-note",
      title: "Сөзден сөйлемге",
      explanationKazakh: "学习 — оқу немесе үйрену әрекеті. Оның соңынан 汉语 сияқты оқу нысанын атауға болады: 我学习汉语。",
      examples: [sample("我学习汉语。", "Wǒ xuéxí Hànyǔ.", "Мен қытай тілін үйреніп жүрмін."), sample("老师好！", "Lǎoshī hǎo!", "Сәлеметсіз бе, мұғалім!")],
    }],
    vocabularyIds: lessonTwoIds,
    grammarPointIds: [],
    readingMaterialIds: [],
    exerciseIds: ["hsk1-classroom-language", "hsk1-classroom-study"],
    estimatedDurationMinutes: 12,
    prerequisites: ["hsk1-introductions"],
  },
  {
    id: "hsk1-daily-language",
    curriculumId,
    levelId: hsk1LevelId,
    unitId,
    moduleId,
    title: "Күнделікті сөздер мен сыпайы өтініш",
    introductionKazakh: "Ас ішу, қарапайым сұрақ қою және әңгімелесуді сыпайы аяқтау үшін қолданылатын сөздерді жаттығыңыз.",
    learningObjectives: ["Болымсыз 不 сөзін сөйлемде қолдану.", "请 және 请问 арқылы өтініш пен сұрақ бастау.", "Тон өзгерісін ескеріп, 一 және 谢谢 сөздерін оқу."],
    teachingSections: [{
      id: "hsk1-daily-note",
      title: "Сыпайылық және дыбыстау",
      explanationKazakh: "请 өтінішті сыпайы етеді, 请问 сұрақты жұмсақ бастайды. 一 сөзінің негізгі жазылымы yī болғанымен, төртінші тонды буынның алдында yí болып айтылады: 一个 yí ge.",
      examples: [sample("请喝水。", "Qǐng hē shuǐ.", "Су ішіңізші."), sample("我有一个朋友。", "Wǒ yǒu yí ge péngyou.", "Менің бір досым бар.")],
    }],
    vocabularyIds: lessonThreeIds,
    grammarPointIds: [],
    readingMaterialIds: [],
    exerciseIds: ["hsk1-daily-negation", "hsk1-daily-request", "hsk1-daily-one"],
    estimatedDurationMinutes: 14,
    prerequisites: ["hsk1-classroom"],
  },
];

const exercises: CurriculumExercise[] = [
  {
    id: "hsk1-intro-friend",
    type: "multiple-choice",
    prompt: "«Дос» сөзінің қытайша жазылуын таңдаңыз.",
    options: ["朋友", "老师", "学生"],
    answer: "朋友",
    explanationKazakh: "朋友 péngyou — дос деген сөз.",
  },
  {
    id: "hsk1-intro-pronoun",
    type: "multiple-choice",
    prompt: "他 есімдігінің мағынасы қайсы?",
    options: ["мен", "сен", "ол (ер адам)"],
    answer: "ол (ер адам)",
    explanationKazakh: "他 tā — ер адамға қатысты қолданылатын «ол» есімдігі.",
  },
  {
    id: "hsk1-classroom-language",
    type: "multiple-choice",
    prompt: "«Қытай тілі» сөзін таңдаңыз.",
    options: ["汉语", "中国", "学生"],
    answer: "汉语",
    explanationKazakh: "汉语 Hànyǔ — қытай тілі; 中国 Zhōngguó — Қытай елі.",
  },
  {
    id: "hsk1-classroom-study",
    type: "multiple-choice",
    prompt: "我学习汉语 сөйлеміндегі әрекетті білдіретін сөз қайсы?",
    options: ["学习", "老师", "中国"],
    answer: "学习",
    explanationKazakh: "学习 xuéxí — оқу, үйрену әрекеті.",
  },
  {
    id: "hsk1-daily-negation",
    type: "multiple-choice",
    prompt: "«Мен шай ішпеймін» деген сөйлемді таңдаңыз.",
    options: ["我不喝茶。", "我喝茶。", "请喝水。"],
    answer: "我不喝茶。",
    explanationKazakh: "不 болымсыздықты білдіреді: 我不喝茶。 — Мен шай ішпеймін.",
  },
  {
    id: "hsk1-daily-request",
    type: "multiple-choice",
    prompt: "«Су ішіңізші» деген сыпайы өтініш қайсы?",
    options: ["请喝水。", "我爱妈妈。", "谢谢你。"],
    answer: "请喝水。",
    explanationKazakh: "请 сөйлемді өтінішке айналдырады: 请喝水。 — Су ішіңізші.",
  },
  {
    id: "hsk1-daily-one",
    type: "multiple-choice",
    prompt: "一个 сөзінде 一 қалай айтылады?",
    options: ["yī", "yí", "yì"],
    answer: "yí",
    explanationKazakh: "一 төртінші тонды буынның алдында көбіне екінші тонға ауысады: yí ge.",
  },
];

export const hsk1FoundationCurriculum: Curriculum = {
  id: curriculumId,
  title: "HSK 1: алғашқы сөздер",
  version: "2025.11-content-v1",
  descriptionKazakh:
    "2025 жылғы HSK емтиханының бірінші деңгейіндегі сөздерден алынған шағын, тақырып бойынша реттелген бастау курсы.",
  editorialNoteKazakh:
    "Қазақша түсіндірмелер мен аудармалар бастапқы редакторлық нұсқа; жариялаудың алдында қазақ тілі ана тілі болып табылатын редактор тексеруі қажет.",
  standard: {
    id: "clec-hsk-exam-syllabus-2025-11",
    name: "HSK 考试大纲 / Syllabus for the Chinese Proficiency Test (2025 edition, HSK 3.0)",
    version: "2025-11",
    publishedAt: "2025-11",
    effectiveFrom: "2026-07",
    publisher: "中外语言交流合作中心",
    sourceUrl: hsk2025SyllabusUrl,
  },
  sources: [
    {
      id: hsk1SourceId,
      title: "HSK 考试大纲 / Syllabus for the Chinese Proficiency Test",
      publisher: "中外语言交流合作中心",
      url: hsk2025SyllabusUrl,
      publishedAt: "2025-11",
      consultedAt: "2026-11-05",
      locator: "词汇大纲，HSK（一级）词表，第 77 页起；本批词条均按一级词表核对",
    },
  ],
  levels: [{
    id: hsk1LevelId,
    displayName: "HSK 1",
    sequence: 1,
    learningGoals: [
      "掌握少量基础词汇并理解个人信息、学习和日常生活中的简单表达。",
      "识读并朗读本课程词语及例句。",
      "使用基础问候、否定和礼貌请求表达简单意思。",
    ],
    unitIds: [unitId],
  }],
  modules: [{
    id: moduleId,
    kind: "vocabulary-characters",
    title: "HSK 1 基础词汇",
    learningObjectives: [
      "按交际主题学习一级词汇。",
      "结合拼音、声调和例句理解词语。",
    ],
    lessonIds: lessons.map(({ id }) => id),
  }],
  units: [{
    id: unitId,
    levelId: hsk1LevelId,
    title: "基础交际词汇",
    sequence: 1,
    moduleIds: [moduleId],
    prerequisites: [],
  }],
  lessons,
  vocabulary: hsk1FoundationVocabulary,
  grammarPoints: [],
  readings: [],
  audioAssets: [],
  exercises,
};
