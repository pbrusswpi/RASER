//Read-only presentation of a rubric.

import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import {
  getMaximumScore,
  getQuestionCount,
  SECTION_LABELS,
  type Rubric,
} from "../model";

interface RubricViewBoundaryProps {
  rubric: Rubric;
}

export default function RubricView({
  rubric,
}: RubricViewBoundaryProps) {
  return (
    <div className="siteShell">
      <Header />

      <main className="section">
        <div className="container narrowContainer">
          <Link href="/rubrics" className="backLink">
            ← Back to Published Rubrics
          </Link>

          <header className="rubricHeader">
            <span className="statusBadge">Published</span>
            <h1>{rubric.name}</h1>
            <p>
              Published{" "}
              {rubric.publicationDate
                ? new Date(rubric.publicationDate).toLocaleDateString()
                : "—"}
            </p>

            <div className="summaryGrid">
              <div>
                <span>Sections</span>
                <strong>{rubric.sections.length}</strong>
              </div>
              <div>
                <span>Questions</span>
                <strong>{getQuestionCount(rubric)}</strong>
              </div>
              <div>
                <span>Maximum score</span>
                <strong>{getMaximumScore(rubric)}</strong>
              </div>
              <div>
                <span>High quality</span>
                <strong>≥ {rubric.highQualityThreshold}</strong>
              </div>
              <div>
                <span>Low quality</span>
                <strong>&lt; {rubric.lowQualityThreshold}</strong>
              </div>
            </div>
          </header>

          <div className="notice">
            <strong>Rating scale:</strong> Each question is rated from 1 to 5.
            The explanations below describe the expected evidence for each
            rating.
          </div>

          <div className="rubricDocument">
            {rubric.sections.map((section) => (
              <section className="rubricSection" key={section.sectionId}>
                <div className="sectionNumber">
                  {String(section.displayOrder).padStart(2, "0")}
                </div>

                <div className="sectionContent">
                  <h2>{SECTION_LABELS[section.name]}</h2>

                  {section.questions.map((question) => (
                    <article className="questionBlock" key={question.questionId}>
                      <h3>
                        <span>Q{question.displayOrder}.</span>{" "}
                        {question.questionText}
                      </h3>

                      <div className="ratingList">
                        {[...question.ratingExplanations]
                          .sort((a, b) => b.rating - a.rating)
                          .map((item) => (
                            <div className="ratingRow" key={item.rating}>
                              <span className="ratingNumber">{item.rating}</span>
                              <p>{item.explanation}</p>
                            </div>
                          ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
