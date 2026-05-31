import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { JsonLd } from "@/components/seo/json-ld";
import {
  blogRequirementsTemplate,
  faqJsonLd,
  pageMetadata,
} from "@/lib/seo";

const faq = [
  {
    question: "要件定義書テンプレートには何を書きますか？",
    answer:
      "目的、背景、スコープ、業務フロー、機能要件、非機能要件、制約、リスク、用語などを整理します。",
  },
  {
    question: "議事録から要件定義書を作成できますか？",
    answer:
      "はい。議事録やヒアリングメモを入力情報として整理し、要件定義書のたたき台作成に利用できます。",
  },
  {
    question: "テンプレートとAI生成はどう使い分けますか？",
    answer:
      "項目を固定して手作業で埋める場合はテンプレート、議事録や背景情報から初稿を作る場合はAI生成が向いています。",
  },
];

export const metadata: Metadata = pageMetadata({
  title: blogRequirementsTemplate.title,
  description: blogRequirementsTemplate.description,
  path: blogRequirementsTemplate.slug,
});

export default function RequirementsDefinitionTemplatePage() {
  return (
    <article className="space-y-8 py-8">
      <JsonLd data={faqJsonLd(faq)} />
      <Card className="micro-grid rounded-2xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          Template Guide
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-slate-50 md:text-5xl">
          要件定義書テンプレートと書き方
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
          要件定義書は、システム開発の目的、対象範囲、機能、制約、リスクを関係者で確認するための文書です。テンプレート化しておくと、議事録やヒアリング内容を整理しやすくなります。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/requirements-definition-ai">
            <Button>AIで要件定義書を作成する</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="secondary">料金を見る</Button>
          </Link>
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-slate-50">
            基本テンプレート項目
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            {[
              "プロジェクトの目的と背景",
              "対象範囲、対象外範囲、前提条件",
              "業務フロー、利用者ロール、画面概要",
              "機能要件、非機能要件、外部連携",
              "制約、リスク、未決事項、用語集",
            ].map((item) => (
              <li key={item} className="border-l border-amber-300/40 pl-3">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-slate-50">
            書き方のポイント
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            {[
              "決定事項と未決事項を分けて書く",
              "業務用語は用語集にまとめる",
              "機能要件と非機能要件を混ぜない",
              "レビュー時に判断できる粒度で条件を書く",
              "Excelで共有する場合はシート単位を揃える",
            ].map((item) => (
              <li key={item} className="border-l border-amber-300/40 pl-3">
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-50">
          AI生成に入力するとよい情報
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          AIで要件定義書を作成する場合は、会議メモだけでなく、目的、背景、対象業務、利用者、制約、既存システム、判断待ちの項目をまとめて入力すると、レビューしやすい初稿につながります。
        </p>
      </Card>

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
