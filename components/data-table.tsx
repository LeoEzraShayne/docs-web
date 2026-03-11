type DataTableProps = {
  rows: Array<Record<string, unknown>>;
  preview?: boolean;
};

export function DataTable({ rows, preview = false }: DataTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-700 p-6 text-sm text-slate-500">
        数据为空
      </div>
    );
  }

  const columns = Array.from(
    rows.reduce<Set<string>>((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set<string>()),
  );

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-800 ${preview ? "watermark" : ""}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/90 text-xs uppercase tracking-[0.24em] text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="border-b border-slate-800 px-4 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/50">
            {rows.map((row, index) => (
              <tr key={`${index}-${JSON.stringify(row)}`} className="align-top">
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3 text-slate-200">
                    {String(row[column] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
