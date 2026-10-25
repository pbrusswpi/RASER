// Designer home/dashboard that provides access to creating rubrics; editing unpublished rubrics;
// publishing; duplicating; deprecating; and deleting where permitted

"use client";

import Link from "next/link";
import { useState } from "react";
import { getQuestionCount, type Rubric } from "../model";
import { RubricControl } from "../controls/RubricControl";
import { raserStore } from "../store/raserStoreInstance";
import Footer from "./Footer";
import Header from "./Header";

import { getCurrentUserId } from "../store/currentUser";

export const getDesignerId = () => getCurrentUserId("DESIGNER");

const rubricControl = new RubricControl(raserStore);

export default function DesignerDashboard() {
  const [rubrics, setRubrics] = useState<Rubric[]>(() =>
    rubricControl.getDesignerRubrics(getDesignerId())
  );
  const [error, setError] = useState("");

  const refresh = () =>
    setRubrics(rubricControl.getDesignerRubrics(getDesignerId()));

  const handleDelete = (rubricId: string) => {
    if (!window.confirm("Delete this unpublished rubric?")) return;
    try {
      rubricControl.deleteRubric(rubricId, getDesignerId());
      setError("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete rubric.");
    }
  };

  const handlePublish = (rubricId: string) => {
    try {
      rubricControl.publishRubric(rubricId, getDesignerId());
      setError("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to publish rubric.");
    }
  };

  const handleDuplicate = (rubricId: string) => {
    const source = rubricControl.getRubric(rubricId);
    if (!source) {
        return;
    } 
        
    const newName = window.prompt("Name for the duplicate rubric:", `${source.name} – Copy`);
    
    if (newName === null) {
        return;
    }
        
    try {
      rubricControl.duplicateRubric(rubricId, newName, getDesignerId());
      setError("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to duplicate rubric.");
    }
  };

  const handleDeprecate = (rubricId: string) => {
    const replacement = window.prompt(
      "Optional replacement rubric ID. Leave blank to deprecate without a replacement:"
    );
    
    if (replacement === null) {
        return;
    }
    
    try {
      rubricControl.deprecateRubric(
        rubricId,
        replacement.trim() || undefined,
        getDesignerId()
      );
      setError("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to deprecate rubric.");
    }
  };

  return (
    <div className="siteShell">
      <Header />
      <main className="section">
        <div className="container">
          <div className="pageHeading dashboardHeading">
            <p className="eyebrow">Rubric Designer</p>
            <h1>Designer Dashboard</h1>
            <p>Design, revise, publish, and manage your research rubrics.</p>
            <Link href="/designer/rubrics/new" className="primaryDarkButton">
              + Create Rubric
            </Link>
          </div>

          {error && <div className="errorMessage" role="alert">{error}</div>}

          <section>
            <div className="sectionHeading compactHeading">
              <h2>My Rubrics</h2>
            </div>

            {rubrics.length === 0 ? (
              <div className="emptyState">
                <h2>No rubrics yet</h2>
                <p>Create your first rubric to begin defining research-quality criteria.</p>
              </div>
            ) : (
              <div className="designerRubricList">
                {rubrics.map((rubric) => (
                  <article className="designerRubricCard" key={rubric.rubricId}>
                    <div className="cardTopRow">
                      <span className={`statusBadge status-${rubric.status.toLowerCase()}`}>
                        {rubric.status}
                      </span>
                      <span className="muted">{getQuestionCount(rubric)} questions</span>
                    </div>
                    <h2>{rubric.name}</h2>
                    <p className="cardDescription">
                      {rubric.sections.length} fixed sections · thresholds {rubric.lowQualityThreshold} / {rubric.highQualityThreshold}
                    </p>
                    <div className="actionRow">
                      {rubric.status === "UNPUBLISHED" && (
                        <>
                          <Link href={`/designer/rubrics/${rubric.rubricId}`} className="secondaryButton smallButton">Edit</Link>
                          <button className="outlineButton" onClick={() => handlePublish(rubric.rubricId)}>Publish</button>
                          <button className="outlineButton" onClick={() => handleDuplicate(rubric.rubricId)}>Duplicate</button>
                          <button className="dangerButton" onClick={() => handleDelete(rubric.rubricId)}>Delete</button>
                        </>
                      )}
                      {rubric.status === "PUBLISHED" && (
                        <>
                          <Link href={`/rubrics/${rubric.rubricId}`} className="secondaryButton smallButton">View</Link>
                          <button className="outlineButton" onClick={() => handleDuplicate(rubric.rubricId)}>Duplicate</button>
                          <button className="outlineButton" onClick={() => handleDeprecate(rubric.rubricId)}>Deprecate</button>
                        </>
                      )}
                      {rubric.status === "DEPRECATED" && (
                        <>
                          <Link href={`/rubrics/${rubric.rubricId}`} className="secondaryButton smallButton">View</Link>
                          <button className="outlineButton" onClick={() => handleDuplicate(rubric.rubricId)}>Duplicate</button>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
