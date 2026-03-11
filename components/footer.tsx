import Link from "next/link";

const supportEmail =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@docs.meritledger.org";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold tracking-[0.24em] text-amber-300">DOCS</p>
          <p className="mt-1 text-slate-500">
            要件定義を、議事録からすぐ業務で使える形に。
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/terms">利用規約</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
          <Link href="/specified-commercial-transaction">特定商取引法</Link>
          <Link href="/contact">お問い合わせ</Link>
        </div>
        <div className="text-right text-slate-500">
          <p>{supportEmail}</p>
          <p>© 2026 Docs</p>
        </div>
      </div>
    </footer>
  );
}
