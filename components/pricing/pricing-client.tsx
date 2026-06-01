"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { documentTypeOptions } from "@/lib/document-labels";
import type { DocumentType } from "@/lib/types";

type Plan = {
  name: string;
  price: string;
  caption: string;
  items: string[];
  action?: "single" | "business";
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "¥0",
    caption: "毎日 preview 1 回",
    items: ["3案件まで作成", "プレビューは5行まで", "Excelダウンロード不可"],
  },
  {
    name: "Docs Single",
    price: "¥980",
    caption: "税込 / 1文書",
    action: "single",
    highlight: true,
    items: ["1文書枠", "購入日から7日有効", "開始後7日内に成功生成3回"],
  },
  {
    name: "Business Pack",
    price: "¥66,640",
    caption: "税込 / 78文書枠",
    action: "business",
    items: [
      "78文書枠",
      "購入日から12か月有効",
      "各文書は開始後7日内に成功生成3回",
    ],
  },
];

export function PricingClient() {
  const router = useRouter();
  const { status } = useAuth();
  const [loading, setLoading] = useState<Plan["action"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [singleType, setSingleType] = useState<DocumentType>("REQUIREMENTS");

  async function checkout(action: Plan["action"]) {
    if (!action) return;
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    try {
      setLoading(action);
      setError(null);
      const response =
        action === "business"
          ? await api.checkoutBusinessPack()
          : await api.checkoutSingleDocument(singleType);
      window.location.assign(response.url);
    } catch (err) {
      const formatted = formatApiError(err);
      setError(
        formatted.requestId
          ? `${formatted.message} | Request ID: ${formatted.requestId}`
          : formatted.message,
      );
      setLoading(null);
    }
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex h-full flex-col ${
              plan.highlight ? "border-amber-300/60" : ""
            }`}
          >
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              {plan.name}
            </p>
            <p className="mt-4 text-4xl font-bold text-slate-50">
              {plan.price}
            </p>
            <p className="mt-2 text-sm text-amber-200">{plan.caption}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {plan.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              {plan.action === "single" ? (
                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">
                    購入する文書
                  </span>
                  <select
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-amber-300"
                    value={singleType}
                    onChange={(event) =>
                      setSingleType(event.target.value as DocumentType)
                    }
                  >
                    {documentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              {plan.action ? (
                <Button
                  className="mt-6 w-full"
                  disabled={loading !== null}
                  onClick={() => void checkout(plan.action)}
                >
                  {loading === plan.action ? "遷移中..." : "購入する"}
                </Button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
      {error ? (
        <div className="rounded-lg border border-orange-500/40 bg-orange-950/30 p-4 text-sm text-orange-200">
          {error}
        </div>
      ) : null}
      <div className="flex gap-3">
        <Link href={status === "authenticated" ? "/app" : "/login"}>
          <Button>
            {status === "authenticated" ? "Workspaceへ" : "ログインして始める"}
          </Button>
        </Link>
        <Link href="/terms">
          <Button variant="secondary">利用規約を見る</Button>
        </Link>
      </div>
    </>
  );
}
