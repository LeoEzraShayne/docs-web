import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { landingPages, pageMetadata } from "@/lib/seo";

const page = landingPages.find(
  (item) => item.slug === "/requirements-definition-ai",
)!;

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.slug,
});

export default function RequirementsDefinitionAiPage() {
  return (
    <>
      <SeoLandingPage page={page} />
      <section className="grid gap-4 pb-8 md:grid-cols-2">
        <Card className="rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
            Template
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-50">
            要件定義書テンプレートを確認する
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            基本情報、業務要件、機能要件、非機能要件など、Excelで整理しやすい構成例と記入例を確認できます。
          </p>
          <div className="mt-5">
            <Link href="/requirements-definition-template">
              <Button variant="secondary">テンプレートを見る</Button>
            </Link>
          </div>
        </Card>
        <Card className="rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
            Meeting Notes
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-50">
            会議メモから要件定義書を作る
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            ヒアリング内容や議事録を、背景、目的、スコープ、機能要件に分けて要件定義書へ整理する流れを紹介します。
          </p>
          <div className="mt-5">
            <Link href="/meeting-notes-to-requirements-definition">
              <Button variant="secondary">作り方を見る</Button>
            </Link>
          </div>
        </Card>
      </section>
    </>
  );
}
