//Displays the published rubric library.

import RubricList from "../../boundaries/RubricList";
import { sampleRubrics } from "../../data/sampleRubrics";

export default function RubricsPage() {
  const publishedRubrics = sampleRubrics.filter(
    (rubric) => rubric.status === "PUBLISHED"
  );

  return <RubricList rubrics={publishedRubrics} />;
}
