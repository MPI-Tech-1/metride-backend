import { DateTime } from 'luxon'

interface TimeOptionsInterface {
  /**
   * The Current DateTime value which serves as the base
   */
  currentDateTime?: DateTime

  /**
   * The Time Duration in the future
   */
  futureTimeDuration: number

  /**
   * Determines the time to be added to the date
   */
  timeComponent?: 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'
}

function generateFutureDateTime(dateTimeOptions: TimeOptionsInterface): DateTime {
  const {
    currentDateTime = DateTime.now(),
    futureTimeDuration,
    timeComponent = 'minutes',
  } = dateTimeOptions

  if (timeComponent === 'months') {
    return currentDateTime.plus({ months: futureTimeDuration })
  }

  if (timeComponent === 'weeks') {
    return currentDateTime.plus({ weeks: futureTimeDuration })
  }

  if (timeComponent === 'days') {
    return currentDateTime.plus({ days: futureTimeDuration })
  }

  if (timeComponent === 'hours') {
    return currentDateTime.plus({ hours: futureTimeDuration })
  }

  if (timeComponent === 'seconds') {
    return currentDateTime.plus({ seconds: futureTimeDuration })
  }

  if (timeComponent === 'milliseconds') {
    return currentDateTime.plus(futureTimeDuration)
  }

  // Default output futureDateTime in minutes
  return currentDateTime.plus({ minutes: futureTimeDuration })
}

export default generateFutureDateTime
