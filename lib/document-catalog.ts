import catalogSnapshot from "./generated/document-catalog.v1.json";
import type { DocumentSourceType, DocumentType } from "./types";

export type GenerationMode = "standard" | "simple" | "custom";

export type DocumentCatalogV1 = {
  contractVersion: 1;
  contractHash: string;
  documents: Record<
    DocumentType,
    {
      title: string;
      filename: string;
      sources: DocumentSourceType[];
      modes: GenerationMode[];
      simpleSheets: string[];
      sheets: Array<{
        name: string;
        workbookName: string;
        columns: string[];
      }>;
    }
  >;
};

export const documentCatalog = catalogSnapshot as DocumentCatalogV1;

export function getDocumentContract(type: DocumentType) {
  return documentCatalog.documents[type];
}
