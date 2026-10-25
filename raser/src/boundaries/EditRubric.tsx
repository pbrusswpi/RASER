"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { QuestionControl } from "../controls/QuestionControl";
import { RubricControl } from "../controls/RubricControl";
import { SECTION_LABELS, getQuestionCount, type Question, type Rubric, type SectionType } from "../model";
import { raserStore } from "../store/raserStoreInstance";
import { getCurrentUserId } from "../store/currentUser";
import QuestionEditor from "./QuestionEditor";
import Footer from "./Footer";
import Header from "./Header";

const rubricControl = new RubricControl(raserStore);
const questionControl = new QuestionControl(raserStore);

type Props = { rubricId: string };

type EditorState =
  | { mode: "none" }
  | { mode: "add"; sectionId: string }
  | { mode: "edit"; sectionId: string; question: Question };

export default function EditRubric({ rubricId }: Props) {
  const [rubric, setRubric] = useState<Rubric | undefined>(() => rubricControl.getRubric(rubricId));
  const [editor, setEditor] = useState<EditorState>({ mode: "none" });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const refresh = () => setRubric(rubricControl.getRubric(rubricId));

  useEffect(() => {
    refresh();
  }, [rubricId]);

  if (!rubric) {
    return (
      <div className="siteShell">
        <Header />
        <main className="section"><div className="container"><div className="emptyState"><h1>Rubric not found</h1><Link href="/designer" className="secondaryButton">Back to Designer</Link></div></div></main>
        <Footer />
      </div>
    );
  }

  if (rubric.status !== "UNPUBLISHED") {
    return (
      <div className="siteShell">
        <Header />
        <main className="section"><div className="container narrowContainer">
          <div className="pageHeading"><p className="eyebrow">Read Only</p><h1>{rubric.name}</h1><p>Published and deprecated rubrics cannot be edited. Create a duplicate if you need a new editable version.</p></div>
          <div className="actionRow"><Link href={`/rubrics/${rubric.rubricId}`} className="primaryDarkButton">View Rubric</Link><Link href="/designer" className="outlineButton">Back to Designer</Link></div>
        </div></main>
        <Footer />
      </div>
    );
  }

  const saveMetadata = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      rubricControl.updateRubric(rubricId, {
        name: String(form.get("name") ?? ""),
        lowQualityThreshold: Number(form.get("lowQualityThreshold")),
        highQualityThreshold: Number(form.get("highQualityThreshold")),
      }, getCurrentUserId("DESIGNER"));
      setError("");
      setSaved(true);
      refresh();
    } catch (err) {
      setSaved(false);
      setError(err instanceof Error ? err.message : "Unable to save rubric.");
    }
  };

  const deleteQuestion = (questionId: string) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      questionControl.deleteQuestion(rubricId, questionId, getCurrentUserId("DESIGNER"));
      setError("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete question.");
    }
  };

  const startAdd = (sectionId: string) => setEditor({ mode: "add", sectionId });
  const startEdit = (sectionId: string, question: Question) => setEditor({ mode: "edit", sectionId, question });
  const closeEditor = () => setEditor({ mode: "none" });
  const afterQuestionSave = () => { closeEditor(); setError(""); refresh(); };

  return (
    <div className="siteShell">
      <Header />
      <main className="section">
        <div className="container">
          <Link href="/designer" className="backLink">← Back to Designer</Link>
          <div className="pageHeading formHeading">
            <p className="eyebrow">Rubric Designer</p>
            <h1>Edit Rubric</h1>
            <p>Only unpublished rubrics can be changed. Manage metadata and questions below.</p>
          </div>

          {error && <div className="errorMessage" role="alert">{error}</div>}
          {saved && <div className="successMessage" role="status">Rubric metadata saved.</div>}

          <form className="formCard metadataCard" onSubmit={saveMetadata}>
            <div className="cardTopRow">
              <span className="statusBadge status-unpublished">UNPUBLISHED</span>
              <span className="muted">{getQuestionCount(rubric)} questions</span>
            </div>
            <div className="twoColumnFields">
              <label className="formField"><span>Rubric Name</span><input name="name" defaultValue={rubric.name} /></label>
              <div className="twoColumnFields compactFields">
                <label className="formField"><span>Low Threshold</span><input name="lowQualityThreshold" type="number" min="0" defaultValue={rubric.lowQualityThreshold} /></label>
                <label className="formField"><span>High Threshold</span><input name="highQualityThreshold" type="number" min="0" defaultValue={rubric.highQualityThreshold} /></label>
              </div>
            </div>
            <div className="formActions"><button className="primaryDarkButton" type="submit">Save Rubric</button></div>
          </form>

          <section className="editorSections">
            <div className="sectionHeading compactHeading"><h2>Questions</h2><p>Each question must have exactly five rating explanations.</p></div>
            {rubric.sections.map((section) => (
              <article className="sectionEditorCard" key={section.sectionId}>
                <div className="sectionEditorHeader">
                  <div><p className="eyebrow">Section {section.displayOrder}</p><h2>{SECTION_LABELS[section.name as SectionType]}</h2></div>
                  <button className="outlineButton" onClick={() => startAdd(section.sectionId)}>+ Add Question</button>
                </div>

                {section.questions.length === 0 ? (
                  <p className="emptySectionText">No questions yet.</p>
                ) : (
                  <div className="questionList">
                    {section.questions.map((question) => (
                      <div className="questionRow" key={question.questionId}>
                        <div><span className="questionNumber">Q{question.displayOrder}</span><p>{question.questionText}</p></div>
                        <div className="actionRow"><button className="outlineButton" onClick={() => startEdit(section.sectionId, question)}>Edit</button><button className="dangerButton" onClick={() => deleteQuestion(question.questionId)}>Delete</button></div>
                      </div>
                    ))}
                  </div>
                )}

                {editor.mode === "add" && editor.sectionId === section.sectionId && (
                  <QuestionEditor rubricId={rubricId} sectionId={section.sectionId} onSaved={afterQuestionSave} onCancel={closeEditor} />
                )}
                {editor.mode === "edit" && editor.sectionId === section.sectionId && (
                  <QuestionEditor rubricId={rubricId} sectionId={section.sectionId} question={editor.question} onSaved={afterQuestionSave} onCancel={closeEditor} />
                )}
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
