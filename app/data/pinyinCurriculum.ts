import type { Curriculum } from "./curriculum";

export const pinyinInitials = [
  "b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h",
  "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s",
] as const;

export const pinyinFinalGroups = {
  simple: ["a", "o", "e", "i", "u", "ü"],
  compound: ["ai", "ei", "ui", "ao", "ou", "iu", "ie", "üe"],
  frontNasal: ["an", "en", "in", "un", "ün"],
  backNasal: ["ang", "eng", "ing", "ong"],
  special: ["er"],
  medialCombinations: [
    "ia", "iao", "ian", "iang", "iong", "ua", "uo", "uai", "uan",
    "uang", "ueng", "üan",
  ],
} as const;

export const pinyinToneInventory = [1, 2, 3, 4, "neutral"] as const;

const curriculumId = "pinyin-foundations-v1";
const levelId = "pinyin-foundations-v1-level-1";
const unitId = "pinyin-foundations-v1-unit-1";
const moduleId = "pinyin-foundations-v1-pronunciation";

export const pinyinCurriculum: Curriculum = {
  id: curriculumId,
  title: "Пиньинь: дыбыстан буынға дейін",
  version: "1.0.0",
  descriptionKazakh:
    "Мандарин дыбыстарын, тондарын және буынды дұрыс құрауды жүйелі түрде меңгеріңіз.",
  editorialNoteKazakh:
    "Қазақша түсіндірмелер мен аудармалар бастапқы редакторлық нұсқа; жариялаудың алдында қазақ тілі ана тілі болып табылатын редактор тексеруі қажет.",
  standard: {
    id: "hanyu-pinyin-scheme-1958-with-gbt-16159-2012",
    name: "《汉语拼音方案》 және GB/T 16159—2012《汉语拼音正词法基本规则》",
    version: "1958-scheme + 2012-orthography",
    publishedAt: "2012-06-29",
    effectiveFrom: "2012-10-01",
    publisher: "中华人民共和国教育部 / 国家语言文字工作委员会",
    sourceUrl:
      "https://www.moe.gov.cn/ewebeditor/uploadfile/2015/01/13/20150113091717604.pdf",
  },
  sources: [
    {
      id: "hanyu-pinyin-scheme",
      title: "汉语拼音方案",
      publisher: "中华人民共和国教育部",
      url: "https://hudong.moe.gov.cn/jyb_sjzl/ziliao/A19/195802/t19580201_186000.html",
      publishedAt: "1958-02-11",
      consultedAt: "2026-11-05",
    },
    {
      id: "gbt-16159-2012",
      title: "汉语拼音正词法基本规则 (GB/T 16159—2012)",
      publisher: "国家质量监督检验检疫总局、国家标准化管理委员会",
      url: "https://www.moe.gov.cn/ewebeditor/uploadfile/2015/01/13/20150113091717604.pdf",
      publishedAt: "2012-06-29",
      consultedAt: "2026-11-05",
      locator: "拼写、分词连写、标调与隔音符号规则",
    },
    {
      id: "cuhk-putonghua-phonetics",
      title: "Putonghua for Foreigners: Phonetics 3 — Tonal changes of the third tone",
      publisher: "The Chinese University of Hong Kong, Independent Learning Centre",
      url: "https://www.ilc.cuhk.edu.hk/chinese/re_PTHforForeigners_Phonetics3.html",
      consultedAt: "2026-11-05",
      locator: "第三声连读和半三声的教学说明",
    },
  ],
  levels: [
    {
      id: levelId,
      displayName: "Пиньинь негіздері",
      sequence: 1,
      learningGoals: [
        "Мандариннің 21 негізгі声母сын тану.",
        "韵母 түрлерін және ü жазылуын ажырату.",
        "Төрт тон мен жеңіл тонды тыңдап тану.",
        "声母, 韵母 және тонды біріктіріп, жаңа буынды оқу.",
      ],
      unitIds: [unitId],
    },
  ],
  modules: [
    {
      id: moduleId,
      kind: "phonetics",
      title: "Дыбыс, тон және буын",
      learningObjectives: [
        "Дыбыстарды дұрыс топтастыру және салыстыру.",
        "Пиньиньдің негізгі орфографиялық ережелерін қолдану.",
        "Таныс және жаңа буындарды оқып, тыңдап ажырату.",
      ],
      lessonIds: [
        "pinyin-initials",
        "pinyin-finals",
        "tone-practice",
        "pinyin-spelling",
        "syllables",
      ],
    },
  ],
  units: [
    {
      id: unitId,
      levelId,
      title: "Негізгі дыбыстар мен拼读",
      sequence: 1,
      moduleIds: [moduleId],
      prerequisites: [],
    },
  ],
  lessons: [
    {
      id: "pinyin-initials",
      curriculumId,
      levelId,
      unitId,
      moduleId,
      title: "声母: буынның бастапқы дыбыстары",
      introductionKazakh:
        "Алдымен сөздің басындағы дауыссызды танып, ауа ағыны бойынша ұқсас дыбыстарды салыстырыңыз.",
      learningObjectives: [
        "21 негізгі声母ны тану және жазу.",
        "Дем шығаруы күштірек жұптарды ажырату: b/p, d/t, g/k, j/q, zh/ch, z/c.",
        "sh және zh сияқты қос әріпті声母ны бір дыбыс ретінде оқу.",
      ],
      teachingSections: [
        {
          id: "initial-inventory",
          title: "21 негізгі声母",
          explanationKazakh:
            "声母 буынның басында тұрады. Жұптағы екінші дыбысты айтқанда дем айқынырақ шығады; b, d, g, j, zh, z дыбыстарында демді қатты шығармаңыз. zh, ch, sh екі әріппен жазылғанымен, әрқайсысы бір声母 болып саналады.",
          items: [...pinyinInitials],
          examples: [
            { hanzi: "八", pinyin: "bā", translationKazakh: "сегіз" },
            { hanzi: "趴", pinyin: "pā", translationKazakh: "етпетінен жату" },
            { hanzi: "吃", pinyin: "chī", translationKazakh: "жеу" },
            { hanzi: "书", pinyin: "shū", translationKazakh: "кітап" },
            { hanzi: "四", pinyin: "sì", translationKazakh: "төрт" },
            { hanzi: "是", pinyin: "shì", translationKazakh: "болу" },
          ],
        },
      ],
      vocabularyIds: [],
      grammarPointIds: [],
      readingMaterialIds: [],
      exerciseIds: ["initial-identification", "initial-listening", "initial-contrast"],
      estimatedDurationMinutes: 12,
      prerequisites: [],
    },
    {
      id: "pinyin-finals",
      curriculumId,
      levelId,
      unitId,
      moduleId,
      title: "韵母: дауысты дыбыстар және олардың тіркестері",
      introductionKazakh:
        "Бір дыбысты, қосарланған және мұрын жолды韵母ларды топтап үйреніп, соңғы дыбыстың қалай өзгеретінін тыңдаңыз.",
      learningObjectives: [
        "Қарапайым, қосарланған, алдыңғы және артқы мұрын жолды韵母ларды топтау.",
        "介音 бар негізгі тіркестерді тану.",
        "ü дыбысының u-дан айырмасын естіп, дұрыс таңбалау.",
      ],
      teachingSections: [
        {
          id: "final-groups",
          title: "韵母 топтары",
          explanationKazakh:
            "韵母 буынның негізгі дауысты бөлігін құрайды. Жаңа韵母ны үйренгенде оның соңындағы мұрын дыбысын да анық тыңдаңыз: n алдыңғы мұрын жолын, ng артқы мұрын жолын білдіреді.",
          items: [
            `Қарапайым: ${pinyinFinalGroups.simple.join(" · ")}`,
            `Қосарланған: ${pinyinFinalGroups.compound.join(" · ")}`,
            `Алдыңғы мұрын жолды: ${pinyinFinalGroups.frontNasal.join(" · ")}`,
            `Артқы мұрын жолды: ${pinyinFinalGroups.backNasal.join(" · ")}`,
            `Арнайы: ${pinyinFinalGroups.special.join(" · ")}`,
            `介音 тіркестері: ${pinyinFinalGroups.medialCombinations.join(" · ")}`,
          ],
          examples: [
            { hanzi: "爱", pinyin: "ài", translationKazakh: "жақсы көру" },
            { hanzi: "杯", pinyin: "bēi", translationKazakh: "кесе" },
            { hanzi: "安", pinyin: "ān", translationKazakh: "аман" },
            { hanzi: "忙", pinyin: "máng", translationKazakh: "бос емес" },
            { hanzi: "月", pinyin: "yuè", translationKazakh: "ай" },
            { hanzi: "儿", pinyin: "ér", translationKazakh: "бала" },
          ],
        },
        {
          id: "umlaut",
          title: "ü дыбысы",
          explanationKazakh:
            "ü айтылғанда ерінді дөңгелектеп, тілдің алдыңғы бөлігін жоғары ұстаңыз. Ол u дыбысымен бірдей емес: lù мен lǜ, nǔ мен nǚ жұптарын тыңдап салыстырыңыз.",
          examples: [
            { hanzi: "绿", pinyin: "lǜ", translationKazakh: "жасыл" },
            { hanzi: "女", pinyin: "nǚ", translationKazakh: "әйел" },
            { hanzi: "月", pinyin: "yuè", translationKazakh: "ай" },
          ],
        },
      ],
      vocabularyIds: [],
      grammarPointIds: [],
      readingMaterialIds: [],
      exerciseIds: ["final-groups", "final-listening", "umlaut-contrast"],
      estimatedDurationMinutes: 14,
      prerequisites: ["pinyin-initials"],
    },
    {
      id: "tone-practice",
      curriculumId,
      levelId,
      unitId,
      moduleId,
      title: "声调: төрт тон және жеңіл тон",
      introductionKazakh:
        "Тон буынның биіктігі мен қозғалысын өзгертеді; тон өзгерсе, сөздің мағынасы да өзгеруі мүмкін.",
      learningObjectives: [
        "Бірінші, екінші, үшінші, төртінші және жеңіл тонды ажырату.",
        "Үшінші тонның сөйлеудегі өзгерісін түсіндіру.",
        "一 және 不 сөздерінің жиі қолданылатын тон өзгерістерін тану.",
      ],
      teachingSections: [
        {
          id: "five-tones",
          title: "Тондардың негізгі әуені",
          explanationKazakh:
            "Бірінші тон жоғары әрі бірқалыпты; екінші тон жоғары көтеріледі; үшінші тон жеке айтылғанда төмен түсіп, соңында көтерілуі мүмкін; төртінші тон қысқа әрі төмен құлдилайды. Жеңіл тон қысқа, екпіні әлсіз болады. Күнделікті сөйлеуде үшінші тон сөз соңында жиі тек төмен айтылады.",
          items: [
            "1-тон: mā — жоғары, бірқалыпты",
            "2-тон: má — төменнен жоғары көтеріледі",
            "3-тон: mǎ — төмен түсіп, кейде қайта көтеріледі",
            "4-тон: mà — жоғарыдан төмен түседі",
            "Жеңіл тон: ma — қысқа, екпінсіз",
          ],
          examples: [
            { hanzi: "妈", pinyin: "mā", translationKazakh: "ана" },
            { hanzi: "麻", pinyin: "má", translationKazakh: "кендір" },
            { hanzi: "马", pinyin: "mǎ", translationKazakh: "жылқы" },
            { hanzi: "骂", pinyin: "mà", translationKazakh: "ұрысу" },
            { hanzi: "吗", pinyin: "ma", translationKazakh: "сұраулық демеулік" },
          ],
        },
        {
          id: "tone-sandhi",
          title: "Тонның сөйлеуде өзгеруі",
          explanationKazakh:
            "Екі үшінші тон қатар келгенде, алғашқы буын сөйлеуде екінші тонға ұқсап айтылады: 你好 сөзінің негізгі жазылымы nǐ hǎo, табиғи айтылымы ní hǎo. Үшінші тоннан кейін 1-, 2-, 4-тон не жеңіл тон келсе, үшінші тон көбіне төмен қалып, толық көтерілмейді. Үш және одан көп үшінші тон қатар келгенде, өзгеріс сөздердің байланысы, мағыналық топ, кідіріс пен сөйлеу қарқынына тәуелді; оларды түгелдей механикалық түрде екінші тонға айналдырмаңыз. Мысалы, 我很好 негізгі түрде wǒ hěn hǎo деп жазылады; айтылымын мағыналық топтарға бөліп тыңдап үйреніңіз. Бірінші тоннан кейінгі үшінші тон арнайы өзгермейді: 花朵 huāduǒ. 一 жеке тұрғанда yī; төртінші тонның алдында yí (一个 yí ge), ал бірінші, екінші не үшінші тонның алдында көбіне yì (一天 yì tiān, 一年 yì nián, 一本 yì běn) болып айтылады. Реттік санда және санап айтқанда 一 кейде yī күйінде қалады. 不 төртінші тонның алдында bú болады: 不是 bú shì.",
          examples: [
            { hanzi: "你好", pinyin: "nǐ hǎo → ní hǎo", translationKazakh: "сәлем" },
            { hanzi: "花朵", pinyin: "huāduǒ", translationKazakh: "гүл" },
            { hanzi: "一个", pinyin: "yí ge", translationKazakh: "біреу" },
            { hanzi: "不是", pinyin: "bú shì", translationKazakh: "емес" },
            { hanzi: "我很好", pinyin: "wǒ hěn hǎo", translationKazakh: "Мен жақсымын" },
          ],
        },
      ],
      vocabularyIds: [],
      grammarPointIds: [],
      readingMaterialIds: [],
      exerciseIds: ["tone-identification", "tone-listening", "tone-sandhi"],
      estimatedDurationMinutes: 15,
      prerequisites: ["pinyin-finals"],
    },
    {
      id: "pinyin-spelling",
      curriculumId,
      levelId,
      unitId,
      moduleId,
      title: "拼写规则: ü, y/w және буын жігі",
      introductionKazakh:
        "Пиньиньде дыбысталуы ұқсас буындар кейде қысқартылып немесе басқа әріп арқылы жазылады. Ережені сөздің құрамына қарап қолданыңыз.",
      learningObjectives: [
        "j, q, x жанында ü әрпінің қалай жазылатынын түсіну.",
        "y және w таңбаларының нөлдік声母 буындарындағы қызметін ажырату.",
        "Қысқарған 韵母, тон белгісі және隔音符号 ережесін қолдану.",
      ],
      teachingSections: [
        {
          id: "jqx-umlaut",
          title: "j, q, x және ü",
          explanationKazakh:
            "j, q, x әріптерінен кейінгі ü үстіндегі екі нүкте түсіріледі: ju, qu, xu; jue, juan, jun жазылымдарында да ü дыбысы сақталады. Харин n және l-ден кейін нүктелер жазылады: nü, lü, nüe, lüe. Сондықтан ju буыны j+u емес, j+ü болып оқылады.",
          examples: [
            { hanzi: "去", pinyin: "qù", translationKazakh: "бару" },
            { hanzi: "女", pinyin: "nǚ", translationKazakh: "әйел" },
            { hanzi: "绿", pinyin: "lǜ", translationKazakh: "жасыл" },
          ],
        },
        {
          id: "zero-initial-spelling",
          title: "y және w",
          explanationKazakh:
            "i, u немесе ü-ден басталған, алдында дауыссыз声母 жоқ буындарды жазғанда y не w қолданылады. Мұндағы y мен w — нөлдік声母 буындарын жазу тәсілі, жеке бастапқы дауыссыз болып есептелмейді.",
          items: [
            "i-қатары: i→yi · ia→ya · ie→ye · iao→yao · iou→you · ian→yan · in→yin · iang→yang · ing→ying · iong→yong",
            "u-қатары: u→wu · ua→wa · uo→wo · uai→wai · uei→wei · uan→wan · uen→wen · uang→wang · ueng→weng",
            "ü-қатары: ü→yu · üe→yue · üan→yuan · ün→yun",
          ],
          examples: [
            { hanzi: "衣", pinyin: "yī", translationKazakh: "киім" },
            { hanzi: "我", pinyin: "wǒ", translationKazakh: "мен" },
            { hanzi: "鱼", pinyin: "yú", translationKazakh: "балық" },
          ],
        },
        {
          id: "orthographic-details",
          title: "Қысқару, тон таңбасы және隔音符号",
          explanationKazakh:
            "Дауыссыздан кейін iou, uei, uen көбіне iu, ui, un болып қысқарады: liu, gui, lun; дауыссызсыз жазылымдары you, wei, wen болады. Тон таңбасын қоюда алдымен a-ны, содан кейін e не o-ны іздеңіз; iu және ui қатарларында таңба соңғы дауыстыға түседі. Сөздер жымдасып, келесі буын a, o немесе e-ден басталса, буын шекарасын апострофпен көрсетіңіз: 西安 Xī'ān. z, c, s, zh, ch, sh, r-ден кейінгі i арнайы айтылымға ие, оны әдеттегі и дыбысымен шатастырмаңыз; er де ерекше韵母.",
          items: ["iou → iu: liú", "uei → ui: guì", "uen → un: lùn", "零声母: yī, wǒ, ài", "隔音符号: Xī'ān"],
          examples: [
            { hanzi: "西安", pinyin: "Xī'ān", translationKazakh: "Сиань" },
            { hanzi: "六", pinyin: "liù", translationKazakh: "алты" },
            { hanzi: "贵", pinyin: "guì", translationKazakh: "қымбат" },
            { hanzi: "论", pinyin: "lùn", translationKazakh: "талқылау" },
          ],
        },
      ],
      vocabularyIds: [],
      grammarPointIds: [],
      readingMaterialIds: [],
      exerciseIds: ["umlaut-spelling", "yw-spelling", "apostrophe-and-tone-mark"],
      estimatedDurationMinutes: 16,
      prerequisites: ["pinyin-finals", "tone-practice"],
    },
    {
      id: "syllables",
      curriculumId,
      levelId,
      unitId,
      moduleId,
      title: "拼读: буынды құрау және шатастырмау",
      introductionKazakh:
        "声母 мен韵母 барлық жағдайда еркін тіркесе бермейді. Үлгі буындарды салыстырып, жаңа кездескен буынды бөліктерге ажыратып оқыңыз.",
      learningObjectives: [
        "Буыннан бастапқы дауыссызды,韵母ны және тонды табу.",
        "zh/ch/sh мен z/c/s, j/q/x мен zh/ch/sh жұптарын салыстыру.",
        "Тыңдалған буынды пиньиньмен сәйкестендіру.",
      ],
      teachingSections: [
        {
          id: "syllable-structure",
          title: "Буынның құрылысы",
          explanationKazakh:
            "Көп буынды声母 + 韵母 + тон деп талдауға болады. Мысалы, hǎo = h + ao + 3-тон. Дауыссызсыз буында声母 болмайды: ài = нөлдік声母 + ai + 4-тон. Әр声母 барлық韵母мен тіркеспейді, сондықтан сөздік пен ресми буын кестесінде бар тіркесті үйреніңіз.",
          items: ["mā = m + a + 1", "hǎo = h + ao + 3", "guó = g + uo + 2", "ài = нөлдік声母 + ai + 4"],
          examples: [
            { hanzi: "妈", pinyin: "mā", translationKazakh: "ана" },
            { hanzi: "好", pinyin: "hǎo", translationKazakh: "жақсы" },
            { hanzi: "国", pinyin: "guó", translationKazakh: "ел" },
            { hanzi: "爱", pinyin: "ài", translationKazakh: "жақсы көру" },
          ],
        },
        {
          id: "common-confusions",
          title: "Жиі шатастырылатын жұптар",
          explanationKazakh:
            "Алдымен ауыздың қай жері қолданылатынын және демнің күшін тыңдаңыз. z/c/s тіл ұшын үстіңгі тістерге жақындатып айтылады; zh/ch/sh тіл ұшын артқа бүгіп айтылады. j/q/x тілдің алдыңғы тұсымен жасалады. Соңғы n мен ng дыбыстарын да салыстырыңыз: олар韵母ның мағынасын өзгертеді.",
          items: ["z / zh", "c / ch", "s / sh", "j / zh", "n / ng", "b / p", "g / k"],
          examples: [
            { hanzi: "是", pinyin: "shì", translationKazakh: "болу" },
            { hanzi: "四", pinyin: "sì", translationKazakh: "төрт" },
            { hanzi: "知", pinyin: "zhī", translationKazakh: "білу" },
            { hanzi: "滋", pinyin: "zī", translationKazakh: "нәрлі болу" },
          ],
        },
      ],
      vocabularyIds: [],
      grammarPointIds: [],
      readingMaterialIds: [],
      exerciseIds: ["syllable-combination", "syllable-reading", "confusable-listening"],
      estimatedDurationMinutes: 15,
      prerequisites: ["pinyin-initials", "pinyin-finals", "tone-practice", "pinyin-spelling"],
    },
  ],
  vocabulary: [],
  grammarPoints: [],
  readings: [],
  audioAssets: [],
  exercises: [
    {
      id: "initial-identification",
      type: "multiple-choice",
      prompt: "zh — қандай聲母?",
      options: ["舌尖后音", "舌尖前音", "舌面音"],
      answer: "舌尖后音",
      explanationKazakh: "zh тіл ұшын артқа бүгіп айтылатын бір声母; z және h болып бөлінбейді.",
    },
    {
      id: "initial-listening",
      type: "listening-selection",
      prompt: "Дыбысты тыңдап, буынның пиньинін таңдаңыз.",
      audioText: "是",
      options: ["shì", "sì", "xì"],
      answer: "shì",
      explanationKazakh: "是 shì: тіл ұшы артқа бүгіледі, соңында төртінші тон төмен түседі.",
    },
    {
      id: "initial-contrast",
      type: "multiple-choice",
      prompt: "Қай жұпта екінші声母 демді күштірек шығарады?",
      options: ["b / p", "m / f", "n / l"],
      answer: "b / p",
      explanationKazakh: "p — демі айқынырақ шығатын қатаңдау дыбыс; b айтылғанда ауа әлдеқайда аз шығады.",
    },
    {
      id: "final-groups",
      type: "multiple-choice",
      prompt: "Қай қатарда тек алдыңғы мұрын жолды韵母лар берілген?",
      options: ["an, en, in, un, ün", "ang, eng, ing, ong", "ai, ei, ao, ou"],
      answer: "an, en, in, un, ün",
      explanationKazakh: "Бұл топтың соңында n жазылады. Артқы мұрын жолды топ ng әріптерімен аяқталады.",
    },
    {
      id: "final-listening",
      type: "listening-selection",
      prompt: "Дыбысты тыңдап,韵母ның соңын таңдаңыз.",
      audioText: "忙",
      options: ["ang", "an", "eng"],
      answer: "ang",
      explanationKazakh: "忙 máng буынындағы韵母 ang; соңында тіл артымен жасалатын ng естіледі.",
    },
    {
      id: "umlaut-contrast",
      type: "multiple-choice",
      prompt: "Қай жұпта ü дыбысы бар?",
      options: ["lǜ / lù", "mā / má", "shì / sì"],
      answer: "lǜ / lù",
      explanationKazakh: "lǜ сөзінде ü, ал lù сөзінде u бар. Жазудағы нүктелер дыбыстық айырманы көрсетеді.",
    },
    {
      id: "tone-identification",
      type: "multiple-choice",
      prompt: "mǎ буынында қай тон бар?",
      options: ["1-тон", "2-тон", "3-тон", "4-тон", "Жеңіл тон"],
      answer: "3-тон",
      explanationKazakh: "ǎ таңбасындағы иілген белгі үшінші тонды көрсетеді.",
    },
    {
      id: "tone-listening",
      type: "listening-selection",
      prompt: "Қытайша буынды тыңдап, оның тон нөмірін таңдаңыз.",
      audioText: "马",
      options: ["1-тон", "2-тон", "3-тон", "4-тон"],
      answer: "3-тон",
      explanationKazakh: "马 mǎ үшінші тонмен айтылады. Тізімдегі басқа мағынасы жақын буындардан тон арқылы ажырайды.",
    },
    {
      id: "tone-sandhi",
      type: "multiple-choice",
      prompt: "你好 сөзінің қалыпты сөйлеудегі алғашқы буыны қалай естіледі?",
      options: ["nǐ — үшінші тон", "ní — екінші тонға ұқсап", "nì — төртінші тон"],
      answer: "ní — екінші тонға ұқсап",
      explanationKazakh: "Екі үшінші тон қатар келгенде, алғашқысы сөйлеуде екінші тонға ұқсап айтылады; пиньиньдің сөздік жазылымы nǐ hǎo болып қалады.",
    },
    {
      id: "umlaut-spelling",
      type: "multiple-choice",
      prompt: "j + ü буыны қалай жазылады?",
      options: ["ju", "jü", "jv"],
      answer: "ju",
      explanationKazakh: "j, q, x әріптерінен кейін ü үстіндегі нүктелер түсіріледі, бірақ дыбысы ü болып қалады.",
    },
    {
      id: "yw-spelling",
      type: "multiple-choice",
      prompt: "Нөлдік声母лы u буыны сөз басында қалай жазылады?",
      options: ["wu", "u", "yu"],
      answer: "wu",
      explanationKazakh: "Алдында дауыссыз声母 жоқ u буыны w арқылы жазылып, wu болады.",
    },
    {
      id: "apostrophe-and-tone-mark",
      type: "multiple-choice",
      prompt: "Сиань қаласының атауын буын шекарасын сақтап қалай жазамыз?",
      options: ["Xī'ān", "Xīān", "Xiān"],
      answer: "Xī'ān",
      explanationKazakh: "Екінші буын a-дан басталатындықтан, апостроф буындардың шекарасын көрсетеді.",
    },
    {
      id: "syllable-combination",
      type: "multiple-choice",
      prompt: "hǎo буынын声母, 韵母 және тонға дұрыс бөліңіз.",
      options: ["h + ao + 3", "ha + o + 3", "h + a + 2"],
      answer: "h + ao + 3",
      explanationKazakh: "h —声母, ao —韵母, ал ǎ үшінші тонды белгілейді.",
    },
    {
      id: "syllable-reading",
      type: "listening-selection",
      prompt: "Дыбысты тыңдап, дәл пиньинь жазылымын таңдаңыз.",
      audioText: "国",
      options: ["guó", "guǒ", "kuó"],
      answer: "guó",
      explanationKazakh: "国 guó: g + uo + екінші тон. Тон белгісі o-ға қойылады.",
    },
    {
      id: "confusable-listening",
      type: "listening-selection",
      prompt: "Дыбысты тыңдап, айтылған сөзді таңдаңыз.",
      audioText: "四",
      options: ["sì", "shì", "xì"],
      answer: "sì",
      explanationKazakh: "四 sì дыбысында тіл ұшы алға жақын тұрады; 是 shì дыбысындағыдай артқа бүгілмейді.",
    },
  ],
};
