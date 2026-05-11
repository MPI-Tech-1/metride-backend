/**
 * Percent change from previous period to current (e.g. MoM-style).
 * Returns a whole number percentage; positive means growth vs previous period.
 */
export default function computeMetricChangePercent(
  previousPeriodValue: number,
  currentPeriodValue: number
): number {
  if (previousPeriodValue === 0 && currentPeriodValue === 0) {
    return 0
  }
  if (previousPeriodValue === 0) {
    return 100
  }
  return Math.round(((currentPeriodValue - previousPeriodValue) / previousPeriodValue) * 100)
}
