//Provides the application's store abstraction used by Controls.

import type { Answer, Issue, Journal, Paper, Question, Review, ReviewAssignment, Rubric } from "../model";
import type { RaserRepository } from "./RaserRepository";
import { InMemoryRaserRepository, createInitialState } from "./InMemoryRaserRepository";

/** Application-facing store. Controls depend on this facade, while persistence is swappable. */
export class RaserStore {
  constructor(repositoryOrRubrics: RaserRepository | Rubric[] = new InMemoryRaserRepository()) {
    this.repository = Array.isArray(repositoryOrRubrics)
      ? new InMemoryRaserRepository(createInitialState(repositoryOrRubrics))
      : repositoryOrRubrics;
  }

  private readonly repository: RaserRepository;

  getRubrics(): Rubric[] { 
    return this.repository.getRubrics(); 
  }
  getRubric(id: string) { 
    return this.repository.getRubric(id); 
  }
  insertRubric(x: Rubric) { 
    this.repository.insertRubric(x); 
  }
  replaceRubric(x: Rubric) { 
    this.repository.replaceRubric(x); 
  }
  removeRubric(id: string) { 
    this.repository.removeRubric(id); 
  }

  getJournals(): Journal[] { 
    return this.repository.getJournals(); 
  }
  getJournal(id: string) { 
    return this.repository.getJournal(id); 
  }
  insertJournal(x: Journal) { 
    this.repository.insertJournal(x); 
  }
  replaceJournal(x: Journal) { 
    this.repository.replaceJournal(x); 
  }


  getIssues(): Issue[] { 
    return this.repository.getIssues(); 
  }
  getIssue(id: string) { 
    return this.repository.getIssue(id); 
  }
  getIssuesForJournal(id: string) { 
    return this.repository.getIssuesForJournal(id); 
  }
  insertIssue(x: Issue) { 
    this.repository.insertIssue(x); 
  }
  removeIssue(id: string) { 
    this.repository.removeIssue(id); 
  }

  getPapers(): Paper[] { return this.repository.getPapers(); }
  getPaper(id: string) { return this.repository.getPaper(id); }
  getPapersForIssue(id: string) { return this.repository.getPapersForIssue(id); }
  insertPaper(x: Paper) { this.repository.insertPaper(x); }
  replacePaper(x: Paper) { this.repository.replacePaper(x); }

  getAssignments(): ReviewAssignment[] { return this.repository.getAssignments(); }
  getAssignmentsForPaper(id: string) { return this.repository.getAssignmentsForPaper(id); }
  insertAssignment(x: ReviewAssignment) { this.repository.insertAssignment(x); }
  replaceAssignment(x: ReviewAssignment) { this.repository.replaceAssignment(x); }
  removeAssignment(id: string) { this.repository.removeAssignment(id); }

  getReview(id: string) { return this.repository.getReview(id); }
  getReviewForAssignment(id: string) { return this.repository.getReviewForAssignment(id); }
  insertReview(x: Review) { this.repository.insertReview(x); }
  replaceReview(x: Review) { this.repository.replaceReview(x); }
  getAnswersForReview(id: string) { return this.repository.getAnswersForReview(id); }
  getAnswer(reviewId: string, questionId: string) { return this.repository.getAnswer(reviewId, questionId); }
  insertAnswer(x: Answer) { this.repository.insertAnswer(x); }
  replaceAnswer(x: Answer) { this.repository.replaceAnswer(x); }
  clear() { this.repository.clear(); }
}

export function cloneRubric(rubric: Rubric): Rubric { 
  return { ...rubric, sections: rubric.sections.map(section => ({ ...section, questions: section.questions.map(cloneQuestion) })) }; }
export function cloneQuestion(question: Question): Question { 
  return { ...question, ratingExplanations: question.ratingExplanations.map(x => ({ ...x })) }; }
export function cloneReview(review: Review): Review { 
  return { ...review, answers: review.answers.map(answer => ({ ...answer })) }; }
