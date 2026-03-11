import { Card } from "@/components/card";

export default function TermsPage() {
  return (
    <div className="space-y-6 py-8">
      <Card className="rounded-2xl p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          Terms of Service
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-50">利用規約</h1>
        <div className="mt-6 space-y-5 text-sm leading-8 text-slate-300">
          <p>
            Docs は、ユーザーが入力した情報をもとに要件定義のプレビューおよび Excel
            形式の成果物を生成する Web サービスです。
          </p>
          <p>
            ユーザーは、法令、公序良俗、第三者の権利を侵害しない範囲で本サービスを利用しなければなりません。認証情報の共有や不正アクセスは禁止します。
          </p>
          <p>
            生成物はユーザーの入力内容に依存するため、最終的な業務利用前にユーザー自身がレビューし、必要な修正を行う責任を負います。
          </p>
          <p>
            One-shot 購入後の生成済み成果物は原則として返金対象外です。定期プランはいつでも次回更新停止のための解約が可能ですが、当月分の日割り返金は原則行いません。
          </p>
        </div>
      </Card>
    </div>
  );
}
