//Stores data in memory,Useful for:tests;development;demos.
// Data disappears when the process ends.

import type { Answer, Issue, Journal, Paper, Review, ReviewAssignment, Rubric } from "../model";
import { sampleRubrics } from "../data/sampleRubrics";
import type { RaserRepository } from "./RaserRepository";
import { cloneAnswer, cloneIssue, cloneJournal, clonePaper, cloneReview, cloneRubric } from "./serialization";

export interface RaserRepositoryState {
  rubrics: Rubric[];
  journals: Journal[];
  issues: Issue[];
  papers: Paper[];
  assignments: ReviewAssignment[];
  reviews: Review[];
  answers: Answer[];
}

export function createInitialState(initialRubrics: Rubric[] = sampleRubrics): RaserRepositoryState {
  return {
    rubrics: initialRubrics.map(cloneRubric), journals: [], issues: [], papers: [],
    assignments: [], reviews: [], answers: [],
  };
}

export class InMemoryRaserRepository implements RaserRepository {
  protected state: RaserRepositoryState;

  constructor(initialState: RaserRepositoryState = createInitialState()) {
    this.state = cloneState(initialState);
  }

  getRubrics() { 
    return this.state.rubrics.map(cloneRubric); 
  }
  getRubric(id: string) { 
    const x = this.state.rubrics.find(r => r.rubricId === id); 
    return x ? cloneRubric(x) : undefined; 
  }
  insertRubric(rubric: Rubric) { 
    if (this.state.rubrics.some(x => x.rubricId === rubric.rubricId)) {
      throw new Error(`Rubric ID ${rubric.rubricId} already exists.`);
    }
    this.state.rubrics.push(cloneRubric(rubric)); 
  }
  replaceRubric(rubric: Rubric) { 
    const i = this.state.rubrics.findIndex(x => x.rubricId === rubric.rubricId); 
    if (i < 0) 
      throw new Error(`Rubric ${rubric.rubricId} was not found.`); 
    this.state.rubrics[i] = cloneRubric(rubric); 
  }
  removeRubric(id: string) { 
    const i = this.state.rubrics.findIndex(x => x.rubricId === id); 
    if (i < 0){
      throw new Error(`Rubric ${id} was not found.`);
    }  
    this.state.rubrics.splice(i, 1); 
  }

  getJournals() { 
    return this.state.journals.map(cloneJournal); 
  }
  getJournal(id: string) { 
    const x = this.state.journals.find(j => j.journalId === id); 
    return x ? cloneJournal(x) : undefined; 
  }
  insertJournal(journal: Journal) { 
    if (this.state.journals.some(x => x.journalId === journal.journalId)){
      throw new Error(`Journal ID ${journal.journalId} already exists.`); 
    } 
    this.state.journals.push(cloneJournal(journal)); 
  }
  replaceJournal(journal: Journal) { 
    const i = this.state.journals.findIndex(x => x.journalId === journal.journalId); 
    if (i < 0) {
      throw new Error("Journal was not found.");
    }  
    this.state.journals[i] = cloneJournal(journal); 
  }

  getIssues() { 
    return this.state.issues.map(cloneIssue); 
  }
  getIssue(id: string) { 
    const x = this.state.issues.find(i => i.issueId === id); 
    return x ? cloneIssue(x) : undefined; 
  }
  getIssuesForJournal(journalId: string) { 
    return this.state.issues.filter(x => x.journalId === journalId).map(cloneIssue); 
  }
  insertIssue(issue: Issue) { 
    if (this.state.issues.some(x => x.issueId === issue.issueId)) {
      throw new Error(`Issue ID ${issue.issueId} already exists.`); 
    }
    this.state.issues.push(cloneIssue(issue)); 
  }
  removeIssue(id: string) { 
    const i = this.state.issues.findIndex(x => x.issueId === id); 
    if (i < 0) {
      throw new Error("Issue was not found."); 
    }
    this.state.issues.splice(i, 1); }

  getPapers() { 
    return this.state.papers.map(clonePaper); 
  }
  getPaper(id: string) { 
    const x = this.state.papers.find(p => p.paperId === id); 
    return x ? clonePaper(x) : undefined; 
  }
  getPapersForIssue(issueId: string) { 
    return this.state.papers.filter(x => x.issueId === issueId).map(clonePaper); 
  }
  insertPaper(paper: Paper) { 
    if (this.state.papers.some(x => x.paperId === paper.paperId)) {
      throw new Error(`Paper ID ${paper.paperId} already exists.`); 
    }
    this.state.papers.push(clonePaper(paper)); 
  }
  replacePaper(paper: Paper) { 
    const i = this.state.papers.findIndex(x => x.paperId === paper.paperId); 
    if (i < 0) {
      throw new Error("Paper was not found."); 
    }
    this.state.papers[i] = clonePaper(paper); 
  }

  getAssignments() { 
    return this.state.assignments.map(x => ({ ...x })); 
  }
  getAssignmentsForPaper(paperId: string) { 
    return this.state.assignments.filter(x => x.paperId === paperId).map(x => ({ ...x })); 
  }
  insertAssignment(assignment: ReviewAssignment) { 
    if (this.state.assignments.some(x => x.assignmentId === assignment.assignmentId)) {
      throw new Error(`Assignment ID ${assignment.assignmentId} already exists.`);
    }
    this.state.assignments.push({ ...assignment }); 
  }
  replaceAssignment(assignment: ReviewAssignment) { 
    const i = this.state.assignments.findIndex(x => x.assignmentId === assignment.assignmentId); 
    if (i < 0) {
      throw new Error("Assignment was not found.");
    }
    this.state.assignments[i] = { ...assignment }; 
  }
  removeAssignment(id: string) { 
    const i = this.state.assignments.findIndex(x => x.assignmentId === id); 
    if (i < 0) {
      throw new Error("Assignment was not found."); 
    }
    this.state.assignments.splice(i, 1); 
  }

  getReview(id: string) { 
    const x = this.state.reviews.find(r => r.reviewId === id); 
    return x ? cloneReview(x) : undefined; 
  }
  getReviewForAssignment(assignmentId: string) { 
    const x = this.state.reviews.find(r => r.assignmentId === assignmentId); 
    return x ? cloneReview(x) : undefined; 
  }
  insertReview(review: Review) { 
    if (this.state.reviews.some(x => x.reviewId === review.reviewId)) {
      throw new Error("Review ID already exists.");
    } 
    this.state.reviews.push(cloneReview(review)); 
  }
  replaceReview(review: Review) { 
    const i = this.state.reviews.findIndex(x => x.reviewId === review.reviewId); 
    if (i < 0) throw new Error("Review was not found."); 
    this.state.reviews[i] = cloneReview(review); 
  }

  getAnswersForReview(reviewId: string) { 
    return this.state.answers.filter(x => x.reviewId === reviewId).map(cloneAnswer); 
  }
  getAnswer(reviewId: string, questionId: string) { 
    const x = this.state.answers.find(a => a.reviewId === reviewId && a.questionId === questionId); 
    return x ? cloneAnswer(x) : undefined; 
  }
  insertAnswer(answer: Answer) { 
    if (this.state.answers.some(x => x.answerId === answer.answerId)) 
      throw new Error("Answer ID already exists."); 
    this.state.answers.push(cloneAnswer(answer)); 
  }
  replaceAnswer(answer: Answer) { 
    const i = this.state.answers.findIndex(x => x.answerId === answer.answerId); 
    if (i < 0) 
      throw new Error("Answer was not found."); 
    this.state.answers[i] = cloneAnswer(answer); 
  }
  clear() { 
    this.state = createInitialState(); 
  }
}

export function cloneState(state: RaserRepositoryState): RaserRepositoryState {
  return {
    rubrics: state.rubrics.map(cloneRubric), journals: state.journals.map(cloneJournal), issues: state.issues.map(cloneIssue),
    papers: state.papers.map(clonePaper), assignments: state.assignments.map(x => ({ ...x })), reviews: state.reviews.map(cloneReview), answers: state.answers.map(cloneAnswer),
  };
}
