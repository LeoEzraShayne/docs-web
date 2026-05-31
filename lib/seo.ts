import type { Metadata } from "next";

export const siteUrl = "https://docs.meritledger.org";
export const siteName = "Docs";

export const homeTitle =
  "AIドキュメント生成ツール | 要件定義書・設計書・テスト仕様書を自動作成";
export const homeDescription =
  "要件定義書、基本設計書、詳細設計書、単体テスト仕様書、結合テスト仕様書をAIで自動生成。日本のシステム開発現場向けに、Excel出力・再生成・履歴管理に対応。";

export type FaqItem = {
  question: string;
  answer: string;
};

export type SeoLandingPage = {
  slug: string;
  kicker: string;
  title: string;
  description: string;
  intro: string;
  useCases: string[];
  inputs: string[];
  outputs: string[];
  faq: FaqItem[];
};

export const landingPages: SeoLandingPage[] = [
  {
    slug: "/requirements-definition-ai",
    kicker: "Requirements Definition AI",
    title: "要件定義書AI生成 | 議事録からExcel要件定義書を自動作成",
    description:
      "議事録、背景、目的、スコープ、制約条件から、要件定義書をAIで整理してExcel出力。日本のシステム開発現場で使いやすい形式で再生成と履歴管理に対応します。",
    intro:
      "会議メモや依頼内容をもとに、要件定義書のたたき台をAIで作成します。目的、対象範囲、機能要件、非機能要件、リスクを分けて整理し、レビューしやすいExcel形式につなげます。",
    useCases: [
      "議事録から要件定義書の初稿を作りたい",
      "顧客ヒアリング後の整理作業を標準化したい",
      "Excelでレビューできる要件定義書を短時間で準備したい",
    ],
    inputs: [
      "システムの目的、背景、業務課題",
      "対象範囲、対象外範囲、前提条件",
      "会議メモ、利用者ロール、制約条件",
    ],
    outputs: [
      "業務フロー、画面、機能要件の整理",
      "非機能要件、リスク、用語集の整理",
      "Excel出力、再生成、履歴管理",
    ],
    faq: [
      {
        question: "要件定義書をAIでどこまで作成できますか？",
        answer:
          "入力された議事録や背景情報をもとに、レビュー用のたたき台を作成します。最終判断や顧客合意は担当者が確認する前提です。",
      },
      {
        question: "Excel形式で出力できますか？",
        answer:
          "はい。プレビュー確認後、要件定義書をExcel形式で出力できます。",
      },
      {
        question: "日本の開発現場向けの項目に対応していますか？",
        answer:
          "目的、スコープ、機能要件、非機能要件、リスク、用語など、日本の受託開発や社内開発で使われやすい項目を意識しています。",
      },
    ],
  },
  {
    slug: "/basic-design-ai",
    kicker: "Basic Design AI",
    title: "基本設計書AI生成 | 機能・画面・フローをExcelで自動整理",
    description:
      "基本設計書をAIで自動生成。機能、画面、業務フロー、インターフェース、非機能要件を日本の開発現場向けに整理し、Excel出力に対応します。",
    intro:
      "要件定義の内容や補足メモから、基本設計書の初稿を作成します。利用者視点の画面、機能、処理の流れを整理し、関係者レビューに回しやすい形にまとめます。",
    useCases: [
      "要件定義後に基本設計書の骨子を作りたい",
      "画面、機能、フローを同じ粒度で整理したい",
      "Excelでレビューできる基本設計書を用意したい",
    ],
    inputs: [
      "要件定義書、業務フロー、画面メモ",
      "機能一覧、利用者ロール、制約条件",
      "外部連携、入出力、非機能要件のメモ",
    ],
    outputs: [
      "画面、機能、業務フローの整理",
      "インターフェースと非機能要件の観点整理",
      "Excel出力、再生成、履歴管理",
    ],
    faq: [
      {
        question: "基本設計書のどの項目を生成できますか？",
        answer:
          "画面、機能、フロー、入出力、非機能要件など、基本設計で確認されやすい項目のたたき台を作成します。",
      },
      {
        question: "既存の要件定義書をもとに作れますか？",
        answer:
          "はい。要件定義書や補足メモを入力して、基本設計書の初稿作成に利用できます。",
      },
      {
        question: "生成後に修正や再生成はできますか？",
        answer:
          "はい。内容を確認しながら再生成でき、履歴として管理できます。",
      },
    ],
  },
  {
    slug: "/detailed-design-ai",
    kicker: "Detailed Design AI",
    title: "詳細設計書AI生成 | 処理ロジックと実装観点を自動整理",
    description:
      "詳細設計書をAIで自動生成。処理ロジック、項目定義、例外処理、実装時の確認事項を整理し、Excel出力と履歴管理に対応します。",
    intro:
      "基本設計の内容をもとに、開発担当者へ引き継ぎやすい詳細設計書のたたき台を作成します。処理単位、項目、条件分岐、例外系を整理し、実装前レビューを支援します。",
    useCases: [
      "基本設計から詳細設計書の初稿を作りたい",
      "処理ロジックや例外処理の観点を整理したい",
      "実装担当者が確認しやすいExcel資料にしたい",
    ],
    inputs: [
      "基本設計書、機能一覧、画面仕様",
      "処理条件、データ項目、外部連携のメモ",
      "制約、例外処理、未決事項",
    ],
    outputs: [
      "処理単位、条件分岐、例外系の整理",
      "項目定義、確認事項、リスクの整理",
      "Excel出力、再生成、履歴管理",
    ],
    faq: [
      {
        question: "詳細設計書は実装コードまで生成しますか？",
        answer:
          "いいえ。主な対象は詳細設計書のたたき台です。実装コードの自動生成ではなく、開発前の整理とレビューを支援します。",
      },
      {
        question: "例外処理や未決事項も整理できますか？",
        answer:
          "入力情報に含まれる範囲で、例外系や確認が必要な項目を整理できます。",
      },
      {
        question: "Excelで開発チームに共有できますか？",
        answer:
          "はい。生成した詳細設計書はExcel出力に対応しています。",
      },
    ],
  },
  {
    slug: "/unit-test-spec-ai",
    kicker: "Unit Test Spec AI",
    title: "単体テスト仕様書AI生成 | テスト項目と期待結果を自動作成",
    description:
      "単体テスト仕様書をAIで自動生成。正常系、異常系、境界値、期待結果を整理し、日本の開発現場でレビューしやすいExcel形式で出力できます。",
    intro:
      "設計書や機能メモから、単体テスト仕様書の初稿を作成します。条件、入力、期待結果、異常系を表形式で整理し、実装後の確認作業に使いやすい形にします。",
    useCases: [
      "機能ごとの単体テスト項目を洗い出したい",
      "正常系、異常系、境界値を表で整理したい",
      "Excelでレビューできる単体テスト仕様書を作りたい",
    ],
    inputs: [
      "詳細設計書、機能仕様、処理条件",
      "入力項目、バリデーション、例外条件",
      "確認したい観点や制約",
    ],
    outputs: [
      "テスト条件、入力値、期待結果の整理",
      "正常系、異常系、境界値の観点整理",
      "Excel出力、再生成、履歴管理",
    ],
    faq: [
      {
        question: "単体テスト仕様書の期待結果も作成できますか？",
        answer:
          "はい。入力された仕様に基づいて、テスト条件と期待結果のたたき台を作成します。",
      },
      {
        question: "境界値や異常系にも対応しますか？",
        answer:
          "入力情報から判断できる範囲で、境界値や異常系の観点を整理します。",
      },
      {
        question: "テスト仕様書はExcelで出力できますか？",
        answer:
          "はい。レビューや納品に使いやすいようExcel出力に対応しています。",
      },
    ],
  },
  {
    slug: "/integration-test-spec-ai",
    kicker: "Integration Test Spec AI",
    title: "結合テスト仕様書AI生成 | 連携・業務フローのテスト観点を整理",
    description:
      "結合テスト仕様書をAIで自動生成。システム間連携、業務フロー、データ連携、エンドツーエンド確認の観点を整理し、Excel出力できます。",
    intro:
      "複数機能や外部システムをまたぐ確認観点を整理し、結合テスト仕様書のたたき台を作成します。業務フロー、データ連携、エラー時の確認をレビューしやすい表にまとめます。",
    useCases: [
      "機能間やシステム間のテスト観点を整理したい",
      "業務フローに沿った結合テスト仕様書を作りたい",
      "Excelで関係者レビューに回せる形式にしたい",
    ],
    inputs: [
      "基本設計書、詳細設計書、業務フロー",
      "外部連携、API、データ入出力のメモ",
      "異常時の扱い、確認したい業務シナリオ",
    ],
    outputs: [
      "業務シナリオ、連携条件、期待結果の整理",
      "システム間連携とデータ確認の観点整理",
      "Excel出力、再生成、履歴管理",
    ],
    faq: [
      {
        question: "結合テスト仕様書ではどの観点を整理できますか？",
        answer:
          "業務フロー、機能間連携、外部システム連携、データ確認、異常時の観点を整理します。",
      },
      {
        question: "API連携のテスト観点にも使えますか？",
        answer:
          "はい。APIや外部連携の仕様メモを入力することで、確認観点の整理に利用できます。",
      },
      {
        question: "生成内容はそのまま納品できますか？",
        answer:
          "生成内容はレビュー用のたたき台です。案件固有の条件や合意事項は担当者が確認してください。",
      },
    ],
  },
];

export const blogRequirementsTemplate = {
  slug: "/blog/requirements-definition-template",
  title: "要件定義書テンプレート | 書き方とAI生成で整理する項目",
  description:
    "要件定義書テンプレートの基本項目、書き方、レビュー観点を日本のシステム開発向けに解説。AIで要件定義書を作成する場合の入力情報も整理します。",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      locale: "ja_JP",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function faqJsonLd(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  inLanguage: "ja",
  description: homeDescription,
};

export const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Docs",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: siteUrl,
  inLanguage: "ja",
  description: homeDescription,
  offers: {
    "@type": "Offer",
    price: "980",
    priceCurrency: "JPY",
    availability: "https://schema.org/InStock",
  },
};
