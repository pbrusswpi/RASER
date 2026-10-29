"use client";
// EBC: Control – one function per use case; business rules live here.
//the nine use cases and their business rules
import { update, type DB } from "./store";
import { blankExplanations, maxScore, type Question, type Rating, type Rubric, type Section } from "@/entities/types";

const uid = () => crypto.randomUUID();

function must<T>(x: T | undefined, msg: string): T { 
    if (x === undefined) {
        throw new Error(msg);
    }
         
    return x; 
}
const need = (v: string, label: string) => { if (!v.trim()) throw new Error(`${label} is required`); return v.trim(); };

function patchDraft(db: DB, id: string, fn: (r: Rubric) => Rubric): DB {
  const r = must(db.rubrics.find((x) => x.id === id), "Rubric not found");
  if (r.status !== "draft") {
    throw new Error("Published rubrics can no longer be edited");
  }
  return { 
    rubrics: db.rubrics.map(
        (x) => (x.id === id ? fn(r) : x)) 
    };
}

export interface QuestionInput { text: string; explanations: Record<Rating, string> }

export const designer = {
  /** Create Rubric */
  create(name: string): string {
    const id = uid(); 
    const n = need(name, "Rubric name");
    update((db) => ({ rubrics: [...db.rubrics, { id, name: n, questions: [], lowThreshold: 40, highThreshold: 55, status: "draft" }] }));
    return id;
  },
  /** Delete Rubric (drafts only) */
  remove(id: string) {
    update((db) => {
      const r = must(db.rubrics.find(
        (x) => x.id === id), "Rubric not found");
      if (r.status !== "draft") {
        throw new Error("Once published, a rubric cannot be deleted");
      }
      return { 
        rubrics: db.rubrics.filter(
            (x) => x.id !== id) 
        };
    });
  },
  /** Edit Rubric: name and thresholds */
  edit(id: string, p: { name: string; lowThreshold: number; highThreshold: number }) {
    update((db) => patchDraft(db, id, (r) => {
      const name = need(p.name, "Rubric name");
      if (!(p.lowThreshold >= 0) || !(p.highThreshold >= 0)) {
        throw new Error("Thresholds must be numbers");
      }
        
      if (p.lowThreshold > p.highThreshold) {
        throw new Error("The low threshold cannot be above the high threshold");
      }
        
      return { 
        ...r, 
        name, 
        lowThreshold: p.lowThreshold, 
        highThreshold: p.highThreshold };
    }));
  },
  /** Add Question */
  addQuestion(id: string, section: Section, input: QuestionInput) {
    const text = need(input.text, "Question text");
    update(
        (db) => patchDraft(db, id, (r) => ({ ...r, questions: [...r.questions, { id: uid(), section, text, explanations: input.explanations }] })));
  },
  /** Edit Question */
  editQuestion(id: string, qid: string, input: QuestionInput) {
    const text = need(input.text, "Question text");
    update((db) => patchDraft(db, id, (r) => ({
      ...r, questions: r.questions.map((q): Question => (q.id === qid ? { ...q, text, explanations: input.explanations } : q)),
    })));
  },
  /** Delete Question */
  deleteQuestion(id: string, qid: string) {
    update((db) => patchDraft(db, id, (r) => ({ ...r, questions: r.questions.filter((q) => q.id !== qid) })));
  },
  /** Publish Rubric: records the publication date and locks the rubric */
  publish(id: string) {
    update((db) => patchDraft(db, id, (r) => {
      if (r.questions.length === 0) {
        throw new Error("Add at least one question before publishing");
      }
        
      if (r.highThreshold > maxScore(r)) {
        throw new Error(`The high threshold exceeds the maximum score (${maxScore(r)})`);
      }
        
      if (r.questions.some(
        (q) => Object.values(q.explanations).some(
            (e) => !e.trim()))) {
                throw new Error("Every question needs an explanation for each rating from 5 to 1");
            }
        
      return { 
        ...r, 
        status: "published", 
        publishedAt: new Date().toISOString() };
    }));
  },
  blank: blankExplanations,
};
