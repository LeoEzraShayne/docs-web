import type { DocumentSourceType, DocumentType } from "@/lib/types";

type GenerationMode = "standard" | "simple" | "custom";

type DocumentCopy = {
  title: string;
  sourceOptions: Array<{ label: string; value: DocumentSourceType }>;
  fieldLabels: Record<string, string>;
  fieldPlaceholders: Record<string, string>;
  progress: string[];
  submitLabel: string;
};

const requirementFieldLabels = {
  problems: "解決したい課題",
  goals: "実現したいこと",
  mainFunctions: "主な機能",
  userTypes: "利用者",
  externalSystems: "外部連携システム",
  specialRequirements: "特別な要件",
};

export const documentPageCopy: Record<DocumentType, DocumentCopy> = {
  REQUIREMENTS: {
    title: "要件定義書",
    sourceOptions: [{ label: "案件情報", value: "PROJECT" }],
    fieldLabels: requirementFieldLabels,
    fieldPlaceholders: {
      problems: "例：注文管理がExcel中心で、入力ミスや確認漏れが発生している。",
      goals: "例：注文、在庫、売上を一元管理し、担当者がリアルタイムに確認できるようにする。",
      mainFunctions: "例：注文登録、在庫確認、売上集計、CSV出力、管理者画面",
      userTypes: "例：営業担当、管理者、経理担当、システム管理者",
      externalSystems: "例：Googleログイン、メール通知、CSV出力、会計システム連携",
      specialRequirements: "例：初期リリースではWeb版のみ対応し、スマートフォンアプリは対象外とする。",
    },
    progress: [
      "入力内容を解析しています",
      "要件を整理しています",
      "Excelを生成しています",
      "完了しました",
    ],
    submitLabel: "要件定義書を生成する",
  },
  BASIC_DESIGN: {
    title: "基本設計書",
    sourceOptions: [
      { label: "要件定義書", value: "REQUIREMENTS_VERSION" },
      { label: "直接入力", value: "DIRECT_INPUT" },
    ],
    fieldLabels: {
      ...requirementFieldLabels,
      systemStructure: "システム構成要件",
      screenDesign: "画面設計要件",
      integration: "外部連携要件",
      dataManagement: "データ管理要件",
      permission: "権限要件",
      operation: "運用要件",
      batchReports: "バッチ・帳票要件",
      specialBusiness: "特別要件",
    },
    fieldPlaceholders: {
      problems: "例：注文管理がExcel中心で、入力ミスや確認漏れが発生している。",
      goals: "例：注文、在庫、売上を一元管理し、担当者がリアルタイムに確認できるようにする。",
      mainFunctions: "例：注文登録、在庫確認、売上集計、CSV出力、管理者画面",
      userTypes: "例：営業担当、管理者、経理担当、システム管理者",
      externalSystems: "例：Googleログイン、メール通知、CSV出力、会計システム連携",
      specialRequirements: "例：初期リリースではWeb版のみ対応し、スマートフォンアプリは対象外とする。",
      systemStructure:
        "例：管理画面、APIサーバー、DBで構成し、利用者はブラウザからアクセスする。",
      screenDesign:
        "例：ログイン画面、測定結果一覧、測定詳細、管理者設定画面を用意する。",
      integration: "例：Googleログイン、メール通知、CSV出力を利用する。",
      dataManagement:
        "例：ユーザー情報、測定データ、測定結果、操作履歴を管理する。",
      permission: "例：管理者は全機能を利用でき、一般利用者は参照と登録のみ可能とする。",
      operation: "例：管理者がマスタを更新し、障害時は操作履歴から原因を確認する。",
      batchReports: "例：日次で測定結果を集計し、CSVレポートを出力する。",
      specialBusiness: "例：医療データを扱うため、参照権限と操作履歴を重視する。",
    },
    progress: [
      "基本設計を分析しています",
      "システム構成を設計しています",
      "Excelを生成しています",
      "完了しました",
    ],
    submitLabel: "基本設計書を生成する",
  },
  DETAILED_DESIGN: {
    title: "詳細設計書",
    sourceOptions: [
      { label: "基本設計書", value: "BASIC_DESIGN_VERSION" },
      { label: "直接入力", value: "DIRECT_INPUT" },
    ],
    fieldLabels: {
      dataDetails: "データ管理詳細要件",
      apiDetails: "API詳細要件",
      screenDetails: "画面詳細要件",
      validation: "入力チェック要件",
      messages: "エラー・メッセージ要件",
      implementation: "特別実装要件",
    },
    fieldPlaceholders: {
      dataDetails:
        "例：ユーザー、測定データ、測定結果テーブルの項目、主キー、必須項目を整理する。",
      apiDetails:
        "例：ログイン、測定データ登録、結果取得、CSV出力APIの入力・出力を定義する。",
      screenDetails:
        "例：一覧検索、詳細表示、登録、編集、エラー表示の項目と操作を整理する。",
      validation:
        "例：必須、形式、文字数、権限、重複チェックを定義する。",
      messages:
        "例：登録完了、入力エラー、権限エラー、データ取得失敗時の表示文言を整理する。",
      implementation:
        "例：CSV出力、ファイルアップロード、外部API連携など特別な処理条件を整理する。",
    },
    progress: [
      "詳細設計を分析しています",
      "項目定義を生成しています",
      "Excelを生成しています",
      "完了しました",
    ],
    submitLabel: "詳細設計書を生成する",
  },
  UNIT_TEST: {
    title: "単体テスト仕様書",
    sourceOptions: [
      { label: "詳細設計書", value: "DETAILED_DESIGN_VERSION" },
      { label: "直接入力", value: "DIRECT_INPUT" },
    ],
    fieldLabels: {
      screens: "画面一覧",
      apis: "API一覧",
      tables: "テーブル一覧",
      testViewpoints: "テスト観点",
      notes: "補足要件",
    },
    fieldPlaceholders: {
      screens: "例：ログイン画面、測定結果一覧、測定詳細、管理者設定画面",
      apis: "例：ログインAPI、測定データ登録API、測定結果取得API、CSV出力API",
      tables: "例：users、measurement_data、measurement_results、operation_logs",
      notes:
        "例：権限別の表示制御、異常系、境界値、CSV出力の確認を重視する。",
    },
    progress: [
      "単体テスト観点を分析しています",
      "テストケースを生成しています",
      "Excelを生成しています",
      "完了しました",
    ],
    submitLabel: "単体テスト仕様書を生成する",
  },
  INTEGRATION_TEST: {
    title: "結合テスト仕様書",
    sourceOptions: [
      { label: "詳細設計書", value: "DETAILED_DESIGN_VERSION" },
      { label: "設計資料貼付", value: "PASTED_DESIGN" },
    ],
    fieldLabels: {
      designMaterial: "設計資料",
    },
    fieldPlaceholders: {
      designMaterial:
        "例：ログイン後、測定データを登録し、結果一覧で確認し、CSV出力する業務フローをテストする。",
    },
    progress: [
      "業務シナリオを分析しています",
      "結合テストケースを生成しています",
      "Excelを生成しています",
      "完了しました",
    ],
    submitLabel: "結合テスト仕様書を生成する",
  },
};

export const testViewpointOptions = [
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

export const defaultTestViewpoints = [
  "正常系",
  "異常系",
  "入力チェック",
  "API連携",
  "DB更新",
];

export const generationModeLabels: Record<GenerationMode, string> = {
  standard: "標準版",
  simple: "簡易版",
  custom: "カスタム",
};

export const documentCommonCopy = {
  eyebrow: "文書生成",
  projectPrefix: "案件",
  loading: "読み込み中...",
  remainingGenerations: "残り生成回数",
  inputSource: "入力ソース",
  version: "バージョン",
  required: "必須",
  standardRecommendedSuffix: "（推奨）",
  generating: "生成中...",
  done: "完了しました",
  purchaseSingleDocument: "1文書を購入",
  versions: "バージョン",
  noVersions: "まだバージョンはありません。",
  redownload: "再ダウンロード",
  versionRequired: "上流文書バージョンを選択してください。",
  sheetRequired: "少なくとも1つのシートを選択してください。",
  fieldRequired: (label: string) => `${label} は必須です。`,
  maxLength: (label: string, maxLength: number) =>
    `${label} は ${maxLength} 文字以内です。`,
  generationComplete: (versionNo: number) =>
    `生成が完了しました。v${versionNo} を保存しました。`,
  downloadStarted:
    "ダウンロードを開始しました。必要な場合は再ダウンロードできます。",
};
