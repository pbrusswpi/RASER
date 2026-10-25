import {
  SECTION_LABELS,
  type Rubric,
  type Section,
  type SectionType,
} from "../model";
import { RaserStore } from "../store/RaserStore";
import { requireNonBlank, requireThresholds } from "../validation/domainValidation";

const FIXED_SECTION_TYPES: SectionType[] = [
  "INTRODUCTION",
  "MATERIALS_AND_SOURCING",
  "METHODOLOGY_AND_REPRODUCIBILITY",
  "REPLICATION",
  "RISK_OF_BIAS_AND_STATISTICS",
  "REPORTING_AND_TRANSPARENCY",
];

export interface CreateRubricInput {
  name: string;
  lowQualityThreshold: number;
  highQualityThreshold: number;
  designerId: string;
}

export interface UpdateRubricInput {
  name: string;
  lowQualityThreshold: number;
  highQualityThreshold: number;
}

export class RubricControl {
  constructor(private readonly store: RaserStore) {}

  getRubrics(): Rubric[] {
    return this.store.getRubrics();
  }

  getRubric(rubricId: string): Rubric | undefined {
    return this.store.getRubric(rubricId);
  }

  getDesignerRubrics(designerId: string): Rubric[] {
    return this.store
      .getRubrics()
      .filter((rubric) => rubric.designerId === designerId);
  }

  createRubric(input: CreateRubricInput): Rubric {
    this.validateRubricFields(input);
    
    if (!input.designerId.trim()) {
      throw new Error("Designer ID is required.");
    }

    const rubricId = createId();
    
    const rubric: Rubric = {
      rubricId,
      name: input.name.trim(),
      lowQualityThreshold: input.lowQualityThreshold,
      highQualityThreshold: input.highQualityThreshold,
      status: "UNPUBLISHED",
      sampleUrl: "",
      designerId: input.designerId,
      sections: this.createEmptySections(),
    };

    this.store.insertRubric(rubric);
    return rubric;
  }

  updateRubric(
    rubricId: string,
    input: UpdateRubricInput,
    designerId?: string
  ): Rubric {
    const rubric = this.requireRubric(rubricId);
    this.assertOwner(rubric, designerId);
    this.assertUnpublished(rubric, "edit");
    this.validateRubricFields(input);

    const updated: Rubric = {
      ...rubric,
      name: input.name.trim(),
      lowQualityThreshold: input.lowQualityThreshold,
      highQualityThreshold: input.highQualityThreshold,
    };
    this.store.replaceRubric(updated);
    return updated;
  }

  deleteRubric(rubricId: string, designerId?: string): void {
    const rubric = this.requireRubric(rubricId);
    this.assertOwner(rubric, designerId);
    this.assertUnpublished(rubric, "delete");
    this.store.removeRubric(rubricId);
  }

  publishRubric(rubricId: string, designerId?: string): Rubric {
    const rubric = this.requireRubric(rubricId);
    this.assertOwner(rubric, designerId);
    this.assertUnpublished(rubric, "publish");

    const published: Rubric = {
      ...rubric,
      status: "PUBLISHED",
      publicationDate: new Date().toISOString(),
    };
    this.store.replaceRubric(published);
    return published;
  }

  deprecateRubric(
    rubricId: string,
    replacementRubricId?: string,
    designerId?: string
  ): Rubric {
    const rubric = this.requireRubric(rubricId);
    
    this.assertOwner(rubric, designerId);
    
    if (rubric.status !== "PUBLISHED") {
      throw new Error("Only published rubrics can be deprecated.");
    }

    if (replacementRubricId) {
      if (replacementRubricId === rubricId) {
        throw new Error("A rubric cannot replace itself.");
      }
      const replacement = this.requireRubric(replacementRubricId);
      
      if (replacement.status !== "PUBLISHED") {
        throw new Error("The replacement rubric must be published.");
      }
    }

    const deprecated: Rubric = {
      ...rubric,
      status: "DEPRECATED",
      deprecationDate: new Date().toISOString(),
      replacementRubricId,
    };
    this.store.replaceRubric(deprecated);
    return deprecated;
  }

  duplicateRubric(
    sourceRubricId: string,
    newName: string,
    designerId: string
  ): Rubric {
    const source = this.requireRubric(sourceRubricId);
    if (!newName.trim()) {
      throw new Error("Rubric name is required.");
    }
    if (!designerId.trim()) {
      throw new Error("Designer ID is required.");
    }
      
    const duplicateId = createId();
    const sections: Section[] = source.sections.map((section) => {
      const sectionId = createId();
      return {
        ...section,
        sectionId,
        questions: section.questions.map((question, index) => {
          const questionId = createId();
          return {
            ...question,
            questionId,
            rubricId: duplicateId,
            sectionId,
            displayOrder: index + 1,
            ratingExplanations: question.ratingExplanations.map((explanation) => ({
              ...explanation,
              ratingExplanationId: createId(),
              questionId,
            })),
          };
        }),
      };
    });

    const duplicate: Rubric = {
      rubricId: duplicateId,
      name: newName.trim(),
      lowQualityThreshold: source.lowQualityThreshold,
      highQualityThreshold: source.highQualityThreshold,
      status: "UNPUBLISHED",
      sampleUrl: "",
      designerId,
      sections,
    };
    this.store.insertRubric(duplicate);
    return duplicate;
  }

  private validateRubricFields(input: UpdateRubricInput): void {
    if (!input.name.trim()) {
      throw new Error("Rubric name is required.");
    }
      
    if (
      !Number.isFinite(input.lowQualityThreshold) ||
      !Number.isFinite(input.highQualityThreshold) ||
      input.lowQualityThreshold < 0 ||
      input.highQualityThreshold < 0
    ) {
      throw new Error("Quality thresholds must be non-negative numbers.");
    }
    if (input.lowQualityThreshold >= input.highQualityThreshold) {
      throw new Error("Low quality threshold must be lower than high quality threshold.");
    }
  }

  private createEmptySections(): Section[] {
    return FIXED_SECTION_TYPES.map((name, index) => ({
      sectionId: createId(),
      name,
      displayOrder: index + 1,
      questions: [],
    }));
  }

  private requireRubric(rubricId: string): Rubric {
    const rubric = this.store.getRubric(rubricId);
    if (!rubric) {
      throw new Error(`Rubric ${rubricId} was not found.`);
    }
    return rubric;
  }

  private assertUnpublished(rubric: Rubric, action: string): void {
    if (rubric.status !== "UNPUBLISHED") {
      throw new Error(`Only unpublished rubrics can be ${action}ed.`);
    }
  }

  private assertOwner(rubric: Rubric, designerId?: string): void {
    if (designerId !== undefined && rubric.designerId !== designerId) {
      throw new Error("You do not have permission to manage this rubric.");
    }
  }
}

function createId(): string {
  // Modern browsers and supported Node.js runtimes provide randomUUID.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `raser-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Kept exported for UI code that needs the fixed section labels.
export { SECTION_LABELS };
