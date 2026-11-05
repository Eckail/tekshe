import PageHeading from "../components/PageHeading";
import LearningCenter from "../components/LearningCenter";
import { pinyinCurriculum } from "../data/pinyinCurriculum";
import { hsk1FoundationCurriculum } from "../data/hsk1Foundation";
import LearningPath from "../components/LearningPath";

export default function LearningPage() {
  return (
    <div>
      <PageHeading eyebrow="ОҚУ ОРТАЛЫҒЫ" title="Қолжетімді сабақтар" description="Курс материалдары дайын модульдерден бастаңыз. Әр сабақ өз бетінде ашылады." />
      <LearningCenter pinyin={pinyinCurriculum} hsk={hsk1FoundationCurriculum} />
      <div className="mt-12">
        <LearningPath />
      </div>
    </div>
  );
}
