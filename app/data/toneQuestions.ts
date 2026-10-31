
export type ToneQuestion = {
  id: number;
  pinyin: string;
  hanzi: string;
  options: number[];
  correctAnswer: number;
};

const toneGroups = [
  ["ma", ["mā", "má", "mǎ", "mà"], ["妈", "麻", "马", "骂"]],
  ["ba", ["bā", "bá", "bǎ", "bà"], ["八", "拔", "把", "爸"]],
  ["di", ["dī", "dí", "dǐ", "dì"], ["低", "敌", "底", "地"]],
  ["tang", ["tāng", "táng", "tǎng", "tàng"], ["汤", "糖", "躺", "烫"]],
  ["yi", ["yī", "yí", "yǐ", "yì"], ["衣", "姨", "椅", "意"]],
  ["shu", ["shū", "shú", "shǔ", "shù"], ["书", "熟", "数", "树"]],
  ["fan", ["fān", "fán", "fǎn", "fàn"], ["翻", "烦", "反", "饭"]],
  ["shi", ["shī", "shí", "shǐ", "shì"], ["师", "十", "使", "事"]],
  ["guo", ["guō", "guó", "guǒ", "guò"], ["锅", "国", "果", "过"]],
  ["zhu", ["zhū", "zhú", "zhǔ", "zhù"], ["猪", "竹", "煮", "住"]],
] as const;

export const toneQuestions: ToneQuestion[] = toneGroups.flatMap(
  (group, groupIndex) =>
    group[1].map((pinyin, toneIndex) => ({
      id: groupIndex * 4 + toneIndex + 1,
      pinyin,
      hanzi: group[2][toneIndex],
      options: [1, 2, 3, 4],
      correctAnswer: toneIndex + 1,
    }))
);
