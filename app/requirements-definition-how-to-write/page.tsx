import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { ResourcePageShell } from "@/components/seo/resource-page-shell";
import { pageMetadata } from "@/lib/seo";

const path = "/requirements-definition-how-to-write";
const title = "要件定義書の書き方｜ヒアリングからレビュー・合意までの手順";
const description = "要件定義書の作成手順を、事前準備、ヒアリング、情報整理、記述、レビュー、合意、基本設計への引継ぎまで実務向けに解説します。";
const faq = [
  { question: "要件定義書は誰が作成しますか？", answer: "一般にはプロジェクトマネージャー、業務担当、IT担当、ベンダーの責任者が協力します。作成者と最終承認者は分けて明確にします。" },
  { question: "どこまで書けば完成ですか？", answer: "対象範囲、要求、制約、受入条件、未決事項と責任者が合意され、基本設計や見積に引き継げる状態が目安です。" },
  { question: "画面レイアウトまで必要ですか？", answer: "要件定義では必要な画面と目的を整理し、詳細な配置や部品仕様は基本設計で確定するのが一般的です。" },
];
export const metadata: Metadata = pageMetadata({ title, description, path });
const steps = [
  ["1. 準備", "目的、現行業務、関係者、既存資料、制約を集め、決定者とレビュー日程を決めます。"],
  ["2. ヒアリング", "利用者の作業、困りごと、例外、繁忙時、権限、外部連携を事実と要望に分けて聞きます。"],
  ["3. 整理", "背景、目的、範囲、業務要件、機能、非機能、制約、未決事項に分類します。"],
  ["4. 記述", "曖昧語を避け、主体、条件、処理、結果、受入条件を確認できる文にします。"],
  ["5. レビュー", "業務、開発、運用、セキュリティの各担当が矛盾、漏れ、実現性を確認します。"],
  ["6. 合意・引継ぎ", "変更管理方法を決め、承認済み範囲と未決事項を基本設計・見積へ渡します。"],
];

export default function RequirementsDefinitionHowToWritePage() {
  return <ResourcePageShell kicker="How to Write" title={title} description={description} path={path} faq={faq} primary={{ href: "/requirements-definition-sample", label: "記入サンプルを見る" }}>
    <section className="grid gap-4 lg:grid-cols-2">{steps.map(([heading, body]) => <Card key={heading} className="rounded-2xl p-6"><h2 className="text-xl font-bold text-slate-50">{heading}</h2><p className="mt-3 text-sm leading-7 text-slate-300">{body}</p></Card>)}</section>
    <Card className="rounded-2xl p-8"><h2 className="text-2xl font-bold text-slate-50">役割と責任の分け方</h2><div className="mt-5 overflow-x-auto"><table className="min-w-[760px] text-left text-sm"><thead className="border-b border-slate-700 text-slate-400"><tr><th className="py-3">役割</th><th>主な責任</th><th>確認する内容</th></tr></thead><tbody className="divide-y divide-slate-800 text-slate-300">{[["業務責任者", "業務判断と優先順位", "目的、業務ルール、受入条件"], ["PM・要件担当", "全体整理と合意管理", "範囲、依存関係、未決事項"], ["開発担当", "実現性と影響確認", "機能、データ、外部連携"], ["運用・セキュリティ", "運用可能性と統制", "権限、監査、障害、保守"]].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="py-4 pr-5 leading-7">{cell}</td>)}</tr>)}</tbody></table></div></Card>
    <Card className="rounded-2xl p-8"><h2 className="text-2xl font-bold text-slate-50">よくある失敗</h2><ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-300 md:grid-cols-2"><li>「使いやすく」「高速に」など判定不能な表現だけを書く</li><li>対象外範囲を書かず、後から期待が膨らむ</li><li>正常系だけを確認し、例外と運用を後回しにする</li><li>決定事項と要望、未決事項を同じ表に混在させる</li><li>承認者を決めず、レビューがコメント交換で止まる</li><li>変更履歴を残さず、どの版が合意済みか分からなくなる</li></ul><p className="mt-5 text-sm text-slate-400"><Link href="/meeting-notes-to-requirements-definition" className="text-amber-200 underline">会議メモを整理する具体例</Link>と<Link href="/requirements-definition-checklist" className="ml-2 text-amber-200 underline">レビュー用チェックリスト</Link>も利用できます。</p></Card>
  </ResourcePageShell>;
}
