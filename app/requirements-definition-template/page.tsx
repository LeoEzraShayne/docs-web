import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { JsonLd } from "@/components/seo/json-ld";
import {
  faqJsonLd,
  pageMetadata,
  requirementsDefinitionTemplatePage,
} from "@/lib/seo";

const sections = [
  ["基本情報", "プロジェクト名、作成日、作成者、対象システム、関係者"],
  ["背景・目的", "現状課題、導入目的、期待する業務上の効果"],
  ["スコープ", "対象範囲、対象外範囲、前提条件、制約条件"],
  ["業務要件", "対象業務、利用者、業務フロー、運用ルール"],
  ["機能要件", "機能一覧、画面一覧、帳票一覧、外部連携"],
  ["非機能要件", "性能、可用性、セキュリティ、保守性、移行"],
  ["リスク・未決事項", "確認待ち事項、依存関係、判断が必要な項目"],
];

const sampleRows = [
  ["目的", "受注から請求までの処理を一元化し、手作業の転記を減らす"],
  ["対象範囲", "見積作成、受注登録、請求書発行、取引先管理"],
  ["対象外範囲", "会計システムへの仕訳登録、倉庫内の在庫実査"],
  ["機能要件", "担当者は受注一覧からステータス、金額、納期を確認できる"],
  ["非機能要件", "平日9時から20時の利用を想定し、主要画面は3秒以内に表示する"],
];

const webExampleRows = [
  ["画面一覧", "ログイン、ダッシュボード、受注一覧、受注詳細、請求書発行"],
  ["利用者ロール", "営業担当、営業管理者、経理担当、システム管理者"],
  ["外部連携", "会計システムへ請求データをCSV連携する"],
  ["制約事項", "既存の顧客コード体系は変更しない"],
];

const faq = [
  {
    question: "このページのテンプレートは無料で確認できますか？",
    answer:
      "はい。要件定義書に含める項目、構成例、記入例をページ上で無料で確認できます。Excelファイルの配布は行っていません。",
  },
  {
    question: "要件定義書テンプレートには何を書けばよいですか？",
    answer:
      "基本情報、背景、目的、スコープ、業務要件、機能要件、非機能要件、制約、リスク、未決事項を分けて整理します。",
  },
  {
    question: "テンプレートだけで要件定義書は完成しますか？",
    answer:
      "テンプレートは整理の土台です。案件ごとの業務条件、関係者の合意、制約事項はレビューしながら追記する必要があります。",
  },
];

export const metadata: Metadata = pageMetadata({
  title: requirementsDefinitionTemplatePage.title,
  description: requirementsDefinitionTemplatePage.description,
  path: requirementsDefinitionTemplatePage.slug,
});

export default function RequirementsDefinitionTemplatePage() {
  return (
    <article className="space-y-8 py-8">
      <JsonLd data={faqJsonLd(faq)} />
      <Card className="micro-grid rounded-2xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          Requirements Template
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-slate-50 md:text-5xl">
          要件定義書テンプレート｜無料で見られるExcel構成・記入例付き
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
          システム開発で使う要件定義書の構成例を、Excelで整理しやすい粒度でまとめています。基本情報、業務要件、機能要件、非機能要件、画面一覧、帳票一覧、制約事項まで、記入例とあわせて確認できます。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login">
            <Button>AIで要件定義書を作成する</Button>
          </Link>
          <Link href="/requirements-definition-ai">
            <Button variant="secondary">AI生成ページを見る</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost">料金を見る</Button>
          </Link>
        </div>
      </Card>

      <Card className="rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-50">
          要件定義書テンプレートとは
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          要件定義書テンプレートは、システム開発で確認すべき項目を抜け漏れなく整理するためのひな形です。会議メモやヒアリング内容をそのまま貼り付けるのではなく、目的、対象範囲、機能、非機能、制約、未決事項に分けて記録することで、関係者レビューに回しやすくなります。
        </p>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-slate-50">
            要件定義書に含める主な項目
          </h2>
          <div className="mt-5 space-y-4">
            {sections.map(([title, body]) => (
              <div key={title} className="border-l border-amber-300/40 pl-4">
                <h3 className="text-base font-semibold text-slate-100">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-7 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-slate-50">
            Excelで整理する場合のシート例
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            {[
              "表紙・改訂履歴",
              "目的・背景・スコープ",
              "業務フロー・利用者ロール",
              "機能一覧・画面一覧・帳票一覧",
              "非機能要件・外部連携・制約事項",
              "リスク・未決事項・用語集",
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
          要件定義書テンプレートの記入例
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[680px] text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-3 pr-4 font-semibold">項目</th>
                <th className="py-3 font-semibold">記入例</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {sampleRows.map(([label, value]) => (
                <tr key={label}>
                  <td className="py-4 pr-4 font-medium text-slate-100">
                    {label}
                  </td>
                  <td className="py-4 leading-7">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-50">
          Webシステム向け要件定義書の例
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Webシステムでは、画面、利用者ロール、権限、外部連携、既存システムとの制約を早い段階で整理しておくと、基本設計や見積もりに引き継ぎやすくなります。
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[680px] text-left text-sm">
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {webExampleRows.map(([label, value]) => (
                <tr key={label}>
                  <th className="w-44 py-4 pr-4 text-left font-medium text-slate-100">
                    {label}
                  </th>
                  <td className="py-4 leading-7">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-slate-50">
            会議メモから要件定義書を作る方法
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            会議メモは発言順のままだとレビューしづらいため、目的、背景、決定事項、未決事項、機能要件、制約に分けて整理します。会議メモから要件定義書へ変換する流れは専用ページで解説しています。
          </p>
          <div className="mt-5">
            <Link href="/meeting-notes-to-requirements-definition">
              <Button variant="secondary">会議メモから作る方法を見る</Button>
            </Link>
          </div>
        </Card>

        <Card className="rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-slate-50">
            AIで要件定義書を自動生成する方法
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Docsでは、会議メモやシステム概要を入力し、要件定義書のたたき台をAIで整理できます。生成後は内容を確認しながら再生成し、Excel出力へ進められます。
          </p>
          <div className="mt-5">
            <Link href="/requirements-definition-ai">
              <Button variant="secondary">AI生成の詳細を見る</Button>
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
