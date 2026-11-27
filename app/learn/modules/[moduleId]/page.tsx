import { notFound } from "next/navigation";
import CurriculumLessonRuntime from "../../../components/CurriculumLessonRuntime";
import { curriculumRepository } from "../../../data/curriculumRepository";
import { U01_RELEASE_ID } from "../../../data/u01Curriculum";

type Props = { params: Promise<{ moduleId: string }> };

export function generateStaticParams() {
  const release = curriculumRepository.getRelease(U01_RELEASE_ID);
  return release?.independentModules.map((independentModule) => ({ moduleId: independentModule.id })) ?? [];
}

export default async function IndependentModulePage({ params }: Props) {
  const { moduleId } = await params;
  const release = curriculumRepository.getRelease(U01_RELEASE_ID);
  if (!release) notFound();
  const independentModule = release.independentModules.find((item) => item.id === moduleId);
  if (!independentModule) notFound();
  return <CurriculumLessonRuntime release={release} mode="independent" moduleId={independentModule.id} />;
}
