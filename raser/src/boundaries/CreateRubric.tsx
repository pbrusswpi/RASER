"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { RubricControl } from "../controls/RubricControl";
import { SECTION_LABELS, type SectionType } from "../model";
import { raserStore } from "../store/raserStoreInstance";
import { getCurrentUserId } from "../store/currentUser";
import Footer from "./Footer";
import Header from "./Header";

const rubricControl = new RubricControl(raserStore);
const fixedSections = Object.keys(SECTION_LABELS) as SectionType[];

export default function CreateRubric() {
  const [name, setName] = useState("");
  const [low, setLow] = useState("40");
  const [high, setHigh] = useState("55");
  const [error, setError] = useState("");
  const [createdId, setCreatedId] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    try {
      const rubric = rubricControl.createRubric({
        name,
        lowQualityThreshold: Number(low),
        highQualityThreshold: Number(high),
        designerId: getCurrentUserId("DESIGNER"),
      });
      setError("");
      setCreatedId(rubric.rubricId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create rubric.");
    }
  };

  if (createdId) {
    return (
      <div className="siteShell">
        <Header />
        <main className="section">
          <div className="container narrowContainer">
            <div className="successPanel">
              <p className="eyebrow">Rubric Created</p>
              <h1>Your rubric is ready to edit.</h1>
              <p>The rubric starts unpublished, so you can add and revise questions before publishing it.</p>
              <div className="actionRow">
                <Link href={`/designer/rubrics/${createdId}`} className="primaryDarkButton">Edit Rubric</Link>
                <Link href="/designer" className="outlineButton">Back to Dashboard</Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="siteShell">
      <Header />
      <main className="section">
        <div className="container narrowContainer">
          <Link href="/designer" className="backLink">← Back to Designer</Link>
          <div className="pageHeading formHeading">
            <p className="eyebrow">Rubric Designer</p>
            <h1>Create Rubric</h1>
            <p>Define the rubric metadata. Its six sections are fixed by the RASER specification.</p>
          </div>

          {error && <div className="errorMessage" role="alert">{error}</div>}

          <form className="formCard" onSubmit={handleSubmit}>
            <label className="formField">
              <span>Rubric Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="In Vitro – Plant Research" />
            </label>

            <div className="twoColumnFields">
              <label className="formField">
                <span>Low Quality Threshold</span>
                <input type="number" min="0" value={low} onChange={(e) => setLow(e.target.value)} />
              </label>
              <label className="formField">
                <span>High Quality Threshold</span>
                <input type="number" min="0" value={high} onChange={(e) => setHigh(e.target.value)} />
              </label>
            </div>

            <fieldset className="fixedSectionsFieldset">
              <legend>Fixed Sections</legend>
              <div className="fixedSectionList">
                {fixedSections.map((section) => (
                  <label key={section} className="fixedSectionItem">
                    <input type="checkbox" checked readOnly />
                    <span>{SECTION_LABELS[section]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="formActions">
              <Link href="/designer" className="outlineButton">Cancel</Link>
              <button type="submit" className="primaryDarkButton">Create Rubric</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
