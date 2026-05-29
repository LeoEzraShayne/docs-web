import type { DocumentSourceType, DocumentType } from "./types";

export type GenerationMode = "standard" | "simple" | "custom";
export type FieldKind = "textarea" | "checkboxes";

export type DocumentFieldConfig = {
  key: string;
  label: string;
  required?: boolean;
  maxLength?: number;
  kind?: FieldKind;
  options?: string[];
  sources?: DocumentSourceType[];
};

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

const req: DocumentFieldConfig[] = [
  {
    key: "problems",
    label: "解決したい課題",
    required: true,
    sources: ["PROJECT", "DIRECT_INPUT"],
  },
  {
    key: "goals",
    label: "実現したいこと",
    required: true,
    sources: ["PROJECT", "DIRECT_INPUT"],
  },
  {
    key: "mainFunctions",
    label: "主な機能",
    required: true,
    sources: ["PROJECT", "DIRECT_INPUT"],
  },
  { key: "userTypes", label: "利用者", sources: ["PROJECT", "DIRECT_INPUT"] },
  {
    key: "externalSystems",
    label: "外部連携システム",
    sources: ["PROJECT", "DIRECT_INPUT"],
  },
  {
    key: "specialRequirements",
    label: "特別な要件",
    sources: ["PROJECT", "DIRECT_INPUT"],
  },
];

const viewpoints = [
  "正常系",
  "異常系",
  "入力チェック",
  "API連携",
  "DB更新",
  "境界値",
  "権限チェック",
  "外部システム連携",
  "CSV出力",
  "メール送信",
  "ファイルアップロード",
];

export const DOCUMENT_PAGE_CONFIGS: Record<DocumentType, DocumentPageConfig> = {
  REQUIREMENTS: {
    type: "REQUIREMENTS",
    title: "要件定義書",
    sourceOptions: [{ label: "案件情報", value: "PROJECT" }],
    modes: ["standard", "simple", "custom"],
    fields: req,
    sheets: [
      "項目概要",
      "スコープ定義",
      "業務要件",
      "機能要件一覧",
      "画面一覧",
      "画面概要",
      "権限一覧",
      "データ項目定義",
      "外部連携/API一覧",
      "非機能要件",
      "業務フロー",
      "課題・リスク一覧",
    ],
    simpleSheets: [
      "項目概要",
      "機能要件一覧",
      "画面一覧",
      "データ項目定義",
      "業務フロー",
    ],
    progress: [
      "入力内容を解析しています",
      "要件を整理しています",
      "Excelを生成しています",
      "完了しました",
    ],
    submitLabel: "要件定義書を生成する",
  },
  BASIC_DESIGN: {
    type: "BASIC_DESIGN",
    title: "基本設計書",
    sourceOptions: [
      { label: "要件定義書", value: "REQUIREMENTS_VERSION" },
      { label: "直接入力", value: "DIRECT_INPUT" },
    ],
    modes: ["standard", "custom"],
    fields: [
      ...req,
      {
        key: "systemStructure",
        label: "システム構成要件",
        required: true,
        sources: ["DIRECT_INPUT"],
      },
      {
        key: "screenDesign",
        label: "画面設計要件",
        required: true,
        sources: ["DIRECT_INPUT"],
      },
      {
        key: "integration",
        label: "外部連携要件",
        required: true,
        sources: ["DIRECT_INPUT"],
      },
      {
        key: "dataManagement",
        label: "データ管理要件",
        required: true,
        sources: ["DIRECT_INPUT"],
      },
      { key: "permission", label: "権限要件", sources: ["DIRECT_INPUT"] },
      { key: "operation", label: "運用要件", sources: ["DIRECT_INPUT"] },
      {
        key: "batchReports",
        label: "バッチ・帳票要件",
        sources: ["DIRECT_INPUT"],
      },
      { key: "specialBusiness", label: "特別要件", sources: ["DIRECT_INPUT"] },
    ],
    sheets: [
      "基本設計概要",
      "システム構成設計",
      "画面遷移一覧",
      "画面設計",
      "機能設計",
      "API設計",
      "データベース設計",
      "権限設計",
      "バッチ・帳票設計",
      "非機能設計",
    ],
    progress: [
      "基本設計を分析しています",
      "システム構成を設計しています",
      "Excelを生成しています",
      "完了しました",
    ],
    submitLabel: "基本設計書を生成する",
  },
  DETAILED_DESIGN: {
    type: "DETAILED_DESIGN",
    title: "詳細設計書",
    sourceOptions: [
      { label: "基本設計書", value: "BASIC_DESIGN_VERSION" },
      { label: "直接入力", value: "DIRECT_INPUT" },
    ],
    modes: ["standard", "custom"],
    fields: [
      {
        key: "dataDetails",
        label: "データ管理詳細要件",
        required: true,
        sources: ["DIRECT_INPUT"],
      },
      {
        key: "apiDetails",
        label: "API詳細要件",
        required: true,
        sources: ["DIRECT_INPUT"],
      },
      {
        key: "screenDetails",
        label: "画面詳細要件",
        required: true,
        sources: ["DIRECT_INPUT"],
      },
      {
        key: "validation",
        label: "入力チェック要件",
        required: true,
        sources: ["DIRECT_INPUT"],
      },
      {
        key: "messages",
        label: "エラー・メッセージ要件",
        sources: ["DIRECT_INPUT"],
      },
      {
        key: "implementation",
        label: "特別実装要件",
        sources: ["DIRECT_INPUT"],
      },
    ],
    sheets: [
      "テーブル詳細設計",
      "テーブル項目定義",
      "API項目定義",
      "API詳細設計",
      "画面項目設計",
      "入力チェック設計",
      "画面処理設計",
      "エラー設計",
      "メッセージ設計",
    ],
    progress: [
      "詳細設計を分析しています",
      "項目定義を生成しています",
      "Excelを生成しています",
      "完了しました",
    ],
    submitLabel: "詳細設計書を生成する",
  },
  UNIT_TEST: {
    type: "UNIT_TEST",
    title: "単体テスト仕様書",
    sourceOptions: [
      { label: "詳細設計書", value: "DETAILED_DESIGN_VERSION" },
      { label: "直接入力", value: "DIRECT_INPUT" },
    ],
    modes: ["standard", "custom"],
    fields: [
      {
        key: "screens",
        label: "画面一覧",
        required: true,
        sources: ["DIRECT_INPUT"],
      },
      { key: "apis", label: "API一覧", sources: ["DIRECT_INPUT"] },
      { key: "tables", label: "テーブル一覧", sources: ["DIRECT_INPUT"] },
      {
        key: "testViewpoints",
        label: "テスト観点",
        kind: "checkboxes",
        options: viewpoints,
      },
      { key: "notes", label: "補足要件" },
    ],
    sheets: ["画面テスト", "APIテスト", "DBテスト"],
    progress: [
      "単体テスト観点を分析しています",
      "テストケースを生成しています",
      "Excelを生成しています",
      "完了しました",
    ],
    submitLabel: "単体テスト仕様書を生成する",
  },
  INTEGRATION_TEST: {
    type: "INTEGRATION_TEST",
    title: "結合テスト仕様書",
    sourceOptions: [
      { label: "詳細設計書", value: "DETAILED_DESIGN_VERSION" },
      { label: "設計資料貼付", value: "PASTED_DESIGN" },
    ],
    modes: ["standard", "custom"],
    fields: [
      {
        key: "designMaterial",
        label: "設計資料",
        required: true,
        maxLength: 10000,
        sources: ["PASTED_DESIGN"],
      },
    ],
    sheets: ["業務シナリオテスト"],
    progress: [
      "業務シナリオを分析しています",
      "結合テストケースを生成しています",
      "Excelを生成しています",
      "完了しました",
    ],
    submitLabel: "結合テスト仕様書を生成する",
  },
};
