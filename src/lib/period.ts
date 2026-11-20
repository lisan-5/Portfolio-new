/**
 * Experience periods are "MM/YYYY - MM/YYYY", "MM/YYYY - Present", or a bare "MM/YYYY"
 * for roles shown with a start date only (no end date stated).
 */
const nowMonths = () => {
  const d = new Date();
  return d.getFullYear() * 12 + d.getMonth();
};
const parse = (s: string) => {
  if (/present/i.test(s)) return nowMonths();
  const [m, y] = s.split("/").map(Number);
  return y * 12 + (m - 1);
};

export const isStartOnly = (period: string) => !period.includes("-");
export const isCurrent = (period: string) => /present/i.test(period);

/** Months covered; start-only periods count up to today. */
export function periodMonths(period: string) {
  const [a, b] = period.split("-").map((s) => s.trim());
  return Math.max(1, (b ? parse(b) : nowMonths()) - parse(a) + 1);
}

/** What to print: start-only periods read "From 07/2026". */
export const periodLabel = (period: string) => (isStartOnly(period) ? `From ${period.trim()}` : period);

export const fmtSpan = (n: number) =>
  n >= 12 ? `${Math.floor(n / 12)} yr ${n % 12 ? `${n % 12} mo` : ""}`.trim() : `${n} mo`;
