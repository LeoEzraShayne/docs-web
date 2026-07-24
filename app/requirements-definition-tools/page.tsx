import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { ResourcePageShell } from "@/components/seo/resource-page-shell";
import { pageMetadata } from "@/lib/seo";

const path = "/requirements-definition-tools";
const title = "要件定義ツールの選び方｜Excel・文書ツール・生成AIを比較";
const description = "要件定義に使うExcel、共同編集文書、汎用生成AI、要件定義専用AIを、適した用途、共同編集、Excel出力、履歴管理、確認負荷の観点で比較します。";
const faq = [
  { question: "どのツールを選べばよいですか？", answer: "既存様式への納品が中心ならExcel、複数人の文章編集なら共同編集文書、初稿の整理を短縮したい場合はAIが候補です。最終的には案件の承認方法と納品形式で選びます。" },
  { question: "生成AIだけで要件定義は完了しますか？", answer: "完了しません。AIは整理と初稿作成を支援できますが、業務判断、合意、優先順位、法務・セキュリティ条件は担当者が確認します。" },
  { question: "比較表は製品ランキングですか？", answer: "いいえ。一般的な方式ごとの特徴を整理したもので、順位や優劣を断定するものではありません。" },
];
export const metadata: Metadata = pageMetadata({ title, description, path });

const rows = [
  ["Excel", "既存様式・納品", "ファイル共有", "標準", "ファイル単位", "手作業が中心"],
  ["共同編集文書", "議論・共同執筆", "リアルタイム", "変換が必要", "変更履歴", "構成は人が設計"],
  ["汎用生成AI", "案出し・要約", "サービスによる", "追加加工", "サービスによる", "指示と検証が必要"],
  ["Docs", "開発文書の初稿", "非対応（単一アカウント）", "対応", "文書版を保持", "リアルタイム共同編集・コメント・承認は非対応"],
];

export default function RequirementsDefinitionToolsPage() {
  return <ResourcePageShell kicker="Tool Selection" title={title} description={description} path={path} faq={faq} primary={{ href: "/demo", label: "Docsのデモを見る" }}>
    <Card className="rounded-2xl p-8"><h2 className="text-2xl font-bold text-slate-50">方式別の比較</h2><div className="mt-5 overflow-x-auto"><table className="min-w-[920px] text-left text-sm"><thead className="border-b border-slate-700 text-slate-400"><tr>{["方式", "向く用途", "共同編集", "Excel出力", "履歴", "注意点"].map((x) => <th key={x} className="py-3 pr-5">{x}</th>)}</tr></thead><tbody className="divide-y divide-slate-800 text-slate-300">{rows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="py-4 pr-5 leading-7">{cell}</td>)}</tr>)}</tbody></table></div><p className="mt-5 text-sm leading-7 text-slate-400">Docsの履歴管理は、単一アカウント内で生成した文書の版を保持する機能です。複数人によるリアルタイム共同編集、コメント、承認ワークフローは現在提供していません。</p></Card>
    <section className="grid gap-4 md:grid-cols-3">{[["承認方法から選ぶ", "顧客がExcelで承認するなら最終成果物をExcelに揃えます。共同編集が重要なら編集履歴とコメントを優先します。"], ["入力情報から選ぶ", "議事録中心なら分類・要約機能、既存設計書中心なら文書間の引継ぎを確認します。"], ["検証負荷を考える", "AIの生成速度だけでなく、根拠確認、未決事項の識別、再生成履歴まで含めて評価します。"]].map(([heading, body]) => <Card key={heading} className="rounded-2xl p-6"><h2 className="text-lg font-semibold text-slate-50">{heading}</h2><p className="mt-3 text-sm leading-7 text-slate-400">{body}</p></Card>)}</section>
    <Card className="rounded-2xl p-8"><h2 className="text-2xl font-bold text-slate-50">選定前の確認項目</h2><ol className="mt-5 grid gap-3 text-sm leading-7 text-slate-300 md:grid-cols-2"><li>1. 最終納品形式と承認者</li><li>2. 扱う情報の機密性</li><li>3. 既存テンプレートの有無</li><li>4. 共同編集と権限の要件</li><li>5. 生成結果を確認する責任者</li><li>6. 文書更新と履歴の運用</li></ol><p className="mt-5 text-sm text-slate-400">比較後は<Link href="/requirements-definition-sample" className="ml-1 text-amber-200 underline">完成イメージのサンプル</Link>と<Link href="/requirements-definition-template" className="ml-1 text-amber-200 underline">無料Excelテンプレート</Link>を確認してください。</p></Card>
  </ResourcePageShell>;
}
