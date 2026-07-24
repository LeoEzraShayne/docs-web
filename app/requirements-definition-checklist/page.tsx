import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { RequirementsChecklist } from "@/components/requirements-checklist";
import { ResourcePageShell } from "@/components/seo/resource-page-shell";
import { pageMetadata } from "@/lib/seo";

const path = "/requirements-definition-checklist";
const title = "要件定義チェックリスト｜レビュー前に確認する項目";
const description = "要件定義書のレビュー前に確認する、目的、スコープ、機能・非機能要件、権限、外部連携、データ移行、運用、リスク、未決事項のチェックリストです。";
const faq = [
  { question: "いつチェックしますか？", answer: "初稿作成後、関係者レビュー前、承認前の最低3回を推奨します。変更が入った場合は影響範囲も再確認します。" },
  { question: "すべての項目が必須ですか？", answer: "案件に該当しない項目は理由を記録して対象外にできます。未確認のまま空欄にするのではなく、対象外か未決かを区別します。" },
  { question: "入力した結果はどこに保存されますか？", answer: "このブラウザのlocalStorageにだけ保存され、サーバーには送信されません。結果はコピーまたはExcelで出力できます。" },
];
export const metadata: Metadata = pageMetadata({ title, description, path });
export default function RequirementsDefinitionChecklistPage() {
  return <ResourcePageShell kicker="Review Checklist" title={title} description={description} path={path} faq={faq} primary={{ href: "/requirements-definition-template-ja.xlsx", label: "Excelテンプレートを無料ダウンロード", download: "requirements-definition-template-ja.xlsx" }}>
    <RequirementsChecklist />
    <Card className="rounded-2xl p-8"><h2 className="text-2xl font-bold text-slate-50">チェック結果の扱い</h2><p className="mt-4 text-sm leading-7 text-slate-300">未確認項目は削除せず、未決事項として責任者、期限、影響を記録します。対象外の場合も理由を残すと、後続工程で「確認漏れ」と「意図的な対象外」を区別できます。</p><p className="mt-4 text-sm text-slate-400">具体的な粒度は<Link href="/requirements-definition-sample" className="ml-1 text-amber-200 underline">要件定義書サンプル</Link>、作成順序は<Link href="/requirements-definition-how-to-write" className="ml-1 text-amber-200 underline">要件定義書の書き方</Link>で確認できます。</p></Card>
  </ResourcePageShell>;
}
