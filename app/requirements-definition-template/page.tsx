import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { JsonLd } from "@/components/seo/json-ld";
import { TrackedLink } from "@/components/seo/tracked-link";
import { getDocumentContract } from "@/lib/document-catalog";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  requirementsDefinitionTemplatePage,
} from "@/lib/seo";

const contract = getDocumentContract("REQUIREMENTS");
const sections = [
  ["背景・目的 → 項目概要", "現状課題、導入目的、期待する業務上の効果は「項目概要」に記録します。"],
  ["制約 → スコープ定義", "対象範囲、対象外範囲、前提条件、業務・技術上の制約は「スコープ定義」に整理します。"],
  ["業務・機能", "業務要件、機能要件一覧、画面一覧、画面概要、権限一覧へ分けます。"],
  ["データ・連携", "データ項目定義と外部連携・API一覧に、対象データとシステム間の受け渡しを記録します。"],
  ["品質・流れ", "非機能要件と業務フローに、品質条件と担当ごとの処理順を記録します。"],
  ["未決事項 → 課題・リスク一覧", "確認待ち、依存関係、判断が必要な項目は「課題・リスク一覧」に残します。"],
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
      "はい。ページ上の構成例に加え、空欄シートと記入例を収録した編集可能なExcelテンプレートを、ログイン不要で無料ダウンロードできます。",
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
      <JsonLd
        data={articleJsonLd({
          title: requirementsDefinitionTemplatePage.title,
          description: requirementsDefinitionTemplatePage.description,
          path: requirementsDefinitionTemplatePage.slug,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          {
            name: requirementsDefinitionTemplatePage.title,
            path: requirementsDefinitionTemplatePage.slug,
          },
        ])}
      />
      <Card className="micro-grid rounded-2xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          Requirements Template
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-slate-50 md:text-5xl">
          要件定義書テンプレート｜無料で見られるExcel構成・記入例付き
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
          製品が生成する正式12シートと同じ構造を、Excelで無料提供しています。空欄から記入できる正式12シートに、レビュー用チェックリストと架空の記入例を加えた全14シートです。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <TrackedLink
            href="/requirements-definition-template-ja.xlsx"
            download="requirements-definition-template-ja.xlsx"
            eventName="template_download"
            ctaPosition="requirements-template:hero"
            assetName="requirements-definition-template-ja.xlsx"
          >
            Excelテンプレートを無料ダウンロード
          </TrackedLink>
          <Link href="/requirements-definition-ai">
            <Button variant="secondary">AI生成ページを見る</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost">料金を見る</Button>
          </Link>
        </div>
      </Card>

      <Card className="rounded-2xl border-amber-400/20 p-8">
        <h2 className="text-2xl font-bold text-slate-50">
          無料Excelテンプレートの内容
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          前半12シートは製品が生成する正式構造、13番目はレビュー・チェックリスト、14番目は架空の記入例です。追加2シートは無料テンプレート限定の補助資料で、製品の生成結果には含まれません。案件に不要な項目は理由を残して対象外とし、生成物をそのまま承認せず関係者でレビューしてください。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <TrackedLink
            href="/requirements-definition-template-ja.xlsx"
            download="requirements-definition-template-ja.xlsx"
            eventName="template_download"
            ctaPosition="requirements-template:download-section"
            assetName="requirements-definition-template-ja.xlsx"
          >
            ログインせずにダウンロード
          </TrackedLink>
          <TrackedLink
            href="/demo"
            eventName="seo_demo_click"
            ctaPosition="requirements-template:download-section"
            variant="secondary"
          >
            無料デモを試す
          </TrackedLink>
          <TrackedLink
            href="/login"
            eventName="seo_signup_click"
            ctaPosition="requirements-template:download-section"
            variant="ghost"
          >
            AIで要件定義書を作成する
          </TrackedLink>
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
              ...contract.sheets.map(
                (sheet, index) => `${index + 1}. ${sheet.workbookName}`,
              ),
              "13. レビュー・チェックリスト（無料テンプレート附属）",
              "14. 記入例（無料テンプレート附属）",
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
