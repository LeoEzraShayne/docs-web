import type { Metadata } from "next";
import { PricingClient } from "@/components/pricing/pricing-client";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionTitle } from "@/components/section-title";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

const pricingFaq = [
  {
    question: "無料で試せますか？",
    answer:
      "Freeプランでは毎日1回プレビューを確認できます。Excelダウンロードは有料プランで利用できます。",
  },
  {
    question: "1文書だけ購入できますか？",
    answer:
      "はい。Docs Singleでは税込980円で1文書枠を購入できます。",
  },
  {
    question: "複数文書をまとめて作成できますか？",
    answer:
      "Business Packでは税込66,640円で78文書枠を利用できます。複数案件やチーム利用に向いています。",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "料金 | AIドキュメント生成ツールのプラン",
  description:
    "Docsの料金プラン。無料プレビュー、1文書ごとのDocs Single、複数文書向けBusiness Packで、要件定義書・設計書・テスト仕様書のAI生成とExcel出力に対応します。",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <div className="space-y-8 py-8">
      <JsonLd data={faqJsonLd(pricingFaq)} />
      <SectionTitle
        kicker="料金"
        title="AIドキュメント生成に必要な文書枠だけ購入"
        body="要件定義書、基本設計書、詳細設計書、単体テスト仕様書、結合テスト仕様書を必要な分だけ作成できます。無料プレビューで確認し、Excel出力が必要な文書だけ購入できます。"
      />
      <PricingClient />
      <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
        <h2 className="text-2xl font-bold text-slate-50">料金に関するFAQ</h2>
        <div className="mt-6 divide-y divide-slate-800">
          {pricingFaq.map((item) => (
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
      </section>
    </div>
  );
}
