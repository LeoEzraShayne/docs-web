const COUNT_LIMIT = 999_999;

export function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("ja-JP").format(value ?? 0);
}

export function formatCount(value: number | null | undefined) {
  const normalized = Math.max(0, Math.floor(value ?? 0));
  if (normalized > COUNT_LIMIT) return `${formatNumber(COUNT_LIMIT)}+`;
  return formatNumber(normalized);
}
