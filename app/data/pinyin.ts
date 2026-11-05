export type Pinyin = {
  id: number;
  syllable: string;
  initial: string;
  final: string;
  tone: number;
  example: string;
  meaning: string;
};

export const pinyinData: Pinyin[] = [
  {
    id: 1,
    syllable: "mā",
    initial: "m",
    final: "a",
    tone: 1,
    example: "妈",
    meaning: "ана",
  },
  {
    id: 2,
    syllable: "má",
    initial: "m",
    final: "a",
    tone: 2,
    example: "麻",
    meaning: "кендір",
  },
  {
    id: 3,
    syllable: "mǎ",
    initial: "m",
    final: "a",
    tone: 3,
    example: "马",
    meaning: "жылқы",
  },
  {
    id: 4,
    syllable: "mà",
    initial: "m",
    final: "a",
    tone: 4,
    example: "骂",
    meaning: "балағаттау",
  },
  {
    id: 5,
    syllable: "ma",
    initial: "m",
    final: "a",
    tone: 5,
    example: "吗",
    meaning: "сұраулық шылау",
  },
];

export type PinyinSyllableExample = {
  pinyin: string;
  hanzi: string;
  meaning: string;
  initial: string;
  final: string;
  tone: number;
  structure: string;
  explanation: string;
};

export const pinyinSyllables: PinyinSyllableExample[] = [
  {
    pinyin: "mā",
    hanzi: "妈",
    meaning: "ана",
    initial: "m",
    final: "a",
    tone: 1,
    structure: "m + a + 1",
    explanation: "m —声母，a —韵母，ā — бірінші тон.",
  },
  {
    pinyin: "mǎ",
    hanzi: "马",
    meaning: "жылқы",
    initial: "m",
    final: "a",
    tone: 3,
    structure: "m + a + 3",
    explanation: "m —声母，a —韵母，ǎ — үшінші тон.",
  },
  {
    pinyin: "hǎo",
    hanzi: "好",
    meaning: "жақсы",
    initial: "h",
    final: "ao",
    tone: 3,
    structure: "h + ao + 3",
    explanation: "h —声母，ao — күрделі韵母，ǎo — үшінші тон.",
  },
  {
    pinyin: "guó",
    hanzi: "国",
    meaning: "ел",
    initial: "g",
    final: "uo",
    tone: 2,
    structure: "g + uo + 2",
    explanation: "g —声母，uo —韵母，ó — екінші тон.",
  },
  {
    pinyin: "shū",
    hanzi: "书",
    meaning: "кітап",
    initial: "sh",
    final: "u",
    tone: 1,
    structure: "sh + u + 1",
    explanation: "sh — біртұтас声母, оны s және h деп бөлуге болмайды.",
  },
  {
    pinyin: "ài",
    hanzi: "爱",
    meaning: "сүю",
    initial: "жоқ",
    final: "ai",
    tone: 4,
    structure: "零声母 + ai + 4",
    explanation: "Бұл буында声母 жоқ. Ол韵母 ai дыбысынан басталады.",
  },
  {
    pinyin: "yī",
    hanzi: "衣",
    meaning: "киім",
    initial: "жоқ",
    final: "i",
    tone: 1,
    structure: "零声母 + i + 1",
    explanation: "y жазылуы бұл жерде жеке声母 ретінде қарастырылмайды. Буынның дыбыстық басталуы — i.",
  },
  {
    pinyin: "dōng",
    hanzi: "东",
    meaning: "шығыс",
    initial: "d",
    final: "ong",
    tone: 1,
    structure: "d + ong + 1",
    explanation: "d —声母, ong —韵母, ō — бірінші тон.",
  },
];

export type PinyinToneDescription = {
  toneNumber: number;
  tone: string;
  name: string;
  description: string;
  mark: string;
};

export const pinyinToneDescriptions: PinyinToneDescription[] = [
  {
    toneNumber: 1,
    tone: "第一声",
    name: "Бірінші тон",
    description: "Жоғары әрі бірқалыпты айтылады.",
    mark: "ā",
  },
  {
    toneNumber: 2,
    tone: "第二声",
    name: "Екінші тон",
    description: "Төменнен жоғары қарай көтеріледі.",
    mark: "á",
  },
  {
    toneNumber: 3,
    tone: "第三声",
    name: "Үшінші тон",
    description: "Жеке айтылғанда алдымен төмендеп, кейін көтеріледі.",
    mark: "ǎ",
  },
  {
    toneNumber: 4,
    tone: "第四声",
    name: "Төртінші тон",
    description: "Жоғарыдан төмен қарай тез түседі.",
    mark: "à",
  },
  {
    toneNumber: 5,
    tone: "轻声",
    name: "Жеңіл тон",
    description: "Қысқа әрі жеңіл айтылады.",
    mark: "ma",
  },
];
