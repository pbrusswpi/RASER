// EBC: Entities – pure domain model and rules.
// the six fixed sections, ratings, rubric and question types, 
// and max-score and ordering rules.

export const SECTIONS = [
  "Introduction",
  "Materials & Sourcing",
  "Methodology & Reproducibility",
  "Replication",
  "Risk of Bias & Statistics",
  "Reporting & Transparency",
] as const;

export type Section = (typeof SECTIONS)[number];

export type Rating = 1 | 2 | 3 | 4 | 5;

export const RATINGS: Rating[] = [5, 4, 3, 2, 1];

export const RATING_LABELS: Record<Rating, string> = {
  5: "Yes, fully met", 
  4: "Mostly met, minor gap", 
  3: "Partial", 
  2: "Largely unmet", 
  1: "No / not reported",
};

export interface Question { 
    id: string; 
    section: Section; 
    text: string; 
    explanations: Record<Rating, string> 
}
export type RubricStatus = "draft" | "published";

export interface Rubric {
  id: string; name: string; questions: Question[];
  lowThreshold: number; highThreshold: number;
  status: RubricStatus; publishedAt?: string;
}

export const blankExplanations = (): Record<Rating, string> => 
  ({ 5: "", 4: "", 3: "", 2: "", 1: "" });

export const maxScore = (r: Pick<Rubric, "questions">) => 5 * r.questions.length;

export const orderedQuestions = (r: Pick<Rubric, "questions">): Question[] => 
  SECTIONS.flatMap((s) => r.questions.filter((q) => q.section === s));

export const fmtDate = (iso?: string) => 
  (iso ? new Date(iso).toLocaleDateString() : "—");
