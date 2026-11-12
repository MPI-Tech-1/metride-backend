import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import DriverOnlineRewardService from '#services/driver_online_reward_service'

const setting = {
  windowStartTime: '07:00',
  windowEndTime: '09:00',
  acceptanceTimeoutMinutes: 5,
}

const window = DriverOnlineRewardService.getRewardWindow('2026-11-10', setting)

/** Lagos wall-clock time on the test date. */
function lagos(time: string) {
  return DateTime.fromISO(`2026-11-10T${time}`, { zone: 'Africa/Lagos' })
}

test.group('DriverOnlineRewardService.getRewardWindow', () => {
  test('builds the window in Lagos time', ({ assert }) => {
    assert.equal(window.windowStart.toUTC().toISO(), '2026-11-10T06:00:00.000Z')
    assert.equal(window.windowEnd.toUTC().toISO(), '2026-11-10T08:00:00.000Z')
    assert.equal(window.windowMinutes, 120)
  })
})

test.group('DriverOnlineRewardService.computeOnlineMinutes', () => {
  const now = lagos('09:30')

  test('clips sessions to the window', ({ assert }) => {
    const minutes = DriverOnlineRewardService.computeOnlineMinutes(
      [{ startedAt: lagos('06:00'), endedAt: lagos('10:00') }],
      window,
      now
    )
    assert.equal(minutes, 120)
  })

  test('merges overlapping sessions instead of double counting', ({ assert }) => {
    const minutes = DriverOnlineRewardService.computeOnlineMinutes(
      [
        { startedAt: lagos('07:00'), endedAt: lagos('08:30') },
        { startedAt: lagos('08:00'), endedAt: lagos('09:00') },
      ],
      window,
      now
    )
    assert.equal(minutes, 120)
  })

  test('counts gaps between sessions as offline', ({ assert }) => {
    const minutes = DriverOnlineRewardService.computeOnlineMinutes(
      [
        { startedAt: lagos('07:00'), endedAt: lagos('07:30') },
        { startedAt: lagos('08:00'), endedAt: lagos('09:00') },
      ],
      window,
      now
    )
    assert.equal(minutes, 90)
  })

  test('counts an open session up to now', ({ assert }) => {
    const minutes = DriverOnlineRewardService.computeOnlineMinutes(
      [{ startedAt: lagos('07:00'), endedAt: null }],
      window,
      lagos('08:15')
    )
    assert.equal(minutes, 75)
  })

  test('ignores sessions outside the window', ({ assert }) => {
    const minutes = DriverOnlineRewardService.computeOnlineMinutes(
      [{ startedAt: lagos('05:00'), endedAt: lagos('06:59') }],
      window,
      now
    )
    assert.equal(minutes, 0)
  })
})

test.group('DriverOnlineRewardService.isMissedAssignment', () => {
  const assignedAt = lagos('08:00')

  test('a rejected ride is missed', ({ assert }) => {
    assert.isTrue(
      DriverOnlineRewardService.isMissedAssignment(
        { response: 'rejected', assignedAt, respondedAt: lagos('08:01') },
        5
      )
    )
  })

  test('accepting within the timeout is not missed', ({ assert }) => {
    assert.isFalse(
      DriverOnlineRewardService.isMissedAssignment(
        { response: 'accepted', assignedAt, respondedAt: lagos('08:04') },
        5
      )
    )
  })

  test('accepting after the timeout is missed', ({ assert }) => {
    assert.isTrue(
      DriverOnlineRewardService.isMissedAssignment(
        { response: 'accepted', assignedAt, respondedAt: lagos('08:06') },
        5
      )
    )
  })

  test('never responding is missed once the timeout has passed', ({ assert }) => {
    assert.isTrue(
      DriverOnlineRewardService.isMissedAssignment(
        { response: 'pending', assignedAt, respondedAt: null },
        5,
        lagos('08:06')
      )
    )
  })

  test('a pending ride still inside its timeout is not missed yet', ({ assert }) => {
    assert.isFalse(
      DriverOnlineRewardService.isMissedAssignment(
        { response: 'pending', assignedAt, respondedAt: null },
        5,
        lagos('08:03')
      )
    )
  })

  test('an admin cancelling before the timeout does not count against the driver', ({ assert }) => {
    assert.isFalse(
      DriverOnlineRewardService.isMissedAssignment(
        { response: 'cancelled', assignedAt, respondedAt: lagos('08:02') },
        5
      )
    )
  })

  test('a reassignment after the timeout counts as missed', ({ assert }) => {
    assert.isTrue(
      DriverOnlineRewardService.isMissedAssignment(
        { response: 'reassigned', assignedAt, respondedAt: lagos('08:10') },
        5
      )
    )
  })
})

test.group('DriverOnlineRewardService.canEvaluateWindow', () => {
  test('waits for the acceptance timeout after the window ends', ({ assert }) => {
    assert.isFalse(DriverOnlineRewardService.canEvaluateWindow(window, setting, lagos('09:04')))
    assert.isTrue(DriverOnlineRewardService.canEvaluateWindow(window, setting, lagos('09:05')))
  })
})
