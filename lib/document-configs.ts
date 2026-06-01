import type { DocumentSourceType, DocumentType } from "./types";
import { documentPageCopy } from "./copy/document-page-copy";
import {
  documentFields,
  type DocumentFieldConfig,
} from "./document-field-configs";
import { documentSheets, simpleDocumentSheets } from "./document-sheet-configs";

export type { DocumentFieldConfig } from "./document-field-configs";

export type GenerationMode = "standard" | "simple" | "custom";

export type DocumentPageConfig = {
  type: DocumentType;
  title: string;
  sourceOptions: Array<{ label: string; value: DocumentSourceType }>;
  modes: GenerationMode[];
  fields: DocumentFieldConfig[];
  sheets: string[];
  simpleSheets?: string[];
  progress: string[];
  submitLabel: string;
};

export const DOCUMENT_PAGE_CONFIGS: Record<DocumentType, DocumentPageConfig> = {
  REQUIREMENTS: page("REQUIREMENTS", ["standard", "simple", "custom"]),
  BASIC_DESIGN: page("BASIC_DESIGN", ["standard", "custom"]),
  DETAILED_DESIGN: page("DETAILED_DESIGN", ["standard", "custom"]),
  UNIT_TEST: page("UNIT_TEST", ["standard", "custom"]),
  INTEGRATION_TEST: page("INTEGRATION_TEST", ["standard", "custom"]),
};

function page(type: DocumentType, modes: GenerationMode[]): DocumentPageConfig {
  const copy = documentPageCopy[type];
  return {
    type,
    title: copy.title,
    sourceOptions: copy.sourceOptions,
    modes,
    fields: documentFields[type],
    sheets: documentSheets[type],
    simpleSheets: simpleDocumentSheets[type],
    progress: copy.progress,
    submitLabel: copy.submitLabel,
  };
}
