import Link from "next/link";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { SectionTitle } from "@/components/section-title";

const plans = [
  {
    name: "Free",
    price: "¥0",
    caption: "毎日 preview 1 回",
    items: ["3案件まで作成", "プレビューは5行まで", "Excelダウンロード不可"],
  },
  {
    name: "One-shot",
    price: "¥980",
    caption: "税込 / 1本",
    items: ["標準品質 export 1 回", "同バージョン再ダウンロード可", "まず1本だけ試せる"],
  },
  {
    name: "Starter",
    price: "¥2,980",
    caption: "税込 / 月",
    items: ["10本 / 月", "標準品質 export", "継続案件向け"],
  },
  {
    name: "Pro",
    price: "¥9,800",
    caption: "税込 / 月",
    items: ["50本 / 月", "high 品質 export", "用語整理強化"],
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-8 py-8">
      <SectionTitle
        kicker="Pricing"
        title="必要な分だけ払う。定常運用なら月額へ。"
        body="最初は One-shot で業務で使えるかを見る。その後、利用量に応じて Starter / Pro に移すのが一番無駄が少ない構成です。"
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.name} className="rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              {plan.name}
            </p>
            <p className="mt-4 text-4xl font-bold text-slate-50">{plan.price}</p>
            <p className="mt-2 text-sm text-amber-200">{plan.caption}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {plan.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href="/login">
          <Button>ログインして始める</Button>
        </Link>
        <Link href="/terms">
          <Button variant="secondary">利用規約を見る</Button>
        </Link>
      </div>
    </div>
  );
}
