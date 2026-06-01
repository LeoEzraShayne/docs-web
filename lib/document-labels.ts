import type { DocumentType } from "./types";

export const documentTypeOptions: Array<{
  value: DocumentType;
  label: string;
}> = [
  { value: "REQUIREMENTS", label: "要件定義書" },
  { value: "BASIC_DESIGN", label: "基本設計書" },
  { value: "DETAILED_DESIGN", label: "詳細設計書" },
  { value: "UNIT_TEST", label: "単体テスト仕様書" },
  { value: "INTEGRATION_TEST", label: "結合テスト仕様書" },
];

export function documentTypeLabel(type: DocumentType | null | undefined) {
  return documentTypeOptions.find((option) => option.value === type)?.label ?? "";
}
