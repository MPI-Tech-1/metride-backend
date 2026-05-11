/**
 * Admin dashboard KPI card shape (matches rolling-period comparisons where applicable).
 */
export default interface DashboardMetricCard {
  /** Primary number shown on the card */
  value: number
  /** vs previous period of same length (e.g. previous 30 days); null when not applicable */
  changePercentVsPreviousPeriod: number | null
  previousPeriodValue: number | null
  currentPeriodValue: number | null
  /** When the % trend is computed from a different basis than `value` (e.g. all-time total vs signup momentum) */
  trendBasis?: string
}
