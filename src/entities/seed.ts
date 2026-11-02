import type { Question, Rubric, Section } from "./types";

const q = (section: Section, text: string, crit: string[]): Question => ({
  id: crypto.randomUUID(), 
  section, 
  text,
  explanations: {
    5: `Fully met: ${crit[0]}`, 
    4: `Mostly met, minor gap: ${crit[1]}`, 
    3: `Partially met: ${crit[2]}`,
    2: `Largely unmet: ${crit[3]}`, 
    1: `Not reported: ${crit[4]}`,
  },
});

/* const q = (section: Section, text: string): Question => ({
  id: crypto.randomUUID(), 
  section, 
  text,
  explanations: {
    5: "Fully met:", 
    4: "Mostly met, minor gap:", 
    3: "Partially met:",
    2: "Largely unmet", 
    1: "Not reported:",
  },
}); */



/* Small sample so the app is usable on first load. */
export const seedRubric = (): Rubric => ({
  id: crypto.randomUUID(),
  name: "Tropical Plant Research Rubric",
  status: "published",
  publishedAt: new Date().toISOString(),
  lowThreshold: 20,
  highThreshold: 27,
  questions: [
    q("Introduction", "Is the research question and hypothesis clearly stated?", ["question and hypothesis are explicit","t1","t2","t3","t4"]),
    q("Materials & Sourcing", "Are plant lines, media and reagents identified with sources?", ["accessions, suppliers and catalogue numbers given","g1","g2","g3","g4"]),
    q("Methodology & Reproducibility", "Are culture conditions described well enough to repeat?", ["light, temperature, medium and timing specified","y1","y2","y3","y4"]),
    q("Replication", "Are biological and technical replicates reported?", ["number and type of replicates stated","x1","x2","x3","x4"]),
    q("Risk of Bias & Statistics", "Are statistical tests justified and randomization described?", ["tests, assumptions and randomization stated","q1","q2","q3","q4"]),
    q("Reporting & Transparency", "Are raw data and protocols available?", ["data and protocols deposited and linked","e1","e2","e3","e4"]),
  ],
});
