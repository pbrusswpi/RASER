//Displays a particular rubric.

import { notFound } from "next/navigation";
import RubricView from "../../../boundaries/RubricView";
import { sampleRubrics } from "../../../data/sampleRubrics";

interface RubricPageProps {
  params: Promise<{ id: string }>;
}

export default async function RubricPage({ params }: RubricPageProps) {
  const { id } = await params;

  const rubric = sampleRubrics.find(
    (candidate) =>
      candidate.rubricId === id && candidate.status === "PUBLISHED"
  );

  if (!rubric) {
    notFound();
  }

  return <RubricView rubric={rubric} />;
}
