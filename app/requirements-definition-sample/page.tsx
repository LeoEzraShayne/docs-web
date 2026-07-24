import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { ResourcePageShell } from "@/components/seo/resource-page-shell";
import { pageMetadata } from "@/lib/seo";

const path = "/requirements-definition-sample";
const title = "要件定義書サンプル｜Webシステムの記入例を項目別に解説";
const description =
  "受注・請求管理Webシステムを題材に、背景、スコープ、利用者、機能要件、非機能要件、画面、外部連携、リスクまで要件定義書の記入例を紹介します。";
const faq = [
  { question: "サンプルをそのまま実案件で使えますか？", answer: "構成と記述粒度の参考として利用できますが、業務ルール、法務、セキュリティ、性能条件は案件関係者の確認が必要です。" },
  { question: "機能要件はどの程度具体的に書きますか？", answer: "利用者、操作、対象データ、成立条件、期待結果がレビューで判断できる粒度を目安にします。画面の詳細な配置は基本設計で扱います。" },
  { question: "Excel版も利用できますか？", answer: "はい。空欄テンプレートと記入例を含むExcelファイルを無料でダウンロードできます。" },
];

export const metadata: Metadata = pageMetadata({ title, description, path });

const requirements = [
  ["REQ-001", "営業担当", "受注一覧を取引先、期間、状態で検索できる", "検索結果が指定条件と一致する"],
  ["REQ-002", "営業管理者", "受注金額と納期を変更し、変更履歴を確認できる", "変更者と変更日時が記録される"],
  ["REQ-003", "経理担当", "確定済み受注から請求書を発行できる", "請求番号が重複せずPDFを取得できる"],
];

export default function RequirementsDefinitionSamplePage() {
  return (
    <ResourcePageShell kicker="Requirements Sample" title={title} description={description} path={path} faq={faq} primary={{ href: "/requirements-definition-template", label: "テンプレートを見る" }}>
      <Card className="rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-50">サンプル案件の前提</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">複数のExcelで管理している見積・受注・請求情報をWebシステムへ統合する架空案件です。営業と経理が同じ情報を参照し、転記ミスと最新版確認の手間を減らすことを目的とします。</p>
        <dl className="mt-6 grid gap-4 md:grid-cols-3">
          {[["対象範囲", "見積、受注、請求、取引先、CSV会計連携"], ["対象外", "倉庫実査、会計仕訳、入金消込"], ["利用者", "営業担当、営業管理者、経理担当、管理者"]].map(([term, value]) => <div key={term} className="rounded-xl border border-slate-800 p-4"><dt className="font-semibold text-amber-200">{term}</dt><dd className="mt-2 text-sm leading-7 text-slate-400">{value}</dd></div>)}
        </dl>
      </Card>
      <Card className="rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-50">機能要件の記入例</h2>
        <div className="mt-5 overflow-x-auto"><table className="min-w-[820px] text-left text-sm"><thead className="border-b border-slate-700 text-slate-400"><tr><th className="py-3">ID</th><th>利用者</th><th>要件</th><th>受入条件</th></tr></thead><tbody className="divide-y divide-slate-800 text-slate-300">{requirements.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="py-4 pr-5 leading-7">{cell}</td>)}</tr>)}</tbody></table></div>
      </Card>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl p-6"><h2 className="text-xl font-bold text-slate-50">非機能要件</h2><ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300"><li>主要画面は通常負荷時に3秒以内で表示する</li><li>権限ごとに閲覧・更新可能な情報を分離する</li><li>受注と請求の変更履歴を7年間保持する</li><li>平日9:00〜20:00の利用を前提に月間稼働率99.5%を目標とする</li></ul></Card>
        <Card className="rounded-2xl p-6"><h2 className="text-xl font-bold text-slate-50">画面・連携・リスク</h2><ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300"><li>画面：ログイン、ダッシュボード、受注一覧・詳細、請求書発行</li><li>連携：会計システムへ日次CSVを出力</li><li>制約：既存顧客コード体系を変更しない</li><li>未決：CSV取込エラーの再処理担当と締切</li></ul></Card>
      </section>
      <Card className="rounded-2xl p-8"><h2 className="text-2xl font-bold text-slate-50">実案件で追加確認すること</h2><p className="mt-4 text-sm leading-7 text-slate-300">このサンプルは完成品ではありません。データ件数、ピーク負荷、バックアップ、障害復旧、監査、個人情報、移行、運用体制、受入責任者を案件ごとに確定してください。</p><p className="mt-4 text-sm text-slate-400">書き進め方は<Link className="ml-1 text-amber-200 underline" href="/requirements-definition-how-to-write">要件定義書の書き方</Link>、確認項目は<Link className="ml-1 text-amber-200 underline" href="/requirements-definition-checklist">レビュー用チェックリスト</Link>で確認できます。</p></Card>
    </ResourcePageShell>
  );
}
