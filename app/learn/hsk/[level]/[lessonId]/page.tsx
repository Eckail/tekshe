import { notFound } from "next/navigation";
import CurriculumCourseRunner from "../../../../components/CurriculumCourseRunner";
import PageHeading from "../../../../components/PageHeading";
import { hsk1FoundationCurriculum } from "../../../../data/hsk1Foundation";

type Props = { params: Promise<{ level: string; lessonId: string }> };

export function generateStaticParams() {
  return hsk1FoundationCurriculum.levels.flatMap((level) =>
    hsk1FoundationCurriculum.lessons
      .filter((lesson) => lesson.levelId === level.id)
      .map((lesson) => ({ level: level.id, lessonId: lesson.id }))
  );
}

export default async function HskLessonPage({ params }: Props) {
  const { level: levelId, lessonId } = await params;
  const level = hsk1FoundationCurriculum.levels.find(({ id }) => id === levelId);
  const lesson = hsk1FoundationCurriculum.lessons.find((item) => item.id === lessonId && item.levelId === levelId);
  if (!level || !lesson) notFound();

  return (
    <div>
      <PageHeading eyebrow={`${level.displayName} · ${lesson.estimatedDurationMinutes} МИН`} title={lesson.title} description={lesson.introductionKazakh} />
      <CurriculumCourseRunner curriculum={hsk1FoundationCurriculum} initialLessonId={lesson.id} singleLessonMode lessonPathPrefix={`/learn/hsk/${level.id}`} moduleHref={`/learn/hsk/${level.id}`} />
    </div>
  );
}
