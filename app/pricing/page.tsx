import { PricingClient } from "@/components/pricing/pricing-client";
import { SectionTitle } from "@/components/section-title";

export default function PricingPage() {
  return (
    <div className="space-y-8 py-8">
      <SectionTitle
        kicker="Pricing"
        title="必要な文書枠だけ購入する。"
        body="まずは Docs Single で1文書を試す。まとめて作る場合は Business Pack で78文書枠を購入できます。"
      />
      <PricingClient />
    </div>
  );
}
