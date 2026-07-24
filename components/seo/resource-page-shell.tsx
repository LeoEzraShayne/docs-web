import { Card } from "@/components/card";
import { JsonLd } from "@/components/seo/json-ld";
import { TrackedLink } from "@/components/seo/tracked-link";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  type FaqItem,
} from "@/lib/seo";

export function ResourcePageShell({
  kicker,
  title,
  description,
  path,
  faq,
  primary,
  children,
}: {
  kicker: string;
  title: string;
  description: string;
  path: string;
  faq: FaqItem[];
  primary: { href: string; label: string; download?: string };
  children: React.ReactNode;
}) {
  const download = Boolean(primary.download);
  return (
    <article className="space-y-8 py-8">
      <JsonLd data={articleJsonLd({ title, description, path })} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: title, path },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />
      <Card className="micro-grid rounded-2xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          {kicker}
        </p>
        <h1 className="mt-4 max-w-5xl text-4xl font-bold leading-tight text-slate-50 md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <TrackedLink
            href={primary.href}
            download={primary.download}
            eventName={download ? "template_download" : "seo_demo_click"}
            ctaPosition={`${path}:hero-primary`}
            assetName={primary.download}
          >
            {primary.label}
          </TrackedLink>
          <TrackedLink
            href="/demo"
            eventName="seo_demo_click"
            ctaPosition={`${path}:hero-demo`}
            variant="secondary"
          >
            無料デモを試す
          </TrackedLink>
          <TrackedLink
            href="/login"
            eventName="seo_signup_click"
            ctaPosition={`${path}:hero-login`}
            variant="ghost"
          >
            AIで文書を作成する
          </TrackedLink>
        </div>
      </Card>

      {children}

      <Card className="rounded-2xl border-amber-400/20 p-8">
        <h2 className="text-2xl font-bold text-slate-50">
          自分の案件で要件定義書を作成する
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          無料デモで出力イメージを確認し、必要な場合だけログインして案件の文書を作成できます。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <TrackedLink href="/demo" eventName="seo_demo_click" ctaPosition={`${path}:closing-demo`}>
            無料デモを試す
          </TrackedLink>
          <TrackedLink href="/login" eventName="seo_signup_click" ctaPosition={`${path}:closing-login`} variant="secondary">
            ログインして作成する
          </TrackedLink>
          <TrackedLink href="/pricing" eventName="seo_pricing_click" ctaPosition={`${path}:closing-pricing`} variant="ghost">
            料金を見る
          </TrackedLink>
        </div>
      </Card>

      <Card className="rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-50">よくある質問</h2>
        <div className="mt-6 divide-y divide-slate-800">
          {faq.map((item) => (
            <div key={item.question} className="py-5 first:pt-0 last:pb-0">
              <h3 className="font-semibold text-slate-100">{item.question}</h3>
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
