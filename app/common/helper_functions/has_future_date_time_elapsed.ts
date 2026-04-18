import { DateTime } from 'luxon'

type DatesForComparisonType = {
  /**
   * This is the current DateTime when the function was called
   */
  currentDateTime?: DateTime

  /**
   * The future DateTime to be compared
   */
  futureDateTime: DateTime
}

const hasFutureDateTimeElapsed = (datesForComparison: DatesForComparisonType): boolean => {
  const { currentDateTime = DateTime.now(), futureDateTime } = datesForComparison

  return currentDateTime.diff(futureDateTime).milliseconds >= 0
}

export default hasFutureDateTimeElapsed
