"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Question } from "../model";
import { QuestionControl } from "../controls/QuestionControl";
import { raserStore } from "../store/raserStoreInstance";
import { getCurrentUserId } from "../store/currentUser";

const questionControl = new QuestionControl(raserStore);
const ratings = [5, 4, 3, 2, 1];

type Props = {
  rubricId: string;
  sectionId: string;
  question?: Question;
  onSaved: () => void;
  onCancel: () => void;
};

export default function QuestionEditor({
  rubricId,
  sectionId,
  question,
  onSaved,
  onCancel,
}: Props) {
  const [questionText, setQuestionText] = useState(question?.questionText ?? "");
  const [explanations, setExplanations] = useState<Record<number, string>>(() =>
    Object.fromEntries(ratings.map((rating) => [rating, question?.ratingExplanations.find((item) => item.rating === rating)?.explanation ?? ""]))
  );
  const [error, setError] = useState("");

  const heading = useMemo(() => (question ? "Edit Question" : "Add Question"), [question]);

  const updateExplanation = (rating: number, value: string) => {
    setExplanations((current) => ({ ...current, [rating]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const input = {
      questionText,
      ratingExplanations: ratings.map((rating) => ({ rating, explanation: explanations[rating] ?? "" })),
    };
    try {
      if (question) {
        questionControl.updateQuestion(rubricId, question.questionId, input, getCurrentUserId("DESIGNER"));
      } else {
        questionControl.addQuestion({ rubricId, sectionId, ...input }, getCurrentUserId("DESIGNER"));
      }
      setError("");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save question.");
    }
  };

  return (
    <form className="questionEditor" onSubmit={handleSubmit}>
      <div className="questionEditorHeading">
        <h3>{heading}</h3>
        <button type="button" className="textButton" onClick={onCancel}>Cancel</button>
      </div>
      {error && <div className="errorMessage" role="alert">{error}</div>}

      <label className="formField">
        <span>Question</span>
        <textarea rows={3} value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
      </label>

      {ratings.map((rating) => (
        <label className="formField" key={rating}>
          <span>Rating {rating}</span>
          <textarea rows={3} value={explanations[rating] ?? ""} onChange={(e) => updateExplanation(rating, e.target.value)} />
        </label>
      ))}

      <div className="formActions">
        <button type="button" className="outlineButton" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primaryDarkButton">{question ? "Save Question" : "Add Question"}</button>
      </div>
    </form>
  );
}
