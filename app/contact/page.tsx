import { Card } from "@/components/card";

const supportEmail =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@docs.meritledger.org";
const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@docs.meritledger.org";

export default function ContactPage() {
  return (
    <div className="space-y-6 py-8">
      <Card className="rounded-2xl p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          Contact
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-50">お問い合わせ</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          サービス仕様、請求、返金、障害、法人導入については以下の窓口を利用してください。
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <p className="text-sm font-semibold text-slate-100">Support</p>
            <p className="mt-2 text-sm text-slate-400">{supportEmail}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <p className="text-sm font-semibold text-slate-100">General Contact</p>
            <p className="mt-2 text-sm text-slate-400">{contactEmail}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
