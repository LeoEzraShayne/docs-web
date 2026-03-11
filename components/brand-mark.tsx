import Link from "next/link";

export function BrandMark({ surface = "dark" }: { surface?: "dark" | "light" }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div
        className={`brand-badge micro-grid flex h-10 w-10 items-center justify-center rounded-sm border text-lg font-bold ${
          surface === "light"
            ? "border-zinc-300 bg-white text-zinc-900"
            : "border-amber-400/30 bg-slate-900 text-amber-300"
        }`}
      >
        D
      </div>
      <div>
        <p
          className={`text-xs uppercase tracking-[0.28em] ${
            surface === "light" ? "text-zinc-500" : "text-slate-500"
          }`}
        >
          Requirement Terminal
        </p>
        <p
          className={`text-sm font-semibold ${
            surface === "light" ? "text-zinc-950" : "text-slate-100"
          }`}
        >
          Docs
        </p>
      </div>
    </Link>
  );
}
