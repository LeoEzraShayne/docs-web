import type { DocumentType } from "./types";
import { documentCatalog } from "./document-catalog";

export const documentSheets = Object.fromEntries(
  Object.entries(documentCatalog.documents).map(([type, document]) => [
    type,
    document.sheets.map((sheet) => sheet.name),
  ]),
) as Record<DocumentType, string[]>;

export const simpleDocumentSheets = Object.fromEntries(
  Object.entries(documentCatalog.documents)
    .filter(([, document]) => document.simpleSheets.length > 0)
    .map(([type, document]) => [type, document.simpleSheets]),
) as Partial<Record<DocumentType, string[]>>;
