//Converts domain objects to/from their persisted representation

import type { Answer, Issue, Journal, Paper, Question, Review, Rubric } from "../model";

export const cloneRubric = (x: Rubric): Rubric => ({ ...x, sections: x.sections.map(s => ({ ...s, questions: s.questions.map(cloneQuestion) })) });
export const cloneQuestion = (x: Question): Question => ({ ...x, ratingExplanations: x.ratingExplanations.map(e => ({ ...e })) });
export const cloneJournal = (x: Journal): Journal => ({ ...x });
export const cloneIssue = (x: Issue): Issue => ({ ...x });
export const clonePaper = (x: Paper): Paper => ({ ...x });
export const cloneAnswer = (x: Answer): Answer => ({ ...x });
export const cloneReview = (x: Review): Review => ({ ...x, answers: x.answers.map(cloneAnswer) });
