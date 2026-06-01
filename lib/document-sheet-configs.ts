import type { DocumentType } from "./types";

export const documentSheets: Record<DocumentType, string[]> = {
  REQUIREMENTS: [
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
  BASIC_DESIGN: [
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
  DETAILED_DESIGN: [
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
  UNIT_TEST: ["画面テスト", "APIテスト", "DBテスト"],
  INTEGRATION_TEST: ["業務シナリオテスト"],
};

export const simpleDocumentSheets: Partial<Record<DocumentType, string[]>> = {
  REQUIREMENTS: [
    "項目概要",
    "機能要件一覧",
    "画面一覧",
    "データ項目定義",
    "業務フロー",
  ],
};
