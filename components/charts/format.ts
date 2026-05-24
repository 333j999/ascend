// Format strings — used by chart components so server components
// don't have to pass a function across the RSC boundary.

export type ValueFormat =
  | "currency"          // $1,234
  | "currencyK"         // $1.2k
  | "weight"            // 88kg
  | "hours"             // 7.4h
  | "score"             // 87
  | "number"            // 1,234
  | "compact";          // 1.2k

export function applyFormat(v: number, f: ValueFormat = "number"): string {
  switch (f) {
    case "currency":
      return `$${Math.round(v).toLocaleString()}`;
    case "currencyK":
      // Auto-scale: tiny amounts stay in $X form, thousands shorten to $X.Xk
      if (v < 1000) return `$${Math.round(v)}`;
      if (v < 10_000) return `$${(v / 1000).toFixed(1)}k`;
      return `$${Math.round(v / 1000)}k`;
    case "weight":
      return `${v}kg`;
    case "hours":
      return `${v}h`;
    case "score":
      return `${Math.round(v)}`;
    case "compact":
      return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(v);
    case "number":
    default:
      return v.toLocaleString();
  }
}
