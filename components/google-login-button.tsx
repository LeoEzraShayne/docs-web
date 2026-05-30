"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "./button";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleLoginButton({
  redirectTo = "/app",
  surface = "dark",
  compact = false,
  onError,
}: {
  redirectTo?: string;
  surface?: "dark" | "light";
  compact?: boolean;
  onError?: (message: string | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const initializedRef = useRef(false);
  const router = useRouter();
  const { refresh } = useAuth();

  useEffect(() => {
    if (!CLIENT_ID) {
      setError("Google Client ID 未设置");
      return;
    }

    if (window.google) {
      setGoogleReady(true);
      return;
    }

    let cancelled = false;
    let pollTimer: number | null = null;
    const script = document.createElement("script");
    const existing = document.getElementById(
      "google-identity-script",
    ) as HTMLScriptElement | null;

    const markReady = () => {
      if (!cancelled && window.google) {
        setGoogleReady(true);
        setError(null);
        onError?.(null);
      }
    };

    const markError = () => {
      if (!cancelled) {
        const message =
          "Google 登录按钮加载失败，请刷新页面或使用邮箱验证码登录。";
        setError(message);
        onError?.(message);
      }
    };

    if (existing) {
      existing.addEventListener("load", markReady);
      existing.addEventListener("error", markError);
      pollTimer = window.setInterval(() => {
        if (window.google) {
          markReady();
          if (pollTimer) {
            window.clearInterval(pollTimer);
          }
        }
      }, 150);
    } else {
      script.id = "google-identity-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = markReady;
      script.onerror = markError;
      document.body.appendChild(script);
    }

    window.setTimeout(() => {
      if (!cancelled && !window.google) {
        markError();
      }
    }, 5000);

    return () => {
      cancelled = true;
      if (existing) {
        existing.removeEventListener("load", markReady);
        existing.removeEventListener("error", markError);
      }
      if (pollTimer) {
        window.clearInterval(pollTimer);
      }
    };
  }, [onError]);

  useEffect(() => {
    if (
      !googleReady ||
      !CLIENT_ID ||
      !window.google ||
      initializedRef.current
    ) {
      return;
    }

    initializedRef.current = true;
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: async ({ credential }) => {
        try {
          setSubmitting(true);
          setError(null);
          onError?.(null);
          await api.verifyGoogleLogin(credential);
          await refresh();
          router.replace(redirectTo);
        } catch (err) {
          const formatted = formatApiError(err);
          const message = formatted.requestId
            ? `${formatted.message} | Request ID: ${formatted.requestId}`
            : formatted.message;
          setError(message);
          onError?.(message);
        } finally {
          setSubmitting(false);
        }
      },
    });
  }, [googleReady, onError, redirectTo, refresh, router]);

  const handleGoogleLogin = () => {
    if (!window.google) {
      const message =
        "Google 登录按钮加载失败，请刷新页面或使用邮箱验证码登录。";
      setError(message);
      onError?.(message);
      return;
    }

    setError(null);
    onError?.(null);
    window.google.accounts.id.prompt();
  };

  return (
    <div className="space-y-2">
      {!googleReady ? (
        <Button
          type="button"
          disabled
          className={
            surface === "light"
              ? "flex h-14 w-full justify-center rounded-xl border-zinc-300 bg-white text-zinc-500 hover:bg-white"
              : compact
                ? "flex h-[52px] w-full justify-center rounded-xl border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-slate-900/80"
                : "flex h-12 w-full justify-center rounded-lg border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-slate-900/80"
          }
        >
          {error
            ? "Google ログインは現在利用できません"
            : "Google ログインを読み込み中..."}
        </Button>
      ) : null}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={!googleReady || submitting}
        className={`${googleReady ? "google-login-button" : "hidden"}`}
      >
        <div className="google-login-visual">
          <span className="google-login-avatar">G</span>
          <span className="google-login-text">Google で続ける</span>
        </div>
      </button>
      {submitting ? (
        <p
          className={
            surface === "light"
              ? "text-sm text-zinc-700"
              : "text-sm text-amber-200"
          }
        >
          Google アカウントを確認しています...
        </p>
      ) : null}
      {error ? (
        <p
          className={
            surface === "light"
              ? "text-sm text-red-600"
              : "text-sm text-orange-300"
          }
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
