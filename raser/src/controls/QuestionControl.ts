import type { Question, Rubric, Section } from "../model";
import { RaserStore } from "../store/RaserStore";
import { requireNonBlank } from "../validation/domainValidation";

export interface QuestionInput {
  rubricId: string;
  sectionId: string;
  questionText: string;
  ratingExplanations: Array<{ rating: number; explanation: string }>;
}

export interface UpdateQuestionInput {
  questionText: string;
  ratingExplanations: Array<{ rating: number; explanation: string }>;
}

const REQUIRED_RATINGS = [1, 2, 3, 4, 5];

export class QuestionControl {
  constructor(private readonly store: RaserStore) {}

  addQuestion(input: QuestionInput, designerId?: string): Question {
    const rubric = this.requireRubric(input.rubricId);
    this.assertOwner(rubric, designerId);
    this.assertUnpublished(rubric, "add questions to");
    const section = this.requireSection(rubric, input.sectionId);
    this.validateQuestion(input);

    const questionId = createId();
    const question: Question = {
      questionId,
      rubricId: rubric.rubricId,
      sectionId: section.sectionId,
      questionText: input.questionText.trim(),
      displayOrder: section.questions.length + 1,
      ratingExplanations: input.ratingExplanations.map((item) => ({
        ratingExplanationId: createId(),
        questionId,
        rating: item.rating,
        explanation: item.explanation.trim(),
      })),
    };

    section.questions.push(question);
    this.store.replaceRubric(rubric);
    return question;
  }

  updateQuestion(
    rubricId: string,
    questionId: string,
    input: UpdateQuestionInput,
    designerId?: string
  ): Question {
    const rubric = this.requireRubric(rubricId);
    this.assertOwner(rubric, designerId);
    this.assertUnpublished(rubric, "edit questions in");
    this.validateQuestion(input);

    const section = rubric.sections.find((item) =>
      item.questions.some((question) => question.questionId === questionId)
    );
    if (!section) throw new Error(`Question ${questionId} was not found.`);

    const index = section.questions.findIndex(
      (question) => question.questionId === questionId
    );
    const existing = section.questions[index];
    const updated: Question = {
      ...existing,
      questionText: input.questionText.trim(),
      ratingExplanations: input.ratingExplanations.map((item) => {
        const oldExplanation = existing.ratingExplanations.find(
          (old) => old.rating === item.rating
        );
        return {
          ratingExplanationId: oldExplanation?.ratingExplanationId ?? createId(),
          questionId,
          rating: item.rating,
          explanation: item.explanation.trim(),
        };
      }),
    };

    section.questions[index] = updated;
    this.store.replaceRubric(rubric);
    return updated;
  }

  deleteQuestion(rubricId: string, questionId: string, designerId?: string): void {
    const rubric = this.requireRubric(rubricId);
    this.assertOwner(rubric, designerId);
    this.assertUnpublished(rubric, "delete questions from");

    const section = rubric.sections.find((item) =>
      item.questions.some((question) => question.questionId === questionId)
    );
    if (!section) throw new Error(`Question ${questionId} was not found.`);

    section.questions = section.questions
      .filter((question) => question.questionId !== questionId)
      .map((question, index) => ({ ...question, displayOrder: index + 1 }));

    this.store.replaceRubric(rubric);
  }

  private validateQuestion(input: {
    questionText: string;
    ratingExplanations: Array<{ rating: number; explanation: string }>;
  }): void {
    if (!input.questionText.trim()) throw new Error("Question text is required.");
    if (input.ratingExplanations.length !== REQUIRED_RATINGS.length) {
      throw new Error("Exactly five rating explanations are required (ratings 1–5).");
    }

    const ratings = input.ratingExplanations.map((item) => item.rating).sort();
    if (ratings.some((rating, index) => rating !== REQUIRED_RATINGS[index])) {
      throw new Error("Rating explanations must contain each rating from 1 through 5 exactly once.");
    }
    if (input.ratingExplanations.some((item) => !item.explanation.trim())) {
      throw new Error("Every rating explanation must contain text.");
    }
  }

  private requireRubric(rubricId: string): Rubric {
    const rubric = this.store.getRubric(rubricId);
    if (!rubric) throw new Error(`Rubric ${rubricId} was not found.`);
    return rubric;
  }

  private requireSection(rubric: Rubric, sectionId: string): Section {
    const section = rubric.sections.find((item) => item.sectionId === sectionId);
    if (!section) throw new Error(`Section ${sectionId} was not found in this rubric.`);
    return section;
  }

  private assertOwner(rubric: Rubric, designerId?: string): void {
    if (designerId !== undefined && rubric.designerId !== designerId) {
      throw new Error("You do not have permission to modify this rubric.");
    }
  }

  private assertUnpublished(rubric: Rubric, action: string): void {
    if (rubric.status !== "UNPUBLISHED") {
      throw new Error(`Only unpublished rubrics can ${action} a rubric.`);
    }
  }
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `raser-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
