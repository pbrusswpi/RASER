//Contains sample rubric data used by the prototype/demo.

import type { Rubric, SectionType } from "../model";

const explanations = (
  questionId: string,
  explanations: [string, string, string, string, string]
) =>
  explanations.map((explanation, index) => ({
    ratingExplanationId: `${questionId}-rating-${5 - index}`,
    questionId,
    rating: 5 - index,
    explanation,
  }));

const section = (
  rubricId: string,
  sectionId: string,
  name: SectionType,
  displayOrder: number,
  questions: Array<{
    id: string;
    text: string;
    explanations: [string, string, string, string, string];
  }>
) => ({
  sectionId,
  name,
  displayOrder,
  questions: questions.map((question, index) => ({
    questionId: question.id,
    rubricId,
    sectionId,
    questionText: question.text,
    displayOrder: index + 1,
    ratingExplanations: explanations(question.id, question.explanations),
  })),
});

export const sampleRubrics: Rubric[] = [
  {
    rubricId: "650e8400-e29b-41d4-a716-446655440000",
    name: "In Vitro – Plant Research",
    lowQualityThreshold: 40,
    highQualityThreshold: 55,
    publicationDate: "2026-10-01T00:00:00.000Z",
    status: "PUBLISHED",
    sampleUrl: "#",
    designerId: "550e8400-e29b-41d4-a716-446655440000",
    sections: [
      section(
        "650e8400-e29b-41d4-a716-446655440000",
        "section-1",
        "INTRODUCTION",
        1,
        [
          {
            id: "q-1",
            text: "Does the introduction clearly establish the research objective?",
            explanations: [
              "The research objective is clearly stated and fully justified.",
              "The research objective is clear but has a minor omission.",
              "The research objective is present but incompletely explained.",
              "The research objective is difficult to identify or substantially incomplete.",
              "No clear research objective is reported.",
            ],
          },
          {
            id: "q-2",
            text: "Does the introduction provide sufficient scientific context?",
            explanations: [
              "The scientific context is comprehensive and directly supports the study.",
              "The context is strong with only minor omissions.",
              "Relevant context is provided but important information is missing.",
              "The scientific context is largely incomplete.",
              "Little or no scientific context is provided.",
            ],
          },
        ]
      ),
      section(
        "650e8400-e29b-41d4-a716-446655440000",
        "section-2",
        "MATERIALS_AND_SOURCING",
        2,
        [
          {
            id: "q-3",
            text: "Are the materials and their sources adequately identified?",
            explanations: [
              "All materials and sources are completely identified.",
              "Materials are identified with only minor omissions.",
              "Most materials are identified, but important details are missing.",
              "Many materials or sources are inadequately documented.",
              "Materials and sources are not reported.",
            ],
          },
        ]
      ),
      section(
        "650e8400-e29b-41d4-a716-446655440000",
        "section-3",
        "METHODOLOGY_AND_REPRODUCIBILITY",
        3,
        [
          {
            id: "q-4",
            text: "Is the methodology described sufficiently to support reproducibility?",
            explanations: [
              "The methodology is detailed enough for independent reproduction.",
              "The methodology is substantially reproducible with minor gaps.",
              "The methodology is partially reproducible.",
              "Major methodological details are missing.",
              "The methodology is not sufficiently reported.",
            ],
          },
        ]
      ),
      section(
        "650e8400-e29b-41d4-a716-446655440000",
        "section-4",
        "REPLICATION",
        4,
        [
          {
            id: "q-5",
            text: "Does the study provide information needed for replication?",
            explanations: [
              "All information necessary for replication is provided.",
              "Replication is possible with minor additional assumptions.",
              "Some important replication information is missing.",
              "Replication would be difficult because of substantial omissions.",
              "No meaningful replication information is provided.",
            ],
          },
        ]
      ),
      section(
        "650e8400-e29b-41d4-a716-446655440000",
        "section-5",
        "RISK_OF_BIAS_AND_STATISTICS",
        5,
        [
          {
            id: "q-6",
            text: "Are risks of bias and statistical procedures appropriately addressed?",
            explanations: [
              "Potential bias and statistical procedures are fully addressed and justified.",
              "Bias and statistics are addressed with minor gaps.",
              "Some relevant issues are addressed but important details are missing.",
              "Major issues relating to bias or statistics are inadequately addressed.",
              "Bias and statistical procedures are not adequately reported.",
            ],
          },
        ]
      ),
      section(
        "650e8400-e29b-41d4-a716-446655440000",
        "section-6",
        "REPORTING_AND_TRANSPARENCY",
        6,
        [
          {
            id: "q-7",
            text: "Does the report provide sufficient information for transparent evaluation?",
            explanations: [
              "Reporting is comprehensive and highly transparent.",
              "Reporting is strong with only minor omissions.",
              "Reporting is partially transparent but has notable gaps.",
              "Reporting is substantially incomplete.",
              "Reporting does not provide sufficient information for evaluation.",
            ],
          },
        ]
      ),
    ],
  },
];



