import { Card } from "@/components/card";

export default function PrivacyPage() {
  return (
    <div className="space-y-6 py-8">
      <Card className="rounded-2xl p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
          Privacy Policy
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-50">
          プライバシーポリシー
        </h1>
        <div className="mt-6 space-y-5 text-sm leading-8 text-slate-300">
          <p>
            Docs は、要件定義生成サービスの提供に必要な範囲で、メールアドレス、Google
            ログイン識別子、入力フォーム内容、議事録、生成結果、決済状態、アクセスログを取り扱います。
          </p>
          <p>
            入力された議事録と生成結果は、プロジェクト履歴管理と再ダウンロードのために保存されます。法令上必要な場合を除き、本人の同意なく第三者へ販売しません。
          </p>
          <p>
            メール送信には Resend、要件抽出には OpenAI、決済には Stripe、認証には Google
            を利用する場合があります。各第三者サービスは、それぞれの利用規約とプライバシーポリシーに従って処理を行います。
          </p>
          <p>
            ユーザーは、サポート窓口を通じて自己データの削除または利用停止を依頼できます。ただし、法令または会計上保持が必要な情報は除きます。
          </p>
          <p>
            サービス改善のため、同意をいただいた場合に限り Google Analytics 4
            を利用します。同意状態はブラウザのローカルストレージの「docs-analytics-consent」に保存します。計測対象は閲覧ページ、テンプレートと生成Excelのダウンロード、チェックリストのコピー・出力、デモ・ログイン・料金ページへの導線、案件作成、文書生成の開始・成功、決済開始・完了です。メールアドレス、入力文書、プロジェクトID、決済識別子は送信しません。
          </p>
          <p>
            同意しない場合もサービスを利用できます。フッターの「Cookie設定」から現在の状態を確認し、いつでも拒否または同意を撤回できます。撤回時は保存済みの選択を拒否状態へ変更し、Google Analytics関連Cookieを削除して、その後のイベント送信を停止します。
          </p>
        </div>
      </Card>
    </div>
  );
}
