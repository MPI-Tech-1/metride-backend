import type { DateTime } from 'luxon'

/**
 * Formats a Luxon DateTime the same way Lucid stores timestamps: wall-clock time in
 * the server's zone (UTC in production, TZ=UTC). Use it for raw where-clauses so a
 * DateTime in another zone (e.g. Africa/Lagos) is compared against the right moment.
 */
export default function toSqlDateTime(dateTime: DateTime): string {
  return dateTime.toLocal().toFormat('yyyy-MM-dd HH:mm:ss')
}
