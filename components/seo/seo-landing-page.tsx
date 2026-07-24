import { Card } from "@/components/card";
import { JsonLd } from "@/components/seo/json-ld";
import { TrackedLink } from "@/components/seo/tracked-link";
import { faqJsonLd, type SeoLandingPage } from "@/lib/seo";
import { getDocumentContract } from "@/lib/document-catalog";

export function SeoLandingPage({ page }: { page: SeoLandingPage }) {
  const contract = getDocumentContract(page.documentType);
  const modeLabels = contract.modes.map((mode) =>
    mode === "standard"
      ? "標準版"
      : mode === "simple"
        ? "簡易版"
        : "カスタム版",
  );
  return (
    <div className="space-y-8 py-8">
      <JsonLd data={faqJsonLd(page.faq)} />
      <Card className="micro-grid rounded-2xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          {page.kicker}
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-slate-50 md:text-5xl">
          {page.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
          {page.intro}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <TrackedLink href="/login" eventName="seo_signup_click" ctaPosition="ai-landing:hero">ログインして作成する</TrackedLink>
          <TrackedLink href="/demo" eventName="seo_demo_click" ctaPosition="ai-landing:hero" variant="secondary">デモで試す</TrackedLink>
          <TrackedLink href="/pricing" eventName="seo_pricing_click" ctaPosition="ai-landing:hero" variant="ghost">料金を見る</TrackedLink>
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoCard title="適用シーン" items={page.useCases} />
        <InfoCard title="入力する情報" items={page.inputs} />
        <InfoCard
          title="確認観点（生成シートではありません）"
          items={page.reviewPoints}
        />
      </section>

      <Card className="rounded-2xl p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-300">
              Product document contract v1
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-50">
              製品が生成する正式{contract.sheets.length}シート
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            生成モード：{modeLabels.join("・")}
          </p>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          以下は実際のExcel出力と同じシート名・列順です。入力情報が不足しているセルは空欄になるため、生成後のレビューが必要です。
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {contract.sheets.map((sheet, index) => (
            <section
              key={sheet.name}
              className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
            >
              <h3 className="font-semibold text-slate-100">
                {index + 1}. {sheet.workbookName}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                列：{sheet.columns.join(" / ")}
              </p>
            </section>
          ))}
        </div>
      </Card>

      <Card className="rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-50">よくある質問</h2>
        <div className="mt-6 divide-y divide-slate-800">
          {page.faq.map((item) => (
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
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
        {items.map((item) => (
          <li key={item} className="border-l border-amber-300/40 pl-3">
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
