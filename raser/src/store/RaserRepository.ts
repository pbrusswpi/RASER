//Defines the repository contract.
// It says what persistence operations the application expects without specifying how the data is stored.


import type { Answer, Issue, Journal, Paper, Review, ReviewAssignment, Rubric } from "../model";

export interface RaserRepository {
  getRubrics(): Rubric[];
  getRubric(id: string): Rubric | undefined;
  insertRubric(rubric: Rubric): void;
  replaceRubric(rubric: Rubric): void;
  removeRubric(id: string): void;

  getJournals(): Journal[];
  getJournal(id: string): Journal | undefined;
  insertJournal(journal: Journal): void;
  replaceJournal(journal: Journal): void;

  getIssues(): Issue[];
  getIssue(id: string): Issue | undefined;
  getIssuesForJournal(journalId: string): Issue[];
  insertIssue(issue: Issue): void;
  removeIssue(id: string): void;

  getPapers(): Paper[];
  getPaper(id: string): Paper | undefined;
  getPapersForIssue(issueId: string): Paper[];
  insertPaper(paper: Paper): void;
  replacePaper(paper: Paper): void;

  getAssignments(): ReviewAssignment[];
  getAssignmentsForPaper(paperId: string): ReviewAssignment[];
  insertAssignment(assignment: ReviewAssignment): void;
  replaceAssignment(assignment: ReviewAssignment): void;
  removeAssignment(id: string): void;

  getReview(id: string): Review | undefined;
  getReviewForAssignment(assignmentId: string): Review | undefined;
  insertReview(review: Review): void;
  replaceReview(review: Review): void;

  getAnswersForReview(reviewId: string): Answer[];
  getAnswer(reviewId: string, questionId: string): Answer | undefined;
  insertAnswer(answer: Answer): void;
  replaceAnswer(answer: Answer): void;

  clear(): void;
}
