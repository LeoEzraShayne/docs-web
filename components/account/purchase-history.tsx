import type { PurchaseHistoryResponse } from "@/lib/types";

export const purchasePageSizes = [10, 30, 50];

export function PurchaseHistoryTable({
  history,
}: {
  history: PurchaseHistoryResponse | null;
}) {
  const items = history?.items ?? [];
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[780px] text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
          <tr className="border-b border-slate-800">
            <th className="py-3 pr-4">購入日時</th>
            <th className="py-3 pr-4">商品名</th>
            <th className="py-3 pr-4">対象文書</th>
            <th className="py-3 pr-4">金額</th>
            <th className="py-3 pr-4">支払い状態</th>
            <th className="py-3 pr-4">付与内容</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-900">
              <td className="py-4 pr-4 text-slate-300">
                {new Date(item.purchasedAt).toLocaleString("ja-JP")}
              </td>
              <td className="py-4 pr-4 text-slate-200">{item.productName}</td>
              <td className="py-4 pr-4 text-slate-300">
                {item.projectTitle ? (
                  <span className="block text-slate-200">{item.projectTitle}</span>
                ) : null}
                <span className="block">{item.documentTitle ?? "全文書"}</span>
              </td>
              <td className="py-4 pr-4 text-slate-200">
                {item.status === "applied"
                  ? "購入済み枠"
                  : `¥${item.amountJpy.toLocaleString("ja-JP")}`}
              </td>
              <td className="py-4 pr-4 text-slate-300">
                {purchaseStatusLabel(item.status)}
              </td>
              <td className="py-4 pr-4 text-slate-300">
                {item.grantedContent}
              </td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td className="py-6 text-slate-500" colSpan={6}>
                購入履歴はありません。
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function purchaseStatusLabel(status: string) {
  if (status === "paid") return "購入成功";
  if (status === "applied") return "適用済み";
  if (status === "unpaid") return "未払い";
  if (status === "no_payment_required") return "支払い不要";
  return status;
}
