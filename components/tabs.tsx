"use client";

type TabsProps = {
  tabs: Array<{ key: string; label: string }>;
  active: string;
  onChange: (key: string) => void;
};

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const selected = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`rounded-md border px-3 py-2 text-sm ${
              selected
                ? "border-amber-400/80 bg-amber-400/10 text-amber-200"
                : "border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-100"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
