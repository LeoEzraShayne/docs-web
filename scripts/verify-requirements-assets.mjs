import fs from "node:fs/promises";
import path from "node:path";

const artifactModule = process.env.ARTIFACT_TOOL_MODULE;
if (!artifactModule) throw new Error("ARTIFACT_TOOL_MODULE is required");
const { FileBlob, SpreadsheetFile } = await import(artifactModule);

const root = process.cwd();
const outputDir = path.resolve(root, "../outputs/p2-content-alignment");
const previewDir = path.join(outputDir, "normalized-previews");
const catalog = JSON.parse(
  await fs.readFile(path.join(root, "lib/generated/document-catalog.v1.json"), "utf8"),
);
const formalSheets = catalog.documents.REQUIREMENTS.sheets;
await fs.mkdir(previewDir, { recursive: true });

for (const asset of [
  {
    name: "requirements-definition-template-ja.xlsx",
    extras: [
      { name: "レビュー・チェックリスト", columns: ["分類", "チェック項目", "状態", "確認者", "確認日", "備考"] },
      { name: "記入例", columns: ["分類", "項目", "記入例", "受入・確認条件", "状態", "備考"] },
    ],
  },
  { name: "requirements-definition-sample-ja.xlsx", extras: [] },
]) {
  const source = path.join(root, "public", asset.name);
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(source));
  const expected = [...formalSheets, ...asset.extras];
  const actualNames = workbook.worksheets.items.map((sheet) => sheet.name);
  const expectedNames = expected.map((sheet) => sheet.workbookName ?? sheet.name);
  if (JSON.stringify(actualNames) !== JSON.stringify(expectedNames)) {
    throw new Error(`${asset.name}: worksheet order mismatch`);
  }

  for (const [index, spec] of expected.entries()) {
    const sheet = workbook.worksheets.getItemAt(index);
    const columns = spec.columns;
    const header = sheet.getRangeByIndexes(3, 0, 1, columns.length).values[0];
    if (JSON.stringify(header) !== JSON.stringify(columns)) {
      throw new Error(`${asset.name}/${sheet.name}: header mismatch`);
    }
    const values = sheet.getUsedRange()?.values ?? [];
    const errors = values.flat().filter(
      (value) =>
        typeof value === "string" &&
        /#(?:REF!|DIV\/0!|VALUE!|NAME\?|N\/A)/.test(value),
    );
    if (errors.length) throw new Error(`${asset.name}/${sheet.name}: formula error ${errors[0]}`);

    const image = await workbook.render({
      sheetName: sheet.name,
      autoCrop: "all",
      scale: 0.8,
      format: "png",
    });
    await fs.writeFile(
      path.join(previewDir, `${asset.name}-${index + 1}-${safeFile(sheet.name)}.png`),
      new Uint8Array(await image.arrayBuffer()),
    );
  }

  console.log(
    (await workbook.inspect({
      kind: "workbook,sheet,formula",
      maxChars: 10000,
      tableMaxRows: 8,
      tableMaxCols: 10,
    })).ndjson,
  );
  await fs.copyFile(source, path.join(outputDir, asset.name));
  console.log(`Verified ${asset.name}`);
}

function safeFile(value) {
  return value.replace(/[^a-zA-Z0-9\u3040-\u30ff\u3400-\u9fff-]+/g, "-");
}
