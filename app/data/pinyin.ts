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