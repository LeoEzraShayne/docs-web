import type { DocumentSourceType, DocumentType } from "./types";
import { documentPageCopy } from "./copy/document-page-copy";
import {
  documentFields,
  type DocumentFieldConfig,
} from "./document-field-configs";
import { documentSheets, simpleDocumentSheets } from "./document-sheet-configs";
import { getDocumentContract, type GenerationMode } from "./document-catalog";

export type { DocumentFieldConfig } from "./document-field-configs";

export type { GenerationMode } from "./document-catalog";

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
  REQUIREMENTS: page("REQUIREMENTS"),
  BASIC_DESIGN: page("BASIC_DESIGN"),
  DETAILED_DESIGN: page("DETAILED_DESIGN"),
  UNIT_TEST: page("UNIT_TEST"),
  INTEGRATION_TEST: page("INTEGRATION_TEST"),
};

function page(type: DocumentType): DocumentPageConfig {
  const copy = documentPageCopy[type];
  const contract = getDocumentContract(type);
  return {
    type,
    title: contract.title,
    sourceOptions: copy.sourceOptions.filter((option) =>
      contract.sources.includes(option.value),
    ),
    modes: contract.modes,
    fields: documentFields[type],
    sheets: documentSheets[type],
    simpleSheets: simpleDocumentSheets[type],
    progress: copy.progress,
    submitLabel: copy.submitLabel,
  };
}
