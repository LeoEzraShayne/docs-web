import fs from "node:fs/promises";
import path from "node:path";

const snapshotPath = path.resolve("lib/generated/document-catalog.v1.json");
const checkOnly = process.argv.includes("--check");
const urlArgument = process.argv.find((argument) => argument.startsWith("--url="));
const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-docs.meritledger.org";
const catalogUrl = urlArgument
  ? urlArgument.slice("--url=".length)
  : process.env.DOCUMENT_CATALOG_URL ??
    `${baseUrl.replace(/\/$/, "")}/document-catalog/v1`;

const response = await fetch(catalogUrl, {
  headers: {
    Accept: "application/json",
    "User-Agent":
      "Mozilla/5.0 (compatible; DocsDocumentCatalogMonitor/1.0; +https://docs.meritledger.org)",
  },
});
if (!response.ok) {
  const errorBody = await response.text().catch(() => "");
  throw new Error(
    `Document catalog request failed: ${response.status} ${catalogUrl} ${errorBody.slice(0, 240)}`,
  );
}

const catalog = await response.json();
validateCatalog(catalog);
const serialized = `${JSON.stringify(catalog, null, 2)}\n`;

if (checkOnly) {
  const current = JSON.parse(await fs.readFile(snapshotPath, "utf8"));
  if (
    current.contractHash !== catalog.contractHash ||
    JSON.stringify(current) !== JSON.stringify(catalog)
  ) {
    throw new Error(
      `Document catalog drift detected (${current.contractHash} -> ${catalog.contractHash}). Run: npm run sync:document-catalog -- --url=${catalogUrl}`,
    );
  }
  console.log(`Document catalog is current: ${catalog.contractHash}`);
} else {
  await fs.mkdir(path.dirname(snapshotPath), { recursive: true });
  await fs.writeFile(snapshotPath, serialized);
  console.log(`Saved document catalog ${catalog.contractHash} to ${snapshotPath}`);
}

function validateCatalog(value) {
  if (
    value?.contractVersion !== 1 ||
    typeof value.contractHash !== "string" ||
    !/^[a-f0-9]{64}$/.test(value.contractHash) ||
    !value.documents ||
    typeof value.documents !== "object"
  ) {
    throw new Error("Invalid document catalog v1 response");
  }

  const expectedTypes = [
    "REQUIREMENTS",
    "BASIC_DESIGN",
    "DETAILED_DESIGN",
    "UNIT_TEST",
    "INTEGRATION_TEST",
  ];
  for (const type of expectedTypes) {
    const document = value.documents[type];
    if (
      !document ||
      typeof document.title !== "string" ||
      typeof document.filename !== "string" ||
      !Array.isArray(document.sources) ||
      !Array.isArray(document.modes) ||
      !Array.isArray(document.simpleSheets) ||
      !Array.isArray(document.sheets) ||
      document.sheets.some(
        (sheet) =>
          typeof sheet?.name !== "string" ||
          typeof sheet?.workbookName !== "string" ||
          !Array.isArray(sheet?.columns),
      )
    ) {
      throw new Error(`Invalid document definition: ${type}`);
    }
  }
}
