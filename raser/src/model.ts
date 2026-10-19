export type UserRole = "DESIGNER" | "EDITOR" | "REVIEWER";

export type RubricStatus = "UNPUBLISHED" | "PUBLISHED" | "DEPRECATED";

export type SectionType =
  | "INTRODUCTION"
  | "MATERIALS_AND_SOURCING"
  | "METHODOLOGY_AND_REPRODUCIBILITY"
  | "REPLICATION"
  | "RISK_OF_BIAS_AND_STATISTICS"
  | "REPORTING_AND_TRANSPARENCY";

export interface User {
  userId: string;
  name: string;
  email: string;
  roles: UserRole[];
}

export interface RatingExplanation {
  ratingExplanationId: string;
  questionId: string;
  rating: number;
  explanation: string;
}

export interface Question {
  questionId: string;
  rubricId: string;
  sectionId: string;
  questionText: string;
  position: number;
  ratingExplanations: RatingExplanation[];
}

export interface Section {
  sectionId: string;
  sectionName: SectionType;
  position: number;
  questions: Question[];
}

export interface Rubric {
  rubricId: string;
  rubricName: string;
  rubricLowQualityThreshold: number;
  rubricHighQualityThreshold: number;
  rubricPublicationDate?: string;
  rubricDeprecationDate?: string;
  rubricStatus: RubricStatus;
  rubricUrl: string;
  rubricDesignerId: string;
  sections: Section[];
}

export const SECTION_LABELS: Record<SectionType, string> = {
  INTRODUCTION: "Introduction",
  MATERIALS_AND_SOURCING: "Materials & Sourcing",
  METHODOLOGY_AND_REPRODUCIBILITY: "Methodology & Reproducibility",
  REPLICATION: "Replication",
  RISK_OF_BIAS_AND_STATISTICS: "Risk of Bias & Statistics",
  REPORTING_AND_TRANSPARENCY: "Reporting & Transparency",
};

export function getQuestionCount(rubric: Rubric): number {
  return rubric.sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );
}

export function getMaximumScore(rubric: Rubric): number {
  return getQuestionCount(rubric) * 5;
}

export type JournalStatus = "ACTIVE" | "WITHDRAWN";
export type PaperStatus = "UNDER_REVIEW" | "WITHDRAWN" | "CLOSED";
export type ReviewAssignmentStatus = "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";

export interface Journal {
  journalId: string;
  journalName: string;
  journalRegistrationDate: string;
  journalWithdrawalDate?: string;
  journalStatus: JournalStatus;
  editorId: string;
}

export interface Issue {
  issueId: string;
  journalId: string;
  volumeNumber: number;
  issueNumber: number;
  createdDate: string;
}

export interface Paper {
  paperId: string;
  issueId: string;
  paperTitle: string;
  paperReference: string;
  paperStatus: PaperStatus;
  paperAddedDate: string;
  paperWithdrawalDate?: string;
  paperClosedDate?: string;
}

export interface ReviewDesignation {
  designationtId: string;
  paperId: string;
  rubricId: string;
  reviewerId: string;
  deadline: string;
  accessUrl: string;
  pin: string;
  status: ReviewAssignmentStatus;
  assignedDate: string;
}

export type ReviewStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
export type QualityRating = "HIGH" | "MODERATE" | "LOW";

export interface Answer {
  answerId: string;
  reviewId: string;
  questionId: string;
  rating: number;
  answerText: string;
  lastUpdated: string;
}

export interface Review {
  reviewId: string;
  assignmentId: string;
  rubricId: string;
  reviewStatus: ReviewStatus;
  reviewStartedDate?: string;
  reviewCompletedDate?: string;
  totalScore?: number;
  qualityRating?: QualityRating;
  answers: Answer[];
}

