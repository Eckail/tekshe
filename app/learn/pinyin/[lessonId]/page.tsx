import { notFound } from "next/navigation";
import CurriculumCourseRunner from "../../../components/CurriculumCourseRunner";
import PageHeading from "../../../components/PageHeading";
import { pinyinCurriculum } from "../../../data/pinyinCurriculum";

type Props = { params: Promise<{ lessonId: string }> };

export function generateStaticParams() {
  return pinyinCurriculum.lessons.map(({ id }) => ({ lessonId: id }));
}

export default async function PinyinLessonPage({ params }: Props) {
  const { lessonId } = await params;
  const lesson = pinyinCurriculum.lessons.find(({ id }) => id === lessonId);
  if (!lesson) notFound();

  return (
    <div>
      <PageHeading eyebrow={`ПИНЬИНЬ · ${lesson.estimatedDurationMinutes} МИН`} title={lesson.title} description={lesson.introductionKazakh} />
      <CurriculumCourseRunner
        curriculum={pinyinCurriculum}
        legacyCourseId="pinyin-basics"
        initialLessonId={lesson.id}
        singleLessonMode
        lessonPathPrefix="/learn/pinyin"
        moduleHref="/learn/pinyin"
      />
    </div>
  );
}
