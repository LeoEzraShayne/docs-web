import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { ResourcePageShell } from "@/components/seo/resource-page-shell";
import { TrackedLink } from "@/components/seo/tracked-link";
import { getDocumentContract } from "@/lib/document-catalog";
import { requirementsSampleData } from "@/lib/requirements-sample-data";
import { pageMetadata } from "@/lib/seo";

const path = "/requirements-definition-sample";
const title = "要件定義書サンプル｜Webシステムの記入例を項目別に解説";
const description =
  "受注・請求管理Webシステムを題材に、製品が生成する正式12シートと同じ列構造で要件定義書の記入例を紹介します。";
const contract = getDocumentContract("REQUIREMENTS");
const faq = [
  {
    question: "サンプルをそのまま実案件で使えますか？",
    answer:
      "いいえ。架空案件のため、構成と記述粒度の参考に限定してください。業務ルール、法務、セキュリティ、性能条件は案件関係者の確認が必要です。",
  },
  {
    question: "WebページとExcelは製品の出力構造と同じですか？",
    answer:
      "はい。正式12シートの名称、順序、列名は製品の要件定義書生成結果と共通です。サンプルExcelにはチェックリストや汎用記入例シートを追加していません。",
  },
  {
    question: "空欄から使えるテンプレートもありますか？",
    answer:
      "はい。正式12シートにレビュー・チェックリストと記入例を加えた14シートの無料テンプレートも提供しています。",
  },
];

export const metadata: Metadata = pageMetadata({ title, description, path });

export default function RequirementsDefinitionSamplePage() {
  return (
    <ResourcePageShell
      kicker="Requirements Sample"
      title={title}
      description={description}
      path={path}
      faq={faq}
      primary={{
        href: "/requirements-definition-template",
        label: "空欄テンプレートを見る",
      }}
    >
      <Card className="rounded-2xl border-amber-400/20 p-8">
        <h2 className="text-2xl font-bold text-slate-50">
          正式12シートのサンプルExcel
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          受注・請求管理を題材にした架空データです。製品の正式なシート名・列順と同じですが、実案件の要件としてそのまま利用することはできません。
        </p>
        <div className="mt-5">
          <TrackedLink
            href="/requirements-definition-sample-ja.xlsx"
            download="requirements-definition-sample-ja.xlsx"
            eventName="sample_download"
            ctaPosition="requirements-sample:download"
            assetName="requirements-definition-sample-ja.xlsx"
          >
            サンプルExcelを無料ダウンロード
          </TrackedLink>
        </div>
      </Card>

      <Card className="rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-50">サンプル案件の前提</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          複数のExcelで管理している見積・受注・請求情報をWebシステムへ統合する架空案件です。以下の各区画はサーバー描画され、正式12シートの全列を順番どおり掲載しています。
        </p>
      </Card>

      {contract.sheets.map((sheet, index) => {
        const rows = requirementsSampleData[sheet.name] ?? [];
        return (
          <Card key={sheet.name} className="rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-50">
              {index + 1}. {sheet.workbookName}
            </h2>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-max text-left text-sm">
                <thead className="border-b border-slate-700 text-slate-400">
                  <tr>
                    {sheet.columns.map((column) => (
                      <th key={column} className="whitespace-nowrap py-3 pr-5 font-semibold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {rows.map((row, rowIndex) => (
                    <tr key={`${sheet.name}-${rowIndex}`}>
                      {sheet.columns.map((column) => (
                        <td key={column} className="max-w-md py-4 pr-5 leading-7">
                          {String(row[column] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}

      <Card className="rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-50">
          実案件で追加確認すること
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          このサンプルは完成品ではありません。データ件数、ピーク負荷、バックアップ、障害復旧、監査、個人情報、移行、運用体制、受入責任者を案件ごとに確定してください。
        </p>
        <p className="mt-4 text-sm text-slate-400">
          書き進め方は
          <Link className="mx-1 text-amber-200 underline" href="/requirements-definition-how-to-write">
            要件定義書の書き方
          </Link>
          、確認項目は
          <Link className="ml-1 text-amber-200 underline" href="/requirements-definition-checklist">
            レビュー用チェックリスト
          </Link>
          で確認できます。
        </p>
      </Card>
    </ResourcePageShell>
  );
}
