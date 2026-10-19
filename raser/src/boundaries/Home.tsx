import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="siteShell">
      <Header />

      <main>
        <section className="hero">
          <div className="container heroContent">
            <p className="eyebrow">Scientific research evaluation</p>
            <h1>Rubric for Assessing Scientific Experimental Research</h1>
            <p className="heroText">
              RASER provides structured rubrics for evaluating the quality,
              reproducibility, and transparency of scientific experimental
              research.
            </p>
            <Link href="/rubrics" className="primaryButton">
              View Published Rubrics
            </Link>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="sectionHeading">
              <p className="eyebrow">The RASER workflow</p>
              <h2>How RASER Works</h2>
            </div>

            <div className="workflowGrid">
              <div className="workflowCard">
                <span className="stepNumber">01</span>
                <h3>Design</h3>
                <p>Rubric designers create and publish structured research rubrics.</p>
              </div>
              <div className="workflowCard">
                <span className="stepNumber">02</span>
                <h3>Adopt</h3>
                <p>Journal editors select appropriate rubrics for their research papers.</p>
              </div>
              <div className="workflowCard">
                <span className="stepNumber">03</span>
                <h3>Review</h3>
                <p>Reviewers evaluate papers using the assigned rubric and record their findings.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
