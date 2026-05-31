import Link from "next/link";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { SectionTitle } from "@/components/section-title";
import { JsonLd } from "@/components/seo/json-ld";
import {
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const highlights = [
  "要件定義書・設計書・テスト仕様書に対応",
  "プレビュー確認後にExcel出力",
  "再生成と履歴管理でレビューを進めやすく",
];

export default function HomePage() {
  return (
    <div className="space-y-10 py-8">
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={softwareApplicationJsonLd} />
      <section className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <Card className="micro-grid overflow-hidden rounded-2xl p-8 md:p-10">
          <SectionTitle
            kicker="AI Document Generator"
            title="要件定義書・設計書・テスト仕様書をAIで自動生成"
            body="日本のシステム開発現場向けに、要件定義書、基本設計書、詳細設計書、単体テスト仕様書、結合テスト仕様書のたたき台をAIで整理します。プレビュー確認後にExcel出力でき、再生成と履歴管理にも対応します。"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login">
              <Button>ログインして作成する</Button>
            </Link>
            <Link href="/demo">
              <Button variant="secondary">デモで試す</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost">料金を見る</Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
            Supported Documents
          </p>
          <div className="mt-6 space-y-4">
            {[
              ["要件定義書", "背景、目的、スコープ、機能要件を整理"],
              ["基本設計書", "画面、機能、フロー、非機能要件を整理"],
              ["詳細設計書", "処理ロジック、項目、例外系を整理"],
              ["テスト仕様書", "単体・結合テストの観点と期待結果を整理"],
            ].map(([label, desc]) => (
              <div
                key={label}
                className="flex items-center justify-between border-b border-slate-800 pb-4"
              >
                <div>
                  <p className="text-lg font-semibold text-slate-100">{label}</p>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
                <p className="text-sm text-amber-200">Ready</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "日本語の業務文書",
            body: "日本の受託開発、社内開発、SI案件でレビューしやすい粒度を意識して文書を整理します。",
          },
          {
            title: "Excel出力",
            body: "プレビューで確認した内容をExcel形式で出力し、社内レビューや顧客確認に回しやすくします。",
          },
          {
            title: "再生成と履歴管理",
            body: "入力内容を見直しながら再生成し、文書ごとの作成履歴を管理できます。",
          },
        ].map((item) => (
          <Card key={item.title} className="rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              {item.title}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
