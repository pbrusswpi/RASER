//Stores prototype data in browser localStorage.This supports the browser-based prototype.

import type { RaserRepository } from "./RaserRepository";
import { createInitialState, cloneState, InMemoryRaserRepository, type RaserRepositoryState } from "./InMemoryRaserRepository";

const STORAGE_KEY = "raser.repository.v2";
const LEGACY_STORAGE_KEY = "raser.repository.v1";
const STORAGE_VERSION = 2;

type PersistedState = { version: number; state: RaserRepositoryState };

/** Browser persistence adapter for the prototype. Production should use an API/database repository. */
export class LocalStorageRaserRepository extends InMemoryRaserRepository implements RaserRepository {
  private loaded = false;

  constructor() { 
    super(createInitialState()); 
  }

  private ensureLoaded(): void {
    if (this.loaded) {
      return;
    } 
    this.loaded = true;
    if (typeof window === "undefined") {
      return;
    } 

    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) { 
      this.persist(); 
      return; 
    }

    try {
      const parsed = JSON.parse(raw) as PersistedState | RaserRepositoryState;
      const migrated = this.migrate(parsed);
      this.state = cloneState(migrated);
      this.persist();
    } catch {
      this.resetStorage();
    }
  }

  private migrate(value: PersistedState | RaserRepositoryState): RaserRepositoryState {
    if ("version" in value && "state" in value) {
      if (value.version !== STORAGE_VERSION) {
        throw new Error("Unsupported RASER storage version.");
      }
      return value.state;
    }
    // v1 stored the state directly. Its domain shape is compatible with v2.
    return value;
  }

  private persist(): void {
    if (typeof window === "undefined") {
      return;
    }
    const payload: PersistedState = { 
      version: STORAGE_VERSION, 
      state: cloneState(this.state) 
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  }

  private resetStorage(): void {
    this.state = createInitialState();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
    this.persist();
  }

  reset(): void {
    this.loaded = true;
    this.resetStorage();
  }

  clear(): void { this.reset(); }

  getRubrics() { 
    this.ensureLoaded(); 
    return super.getRubrics(); 
  }
  
  getRubric(id: string) { 
    this.ensureLoaded(); 
    return super.getRubric(id); 
  }
  
  insertRubric(x: Parameters<InMemoryRaserRepository["insertRubric"]>[0]) { 
    this.ensureLoaded(); 
    super.insertRubric(x); 
    this.persist(); 
  }
  
  replaceRubric(x: Parameters<InMemoryRaserRepository["replaceRubric"]>[0]) { 
    this.ensureLoaded(); 
    super.replaceRubric(x); 
    this.persist(); 
  }
  
  removeRubric(id: string) { 
    this.ensureLoaded(); 
    super.removeRubric(id); 
    this.persist(); 
  }

  getJournals() { 
    this.ensureLoaded(); 
    return super.getJournals(); 
  }
  
  getJournal(id: string) { 
    this.ensureLoaded(); 
    return super.getJournal(id); 
  }

  insertJournal(x: Parameters<InMemoryRaserRepository["insertJournal"]>[0]) { 
    this.ensureLoaded(); 
    super.insertJournal(x); 
    this.persist(); 
  }
  
  replaceJournal(x: Parameters<InMemoryRaserRepository["replaceJournal"]>[0]) { 
    this.ensureLoaded(); 
    super.replaceJournal(x); 
    this.persist(); 
  }

  getIssues() { 
    this.ensureLoaded(); 
    return super.getIssues(); 
  }
  
  getIssue(id: string) { 
    this.ensureLoaded(); 
    return super.getIssue(id); 
  }
  
  getIssuesForJournal(id: string) { 
    this.ensureLoaded(); 
    return super.getIssuesForJournal(id); 
  }
  
  insertIssue(x: Parameters<InMemoryRaserRepository["insertIssue"]>[0]) { 
    this.ensureLoaded(); 
    super.insertIssue(x); 
    this.persist(); }
  
  removeIssue(id: string) { 
    this.ensureLoaded(); 
    super.removeIssue(id); 
    this.persist(); 
  }

  getPapers() { 
    this.ensureLoaded(); 
    return super.getPapers(); 
  }
  
  getPaper(id: string) { 
    this.ensureLoaded(); 
    return super.getPaper(id); 
  }
  
  getPapersForIssue(id: string) { 
    this.ensureLoaded(); 
    return super.getPapersForIssue(id); 
  }
  
  insertPaper(x: Parameters<InMemoryRaserRepository["insertPaper"]>[0]) { 
    this.ensureLoaded(); 
    super.insertPaper(x); 
    this.persist(); 
  }
  
  replacePaper(x: Parameters<InMemoryRaserRepository["replacePaper"]>[0]) { 
    this.ensureLoaded(); 
    super.replacePaper(x); 
    this.persist(); 
  }

  getAssignments() { 
    this.ensureLoaded(); 
    return super.getAssignments(); 
  }
  
  getAssignmentsForPaper(id: string) { 
    this.ensureLoaded(); 
    return super.getAssignmentsForPaper(id); 
  }
  
  insertAssignment(x: Parameters<InMemoryRaserRepository["insertAssignment"]>[0]) { 
    this.ensureLoaded(); 
    super.insertAssignment(x); 
    this.persist(); 
  }
  
  replaceAssignment(x: Parameters<InMemoryRaserRepository["replaceAssignment"]>[0]) { 
    this.ensureLoaded(); 
    super.replaceAssignment(x); 
    this.persist(); 
  }
  removeAssignment(id: string) { 
    this.ensureLoaded(); 
    super.removeAssignment(id); 
    this.persist(); 
  }

  getReview(id: string) { 
    this.ensureLoaded(); 
    return super.getReview(id); 
  }
  
  getReviewForAssignment(id: string) { 
    this.ensureLoaded(); 
    return super.getReviewForAssignment(id); 
  }
  
  insertReview(x: Parameters<InMemoryRaserRepository["insertReview"]>[0]) { 
    this.ensureLoaded(); 
    super.insertReview(x); 
    this.persist(); }
  
    replaceReview(x: Parameters<InMemoryRaserRepository["replaceReview"]>[0]) { 
      this.ensureLoaded(); 
      super.replaceReview(x); 
      this.persist(); 
    }

  getAnswersForReview(id: string) { 
    this.ensureLoaded(); 
    return super.getAnswersForReview(id); 
  }
  
  getAnswer(reviewId: string, questionId: string) { 
    this.ensureLoaded(); 
    return super.getAnswer(reviewId, questionId); 
  }
  
  insertAnswer(x: Parameters<InMemoryRaserRepository["insertAnswer"]>[0]) { 
    this.ensureLoaded(); 
    super.insertAnswer(x); 
    this.persist(); 
  }

  replaceAnswer(x: Parameters<InMemoryRaserRepository["replaceAnswer"]>[0]) { 
    this.ensureLoaded(); 
    super.replaceAnswer(x); 
    this.persist(); 
  }
}
