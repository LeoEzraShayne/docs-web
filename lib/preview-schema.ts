import { getDocumentContract } from "./document-catalog";
import type { GenerateTabs, PreviewSchema } from "./types";

const legacyTabs = [
  { key: "flow", label: "FLOW" },
  { key: "screens", label: "SCREENS" },
  { key: "functions", label: "FUNCTIONS" },
  { key: "nfr", label: "NFR" },
  { key: "risks_issues", label: "RISKS" },
  { key: "glossary", label: "GLOSSARY" },
];

export function resolvePreviewSchema(
  schema: PreviewSchema | undefined,
  tabs: GenerateTabs,
): PreviewSchema {
  if (schema) return schema;
  return Object.hasOwn(tabs, "項目概要") ? "requirements-v2" : "legacy-v1";
}

export function previewTabDefinitions(
  schema: PreviewSchema | undefined,
  tabs: GenerateTabs,
) {
  return resolvePreviewSchema(schema, tabs) === "requirements-v2"
    ? getDocumentContract("REQUIREMENTS").sheets.map((sheet) => ({
        key: sheet.name,
        label: sheet.name,
      }))
    : legacyTabs;
}
