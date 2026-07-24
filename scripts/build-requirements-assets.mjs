import fs from "node:fs/promises";
import path from "node:path";

const artifactModule = process.env.ARTIFACT_TOOL_MODULE;
if (!artifactModule) {
  throw new Error(
    "ARTIFACT_TOOL_MODULE must point to @oai/artifact-tool/dist/artifact_tool.mjs",
  );
}
const { FileBlob, SpreadsheetFile, Workbook } = await import(artifactModule);

const root = process.cwd();
const publicDir = path.join(root, "public");
const outputDir = path.resolve(root, "../outputs/p2-content-alignment");
const previewDir = path.join(outputDir, "previews");
const catalog = JSON.parse(
  await fs.readFile(path.join(root, "lib/generated/document-catalog.v1.json"), "utf8"),
);
const requirements = catalog.documents.REQUIREMENTS;
const templatePath = path.join(publicDir, "requirements-definition-template-ja.xlsx");
const samplePath = path.join(publicDir, "requirements-definition-sample-ja.xlsx");

await fs.mkdir(publicDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

if (process.argv.includes("--inspect-existing")) {
  try {
    const existing = await SpreadsheetFile.importXlsx(await FileBlob.load(templatePath));
    console.log(
      (await existing.inspect({
        kind: "workbook,sheet,computedStyle",
        maxChars: 6000,
        tableMaxRows: 6,
        tableMaxCols: 8,
      })).ndjson,
    );
    for (const sheet of existing.worksheets.items) {
      await saveRender(existing, sheet.name, path.join(previewDir, `existing-${safeFile(sheet.name)}.png`));
    }
  } catch (error) {
    console.warn(`Existing template inspection skipped: ${error.message}`);
  }
}

function buildTemplateWorkbook() {
  const workbook = Workbook.create();
  for (const spec of requirements.sheets) {
    const sheet = workbook.worksheets.add(spec.workbookName);
    setupSheet(sheet, `${spec.workbookName}｜無料テンプレート`, "製品が生成する正式構造です。案件固有の内容を記入し、関係者レビューを行ってください。", spec.columns, []);
  }

  const checklist = workbook.worksheets.add("レビュー・チェックリスト");
  const checklistColumns = ["分類", "チェック項目", "状態", "確認者", "確認日", "備考"];
  const checklistRows = checklistItems.map(([category, item]) => [
    category,
    item,
    "未確認",
    "",
    "",
    "",
  ]);
  setupSheet(
    checklist,
    "レビュー・チェックリスト｜無料テンプレート附属",
    "このシートは製品生成結果には含まれないレビュー補助資料です。状態、確認者、確認日、備考を記録してください。",
    checklistColumns,
    checklistRows,
  );
  checklist.getRange("C5:C19").dataValidation = {
    rule: { type: "list", values: ["未確認", "確認中", "確認済", "対象外"] },
  };
  checklist.getRange("C5:C19").conditionalFormats.add("containsText", {
    text: "未確認",
    format: { fill: "#FEE2E2", font: { color: "#991B1B" } },
  });
  checklist.getRange("C5:C19").conditionalFormats.add("containsText", {
    text: "確認中",
    format: { fill: "#FEF3C7", font: { color: "#92400E" } },
  });
  checklist.getRange("E5:E19").format.numberFormat = "yyyy-mm-dd";

  const example = workbook.worksheets.add("記入例");
  setupSheet(
    example,
    "記入例｜無料テンプレート附属",
    "受注・請求管理を題材にした架空例です。実案件の要件としてそのまま利用できません。",
    ["分類", "項目", "記入例", "受入・確認条件", "状態", "備考"],
    [
      ["項目概要", "目的", "受注から請求までを一元管理し、手作業の転記を減らす", "業務責任者が目的と効果を確認する", "確認中", "架空例"],
      ["スコープ定義", "対象", "見積、受注、請求、会計CSV連携", "対象外業務も合わせて合意する", "未確認", "架空例"],
      ["非機能要件", "性能", "主要画面を通常負荷時に3秒以内で表示する", "計測条件と対象画面を決める", "未確認", "架空例"],
    ],
  );
  example.getRange("E5:E7").dataValidation = {
    rule: { type: "list", values: ["未確認", "確認中", "確認済", "対象外"] },
  };
  return workbook;
}

function buildSampleWorkbook() {
  const workbook = Workbook.create();
  for (const spec of requirements.sheets) {
    const sheet = workbook.worksheets.add(spec.workbookName);
    const objects = sampleData[spec.name] ?? [];
    const rows = objects.map((row) => spec.columns.map((column) => row[column] ?? ""));
    setupSheet(
      sheet,
      `${spec.workbookName}｜架空サンプル`,
      "受注・請求管理を題材にした架空案件です。構成と記述粒度の確認用であり、実案件の要件としてそのまま利用できません。",
      spec.columns,
      rows,
    );
  }
  return workbook;
}

function setupSheet(sheet, title, note, columns, rows) {
  const lastColumn = columnName(columns.length);
  sheet.showGridLines = false;
  sheet.mergeCells(`A1:${lastColumn}1`);
  sheet.mergeCells(`A2:${lastColumn}2`);
  sheet.getRange("A1").values = [[title]];
  sheet.getRange("A2").values = [[note]];
  sheet.getRange(`A4:${lastColumn}4`).values = [columns];
  if (rows.length > 0) {
    sheet.getRange(`A5:${lastColumn}${rows.length + 4}`).values = rows;
  }

  sheet.getRange(`A1:${lastColumn}1`).format = {
    fill: "#0F172A",
    font: { bold: true, color: "#FFFFFF", size: 16 },
    verticalAlignment: "center",
  };
  sheet.getRange(`A2:${lastColumn}2`).format = {
    fill: "#FFF7ED",
    font: { color: "#9A3412", size: 10 },
    wrapText: true,
    verticalAlignment: "center",
  };
  sheet.getRange(`A4:${lastColumn}4`).format = {
    fill: "#D97706",
    font: { bold: true, color: "#FFFFFF" },
    borders: { preset: "all", style: "thin", color: "#CBD5E1" },
    verticalAlignment: "center",
  };
  const bodyEnd = Math.max(24, rows.length + 4);
  sheet.getRange(`A5:${lastColumn}${bodyEnd}`).format = {
    font: { color: "#1E293B", size: 10 },
    borders: { preset: "all", style: "thin", color: "#E2E8F0" },
    wrapText: true,
    verticalAlignment: "top",
  };
  sheet.getRange("A1").format.rowHeight = 28;
  sheet.getRange("A2").format.rowHeight = 34;
  sheet.getRange(`A4:${lastColumn}4`).format.rowHeight = 25;
  sheet.getRange(`A5:${lastColumn}${bodyEnd}`).format.rowHeight = 38;
  sheet.getRange("A:A").format.columnWidth = 9;
  for (let index = 1; index < columns.length; index += 1) {
    const letter = columnName(index + 1);
    sheet.getRange(`${letter}:${letter}`).format.columnWidth =
      columns[index].includes("内容") ||
      columns[index].includes("説明") ||
      columns[index].includes("概要") ||
      columns[index].includes("要件")
        ? 34
        : 21;
  }
  sheet.freezePanes.freezeRows(4);
}

async function exportWorkbook(workbook, destination) {
  const file = await SpreadsheetFile.exportXlsx(workbook);
  await file.save(destination);
}

async function saveRender(workbook, sheetName, destination) {
  const image = await workbook.render({
    sheetName,
    autoCrop: "all",
    scale: 0.8,
    format: "png",
  });
  await fs.writeFile(destination, new Uint8Array(await image.arrayBuffer()));
}

function columnName(index) {
  let value = index;
  let result = "";
  while (value > 0) {
    value -= 1;
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }
  return result;
}

function safeFile(value) {
  return value.replace(/[^a-zA-Z0-9\u3040-\u30ff\u3400-\u9fff-]+/g, "-");
}

const checklistItems = [
  ["目的・背景", "解決する業務課題と期待効果が合意されている"],
  ["スコープ", "対象範囲と対象外範囲が明記されている"],
  ["業務要件", "対象業務と例外時の運用が確認されている"],
  ["機能要件", "利用者、操作、対象データ、期待結果が判定できる"],
  ["非機能要件", "性能、可用性、セキュリティの条件が測定可能である"],
  ["役割・権限", "ロールごとの参照・更新範囲が確認されている"],
  ["画面", "主要画面の目的と利用者が整理されている"],
  ["データ", "主要データ項目と保持方針が確認されている"],
  ["外部連携", "連携先、方式、頻度、異常時の扱いが確認されている"],
  ["データ移行", "移行対象、品質確認、切替手順が確認されている"],
  ["運用", "監視、バックアップ、問い合わせ対応が確認されている"],
  ["リスク", "主要リスクの影響と対応方針が記録されている"],
  ["未決事項", "未決事項ごとに責任者と期限が設定されている"],
  ["レビュー", "業務責任者とシステム責任者が確認している"],
  ["移管", "基本設計へ引き継ぐ前提と制約が整理されている"],
];

const sampleData = {
  "項目概要": [
    { No: 1, 項目: "案件名", 内容: "受注・請求管理システム刷新（架空案件）" },
    { No: 2, 項目: "目的", 内容: "見積・受注・請求情報を一元化し、転記ミスを減らす" },
    { No: 3, 項目: "注意", 内容: "架空例であり実案件の要件として利用不可" },
  ],
  "スコープ定義": [
    { No: 1, 区分: "対象", 対象: "見積・受注・請求管理", 説明: "Web画面で登録、検索、更新、請求書発行を行う" },
    { No: 2, 区分: "対象外", 対象: "入金消込・会計仕訳", 説明: "既存会計システムで実施する" },
  ],
  "業務要件": [
    { No: 1, 業務: "受注管理", 課題: "Excelが分散し最新版が不明", 要件: "受注情報と更新履歴を一元管理する" },
    { No: 2, 業務: "請求管理", 課題: "転記誤りが発生", 要件: "確定済み受注から請求情報を作成する" },
  ],
  "機能要件一覧": [
    { No: 1, 機能名: "受注検索", 目的: "対象受注を特定", 概要: "取引先、期間、状態で検索", 優先度: "高" },
    { No: 2, 機能名: "請求書発行", 目的: "転記をなくす", 概要: "請求番号を採番してPDFを生成", 優先度: "高" },
  ],
  "画面一覧": [
    { No: 1, 画面ID: "SCR-001", 画面名: "受注一覧", 目的: "受注検索と状態確認", 主な機能: "検索、並べ替え、詳細遷移" },
    { No: 2, 画面ID: "SCR-002", 画面名: "受注詳細", 目的: "受注内容の参照と更新", 主な機能: "明細編集、状態更新、履歴表示" },
  ],
  "画面概要": [
    { No: 1, 画面名: "受注一覧", 利用者: "営業担当、経理担当", 概要: "権限に応じて受注を検索する" },
    { No: 2, 画面名: "請求書発行", 利用者: "経理担当", 概要: "確定済み受注から請求書を発行する" },
  ],
  "権限一覧": [
    { No: 1, ロール名: "営業担当", 利用可能機能: "担当受注の登録・参照・更新" },
    { No: 2, ロール名: "経理担当", 利用可能機能: "全受注の参照、請求確定、CSV出力" },
  ],
  "データ項目定義": [
    { No: 1, エンティティ名: "受注", 目的: "注文を管理", 主なデータ項目: "受注番号、取引先コード、受注日、金額、状態" },
    { No: 2, エンティティ名: "請求", 目的: "請求を管理", 主なデータ項目: "請求番号、受注番号、支払期限、請求金額" },
  ],
  "外部連携/API一覧": [
    { No: 1, API名: "会計連携CSV出力", 目的: "請求情報の受け渡し", 呼出元: "受注・請求管理", 呼出先: "会計システム", 業務説明: "毎営業日20時に確定分を出力する" },
  ],
  "非機能要件": [
    { No: 1, 分類: "性能", 要件: "主要画面の応答", 説明: "通常負荷時に3秒以内で表示" },
    { No: 2, 分類: "可用性", 要件: "月間稼働率", 説明: "サービス時間帯で99.5%以上を目標" },
  ],
  "業務フロー": [
    { No: 1, ステップ: "見積登録", 担当: "営業担当", 内容: "取引先と明細を入力する" },
    { No: 2, ステップ: "受注確定", 担当: "営業管理者", 内容: "内容を確認して受注を確定する" },
    { No: 3, ステップ: "請求発行", 担当: "経理担当", 内容: "請求書を発行する" },
  ],
  "課題・リスク一覧": [
    { No: 1, 分類: "未決事項", 内容: "CSVエラー時の再処理担当と期限", 影響: "会計連携の遅延" },
    { No: 2, 分類: "リスク", 内容: "既存顧客コードの重複", 影響: "移行対象を一意に特定できない" },
  ],
};

const template = buildTemplateWorkbook();
const sample = buildSampleWorkbook();
await exportWorkbook(template, templatePath);
await exportWorkbook(sample, samplePath);
await fs.copyFile(templatePath, path.join(outputDir, path.basename(templatePath)));
await fs.copyFile(samplePath, path.join(outputDir, path.basename(samplePath)));

for (const [label, workbook] of [
  ["template", template],
  ["sample", sample],
]) {
  console.log(
    (await workbook.inspect({
      kind: "workbook,sheet,formula",
      maxChars: 12000,
      tableMaxRows: 8,
      tableMaxCols: 10,
    })).ndjson,
  );
  for (const sheet of workbook.worksheets.items) {
    await saveRender(workbook, sheet.name, path.join(previewDir, `${label}-${safeFile(sheet.name)}.png`));
  }
}

console.log(`Generated ${templatePath}`);
console.log(`Generated ${samplePath}`);
