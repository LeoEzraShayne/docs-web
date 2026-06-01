import type { ProjectFormValues } from "@/lib/types";

type FieldCopy = {
  label: string;
  placeholder: string;
  helper?: string;
  validationMessage?: string;
};

export const projectFormCopy: Record<keyof ProjectFormValues, FieldCopy> = {
  docTitle: {
    label: "案件タイトル",
    placeholder: "例：販売管理システム、勤怠管理アプリ、EC注文管理",
    validationMessage: "案件タイトルを入力してください。",
  },
  industry: {
    label: "業界",
    placeholder: "例：小売、製造、医療、教育、金融、物流、スポーツ",
    validationMessage: "業界を入力してください。",
  },
  systemType: {
    label: "システム種別",
    placeholder: "例：Webアプリ、Androidアプリ、iOSアプリ、管理画面",
    helper: "技術名でも業務上の種類でも入力できます。",
    validationMessage: "システム種別を入力してください。",
  },
  purpose: {
    label: "目的",
    placeholder: "例：手作業の注文管理を自動化し、入力ミスと確認工数を削減する。",
    validationMessage: "目的を入力してください。",
  },
  background: {
    label: "背景",
    placeholder: "例：現在はExcelとメールで注文を管理しており、担当者ごとに情報が分散している。",
  },
  goals: {
    label: "ゴール",
    placeholder: "例：注文、在庫、売上情報を一つのシステムで管理し、リアルタイムに確認できる状態にする。",
  },
  inScope: {
    label: "対象範囲",
    placeholder: "例：注文登録、在庫確認、売上集計、CSV出力、管理者画面",
  },
  outScope: {
    label: "対象外",
    placeholder: "例：決済処理、会計システム連携、スマートフォンアプリ対応は初期リリースでは対象外とする。",
  },
  assumptions: {
    label: "前提条件",
    placeholder: "例：利用者は社内メンバーのみ。管理者と一般利用者で権限を分ける。",
  },
  constraints: {
    label: "制約",
    placeholder: "例：初期リリースではWeb版のみ対応し、スマートフォンアプリは対象外とする。",
  },
  rolesText: {
    label: "関係者",
    placeholder: "例：営業担当、管理者、承認者、経理担当、システム管理者",
  },
  minutesText: {
    label: "議事録",
    placeholder:
      "例：\n現在はExcelで注文を管理している。\n注文内容の確認に時間がかかっている。\n在庫状況がリアルタイムに分からない。\n管理者は売上レポートを確認したい。\n将来的には外部会計システムと連携したい。",
    helper:
      "打ち合わせ内容、要望、業務課題などを貼り付けてください。箇条書きでも構いません。",
    validationMessage: "議事録を入力してください。",
  },
};

export const projectFormPageCopy = {
  description: "入力後、無料プレビューまたはExcel生成に進めます。",
  unpaidPreviewLimit:
    "未購入ユーザーはプレビューを1日1回まで利用できます。Excel生成は文書を選択してから購入できます。",
};
