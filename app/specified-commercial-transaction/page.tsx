import { Card } from "@/components/card";

const supportEmail =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@docs.meritledger.org";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://docs.meritledger.org";

export default function SpecifiedCommercialTransactionPage() {
  return (
    <div className="space-y-6 py-8">
      <Card className="rounded-2xl p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          特定商取引法
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-50">
          特定商取引法に基づく表記
        </h1>
        <div className="mt-6 space-y-6 text-sm leading-8 text-slate-300">
          <section>
            <h2 className="font-semibold text-slate-100">基本情報</h2>
            <p>サービス名称: Docs</p>
            <p>サイト名称: Docs</p>
            <p>運営者名称: Docs 運営事務局</p>
            <p>責任者: 請求があれば遅滞なく開示します</p>
            <p>連絡先メール: {supportEmail}</p>
            <p>電話番号: 請求があれば遅滞なく開示します</p>
            <p>所在地: 請求があれば遅滞なく開示します</p>
            <p>公式サイト: {siteUrl}</p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-100">サービス内容</h2>
            <p>
              本サービスは、議事録や背景情報から要件定義プレビューおよび Excel
              要件定義書を生成するオンラインツールです。
            </p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-100">販売価格</h2>
            <p>
              価格は購入ページ、料金ページ、決済ページに表示された金額（税込）によります。
            </p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-100">支払方法</h2>
            <p>Stripe を通じたクレジットカード等のオンライン決済</p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-100">支払時期</h2>
            <p>
              一回購入は注文時、定期課金は申込時および各更新日に課金されます。
            </p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-100">サービス提供時期</h2>
            <p>
              決済または認証完了後、直ちにプレビュー、ダウンロード、または契約中プランの機能を利用できます。
            </p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-100">返品・キャンセル</h2>
            <p>
              デジタルサービスの性質上、生成済み成果物の返金は原則不可です。重複課金やシステム障害等は個別に対応します。定期課金は次回更新前までに解約可能です。
            </p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-100">必要な環境</h2>
            <p>
              最新の主要ブラウザ、インターネット接続、メール受信可能環境が必要です。
            </p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-100">最終更新日</h2>
            <p>2026年03月11日</p>
          </section>
        </div>
      </Card>
    </div>
  );
}
