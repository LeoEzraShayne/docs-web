import type { DocumentSourceType, DocumentType } from "./types";

export type DocumentFieldConfig = {
  key: string;
  label: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
};

export type DocumentPageConfig = {
  type: DocumentType;
  title: string;
  sourceOptions: Array<{ label: string; value: DocumentSourceType }>;
  fields: DocumentFieldConfig[];
  sheets: string[];
  progress: string[];
  submitLabel: string;
};

const requirementFields: DocumentFieldConfig[] = [
  { key: "problems", label: "解決したい課題", required: true },
  { key: "goals", label: "実現したいこと", required: true },
  { key: "mainFunctions", label: "主な機能", required: true },
  { key: "userTypes", label: "利用者" },
  { key: "externalSystems", label: "外部連携システム" },
  { key: "specialRequirements", label: "特別な要件" },
];

export const DOCUMENT_PAGE_CONFIGS: Record<DocumentType, DocumentPageConfig> = {
  REQUIREMENTS: {
    type: "REQUIREMENTS",
    title: "要件定義書",
    sourceOptions: [{ label: "案件情報", value: "PROJECT" }],
    fields: requirementFields,
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
    progress: ["入力内容を解析しています", "要件を整理しています", "Excelを生成しています", "完了しました"],
    submitLabel: "要件定義書を生成する",
  },
  BASIC_DESIGN: {
    type: "BASIC_DESIGN",
    title: "基本設計書",
    sourceOptions: [
      { label: "要件定義書", value: "REQUIREMENTS_VERSION" },
      { label: "直接入力", value: "DIRECT_INPUT" },
    ],
    fields: [
      ...requirementFields,
      { key: "systemStructure", label: "システム構成要件", required: true },
      { key: "screenDesign", label: "画面設計要件", required: true },
      { key: "integration", label: "外部連携要件", required: true },
      { key: "dataManagement", label: "データ管理要件", required: true },
      { key: "permission", label: "権限要件" },
      { key: "operation", label: "運用要件" },
      { key: "batchReports", label: "バッチ・帳票要件" },
      { key: "specialBusiness", label: "特別要件" },
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
    progress: ["基本設計を分析しています", "システム構成を設計しています", "Excelを生成しています", "完了しました"],
    submitLabel: "基本設計書を生成する",
  },
  DETAILED_DESIGN: {
    type: "DETAILED_DESIGN",
    title: "詳細設計書",
    sourceOptions: [
      { label: "基本設計書", value: "BASIC_DESIGN_VERSION" },
      { label: "直接入力", value: "DIRECT_INPUT" },
    ],
    fields: [
      { key: "dataDetails", label: "データ管理詳細要件", required: true },
      { key: "apiDetails", label: "API詳細要件", required: true },
      { key: "screenDetails", label: "画面詳細要件", required: true },
      { key: "validation", label: "入力チェック要件", required: true },
      { key: "messages", label: "エラー・メッセージ要件" },
      { key: "implementation", label: "特別実装要件" },
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
    progress: ["詳細設計を分析しています", "項目定義を生成しています", "Excelを生成しています", "完了しました"],
    submitLabel: "詳細設計書を生成する",
  },
  UNIT_TEST: {
    type: "UNIT_TEST",
    title: "単体テスト仕様書",
    sourceOptions: [
      { label: "詳細設計書", value: "DETAILED_DESIGN_VERSION" },
      { label: "直接入力", value: "DIRECT_INPUT" },
    ],
    fields: [
      { key: "screens", label: "画面一覧", required: true },
      { key: "apis", label: "API一覧" },
      { key: "tables", label: "テーブル一覧" },
      { key: "viewpoints", label: "テスト観点" },
      { key: "notes", label: "補足要件" },
    ],
    sheets: ["画面テスト", "APIテスト", "DBテスト"],
    progress: ["単体テスト観点を分析しています", "テストケースを生成しています", "Excelを生成しています", "完了しました"],
    submitLabel: "単体テスト仕様書を生成する",
  },
  INTEGRATION_TEST: {
    type: "INTEGRATION_TEST",
    title: "結合テスト仕様書",
    sourceOptions: [
      { label: "詳細設計書", value: "DETAILED_DESIGN_VERSION" },
      { label: "設計資料貼付", value: "PASTED_DESIGN" },
    ],
    fields: [{ key: "designMaterial", label: "設計資料", required: true, maxLength: 10000 }],
    sheets: ["業務シナリオテスト"],
    progress: ["業務シナリオを分析しています", "結合テストケースを生成しています", "Excelを生成しています", "完了しました"],
    submitLabel: "結合テスト仕様書を生成する",
  },
};
