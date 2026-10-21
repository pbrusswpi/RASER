//Displays available published rubrics, 
//includes displaying rubric metadata & links to individual rubrics.


import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import {
  getMaximumScore,
  getQuestionCount,
  SECTION_LABELS,
  type Rubric,
} from "../model";

interface RubricListBoundaryProps {
  rubrics: Rubric[];
}

export default function RubricList({
  rubrics,
}: RubricListBoundaryProps) {
  return (
    <div className="siteShell">
      <Header />

      <main className="section">
        <div className="container">
          <div className="pageHeading">
            <p className="eyebrow">RASER Library</p>
            <h1>Published Rubrics</h1>
            <p>
              Browse rubrics that have been published for use in scientific
              research evaluation.
            </p>
          </div>

          <div className="rubricGrid">
            {rubrics.map((rubric) => (
              <article className="rubricCard" key={rubric.rubricId}>
                <div className="cardTopRow">
                  <span className="statusBadge">Published</span>
                  <span className="muted">
                    {getQuestionCount(rubric)} questions
                  </span>
                </div>

                <h2>{rubric.name}</h2>

                <p className="cardDescription">
                  A structured rubric covering {rubric.sections.length} fixed
                  research-quality sections.
                </p>

                <dl className="rubricMeta">
                  <div>
                    <dt>Published</dt>
                    <dd>
                      {rubric.publicationDate
                        ? new Date(rubric.publicationDate).toLocaleDateString()
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt>Maximum score</dt>
                    <dd>{getMaximumScore(rubric)}</dd>
                  </div>
                  <div>
                    <dt>High quality</dt>
                    <dd>≥ {rubric.highQualityThreshold}</dd>
                  </div>
                  <div>
                    <dt>Low quality</dt>
                    <dd>&lt; {rubric.lowQualityThreshold}</dd>
                  </div>
                </dl>

                <div className="sectionTags">
                  {rubric.sections.map((section) => (
                    <span className="sectionTag" key={section.sectionId}>
                      {SECTION_LABELS[section.name]}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/rubrics/${rubric.rubricId}`}
                  className="secondaryButton"
                >
                  View Rubric
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
