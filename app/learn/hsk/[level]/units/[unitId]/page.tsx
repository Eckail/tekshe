import { notFound } from "next/navigation";
import CurriculumLessonRuntime from "../../../../../components/CurriculumLessonRuntime";
import { curriculumRepository } from "../../../../../data/curriculumRepository";
import { U01_RELEASE_ID } from "../../../../../data/u01Curriculum";

type Props = { params: Promise<{ level: string; unitId: string }> };

export function generateStaticParams() {
  const release = curriculumRepository.getRelease(U01_RELEASE_ID);
  return release?.units.map((unit) => ({ level: unit.levelId, unitId: unit.id })) ?? [];
}

export default async function U01PathPage({ params }: Props) {
  const { level, unitId } = await params;
  const release = curriculumRepository.getRelease(U01_RELEASE_ID);
  if (!release) notFound();
  const unit = release.units.find((item) => item.id === unitId && item.levelId === level);
  if (!unit || level !== release.path.levelId) notFound();
  return <CurriculumLessonRuntime release={release} mode="path" initialLessonId={unit.lessonIds[0]} />;
}
