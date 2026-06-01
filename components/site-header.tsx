"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "./button";
import { BrandMark } from "./brand-mark";

const links = [
  { href: "/", label: "概要" },
  { href: "/pricing", label: "料金" },
  { href: "/demo", label: "デモ" },
  { href: "/contact", label: "お問い合わせ" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { status, user, refresh } = useAuth();

  async function handleLogout() {
    await api.logout();
    await refresh();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-900/80 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <BrandMark />

        <nav className="hidden items-center gap-5 text-sm text-slate-400 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "text-amber-300" : "hover:text-slate-100"}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="h-11 w-28 animate-pulse rounded-md border border-slate-800 bg-slate-900/70" />
          ) : status === "authenticated" ? (
            <>
              <div className="hidden rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-400 lg:block">
                {user?.email}
              </div>
              <Link href="/account">
                <Button variant="ghost">アカウント</Button>
              </Link>
              <Link href="/app">
                <Button>ワークスペース</Button>
              </Link>
              <Button variant="ghost" onClick={() => void handleLogout()}>
                ログアウト
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button>ログイン</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
