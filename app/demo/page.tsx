"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { DataTable } from "@/components/data-table";
import { Tabs } from "@/components/tabs";
import { api, formatApiError } from "@/lib/api";
import type { GenerateResponse } from "@/lib/types";

const demoTabs = [
  { key: "flow", label: "FLOW" },
  { key: "screens", label: "SCREENS" },
  { key: "functions", label: "FUNCTIONS" },
  { key: "nfr", label: "NFR" },
  { key: "risks_issues", label: "RISKS" },
  { key: "glossary", label: "GLOSSARY" },
];

export default function DemoPage() {
  const [data, setData] = useState<GenerateResponse | null>(null);
  const [activeTab, setActiveTab] = useState("flow");
  const [message, setMessage] = useState("読み込み中...");

  useEffect(() => {
    async function run() {
      try {
        const response = await api.demoPreview();
        setData(response);
        setMessage("");
      } catch (err) {
        const formatted = formatApiError(err);
        if (formatted.status === 429) {
          setMessage("しばらくしてから再度お試しください");
          return;
        }
        setMessage(formatted.message);
      }
    }

    void run();
  }, []);

  return (
    <div className="space-y-6 py-8">
      <Card className="rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300">
              Demo Preview
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50">
              無料デモ
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              デモではサーバー側で redaction された preview のみ表示します。
            </p>
          </div>
          <Link href="/login">
            <Button>¥980で作る</Button>
          </Link>
        </div>
      </Card>

      {data ? (
        <Card className="rounded-2xl p-6">
          <Tabs tabs={demoTabs} active={activeTab} onChange={setActiveTab} />
          <div className="mt-6">
            <DataTable rows={data.tabs[activeTab as keyof typeof data.tabs]} preview />
          </div>
        </Card>
      ) : (
        <Card className="rounded-2xl p-6 text-sm text-slate-400">{message}</Card>
      )}
    </div>
  );
}
