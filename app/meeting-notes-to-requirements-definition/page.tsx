import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { JsonLd } from "@/components/seo/json-ld";
import { TrackedLink } from "@/components/seo/tracked-link";
import {
  faqJsonLd,
  meetingNotesToRequirementsPage,
  pageMetadata,
} from "@/lib/seo";

const meetingMemo = [
  "営業部では受注情報をExcelで管理しており、最新版が分からないことがある。",
  "見積、受注、請求の情報を同じ画面で確認したい。",
  "会計システムへの連携は初期リリースではCSV出力でよい。",
  "顧客コードは既存システムと同じ体系を使う必要がある。",
  "営業担当と経理担当で見える項目を分けたい。",
];

const conversionRows = [
  ["Excelが分散し最新版が不明", "項目概要", "項目 / 内容", "背景：最新版確認に時間がかかっている"],
  ["見積・受注・請求を同じ画面で確認", "業務要件", "業務 / 課題 / 要件", "受注・請求情報を一元管理する"],
  ["初期連携はCSVでよい", "外部連携・API一覧", "API名 / 目的 / 呼出元 / 呼出先 / 業務説明", "会計システムへ日次CSVを出力する"],
  ["既存顧客コード体系を使用", "スコープ定義", "区分 / 対象 / 説明", "制約として既存コード体系を維持する"],
  ["営業と経理で見える項目を分離", "権限一覧", "ロール名 / 利用可能機能", "営業担当と経理担当の参照範囲を分ける"],
  ["再処理担当は未決", "課題・リスク一覧", "分類 / 内容 / 影響", "CSVエラー時の担当と期限を確認する"],
];

const steps = [
  "発言をそのまま整理せず、背景、目的、要件、制約に分ける",
  "決定事項と未決事項を分ける",
  "利用者ロールと対象業務を明確にする",
  "機能要件と非機能要件を混ぜない",
  "レビューで確認が必要な項目を未決事項として残す",
];

const faq = [
  {
    question: "会議メモだけで要件定義書は作れますか？",
    answer:
      "会議メモは初稿作成の材料になります。ただし、対象範囲、制約、未決事項、関係者の合意はレビューで確認する必要があります。",
  },
  {
    question: "AIに入力する会議メモはどの程度必要ですか？",
    answer:
      "背景、目的、対象業務、利用者、制約、決定事項、未決事項が含まれていると、要件定義書のたたき台を整理しやすくなります。",
  },
  {
    question: "生成された要件定義書はそのまま使えますか？",
    answer:
      "生成内容はレビュー用のたたき台です。案件固有の条件、顧客合意、法務やセキュリティ上の制約は担当者が確認してください。",
  },
];

export const metadata: Metadata = pageMetadata({
  title: meetingNotesToRequirementsPage.title,
  description: meetingNotesToRequirementsPage.description,
  path: meetingNotesToRequirementsPage.slug,
});

export default function MeetingNotesToRequirementsDefinitionPage() {
  return (
    <article className="space-y-8 py-8">
      <JsonLd data={faqJsonLd(faq)} />
      <Card className="micro-grid rounded-2xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          Meeting Notes to Requirements
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-slate-50 md:text-5xl">
          会議メモから要件定義書を自動生成する方法
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
          ヒアリングや定例会のメモを、背景、目的、スコープ、機能要件、非機能要件、制約条件に分けて整理すると、要件定義書の初稿にしやすくなります。ここでは会議メモの例から要件定義書へ変換する流れを紹介します。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <TrackedLink href="/login" eventName="seo_signup_click" ctaPosition="meeting-notes:hero">会議メモから作成する</TrackedLink>
          <Link href="/requirements-definition-template">
            <Button variant="secondary">テンプレートを見る</Button>
          </Link>
          <TrackedLink href="/pricing" eventName="seo_pricing_click" ctaPosition="meeting-notes:hero" variant="ghost">料金を見る</TrackedLink>
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-slate-50">会議メモの例</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            {meetingMemo.map((item) => (
              <li key={item} className="border-l border-amber-300/40 pl-3">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-slate-50">
            要件定義書へ整理する手順
          </h2>
          <ol className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            {steps.map((item) => (
              <li key={item} className="border-l border-amber-300/40 pl-3">
                {item}
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <Card className="rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-50">
          会議メモから要件定義書への変換例
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          会議メモの発言をそのまま文書にするのではなく、要件定義書の項目に合わせて分類します。レビュー時には、この分類が正しいか、未決事項が残っていないかを確認します。
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-3 pr-4 font-semibold">会議メモの原始情報</th>
                <th className="py-3 pr-4 font-semibold">対象シート</th>
                <th className="py-3 pr-4 font-semibold">対象列</th>
                <th className="py-3 font-semibold">整理後の記入例</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {conversionRows.map(([source, sheet, columns, example]) => (
                <tr key={source}>
                  <td className="py-4 pr-4 font-medium text-slate-100">{source}</td>
                  <td className="py-4 pr-4 text-amber-100">{sheet}</td>
                  <td className="py-4 pr-4 leading-7">{columns}</td>
                  <td className="py-4 leading-7">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-slate-50">
            AIで初稿を作成する場合の入力情報
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            AIに入力する場合は、会議メモに加えて、対象業務、利用者、既存システム、制約条件、決定事項、未決事項をまとめておくと、要件定義書の初稿がレビューしやすくなります。
          </p>
        </Card>

        <Card className="rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-slate-50">
            Docsでできること
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Docsでは、会議メモやシステム概要から要件定義書のたたき台をAIで作成し、プレビュー確認後にExcel出力できます。再生成と履歴管理にも対応しています。
          </p>
          <div className="mt-5">
            <Link href="/requirements-definition-ai">
              <Button variant="secondary">要件定義書AI生成を見る</Button>
            </Link>
          </div>
        </Card>
      </section>

      <Card className="rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-50">よくある質問</h2>
        <div className="mt-6 divide-y divide-slate-800">
          {faq.map((item) => (
            <div key={item.question} className="py-5 first:pt-0 last:pb-0">
              <h3 className="text-base font-semibold text-slate-100">
                {item.question}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </article>
  );
}
