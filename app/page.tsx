import Link from "next/link";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { SectionTitle } from "@/components/section-title";

const highlights = [
  "Google ログイン + メール認証",
  "議事録から多シート要件定義を自動整理",
  "プレビュー確認後に Excel ダウンロード",
];

export default function HomePage() {
  return (
    <div className="space-y-10 py-8">
      <section className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <Card className="micro-grid overflow-hidden rounded-2xl p-8 md:p-10">
          <SectionTitle
            kicker="Requirement Terminal"
            title="Bloomberg みたいに、要件定義を手早く読む。"
            body="会議メモ、背景、目的、制約を入れるだけで、FLOW / SCREENS / FUNCTIONS / NFR / RISKS / GLOSSARY に整理したプレビューを返し、そのまま Excel 要件定義に落とします。"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login">
              <Button>¥980で1本作る</Button>
            </Link>
            <Link href="/demo">
              <Button variant="secondary">デモで試す</Button>
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
            Snapshot
          </p>
          <div className="mt-6 space-y-4">
            {[
              ["Flow", "利用者フローを段階化"],
              ["Functions", "機能要件を行単位で整理"],
              ["NFR", "性能・セキュリティ要件を抜き出し"],
              ["Risks", "要確認項目と判断待ちを洗い出し"],
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
            title: "無料 preview",
            body: "未購入でも毎日 1 回、要件定義の骨格を確認できます。",
          },
          {
            title: "Google login",
            body: "登録障壁を下げて、初回ログインを最短化します。",
          },
          {
            title: "Stripe checkout",
            body: "必要なときだけ 1 本購入。定期利用は月額プランへ移行できます。",
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
