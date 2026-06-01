import type { DocumentFieldConfig } from "@/lib/document-configs";
import { documentCommonCopy } from "@/lib/copy/document-page-copy";
import type { DocumentSourceType } from "@/lib/types";

export function visibleFields(fields: DocumentFieldConfig[], sourceType: DocumentSourceType) {
  return fields.filter((field) => !field.sources || field.sources.includes(sourceType));
}

export function DocumentFields({
  fields,
  values,
  checks,
  onValue,
  onChecks,
}: {
  fields: DocumentFieldConfig[];
  values: Record<string, string>;
  checks: Record<string, string[]>;
  onValue: (key: string, value: string) => void;
  onChecks: (key: string, value: string[]) => void;
}) {
  return (
    <div className="grid gap-4">
      {fields.map((field) => field.kind === "checkboxes" ? (
        <fieldset key={field.key} className="space-y-3">
          <legend className="text-sm text-slate-300">{field.label}</legend>
          <div className="grid gap-2 md:grid-cols-2">
            {(field.options ?? []).map((option) => {
              const selected = checks[field.key] ?? [];
              return (
                <label key={option} className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={selected.includes(option)} onChange={(event) => onChecks(field.key, event.target.checked ? [...selected, option] : selected.filter((item) => item !== option))} />
                  {option}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : (
        <label key={field.key} className="space-y-2">
          <span className="text-sm text-slate-300">{field.label}{field.required ? <span className="ml-2 text-xs text-amber-300">{documentCommonCopy.required}</span> : null}</span>
          <textarea rows={4} value={values[field.key] ?? ""} placeholder={field.placeholder} maxLength={field.maxLength} onChange={(event) => onValue(field.key, event.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500" />
          {field.maxLength ? <p className="text-right text-xs text-slate-500">{values[field.key]?.length ?? 0} / {field.maxLength}</p> : null}
        </label>
      ))}
    </div>
  );
}
