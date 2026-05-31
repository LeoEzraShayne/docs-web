import Link from "next/link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { JsonLd } from "@/components/seo/json-ld";
import { faqJsonLd, type SeoLandingPage } from "@/lib/seo";

export function SeoLandingPage({ page }: { page: SeoLandingPage }) {
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
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoCard title="適用シーン" items={page.useCases} />
        <InfoCard title="入力する情報" items={page.inputs} />
        <InfoCard title="生成される成果物" items={page.outputs} />
      </section>

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
