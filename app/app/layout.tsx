import Link from "next/link";
import { AuthGate } from "@/components/auth-gate";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <div className="grid gap-6 py-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="panel rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Workspace
          </p>
          <nav className="mt-6 flex flex-col gap-3 text-sm text-slate-300">
            <Link href="/app">案件一覧</Link>
            <Link href="/app/new">新規案件</Link>
            <Link href="/account">アカウント</Link>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </AuthGate>
  );
}
