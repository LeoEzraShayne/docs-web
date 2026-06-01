"use client";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/button";
import { GoogleLoginButton } from "@/components/google-login-button";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

function LoginPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/app";
  const { refresh, status } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);
  const codeInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(next);
    }
  }, [next, router, status]);

  useEffect(() => {
    if (cooldown < 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  if (status === "loading") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-[500px] items-center justify-center py-8">
        <div className="panel w-full rounded-[28px] p-6 md:p-8">
          <div className="space-y-4">
            <BrandMark />
            <div className="space-y-3">
              <div className="h-10 w-48 animate-pulse rounded bg-slate-800" />
              <div className="h-5 w-full animate-pulse rounded bg-slate-800" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  async function startEmailLogin() {
    try {
      setLoading(true);
      setEmailError(null);
      setEmailNotice(null);
      const result = await api.startEmailLogin(email);
      if (result.emailSent === false && result.devCode) {
        setCode(result.devCode);
        setEmailNotice(`ローカル開発用コード: ${result.devCode}`);
      } else if (result.emailSent === false) {
        setEmailNotice("メール送信はスキップされました。");
      }
      setCooldown(60);
      window.setTimeout(() => codeInputRef.current?.focus(), 50);
    } catch (err) {
      setEmailError(formatLoginError(err));
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    try {
      setLoading(true);
      setEmailError(null);
      setEmailNotice(null);
      await api.verifyEmailLogin(email, code);
      await refresh();
      router.replace(next);
    } catch (err) {
      setEmailError(formatLoginError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[470px] items-center justify-center py-8">
      <div className="panel w-full rounded-[28px] p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="opacity-90">
            <BrandMark />
          </div>
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-slate-300 transition hover:bg-slate-900/70 hover:text-white"
          >
            ×
          </Link>
        </div>

        <div className="mt-6 w-full max-w-[860px] space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-3xl">
              ログイン
            </h1>
          </div>

          <div className="space-y-4">
            <GoogleLoginButton redirectTo={next} compact />

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-sm tracking-[0.24em] text-slate-500">
                または
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-[40px] w-full rounded-xl border border-slate-430 bg-slate-950/70 px-5 text-base text-slate-100 transition placeholder:text-slate-500 focus:border-amber-400/70"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                <input
                  type="text"
                  placeholder="6桁の認証コードを入力"
                  ref={codeInputRef}
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  className="h-[40px] min-w-0 flex-1 rounded-xl border border-slate-430 bg-slate-950/70 px-5 text-base text-slate-100 transition placeholder:text-slate-500 focus:border-amber-400/70"
                />
                <Button
                  className="h-[40px] w-full shrink-0 rounded-xl text-sm sm:w-[132px]"
                  disabled={loading || !email || cooldown > 0}
                  onClick={() => void startEmailLogin()}
                >
                  {cooldown > 0 ? `${cooldown}s後に再送` : "コード送信"}
                </Button>
              </div>
              <Button
                className="h-[40px] w-full rounded-xl text-base"
                disabled={loading || !email || code.length !== 6}
                onClick={() => void verifyCode()}
              >
                認証してログイン
              </Button>

              {emailError ? (
                <p className="text-sm text-orange-300">{emailError}</p>
              ) : null}
              {emailNotice ? (
                <p className="text-sm text-amber-200">{emailNotice}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatLoginError(error: unknown) {
  const { message } = formatApiError(error);
  if (
    message === "Please wait 60 seconds before retrying" ||
    message === "60秒後にもう一度お試しください。"
  ) {
    return "60秒後にもう一度お試しください。";
  }
  if (
    message === "Too many requests from this IP" ||
    message ===
      "アクセスが集中しています。しばらくしてからもう一度お試しください。"
  ) {
    return "アクセスが集中しています。しばらくしてからもう一度お試しください。";
  }
  if (
    message === "Invalid code" ||
    message === "認証コードが正しくありません。"
  ) {
    return "認証コードが正しくありません。";
  }
  return message;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-8 text-sm text-slate-400">読み込み中...</div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
