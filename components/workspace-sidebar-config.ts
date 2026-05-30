import type { DocumentType } from "@/lib/types";

export const workspaceLinks = [
  { href: "/app/new", label: "新規案件" },
  { href: "/app", label: "案件一覧" },
  { href: "/account", label: "アカウント" },
];

export const documentTreeNodes: Array<{
  type: DocumentType;
  label: string;
  slug: string;
}> = [
  { type: "REQUIREMENTS", label: "要件定義書", slug: "requirements" },
  { type: "BASIC_DESIGN", label: "基本設計書", slug: "basic-design" },
  { type: "DETAILED_DESIGN", label: "詳細設計書", slug: "detailed-design" },
  { type: "UNIT_TEST", label: "単体テスト仕様書", slug: "unit-test" },
  {
    type: "INTEGRATION_TEST",
    label: "結合テスト仕様書",
    slug: "integration-test",
  },
];

export function navClass(active: boolean) {
  return `rounded-md px-3 py-2 ${
    active
      ? "bg-amber-400/10 text-amber-200"
      : "text-slate-300 hover:bg-slate-900/70 hover:text-slate-100"
  }`;
}

export function treeClass(active: boolean) {
  return `block rounded px-2 py-1 text-xs ${
    active
      ? "bg-amber-400/10 text-amber-200"
      : "text-slate-400 hover:bg-slate-900/70 hover:text-slate-100"
  }`;
}

export function versionClass(active: boolean) {
  return `block rounded px-2 py-1 text-xs ${
    active
      ? "text-amber-200"
      : "text-slate-500 hover:bg-slate-900/70 hover:text-slate-200"
  }`;
}
