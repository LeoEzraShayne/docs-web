import { Button } from "@/components/button";

export function Pagination({
  page,
  total,
  totalPages,
  onPage,
  className = "",
}: {
  page: number;
  total: number;
  totalPages: number;
  onPage: (page: number) => void;
  className?: string;
}) {
  return (
    <div
      className={`mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400 ${className}`}
    >
      <span>
        {total}件中 {page} / {totalPages} ページ
      </span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          前へ
        </Button>
        <Button
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          次へ
        </Button>
      </div>
    </div>
  );
}
