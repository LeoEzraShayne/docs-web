import Link from "next/link";

const supportEmail =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@docs.meritledger.org";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 text-sm text-slate-400">
        <div>
          <p className="font-semibold tracking-[0.24em] text-amber-300">DOCS</p>
          <p className="mt-1 text-slate-500">
            要件定義書・設計書・テスト仕様書をAIで整理し、Excel出力へ。
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              文書
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <Link href="/requirements-definition-ai">要件定義書AI</Link>
              <Link href="/basic-design-ai">基本設計書AI</Link>
              <Link href="/detailed-design-ai">詳細設計書AI</Link>
              <Link href="/unit-test-spec-ai">単体テスト仕様書AI</Link>
              <Link href="/integration-test-spec-ai">結合テスト仕様書AI</Link>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              リソース
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <Link href="/pricing">料金</Link>
              <Link href="/demo">デモ</Link>
              <Link href="/blog/requirements-definition-template">
                要件定義書テンプレート
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              法務
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <Link href="/terms">利用規約</Link>
              <Link href="/privacy">プライバシーポリシー</Link>
              <Link href="/specified-commercial-transaction">特定商取引法</Link>
              <Link href="/contact">お問い合わせ</Link>
            </div>
          </div>
        </div>
        <div className="text-slate-500 md:text-right">
          <p>{supportEmail}</p>
          <p>© 2026 Docs</p>
        </div>
      </div>
    </footer>
  );
}
