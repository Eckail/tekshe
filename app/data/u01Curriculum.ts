import type {
  Assessment,
  ContentBlock,
  CoverageRequirement,
  CurriculumLesson,
  CurriculumRelease,
  Exercise,
  IndependentModule,
  KnowledgePoint,
  KnowledgePointRevision,
  ScoredExercise,
  VocabularyContentRevision,
} from "./learningContracts";

export const U01_RELEASE_ID = "tekshe-hsk1-u01-release-v1";
export const U01_CURRICULUM_ID = "tekshe-hsk1-u01";
export const U01_LEVEL_ID = "hsk-2025-level-1";
export const U01_UNIT_ID = "hsk1-u01-personal-introductions";
export const U01_PATH_ID = "tekshe-hsk1-structured-path-v1";
export const HSK_SYLLABUS_2025_SOURCE = "https://download.chinesetest.cn/newhsk-site/Syllabus/H_DG_1110.pdf";

const TASK_T01 = "hsk-2025-11-hsk1-task-t01";
const TASK_T06 = "hsk-2025-11-hsk1-task-t06";
const TOPIC_PERSONAL_INFO = "hsk-2025-11-hsk1-topic-basic-information-personal-information";
const TOPIC_INTERACTION = "hsk-2025-11-hsk1-topic-daily-life-interaction-basic-politeness";
const taskLocator = "任务大纲 HSK 1，PDF 第 2–5 页，T01「问答个人基本信息」";
const interactionTaskLocator = "任务大纲 HSK 1，PDF 第 2–5 页，T06「日常言语交往」";
const topicLocator = "话题大纲 HSK 1，PDF 第 56–57 页，基本信息 > 个人信息";
const interactionTopicLocator = "话题大纲 HSK 1，PDF 第 56 页，日常生活 > 交往 > 基本礼貌行为";
const vocabularyLocator = (word: string) => `词汇大纲 HSK 1，PDF 第 77–83 页，词头「${word}」`;

const officialVocabulary: Array<{ word: string; kp: string }> = [
  { word: "你好", kp: "kp.vocabulary.0001" },
  { word: "我", kp: "kp.vocabulary.0002" },
  { word: "你", kp: "kp.vocabulary.0003" },
  { word: "是", kp: "kp.vocabulary.0011" },
  { word: "叫", kp: "kp.vocabulary.0004" },
  { word: "什么", kp: "kp.vocabulary.0005" },
  { word: "名字", kp: "kp.vocabulary.0006" },
  { word: "哪", kp: "kp.vocabulary.0007" },
  { word: "国", kp: "kp.vocabulary.0008" },
  { word: "人", kp: "kp.vocabulary.0009" },
  { word: "吗", kp: "kp.vocabulary.0012" },
  { word: "学生", kp: "kp.vocabulary.0013" },
  { word: "汉语", kp: "kp.vocabulary.0014" },
  { word: "学习", kp: "kp.vocabulary.0015" },
  { word: "好", kp: "kp.vocabulary.0016" },
  { word: "再见", kp: "kp.vocabulary.0017" },
];

const requirements: CoverageRequirement[] = [
  {
    id: TASK_T01,
    standardReferenceId: "hsk-exam-syllabus-2025-11",
    section: "task",
    officialItemKey: "T01",
    sourceLocator: taskLocator,
    knowledgePointIds: ["kp.vocabulary.0001", "kp.vocabulary.0004", "kp.vocabulary.0006", "kp.grammar.0001", "kp.grammar.0002"],
    unitIds: [U01_UNIT_ID],
    coverageStatus: "partial",
  },
  {
    id: TOPIC_PERSONAL_INFO,
    standardReferenceId: "hsk-exam-syllabus-2025-11",
    section: "topic",
    officialItemKey: "基本信息 > 个人信息",
    sourceLocator: topicLocator,
    knowledgePointIds: ["kp.vocabulary.0004", "kp.vocabulary.0006", "kp.vocabulary.0007", "kp.vocabulary.0009", "kp.grammar.0001", "kp.grammar.0002"],
    unitIds: [U01_UNIT_ID],
    coverageStatus: "partial",
  },
  {
    id: TASK_T06,
    standardReferenceId: "hsk-exam-syllabus-2025-11",
    section: "task",
    officialItemKey: "T06",
    sourceLocator: interactionTaskLocator,
    knowledgePointIds: ["kp.vocabulary.0001", "kp.vocabulary.0016", "kp.vocabulary.0017", "kp.speaking.0001"],
    unitIds: [U01_UNIT_ID],
    coverageStatus: "partial",
  },
  {
    id: TOPIC_INTERACTION,
    standardReferenceId: "hsk-exam-syllabus-2025-11",
    section: "topic",
    officialItemKey: "日常生活 > 交往 > 基本礼貌行为",
    sourceLocator: interactionTopicLocator,
    knowledgePointIds: ["kp.vocabulary.0001", "kp.vocabulary.0016", "kp.vocabulary.0017", "kp.speaking.0001"],
    unitIds: [U01_UNIT_ID],
    coverageStatus: "partial",
  },
  ...officialVocabulary.map(({ word, kp }) => ({
    id: `hsk-2025-11-hsk1-vocabulary-${encodeURIComponent(word)}`,
    standardReferenceId: "hsk-exam-syllabus-2025-11",
    section: "vocabulary" as const,
    officialItemKey: word,
    sourceLocator: vocabularyLocator(word),
    knowledgePointIds: [kp],
    unitIds: [U01_UNIT_ID],
    coverageStatus: "mapped" as const,
  })),
];

const block = (input: Omit<ContentBlock, "revisionId" | "editorialStatus"> & { revisionId?: string }): ContentBlock => ({
  ...input,
  revisionId: input.revisionId ?? `${input.id}-r1`,
  editorialStatus: "draft",
});

const contentBlocks: ContentBlock[] = [
  block({
    id: "u01-l1-pinyin-and-greeting",
    kind: "explanation",
    titleKazakh: "你好: жазылуы мен табиғи айтылымы",
    textChinese: "你好！",
    pinyin: "nǐ hǎo → ní hǎo",
    translationKazakh: "Сәлем!",
    explanationKazakh: "你好 сөзінде екі үшінші тон қатар тұр. Пиньиньде негізгі тон белгілері сақталады: nǐ hǎo. Сөйлегенде бірінші буын екінші тонға ұқсап айтылады: ní hǎo. Жазылым мен айтылымды бөлек ажыратыңыз.",
    sourceRequirementIds: [TASK_T01, TASK_T06, TOPIC_PERSONAL_INFO, TOPIC_INTERACTION],
  }),
  block({
    id: "u01-l1-pronouns-example",
    kind: "example",
    titleKazakh: "Екі негізгі есімдік",
    textChinese: "我叫阿依。你呢？",
    pinyin: "Wǒ jiào Āyī. Nǐ ne?",
    translationKazakh: "Менің атым Аи. Ал сен ше?",
    explanationKazakh: "我 — «мен», 你 — «сен». 阿依 — тек мысал есім; ресми HSK сөздігіне кірмейді.",
    sourceRequirementIds: [TASK_T01, TOPIC_PERSONAL_INFO],
  }),
  block({
    id: "u01-l2-name-pattern",
    kind: "explanation",
    titleKazakh: "Атыңды сұрау және айту",
    textChinese: "你叫什么名字？我叫阿依。",
    pinyin: "Nǐ jiào shénme míngzi? Wǒ jiào Āyī.",
    translationKazakh: "Атың кім? Менің атым Аи.",
    explanationKazakh: "Сұрақ үлгісі: 你 + 叫 + 什么名字？ Жауапта: 我 + 叫 + есім. Бұл үлгіде 叫 «аталу/атын айту» мағынасын береді.",
    sourceRequirementIds: [TASK_T01, TOPIC_PERSONAL_INFO],
  }),
  block({
    id: "u01-dialogue-first-meeting",
    kind: "dialogue",
    titleKazakh: "1-диалог: алғашқы кездесу",
    textChinese: "A: 你好！你叫什么名字？\nB: 你好！我叫阿依。\nA: 我叫安娜。\nB: 再见！\nA: 再见！",
    pinyin: "A: Nǐ hǎo! Nǐ jiào shénme míngzi?\nB: Nǐ hǎo! Wǒ jiào Āyī.\nA: Wǒ jiào Ānnà.\nB: Zàijiàn!\nA: Zàijiàn!",
    translationKazakh: "A: Сәлем! Атың кім?\nB: Сәлем! Менің атым Аи.\nA: Менің атым Анна.\nB: Сау бол!\nA: Сау бол!",
    explanationKazakh: "Диалог T01 жеке ақпарат сұрау және жауап беру үлгісін T06 күнделікті сәлемдесу және қоштасумен байланыстырады. 阿依 мен 安娜 — үйрету үшін алынған мысал есімдер.",
    sourceRequirementIds: [TASK_T01, TASK_T06, TOPIC_PERSONAL_INFO, TOPIC_INTERACTION],
  }),
  block({
    id: "u01-l3-nationality-pattern",
    kind: "explanation",
    titleKazakh: "Ұлты мен кім екенін айту",
    textChinese: "你是哪国人？我是哈萨克斯坦人。",
    pinyin: "Nǐ shì nǎ guó rén? Wǒ shì Hāsàkèsītǎn rén.",
    translationKazakh: "Сен қай елденсің? Мен Қазақстаннанмын.",
    explanationKazakh: "哪国人 үлгісі «қай елдің адамы?» деп сұрайды. 哈萨克斯坦 — Қазақстан атауының қытайша жазылуы; ол осы мысалдағы контекстік жалқы есім, HSK 1 сөздік талабы ретінде саналмайды.",
    sourceRequirementIds: [TASK_T01, TOPIC_PERSONAL_INFO],
  }),
  block({
    id: "u01-l3-identity-pattern",
    kind: "example",
    titleKazakh: "Оқушы екенін айту",
    textChinese: "你是学生吗？我是学生。",
    pinyin: "Nǐ shì xuésheng ma? Wǒ shì xuésheng.",
    translationKazakh: "Сен оқушысың ба? Мен оқушымын.",
    explanationKazakh: "学生 — оқушы/студент. Сөйлем соңындағы 吗 жалпы сұрақ жасайды; жауапта 是 үлгісін қайталауға болады.",
    sourceRequirementIds: [TASK_T01, TOPIC_PERSONAL_INFO],
  }),
  block({
    id: "u01-dialogue-nationality",
    kind: "dialogue",
    titleKazakh: "2-диалог: ел және оқу",
    textChinese: "A: 你是哪国人？\nB: 我是哈萨克斯坦人。你是学生吗？\nA: 我是学生。我学习汉语。\nB: 好！",
    pinyin: "A: Nǐ shì nǎ guó rén?\nB: Wǒ shì Hāsàkèsītǎn rén. Nǐ shì xuésheng ma?\nA: Wǒ shì xuésheng. Wǒ xuéxí Hànyǔ.\nB: Hǎo!",
    translationKazakh: "A: Сен қай елденсің?\nB: Мен Қазақстаннанмын. Сен оқушысың ба?\nA: Мен оқушымын. Мен қытай тілін үйреніп жүрмін.\nB: Жақсы!",
    explanationKazakh: "Диалогтағы 哈萨克斯坦 — контекстік жалқы есім. 好 қысқа жауап ретінде қолданылады; қалған сөйлемдер елін және оқу мәртебесін айтуға үлгі болады.",
    sourceRequirementIds: [TASK_T01, TASK_T06, TOPIC_PERSONAL_INFO, TOPIC_INTERACTION],
  }),
  block({
    id: "u01-l4-reading-card",
    kind: "reading",
    titleKazakh: "Оқу: таныстыру карточкасы",
    textChinese: "我叫阿依。我是学生。我学习汉语。",
    pinyin: "Wǒ jiào Āyī. Wǒ shì xuésheng. Wǒ xuéxí Hànyǔ.",
    translationKazakh: "Менің атым Аи. Мен оқушымын. Мен қытай тілін үйреніп жүрмін.",
    explanationKazakh: "Алдымен таныс сөздерді тауып, есім мен оқу мәртебесі туралы ақпаратты ажыратыңыз.",
    sourceRequirementIds: [TASK_T01, TOPIC_PERSONAL_INFO],
  }),
  block({
    id: "u01-l4-writing-model",
    kind: "writing-model",
    titleKazakh: "Жазу үлгісі: сөйлем ретін құрау",
    textChinese: "我叫阿依。",
    pinyin: "Wǒ jiào Āyī.",
    translationKazakh: "Менің атым Аи.",
    explanationKazakh: "Сөйлемді үлгімен құраңыз: бастауыш + 叫 + есім. Бұл жерде жазу жаттығуы мәтін теруді және сөз ретін құрауды қолданады; ол қолжазбаны танымайды.",
    sourceRequirementIds: [TASK_T01, TOPIC_PERSONAL_INFO],
  }),
  block({
    id: "u01-l4-listening-note",
    kind: "listening",
    titleKazakh: "Тыңдау: құрылғыдағы қытайша дауыс",
    explanationKazakh: "Тыңдау тапсырмаларындағы дыбысты браузердің құрылғыдағы zh-CN мәтінді дыбыстау дауысы оқиды. Дауыс құрылғыға байланысты өзгеруі мүмкін; бұл студиялық аудио емес.",
    sourceRequirementIds: [TASK_T01],
  }),
  block({
    id: "u01-l4-speaking-prompt",
    kind: "speaking-prompt",
    titleKazakh: "Сөйлеу: өзіңді таныстыр",
    textChinese: "你好！我叫阿依。我是学生。我学习汉语。",
    pinyin: "Nǐ hǎo! Wǒ jiào Āyī. Wǒ shì xuésheng. Wǒ xuéxí Hànyǔ.",
    translationKazakh: "Сәлем! Менің атым Аи. Мен оқушымын. Мен қытай тілін үйреніп жүрмін.",
    explanationKazakh: "Сөйлемдерді дауыстап айтып, өз дауысыңызды тыңдаңыз. Қолданба айтылымды автоматты бағаламайды.",
    sourceRequirementIds: [TASK_T01, TASK_T06, TOPIC_PERSONAL_INFO, TOPIC_INTERACTION],
  }),
];

const points: KnowledgePoint[] = [
  { id: "kp.pinyin.0001", kind: "pinyin", lifecycle: "active" },
  ...Array.from({ length: 17 }, (_, index) => ({ id: `kp.vocabulary.${String(index + 1).padStart(4, "0")}`, kind: "vocabulary" as const, lifecycle: "active" as const })),
  ...Array.from({ length: 5 }, (_, index) => ({ id: `kp.character.${String(index + 1).padStart(4, "0")}`, kind: "character" as const, lifecycle: "active" as const })),
  ...Array.from({ length: 3 }, (_, index) => ({ id: `kp.grammar.${String(index + 1).padStart(4, "0")}`, kind: "grammar" as const, lifecycle: "active" as const })),
  ...(["listening", "speaking", "reading", "writing"] as const).map((kind) => ({ id: `kp.${kind}.0001`, kind, lifecycle: "active" as const })),
];

const revisionSpecs: Array<{
  kp: string; title: string; explanation: string; blocks?: string[]; legacy?: string[]; requirements?: string[]; prerequisites?: string[];
}> = [
  { kp: "kp.pinyin.0001", title: "你好 сөзінің пиньині", explanation: "nǐ hǎo негізгі жазылымын және сөйлеудегі ní hǎo өзгерісін ажырату.", blocks: ["u01-l1-pinyin-and-greeting"], requirements: [TASK_T01] },
  { kp: "kp.vocabulary.0001", title: "你好", explanation: "Сәлемдесу сөзі.", legacy: ["hsk1-nihao"], requirements: [TASK_T01, TASK_T06, TOPIC_PERSONAL_INFO, TOPIC_INTERACTION] },
  { kp: "kp.vocabulary.0002", title: "我", explanation: "Бірінші жақ есімдігі: мен.", legacy: ["hsk1-wo"], requirements: [TASK_T01, TOPIC_PERSONAL_INFO] },
  { kp: "kp.vocabulary.0003", title: "你", explanation: "Екінші жақ есімдігі: сен/сіз.", legacy: ["hsk1-ni"], requirements: [TASK_T01, TOPIC_PERSONAL_INFO] },
  { kp: "kp.vocabulary.0004", title: "叫", explanation: "Есімді айту үлгісінде қолданылатын етістік.", requirements: [TASK_T01, TOPIC_PERSONAL_INFO], blocks: ["u01-l2-name-pattern"] },
  { kp: "kp.vocabulary.0005", title: "什么", explanation: "Сұрау мағынасын білдіреді: не/қандай.", legacy: ["hsk1-shenme"], requirements: [TASK_T01, TOPIC_PERSONAL_INFO] },
  { kp: "kp.vocabulary.0006", title: "名字", explanation: "Адамның есімі.", requirements: [TASK_T01, TOPIC_PERSONAL_INFO], blocks: ["u01-l2-name-pattern"] },
  { kp: "kp.vocabulary.0007", title: "哪", explanation: "Сұрақтағы «қай» сөзі.", requirements: [TASK_T01, TOPIC_PERSONAL_INFO] },
  { kp: "kp.vocabulary.0008", title: "国", explanation: "Ел гэсэн мағына беретін зат есім.", requirements: [TASK_T01, TOPIC_PERSONAL_INFO] },
  { kp: "kp.vocabulary.0009", title: "人", explanation: "Адам деген мағына беретін зат есім.", requirements: [TASK_T01, TOPIC_PERSONAL_INFO] },
  { kp: "kp.vocabulary.0010", title: "哈萨克斯坦", explanation: "Қазақстан елінің қытайша атауы; бұл контекстік жалқы есім және HSK词汇 coverage-іне кірмейді.", blocks: ["u01-l3-nationality-pattern"] },
  { kp: "kp.vocabulary.0011", title: "是", explanation: "Адамның кім екенін айтуға көмектеседі.", legacy: ["hsk1-shi"], requirements: [TASK_T01, TOPIC_PERSONAL_INFO] },
  { kp: "kp.vocabulary.0012", title: "吗", explanation: "Сөйлем соңында жалпы сұрақ жасайтын демеулік.", requirements: [TASK_T01, TOPIC_PERSONAL_INFO] },
  { kp: "kp.vocabulary.0013", title: "学生", explanation: "Оқушы немесе студент.", legacy: ["hsk1-xuesheng"], requirements: [TASK_T01, TOPIC_PERSONAL_INFO] },
  { kp: "kp.vocabulary.0014", title: "汉语", explanation: "Қытай тілі.", legacy: ["hsk1-hanyu"], requirements: [TASK_T01, TOPIC_PERSONAL_INFO] },
  { kp: "kp.vocabulary.0015", title: "学习", explanation: "Оқу, үйрену әрекеті.", legacy: ["hsk1-xuexi"], requirements: [TASK_T01, TOPIC_PERSONAL_INFO] },
  { kp: "kp.vocabulary.0016", title: "好", explanation: "Әңгімеде келісім не жағымды жауап білдіретін сөз.", legacy: ["hsk1-hao"], requirements: [TASK_T06, TOPIC_INTERACTION], blocks: ["u01-dialogue-nationality"] },
  { kp: "kp.vocabulary.0017", title: "再见", explanation: "Қоштасқанда айтылатын сөз.", legacy: ["hsk1-zaijian"], requirements: [TASK_T06, TOPIC_INTERACTION], blocks: ["u01-dialogue-first-meeting"] },
  { kp: "kp.character.0001", title: "我 және 你 таңбалары", explanation: "我 және 你 таңбаларын танып, олардың есімдік мағынасын ажырату.", requirements: [TASK_T01] },
  { kp: "kp.character.0002", title: "叫 таңбасы", explanation: "叫 таңбасын танып, есім айту үлгісіндегі орнын тану.", requirements: [TASK_T01] },
  { kp: "kp.character.0003", title: "名字 таңбалары", explanation: "名 және 字 таңбаларын бірге танып, 名字 сөзін оқу.", requirements: [TASK_T01] },
  { kp: "kp.character.0004", title: "哪国人 тіркесі", explanation: "哪、国、人 таңбаларын тіркес ішінде тану.", requirements: [TASK_T01] },
  { kp: "kp.character.0005", title: "是 және 学生 таңбалары", explanation: "是、学、生 таңбаларын танып, 身份 туралы сөйлемде оқу.", requirements: [TASK_T01] },
  { kp: "kp.grammar.0001", title: "我叫 + есім", explanation: "Есімді айту: есімдік + 叫 + есім.", blocks: ["u01-l2-name-pattern"], requirements: [TASK_T01] },
  { kp: "kp.grammar.0002", title: "是 + адам/мәртебе", explanation: "Адамның кім екенін айту: бастауыш + 是 + атау.", blocks: ["u01-l3-identity-pattern"], requirements: [TASK_T01] },
  { kp: "kp.grammar.0003", title: "吗 сұрағы", explanation: "Таныс жай сөйлемге соңынан 吗 қосып жалпы сұрақ жасау.", blocks: ["u01-l3-identity-pattern"], requirements: [TASK_T01] },
  { kp: "kp.listening.0001", title: "Танысу сөздерін тыңдау", explanation: "Құрылғыдағы қытайша дауыстан есім мен оқу мәртебесін тану.", blocks: ["u01-l4-listening-note"] },
  { kp: "kp.speaking.0001", title: "Өзін таныстыруды айту", explanation: "Қысқа таныстыруды жазып алып, өзіңіз қайта тыңдау.", blocks: ["u01-l4-speaking-prompt"], requirements: [TASK_T01, TASK_T06, TOPIC_PERSONAL_INFO, TOPIC_INTERACTION] },
  { kp: "kp.reading.0001", title: "Қысқа таныстыруды оқу", explanation: "Қысқа таныстырудан есім мен оқу туралы ақпаратты табу.", blocks: ["u01-l4-reading-card"] },
  { kp: "kp.writing.0001", title: "Қысқа таныстыруды теру", explanation: "Үлгімен жеке таныстыру сөйлемін теру және сөз ретін құрау.", blocks: ["u01-l4-writing-model"] },
];

const knowledgePointRevisions: KnowledgePointRevision[] = revisionSpecs.map((spec) => ({
  id: `${spec.kp}-r1`,
  knowledgePointId: spec.kp,
  revision: 1,
  titleKazakh: spec.title,
  explanationKazakh: spec.explanation,
  contentBlockIds: spec.blocks ?? [],
  prerequisiteIds: spec.prerequisites ?? [],
  legacyVocabularyIds: spec.legacy ?? [],
  sourceRequirementIds: spec.requirements ?? [],
  editorialStatus: "draft",
}));

const pins = knowledgePointRevisions.map((revision) => ({ knowledgePointId: revision.knowledgePointId, revisionId: revision.id }));

const newVocabulary: VocabularyContentRevision[] = [
  { id: "vocab-jiao-r1", knowledgePointId: "kp.vocabulary.0004", hanzi: "叫", pinyin: "jiào", tones: [4], partOfSpeech: "verb", translationKazakh: "аталу; атын айту", scope: "hsk-standard", example: { hanzi: "我叫阿依。", pinyin: "Wǒ jiào Āyī.", translationKazakh: "Менің атым Аи." }, sourceRequirementIds: ["hsk-2025-11-hsk1-vocabulary-%E5%8F%AB"], editorialStatus: "draft" },
  { id: "vocab-mingzi-r1", knowledgePointId: "kp.vocabulary.0006", hanzi: "名字", pinyin: "míngzi", tones: [2, "neutral"], partOfSpeech: "noun", translationKazakh: "есім, ат", scope: "hsk-standard", example: { hanzi: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzi?", translationKazakh: "Атың кім?" }, sourceRequirementIds: ["hsk-2025-11-hsk1-vocabulary-%E5%90%8D%E5%AD%97"], editorialStatus: "draft" },
  { id: "vocab-na-r1", knowledgePointId: "kp.vocabulary.0007", hanzi: "哪", pinyin: "nǎ", tones: [3], partOfSpeech: "pronoun", translationKazakh: "қай", scope: "hsk-standard", example: { hanzi: "你是哪国人？", pinyin: "Nǐ shì nǎ guó rén?", translationKazakh: "Сен қай елденсің?" }, sourceRequirementIds: ["hsk-2025-11-hsk1-vocabulary-%E5%93%AA"], editorialStatus: "draft" },
  { id: "vocab-guo-r1", knowledgePointId: "kp.vocabulary.0008", hanzi: "国", pinyin: "guó", tones: [2], partOfSpeech: "noun", translationKazakh: "ел, мемлекет", scope: "hsk-standard", example: { hanzi: "你是哪国人？", pinyin: "Nǐ shì nǎ guó rén?", translationKazakh: "Сен қай елденсің?" }, sourceRequirementIds: ["hsk-2025-11-hsk1-vocabulary-%E5%9B%BD"], editorialStatus: "draft" },
  { id: "vocab-ren-r1", knowledgePointId: "kp.vocabulary.0009", hanzi: "人", pinyin: "rén", tones: [2], partOfSpeech: "noun", translationKazakh: "адам", scope: "hsk-standard", example: { hanzi: "我是哈萨克斯坦人。", pinyin: "Wǒ shì Hāsàkèsītǎn rén.", translationKazakh: "Мен Қазақстаннанмын." }, sourceRequirementIds: ["hsk-2025-11-hsk1-vocabulary-%E4%BA%BA"], editorialStatus: "draft" },
  { id: "vocab-ma-r1", knowledgePointId: "kp.vocabulary.0012", hanzi: "吗", pinyin: "ma", tones: ["neutral"], partOfSpeech: "particle", translationKazakh: "жалпы сұрақ жасайтын демеулік", scope: "hsk-standard", example: { hanzi: "你是学生吗？", pinyin: "Nǐ shì xuésheng ma?", translationKazakh: "Сен оқушысың ба?" }, sourceRequirementIds: ["hsk-2025-11-hsk1-vocabulary-%E5%90%97"], editorialStatus: "draft" },
  { id: "vocab-kazakhstan-r1", knowledgePointId: "kp.vocabulary.0010", hanzi: "哈萨克斯坦", pinyin: "Hāsàkèsītǎn", tones: [1, 4, 4, 1, 3], partOfSpeech: "proper-noun", translationKazakh: "Қазақстан", scope: "contextual-extension", example: { hanzi: "我是哈萨克斯坦人。", pinyin: "Wǒ shì Hāsàkèsītǎn rén.", translationKazakh: "Мен Қазақстаннанмын." }, sourceRequirementIds: [], editorialStatus: "draft" },
];

const objectives = {
  greeting: "u01-objective-greetings",
  name: "u01-objective-name",
  identity: "u01-objective-identity",
  integrated: "u01-objective-integrated",
};

const lessonSpecs: CurriculumLesson[] = [
  {
    id: "u01-lesson-01-greetings",
    unitId: U01_UNIT_ID,
    sequence: 1,
    titleKazakh: "1-сабақ · Сәлемдесу және есімдіктер",
    introductionKazakh: "你好 арқылы амандасып, өзіңді және сөйлесіп тұрған адамды 我, 你 есімдіктерімен ата.",
    learningObjectives: [{ id: objectives.greeting, statementKazakh: "你好 арқылы амандасу, 我 мен 你 сөздерін ажырату және екі үшінші тонның жазылымы мен табиғи айтылымын тану.", knowledgePointIds: ["kp.pinyin.0001", "kp.vocabulary.0001", "kp.vocabulary.0002", "kp.vocabulary.0003", "kp.character.0001"], requirementIds: [TASK_T01, TASK_T06, TOPIC_PERSONAL_INFO, TOPIC_INTERACTION] }],
    knowledgePointIds: ["kp.pinyin.0001", "kp.vocabulary.0001", "kp.vocabulary.0002", "kp.vocabulary.0003", "kp.character.0001", "kp.listening.0001"],
    contentBlockIds: ["u01-l1-pinyin-and-greeting", "u01-l1-pronouns-example"],
    practiceExerciseIds: ["u01-l1-practice-greeting", "u01-l1-practice-tone"],
    exerciseIds: ["u01-l1-practice-greeting", "u01-l1-practice-tone", ...Array.from({ length: 5 }, (_, i) => `u01-l1-assess-${i + 1}`)],
    assessmentIds: ["u01-assessment-lesson-01"],
    prerequisiteLessonIds: [],
    editorialStatus: "draft",
  },
  {
    id: "u01-lesson-02-names",
    unitId: U01_UNIT_ID,
    sequence: 2,
    titleKazakh: "2-сабақ · Есімді сұрау және айту",
    introductionKazakh: "你叫什么名字？ деген сұрақты түсініп, 我叫… үлгісімен жауап бер.",
    learningObjectives: [{ id: objectives.name, statementKazakh: "叫, 什么, 名字 сөздерін қолданып адамның есімін сұрау және айту; танысқанда амандасып, қоштасу.", knowledgePointIds: ["kp.vocabulary.0001", "kp.vocabulary.0002", "kp.vocabulary.0003", "kp.vocabulary.0004", "kp.vocabulary.0005", "kp.vocabulary.0006", "kp.vocabulary.0017", "kp.character.0002", "kp.character.0003", "kp.grammar.0001"], requirementIds: [TASK_T01, TASK_T06, TOPIC_PERSONAL_INFO, TOPIC_INTERACTION] }],
    knowledgePointIds: ["kp.vocabulary.0001", "kp.vocabulary.0002", "kp.vocabulary.0003", "kp.vocabulary.0004", "kp.vocabulary.0005", "kp.vocabulary.0006", "kp.vocabulary.0017", "kp.character.0002", "kp.character.0003", "kp.grammar.0001", "kp.speaking.0001", "kp.reading.0001"],
    contentBlockIds: ["u01-l2-name-pattern", "u01-dialogue-first-meeting"],
    practiceExerciseIds: ["u01-l2-practice-name-fill", "u01-l2-practice-name-order"],
    exerciseIds: ["u01-l2-practice-name-fill", "u01-l2-practice-name-order", ...Array.from({ length: 5 }, (_, i) => `u01-l2-assess-${i + 1}`)],
    assessmentIds: ["u01-assessment-lesson-02"],
    prerequisiteLessonIds: ["u01-lesson-01-greetings"],
    editorialStatus: "draft",
  },
  {
    id: "u01-lesson-03-nationality",
    unitId: U01_UNIT_ID,
    sequence: 3,
    titleKazakh: "3-сабақ · Ел және кім екеніңді айту",
    introductionKazakh: "哪国人 үлгісімен ел туралы сұрап, 是 үлгісімен кім екеніңді айт.",
    learningObjectives: [{ id: objectives.identity, statementKazakh: "哪国人 сұрағын түсініп, ел атауын және 学生 мәртебесін қысқа жауапта қолдану; 好 сөзін қысқа жауап ретінде тану.", knowledgePointIds: ["kp.vocabulary.0007", "kp.vocabulary.0008", "kp.vocabulary.0009", "kp.vocabulary.0010", "kp.vocabulary.0011", "kp.vocabulary.0012", "kp.vocabulary.0013", "kp.vocabulary.0016", "kp.character.0004", "kp.character.0005", "kp.grammar.0002", "kp.grammar.0003"], requirementIds: [TASK_T01, TASK_T06, TOPIC_PERSONAL_INFO, TOPIC_INTERACTION] }],
    knowledgePointIds: ["kp.vocabulary.0007", "kp.vocabulary.0008", "kp.vocabulary.0009", "kp.vocabulary.0010", "kp.vocabulary.0011", "kp.vocabulary.0012", "kp.vocabulary.0013", "kp.vocabulary.0016", "kp.character.0004", "kp.character.0005", "kp.grammar.0002", "kp.grammar.0003", "kp.listening.0001", "kp.speaking.0001"],
    contentBlockIds: ["u01-l3-nationality-pattern", "u01-l3-identity-pattern", "u01-dialogue-nationality"],
    practiceExerciseIds: ["u01-l3-practice-nationality", "u01-l3-practice-identity"],
    exerciseIds: ["u01-l3-practice-nationality", "u01-l3-practice-identity", ...Array.from({ length: 5 }, (_, i) => `u01-l3-assess-${i + 1}`)],
    assessmentIds: ["u01-assessment-lesson-03"],
    prerequisiteLessonIds: ["u01-lesson-02-names"],
    editorialStatus: "draft",
  },
  {
    id: "u01-lesson-04-integrated-introduction",
    unitId: U01_UNIT_ID,
    sequence: 4,
    titleKazakh: "4-сабақ · Таныстыруды тыңдау, оқу және жазу",
    introductionKazakh: "Қысқа таныстырудан есім мен оқу мәртебесін тап, сөйлемді теріп құрастыр және өз дауысыңды тыңда.",
    learningObjectives: [{ id: objectives.integrated, statementKazakh: "Қысқа сәлемдесу мен таныстыруды тыңдау/оқу, негізгі ақпаратты түсіну және таныстыру сөйлемін теріп құрау.", knowledgePointIds: ["kp.vocabulary.0001", "kp.listening.0001", "kp.speaking.0001", "kp.reading.0001", "kp.writing.0001", "kp.grammar.0001", "kp.grammar.0002"], requirementIds: [TASK_T01, TASK_T06, TOPIC_PERSONAL_INFO, TOPIC_INTERACTION] }],
    knowledgePointIds: ["kp.vocabulary.0001", "kp.listening.0001", "kp.speaking.0001", "kp.reading.0001", "kp.writing.0001", "kp.grammar.0001", "kp.grammar.0002", "kp.vocabulary.0004", "kp.vocabulary.0006", "kp.vocabulary.0011", "kp.vocabulary.0013", "kp.vocabulary.0014", "kp.vocabulary.0015"],
    contentBlockIds: ["u01-l4-reading-card", "u01-l4-writing-model", "u01-l4-listening-note", "u01-l4-speaking-prompt", "u01-dialogue-nationality"],
    practiceExerciseIds: ["u01-l4-practice-reading", "u01-l4-practice-writing", "u01-l4-practice-speaking"],
    exerciseIds: ["u01-l4-practice-reading", "u01-l4-practice-writing", "u01-l4-practice-speaking", ...Array.from({ length: 5 }, (_, i) => `u01-l4-assess-${i + 1}`)],
    assessmentIds: ["u01-assessment-lesson-04"],
    prerequisiteLessonIds: ["u01-lesson-03-nationality"],
    editorialStatus: "draft",
  },
];

type ScoredDefinition = {
  id: string; lessonId: string; objectiveId: string; knowledgePointIds: string[]; skill: ScoredExercise["skill"];
  interaction: ScoredExercise["interaction"]; promptKazakh: string; answerKey: string | string[]; options?: string[];
  acceptedAnswers?: string[]; audioText?: string; explanationKazakh: string;
};
type ScoredDefinitionWithoutInteraction = Omit<ScoredDefinition, "interaction">;

function scored(input: ScoredDefinition): ScoredExercise {
  const { objectiveId, ...exercise } = input;
  return {
    ...exercise,
    objectiveIds: [objectiveId],
    revisionId: `${input.id}-r1`,
    mode: "scored",
    points: 1,
    editorialStatus: "draft",
  };
}

const qChoice = (input: ScoredDefinitionWithoutInteraction) => scored({ ...input, interaction: "choice" });
const qListen = (input: ScoredDefinitionWithoutInteraction) => scored({ ...input, interaction: "listening-choice" });
const qText = (input: ScoredDefinitionWithoutInteraction) => scored({ ...input, interaction: "text" });
const qOrder = (input: ScoredDefinitionWithoutInteraction) => scored({ ...input, interaction: "order" });
const questions: Exercise[] = [
  qChoice({ id: "u01-l1-practice-greeting", lessonId: lessonSpecs[0].id, objectiveId: objectives.greeting, knowledgePointIds: ["kp.vocabulary.0001"], skill: "language-form", promptKazakh: "你好 сөзінің қазақша мағынасын таңда.", answerKey: "Сәлем", options: ["Сәлем", "Сау бол", "Рақмет"], explanationKazakh: "你好 — амандасқанда айтылатын «Сәлем»." }),
  qListen({ id: "u01-l1-practice-tone", lessonId: lessonSpecs[0].id, objectiveId: objectives.greeting, knowledgePointIds: ["kp.pinyin.0001", "kp.listening.0001"], skill: "pinyin", promptKazakh: "Дыбысты тыңдап, сөздің негізгі пиньинін таңда.", answerKey: "nǐ hǎo", options: ["nǐ hǎo", "ní hǎo", "nǐ hào"], audioText: "你好", explanationKazakh: "Негізгі жазылым nǐ hǎo; табиғи айтылымда бірінші буын ní болып өзгереді." }),
  qText({ id: "u01-l2-practice-name-fill", lessonId: lessonSpecs[1].id, objectiveId: objectives.name, knowledgePointIds: ["kp.grammar.0001", "kp.vocabulary.0004"], skill: "writing", promptKazakh: "Бос орынды толтыр: 我___阿依。", answerKey: "叫", explanationKazakh: "我叫… үлгісінде 叫 есімнен бұрын тұрады." }),
  qOrder({ id: "u01-l2-practice-name-order", lessonId: lessonSpecs[1].id, objectiveId: objectives.name, knowledgePointIds: ["kp.grammar.0001", "kp.vocabulary.0006"], skill: "language-form", promptKazakh: "Сұрақты дұрыс ретпен құрастыр.", answerKey: ["你", "叫", "什么", "名字？"], options: ["你", "叫", "什么", "名字？"], explanationKazakh: "Үлгі: 你 + 叫 + 什么名字？" }),
  qChoice({ id: "u01-l3-practice-nationality", lessonId: lessonSpecs[2].id, objectiveId: objectives.identity, knowledgePointIds: ["kp.vocabulary.0007", "kp.vocabulary.0008", "kp.vocabulary.0009"], skill: "language-form", promptKazakh: "Қай сұрақ адамның қай елден екенін сұрайды?", answerKey: "你是哪国人？", options: ["你是哪国人？", "你叫什么名字？", "你是学生吗？"], explanationKazakh: "哪国人 — қай елдің адамы екенін сұрайтын үлгі." }),
  qText({ id: "u01-l3-practice-identity", lessonId: lessonSpecs[2].id, objectiveId: objectives.identity, knowledgePointIds: ["kp.grammar.0002", "kp.vocabulary.0013"], skill: "writing", promptKazakh: "Оқушы екеніңді толықтыр: 我是___。", answerKey: "学生", explanationKazakh: "我是学生 — Мен оқушымын." }),
  qChoice({ id: "u01-l4-practice-reading", lessonId: lessonSpecs[3].id, objectiveId: objectives.integrated, knowledgePointIds: ["kp.reading.0001", "kp.vocabulary.0014"], skill: "reading", promptKazakh: "我学习汉语 сөйлемінде адам нені үйреніп жүр?", answerKey: "汉语", options: ["汉语", "名字", "国"], explanationKazakh: "学习 етістігінен кейін 汉语 — үйреніп жүрген тілді білдіреді." }),
  qOrder({ id: "u01-l4-practice-writing", lessonId: lessonSpecs[3].id, objectiveId: objectives.integrated, knowledgePointIds: ["kp.writing.0001", "kp.grammar.0002"], skill: "writing", promptKazakh: "Сөйлемді дұрыс ретпен құрастыр.", answerKey: ["我", "是", "学生。"], options: ["我", "是", "学生。"], explanationKazakh: "Қарапайым үлгі: бастауыш + 是 + адам атауы." }),
  {
    id: "u01-l4-practice-speaking",
    revisionId: "u01-l4-practice-speaking-r1",
    lessonId: lessonSpecs[3].id,
    knowledgePointIds: ["kp.speaking.0001", "kp.vocabulary.0001", "kp.vocabulary.0004", "kp.vocabulary.0013"],
    objectiveIds: [objectives.integrated],
    skill: "speaking",
    mode: "practice",
    interaction: "recording",
    promptKazakh: "你好！我叫阿依。我是学生。 сөйлемдерін айтып жазып ал. Қолданба айтылымға балл қоймайды.",
    recordingPromptChinese: "你好！我叫阿依。我是学生。",
    explanationKazakh: "Өз жазбаңды тыңдап, дыбыстардың анық айтылғанын өзің белгіле.",
    editorialStatus: "draft",
  },
  qChoice({ id: "u01-l1-assess-1", lessonId: lessonSpecs[0].id, objectiveId: objectives.greeting, knowledgePointIds: ["kp.vocabulary.0001"], skill: "language-form", promptKazakh: "你好！ сөзінің мағынасын таңда.", answerKey: "Сәлем", options: ["Сәлем", "Сау бол", "Қай елденсің?"], explanationKazakh: "你好！ — сәлемдесу." }),
  qChoice({ id: "u01-l1-assess-2", lessonId: lessonSpecs[0].id, objectiveId: objectives.greeting, knowledgePointIds: ["kp.vocabulary.0002", "kp.character.0001"], skill: "reading", promptKazakh: "我 таңбасын таңда.", answerKey: "我", options: ["我", "你", "叫"], explanationKazakh: "我 — «мен» есімдігі." }),
  qListen({ id: "u01-l1-assess-3", lessonId: lessonSpecs[0].id, objectiveId: objectives.greeting, knowledgePointIds: ["kp.pinyin.0001", "kp.listening.0001"], skill: "listening", promptKazakh: "Құрылғы дауысын тыңдап, айтылған амандасуды таңда.", answerKey: "你好", options: ["你好", "再见", "学生"], audioText: "你好", explanationKazakh: "Дыбыс 你好 сөзін оқиды. Бұл құрылғыдағы синтезделген дауыс." }),
  qChoice({ id: "u01-l1-assess-4", lessonId: lessonSpecs[0].id, objectiveId: objectives.greeting, knowledgePointIds: ["kp.vocabulary.0003", "kp.character.0001"], skill: "reading", promptKazakh: "你 есімдігі нені білдіреді?", answerKey: "сен/сіз", options: ["мен", "сен/сіз", "оқушы"], explanationKazakh: "你 — сөйлесіп тұрған адамға айтылатын есімдік." }),
  qChoice({ id: "u01-l1-assess-5", lessonId: lessonSpecs[0].id, objectiveId: objectives.greeting, knowledgePointIds: ["kp.pinyin.0001"], skill: "pinyin", promptKazakh: "你好 сөзінің негізгі жазылымын таңда.", answerKey: "nǐ hǎo", options: ["nǐ hǎo", "ní hǎo", "nǐ hào"], explanationKazakh: "Сөздіктегі негізгі жазылым nǐ hǎo. Сөйлеуде бірінші буын өзгеруі мүмкін." }),
  qChoice({ id: "u01-l2-assess-1", lessonId: lessonSpecs[1].id, objectiveId: objectives.name, knowledgePointIds: ["kp.vocabulary.0004", "kp.grammar.0001"], skill: "language-form", promptKazakh: "我___阿依。 сөйлеміне сәйкес сөзді таңда.", answerKey: "叫", options: ["叫", "吗", "哪"], explanationKazakh: "我叫阿依 — Менің атым Аи." }),
  qText({ id: "u01-l2-assess-2", lessonId: lessonSpecs[1].id, objectiveId: objectives.name, knowledgePointIds: ["kp.vocabulary.0006"], skill: "writing", promptKazakh: "Бос орынды толтыр: 你叫什么___？", answerKey: "名字", explanationKazakh: "名字 — есім." }),
  qOrder({ id: "u01-l2-assess-3", lessonId: lessonSpecs[1].id, objectiveId: objectives.name, knowledgePointIds: ["kp.grammar.0001"], skill: "language-form", promptKazakh: "«Атың кім?» деген сұрақты құрастыр.", answerKey: ["你", "叫", "什么", "名字？"], options: ["你", "叫", "什么", "名字？"], explanationKazakh: "你叫什么名字？ — Атың кім?" }),
  qListen({ id: "u01-l2-assess-4", lessonId: lessonSpecs[1].id, objectiveId: objectives.name, knowledgePointIds: ["kp.listening.0001", "kp.vocabulary.0006"], skill: "listening", promptKazakh: "Дыбысты тыңда. Қай ақпаратты сұрады?", answerKey: "есім", options: ["есім", "ел", "оқу тілі"], audioText: "你叫什么名字", explanationKazakh: "Сұрақтағы 什么名字 адамның есімін сұрайды." }),
  qChoice({ id: "u01-l2-assess-5", lessonId: lessonSpecs[1].id, objectiveId: objectives.name, knowledgePointIds: ["kp.character.0003"], skill: "reading", promptKazakh: "名字 сөзінің жазылуын таңда.", answerKey: "名字", options: ["名字", "学生", "汉语"], explanationKazakh: "名字 екі таңбадан тұрады: 名 + 字." }),
  qChoice({ id: "u01-l3-assess-1", lessonId: lessonSpecs[2].id, objectiveId: objectives.identity, knowledgePointIds: ["kp.vocabulary.0007", "kp.vocabulary.0008", "kp.vocabulary.0009"], skill: "language-form", promptKazakh: "Қай сөйлем «Сен қай елденсің?» деп сұрайды?", answerKey: "你是哪国人？", options: ["你是哪国人？", "你叫什么名字？", "我学习汉语。"], explanationKazakh: "哪国人 ел/ұлт туралы сұрайды." }),
  qText({ id: "u01-l3-assess-2", lessonId: lessonSpecs[2].id, objectiveId: objectives.identity, knowledgePointIds: ["kp.vocabulary.0010"], skill: "writing", promptKazakh: "«Мен Қазақстаннанмын» сөйлеміндегі ел атауын толтыр: 我是___人。", answerKey: "哈萨克斯坦", explanationKazakh: "哈萨克斯坦 — Қазақстан атауының қытайша жазылуы; ол контекстік жалқы есім." }),
  qListen({ id: "u01-l3-assess-3", lessonId: lessonSpecs[2].id, objectiveId: objectives.identity, knowledgePointIds: ["kp.listening.0001", "kp.vocabulary.0013"], skill: "listening", promptKazakh: "Тыңдаған сөйлемде адам кім?", answerKey: "学生", options: ["学生", "老师", "朋友"], audioText: "我是学生", explanationKazakh: "我是学生 — Мен оқушымын." }),
  qOrder({ id: "u01-l3-assess-4", lessonId: lessonSpecs[2].id, objectiveId: objectives.identity, knowledgePointIds: ["kp.grammar.0002", "kp.character.0005"], skill: "language-form", promptKazakh: "«Мен оқушымын» сөйлемін құрастыр.", answerKey: ["我", "是", "学生。"], options: ["我", "是", "学生。"], explanationKazakh: "Бастауыш + 是 + адам мәртебесі." }),
  qChoice({ id: "u01-l3-assess-5", lessonId: lessonSpecs[2].id, objectiveId: objectives.identity, knowledgePointIds: ["kp.grammar.0003", "kp.vocabulary.0012"], skill: "reading", promptKazakh: "Жалпы сұрақ қай сөйлем?", answerKey: "你是学生吗？", options: ["你是学生吗？", "我是学生。", "我叫阿依。"], explanationKazakh: "吗 сөйлем соңында тұрса, жалпы сұрақ жасалады." }),
  qListen({ id: "u01-l4-assess-1", lessonId: lessonSpecs[3].id, objectiveId: objectives.integrated, knowledgePointIds: ["kp.listening.0001", "kp.vocabulary.0014"], skill: "listening", promptKazakh: "Тыңдаған сөйлемде қандай тіл үйреніледі?", answerKey: "汉语", options: ["汉语", "名字", "国"], audioText: "我学习汉语", explanationKazakh: "我学习汉语 — Мен қытай тілін үйреніп жүрмін." }),
  qChoice({ id: "u01-l4-assess-2", lessonId: lessonSpecs[3].id, objectiveId: objectives.integrated, knowledgePointIds: ["kp.reading.0001", "kp.vocabulary.0004"], skill: "reading", promptKazakh: "我叫阿依。 сөйлемі қандай ақпарат береді?", answerKey: "есімі", options: ["есімі", "елі", "үйреніп жүрген тілі"], explanationKazakh: "叫 сөзінен кейін есім келеді." }),
  qText({ id: "u01-l4-assess-3", lessonId: lessonSpecs[3].id, objectiveId: objectives.integrated, knowledgePointIds: ["kp.writing.0001", "kp.vocabulary.0014"], skill: "writing", promptKazakh: "Сөйлемді аяқта: 我学习___。", answerKey: "汉语", explanationKazakh: "学习汉语 — қытай тілін үйрену." }),
  qOrder({ id: "u01-l4-assess-4", lessonId: lessonSpecs[3].id, objectiveId: objectives.integrated, knowledgePointIds: ["kp.grammar.0002", "kp.writing.0001"], skill: "writing", promptKazakh: "«Мен оқушымын» сөйлемін дұрыс ретке келтір.", answerKey: ["我", "是", "学生。"], options: ["我", "是", "学生。"], explanationKazakh: "我 + 是 + 学生 сөйлем реті." }),
  qChoice({ id: "u01-l4-assess-5", lessonId: lessonSpecs[3].id, objectiveId: objectives.integrated, knowledgePointIds: ["kp.reading.0001", "kp.vocabulary.0015"], skill: "reading", promptKazakh: "学习 сөзі қай әрекетті білдіреді?", answerKey: "үйрену", options: ["үйрену", "амандасу", "сұрау"], explanationKazakh: "学习 — оқу/үйрену әрекеті." }),
];

const assessments: Assessment[] = lessonSpecs.map((lesson) => ({
  id: lesson.assessmentIds[0],
  revisionId: `${lesson.assessmentIds[0]}-r1`,
  lessonId: lesson.id,
  exerciseIds: lesson.exerciseIds.filter((id) => id.includes("-assess-")),
  requiredObjectiveIds: lesson.learningObjectives.map(({ id }) => id),
  rule: {
    version: "assessment-pass-v1-total-80-objective-70",
    minimumTotalPercent: 80,
    requiredObjectiveMinimumPercent: Object.fromEntries(lesson.learningObjectives.map(({ id }) => [id, 70])),
    allRequiredItemsMustBeScored: true,
  },
  editorialStatus: "draft",
}));

const u01Modules: IndependentModule[] = [
  { id: "u01-module-pinyin", kind: "pinyin", titleKazakh: "Пиньинь және айтылым · U01", descriptionKazakh: "你好 сөзінің екі үшінші тонын тыңдап, негізгі жазылымын ажырат.", status: "available", knowledgePointIds: ["kp.pinyin.0001", "kp.listening.0001"], contentBlockIds: ["u01-l1-pinyin-and-greeting", "u01-l4-listening-note"], exerciseIds: ["u01-l1-practice-tone", "u01-l1-assess-5"] },
  { id: "u01-module-characters", kind: "character", titleKazakh: "Иероглифтер · U01", descriptionKazakh: "我, 你, 叫, 名字 және таныстырудағы таңбаларды таны.", status: "available", knowledgePointIds: points.filter(({ kind }) => kind === "character").map(({ id }) => id), contentBlockIds: ["u01-l1-pronouns-example", "u01-l2-name-pattern", "u01-l3-identity-pattern"], exerciseIds: ["u01-l1-assess-2", "u01-l2-assess-5", "u01-l3-assess-4"] },
  { id: "u01-module-vocabulary", kind: "vocabulary", titleKazakh: "Сөздік · U01", descriptionKazakh: "Сәлемдесу, есім, ел және оқушы туралы сөздер.", status: "available", knowledgePointIds: points.filter(({ kind, id }) => kind === "vocabulary" && id !== "kp.vocabulary.0010").map(({ id }) => id), contentBlockIds: ["u01-l1-pronouns-example", "u01-l2-name-pattern", "u01-l3-nationality-pattern", "u01-l3-identity-pattern"], exerciseIds: ["u01-l1-practice-greeting", "u01-l2-practice-name-fill", "u01-l3-practice-nationality"] },
  { id: "u01-module-grammar", kind: "grammar", titleKazakh: "Грамматика және сөйлем үлгілері · U01", descriptionKazakh: "我叫…, 是… және 吗 сұрақ үлгілерін қолдан.", status: "available", knowledgePointIds: points.filter(({ kind }) => kind === "grammar").map(({ id }) => id), contentBlockIds: ["u01-l2-name-pattern", "u01-l3-identity-pattern"], exerciseIds: ["u01-l2-practice-name-order", "u01-l3-practice-identity"] },
  { id: "u01-module-listening", kind: "listening", titleKazakh: "Тыңдау · U01", descriptionKazakh: "Құрылғыдағы қытайша дауыспен таныстыру сұрақтарын тыңда.", status: "available", knowledgePointIds: ["kp.listening.0001"], contentBlockIds: ["u01-l4-listening-note", "u01-dialogue-first-meeting", "u01-dialogue-nationality"], exerciseIds: ["u01-l1-practice-tone", "u01-l2-assess-4", "u01-l3-assess-3", "u01-l4-assess-1"] },
  { id: "u01-module-speaking", kind: "speaking", titleKazakh: "Сөйлеу · U01", descriptionKazakh: "Таныстыруыңды жазып алып, тыңда; автоматты баға берілмейді.", status: "available", knowledgePointIds: ["kp.speaking.0001"], contentBlockIds: ["u01-l4-speaking-prompt"], exerciseIds: ["u01-l4-practice-speaking"] },
  { id: "u01-module-reading", kind: "reading", titleKazakh: "Оқу · U01", descriptionKazakh: "Алғашқы кездесу диалогы мен қысқа таныстыруды оқы.", status: "available", knowledgePointIds: ["kp.reading.0001"], contentBlockIds: ["u01-dialogue-first-meeting", "u01-dialogue-nationality", "u01-l4-reading-card"], exerciseIds: ["u01-l4-practice-reading", "u01-l4-assess-2"] },
  { id: "u01-module-writing", kind: "writing", titleKazakh: "Жазу · U01", descriptionKazakh: "Таныстыруға арналған қысқа сөз бен сөйлемді теріп құрастыр.", status: "available", knowledgePointIds: ["kp.writing.0001"], contentBlockIds: ["u01-l4-writing-model"], exerciseIds: ["u01-l2-practice-name-fill", "u01-l4-practice-writing", "u01-l4-assess-3"] },
];

export const u01Release: CurriculumRelease = {
  id: U01_RELEASE_ID,
  curriculumId: U01_CURRICULUM_ID,
  contentVersion: "u01-content-v1",
  status: "draft",
  standardReferences: [
    { id: "hsk-exam-syllabus-2025-11", edition: "2025-11", levelId: U01_LEVEL_ID, sourceUrl: HSK_SYLLABUS_2025_SOURCE, locator: "新版 HSK 考试大纲，2026-07 实施；使用 HSK 3.0 一级，不与旧 HSK 2.0 混用。" },
    { id: "hanyu-pinyin-1958-gbt-16159-2012", edition: "1958-scheme+2012", levelId: "pinyin-foundations", sourceUrl: "https://www.moe.gov.cn/ewebeditor/uploadfile/2015/01/13/20150113091717604.pdf", locator: "《汉语拼音方案》与 GB/T 16159—2012；声调标记、拼写与隔音符号规则。" },
  ],
  coverageRequirements: requirements,
  levelIds: [U01_LEVEL_ID],
  levels: [{ id: U01_LEVEL_ID, titleKazakh: "HSK 1 · бастапқы деңгей", sequence: 1, unitIds: [U01_UNIT_ID] }],
  units: [{ id: U01_UNIT_ID, levelId: U01_LEVEL_ID, titleKazakh: "U01 · Жеке ақпарат және алғашқы кездесу", sequence: 1, lessonIds: lessonSpecs.map(({ id }) => id), assessmentIds: assessments.map(({ id }) => id) }],
  lessons: lessonSpecs,
  knowledgePoints: points,
  knowledgePointRevisions,
  knowledgePointPins: pins,
  vocabularyContent: newVocabulary,
  contentBlocks,
  exercises: questions,
  assessments,
  path: { id: U01_PATH_ID, levelId: U01_LEVEL_ID, orderedLessonIds: lessonSpecs.map(({ id }) => id) },
  independentModules: u01Modules,
};

export function validateU01DraftStatuses(release: CurriculumRelease = u01Release): string[] {
  const errors: string[] = [];
  for (const vocabulary of release.vocabularyContent) if (vocabulary.editorialStatus !== "draft") errors.push(vocabulary.id + ": expected draft");
  if (release.status !== "draft") errors.push("U01 release must remain draft until editorial review");
  for (const revision of release.knowledgePointRevisions) if (revision.editorialStatus !== "draft") errors.push(`${revision.id}: expected draft`);
  for (const block of release.contentBlocks) if (block.editorialStatus !== "draft") errors.push(`${block.id}: expected draft`);
  for (const exercise of release.exercises) if (exercise.editorialStatus !== "draft") errors.push(`${exercise.id}: expected draft`);
  for (const assessment of release.assessments) if (assessment.editorialStatus !== "draft") errors.push(`${assessment.id}: expected draft`);
  for (const lesson of release.lessons) if (lesson.editorialStatus !== "draft") errors.push(`${lesson.id}: expected draft`);
  return errors;
}
