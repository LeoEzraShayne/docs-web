import type { DocumentSourceType, DocumentType } from "./types";
import { documentPageCopy, testViewpointOptions } from "./copy/document-page-copy";

export type FieldKind = "textarea" | "checkboxes";

export type DocumentFieldConfig = {
  key: string;
  label: string;
  required?: boolean;
  maxLength?: number;
  kind?: FieldKind;
  options?: string[];
  placeholder?: string;
  sources?: DocumentSourceType[];
};

const req: DocumentFieldConfig[] = [
  field("REQUIREMENTS", "problems", {
    required: true,
    sources: ["PROJECT", "DIRECT_INPUT"],
  }),
  field("REQUIREMENTS", "goals", {
    required: true,
    sources: ["PROJECT", "DIRECT_INPUT"],
  }),
  field("REQUIREMENTS", "mainFunctions", {
    required: true,
    sources: ["PROJECT", "DIRECT_INPUT"],
  }),
  field("REQUIREMENTS", "userTypes", { sources: ["PROJECT", "DIRECT_INPUT"] }),
  field("REQUIREMENTS", "externalSystems", {
    sources: ["PROJECT", "DIRECT_INPUT"],
  }),
  field("REQUIREMENTS", "specialRequirements", {
    sources: ["PROJECT", "DIRECT_INPUT"],
  }),
];

export const documentFields: Record<DocumentType, DocumentFieldConfig[]> = {
  REQUIREMENTS: req,
  BASIC_DESIGN: [
    ...req,
    field("BASIC_DESIGN", "systemStructure", {
      required: true,
      sources: ["DIRECT_INPUT"],
    }),
    field("BASIC_DESIGN", "screenDesign", {
      required: true,
      sources: ["DIRECT_INPUT"],
    }),
    field("BASIC_DESIGN", "integration", {
      required: true,
      sources: ["DIRECT_INPUT"],
    }),
    field("BASIC_DESIGN", "dataManagement", {
      required: true,
      sources: ["DIRECT_INPUT"],
    }),
    field("BASIC_DESIGN", "permission", { sources: ["DIRECT_INPUT"] }),
    field("BASIC_DESIGN", "operation", { sources: ["DIRECT_INPUT"] }),
    field("BASIC_DESIGN", "batchReports", { sources: ["DIRECT_INPUT"] }),
    field("BASIC_DESIGN", "specialBusiness", { sources: ["DIRECT_INPUT"] }),
  ],
  DETAILED_DESIGN: [
    field("DETAILED_DESIGN", "dataDetails", {
      required: true,
      sources: ["DIRECT_INPUT"],
    }),
    field("DETAILED_DESIGN", "apiDetails", {
      required: true,
      sources: ["DIRECT_INPUT"],
    }),
    field("DETAILED_DESIGN", "screenDetails", {
      required: true,
      sources: ["DIRECT_INPUT"],
    }),
    field("DETAILED_DESIGN", "validation", {
      required: true,
      sources: ["DIRECT_INPUT"],
    }),
    field("DETAILED_DESIGN", "messages", { sources: ["DIRECT_INPUT"] }),
    field("DETAILED_DESIGN", "implementation", { sources: ["DIRECT_INPUT"] }),
  ],
  UNIT_TEST: [
    field("UNIT_TEST", "screens", { required: true, sources: ["DIRECT_INPUT"] }),
    field("UNIT_TEST", "apis", { sources: ["DIRECT_INPUT"] }),
    field("UNIT_TEST", "tables", { sources: ["DIRECT_INPUT"] }),
    field("UNIT_TEST", "testViewpoints", {
      kind: "checkboxes",
      options: testViewpointOptions,
    }),
    field("UNIT_TEST", "notes"),
  ],
  INTEGRATION_TEST: [
    field("INTEGRATION_TEST", "designMaterial", {
      required: true,
      maxLength: 10000,
      sources: ["PASTED_DESIGN"],
    }),
  ],
};

function field(
  type: DocumentType,
  key: string,
  options: Omit<DocumentFieldConfig, "key" | "label"> = {},
): DocumentFieldConfig {
  return {
    key,
    label: documentPageCopy[type].fieldLabels[key],
    placeholder: documentPageCopy[type].fieldPlaceholders[key],
    ...options,
  };
}
