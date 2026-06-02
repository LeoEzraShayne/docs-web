import { formatDate, StatusBadge } from "./account-summary";
import type { AccountUsageResponse } from "@/lib/types";

export function DocumentUsageTable({
  usage,
  page = 1,
  pageSize,
}: {
  usage: AccountUsageResponse | null;
  page?: number;
  pageSize?: number;
}) {
  const showRemaining = !usage?.summary.hasBusinessPack;
  const allDocs = usage?.documents ?? [];
  const docs = pageSize
    ? allDocs.slice((page - 1) * pageSize, page * pageSize)
    : allDocs;
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
          <tr className="border-b border-slate-800">
            <th className="py-3 pr-4">案件</th>
            <th className="py-3 pr-4">文書</th>
            <th className="py-3 pr-4">生成回数</th>
            {showRemaining ? <th className="py-3 pr-4">残り生成回数</th> : null}
            <th className="py-3 pr-4">有効期限</th>
            <th className="py-3 pr-4">状態</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.documentId} className="border-b border-slate-900">
              <td className="py-4 pr-4 text-slate-200">
                {doc.projectTitle ?? "-"}
              </td>
              <td className="py-4 pr-4 text-slate-200">{doc.documentTitle}</td>
              <td className="py-4 pr-4 text-amber-200">{doc.generationCount}</td>
              {showRemaining ? (
                <td className="py-4 pr-4 text-slate-200">
                  {doc.remainingGenerations ?? 0}
                </td>
              ) : null}
              <td className="py-4 pr-4 text-slate-300">
                {formatDate(doc.expiresAt)}
              </td>
              <td className="py-4 pr-4">
                <StatusBadge status={doc.status} />
              </td>
            </tr>
          ))}
          {docs.length === 0 ? (
            <tr>
              <td className="py-6 text-slate-500" colSpan={showRemaining ? 6 : 5}>
                まだ文書生成の利用状況はありません。
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
