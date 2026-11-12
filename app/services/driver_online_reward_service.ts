import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import Driver from '#models/driver'
import DriverWallet from '#models/driver_wallet'
import type DriverOnlineSession from '#models/driver_online_session'
import type DriverBookingAssignment from '#models/driver_booking_assignment'
import type DriverOnlineRewardSetting from '#models/driver_online_reward_setting'
import DriverOnlineSessionActions from '#model_management/actions/driver_online_session_actions'
import DriverBookingAssignmentActions from '#model_management/actions/driver_booking_assignment_actions'
import DriverOnlineRewardActions from '#model_management/actions/driver_online_reward_actions'
import DriverWalletTransactionActions from '#model_management/actions/driver_wallet_transaction_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export const DRIVER_ONLINE_REWARD_TIMEZONE = 'Africa/Lagos'

export type RewardWindow = {
  rewardDate: string
  windowStart: DateTime
  windowEnd: DateTime
  windowMinutes: number
}

export type DriverRewardEvaluation = {
  driverId: number
  onlineMinutes: number
  hasMissedAssignment: boolean
  isEligible: boolean
}

export default class DriverOnlineRewardService {
  /** The window for an ISO date (Lagos), e.g. 2026-11-12 07:00 → 09:00 Lagos time. */
  public static getRewardWindow(
    rewardDate: string,
    setting: Pick<DriverOnlineRewardSetting, 'windowStartTime' | 'windowEndTime'>
  ): RewardWindow {
    const windowStart = DateTime.fromISO(`${rewardDate}T${setting.windowStartTime}`, {
      zone: DRIVER_ONLINE_REWARD_TIMEZONE,
    })
    const windowEnd = DateTime.fromISO(`${rewardDate}T${setting.windowEndTime}`, {
      zone: DRIVER_ONLINE_REWARD_TIMEZONE,
    })
    return {
      rewardDate,
      windowStart,
      windowEnd,
      windowMinutes: Math.round(windowEnd.diff(windowStart, 'minutes').minutes),
    }
  }

  /**
   * Minutes the driver was online inside the window. Overlapping sessions are merged
   * so they are not double counted; an open session counts up to `now`.
   */
  public static computeOnlineMinutes(
    sessions: Pick<DriverOnlineSession, 'startedAt' | 'endedAt'>[],
    window: Pick<RewardWindow, 'windowStart' | 'windowEnd'>,
    now: DateTime
  ): number {
    const windowStartMs = window.windowStart.toMillis()
    const windowEndMs = window.windowEnd.toMillis()

    const intervals = sessions
      .map((session) => {
        const start = Math.max(session.startedAt.toMillis(), windowStartMs)
        const end = Math.min((session.endedAt ?? now).toMillis(), windowEndMs)
        return [start, end] as const
      })
      .filter(([start, end]) => end > start)
      .sort((a, b) => a[0] - b[0])

    let totalMs = 0
    let currentStart: number | null = null
    let currentEnd = 0
    for (const [start, end] of intervals) {
      if (currentStart === null || start > currentEnd) {
        if (currentStart !== null) totalMs += currentEnd - currentStart
        currentStart = start
        currentEnd = end
      } else {
        currentEnd = Math.max(currentEnd, end)
      }
    }
    if (currentStart !== null) totalMs += currentEnd - currentStart

    return Math.floor(totalMs / 60000)
  }

  /**
   * A ride assigned inside the window disqualifies the driver unless it was accepted
   * within the timeout, or reassigned/cancelled by an admin before the timeout ran out.
   */
  public static isMissedAssignment(
    assignment: Pick<DriverBookingAssignment, 'response' | 'assignedAt' | 'respondedAt'>,
    acceptanceTimeoutMinutes: number,
    now?: DateTime
  ): boolean {
    if (assignment.response === 'rejected') return true
    if (assignment.response === 'pending') {
      // Still inside its timeout: the driver can yet accept it.
      if (now && now < assignment.assignedAt.plus({ minutes: acceptanceTimeoutMinutes })) {
        return false
      }
      return true
    }
    if (!assignment.respondedAt) return true

    const minutesToRespond = assignment.respondedAt.diff(assignment.assignedAt, 'minutes').minutes
    return minutesToRespond > acceptanceTimeoutMinutes
  }

  /**
   * The window may only be evaluated once every ride assigned inside it has had its
   * full acceptance timeout.
   */
  public static canEvaluateWindow(
    window: RewardWindow,
    setting: Pick<DriverOnlineRewardSetting, 'acceptanceTimeoutMinutes'>,
    now: DateTime
  ): boolean {
    return now >= window.windowEnd.plus({ minutes: setting.acceptanceTimeoutMinutes })
  }

  public static async evaluateDrivers(
    window: RewardWindow,
    setting: DriverOnlineRewardSetting,
    now: DateTime,
    driverId?: number
  ): Promise<DriverRewardEvaluation[]> {
    const sessions = await DriverOnlineSessionActions.listDriverOnlineSessionsOverlappingWindow({
      windowStart: window.windowStart,
      windowEnd: window.windowEnd,
      driverId,
    })

    const sessionsByDriver = new Map<number, DriverOnlineSession[]>()
    for (const session of sessions) {
      const driverSessions = sessionsByDriver.get(session.driverId) ?? []
      driverSessions.push(session)
      sessionsByDriver.set(session.driverId, driverSessions)
    }

    const driverIds = [...sessionsByDriver.keys()]
    const assignments = await DriverBookingAssignmentActions.listDriverBookingAssignmentsInWindow({
      windowStart: window.windowStart,
      windowEnd: window.windowEnd,
      driverIds,
    })

    const driversWithMissedAssignment = new Set(
      assignments
        .filter((assignment) =>
          this.isMissedAssignment(assignment, setting.acceptanceTimeoutMinutes, now)
        )
        .map((assignment) => assignment.driverId)
    )

    const requiredMinutes = Math.max(window.windowMinutes - setting.graceMinutes, 0)

    return driverIds.map((candidateDriverId) => {
      const onlineMinutes = this.computeOnlineMinutes(
        sessionsByDriver.get(candidateDriverId)!,
        window,
        now
      )
      const hasMissedAssignment = driversWithMissedAssignment.has(candidateDriverId)
      return {
        driverId: candidateDriverId,
        onlineMinutes,
        hasMissedAssignment,
        isEligible: onlineMinutes >= requiredMinutes && !hasMissedAssignment,
      }
    })
  }

  /**
   * Credits a reward to the driver's wallet. Returns false when the driver was
   * already rewarded for that date (the unique key protects against double payment).
   */
  public static async creditReward(options: {
    driverId: number
    window: RewardWindow
    setting: DriverOnlineRewardSetting
    onlineMinutes: number
  }): Promise<boolean> {
    const { driverId, window, setting, onlineMinutes } = options

    const dbTransaction = await db.transaction()
    try {
      const wallet = await DriverWallet.query({ client: dbTransaction })
        .where('driver_id', driverId)
        .forUpdate()
        .first()

      if (!wallet) {
        throw new Error(`DriverOnlineRewardService: driver ${driverId} has no wallet`)
      }

      const amount = setting.rewardAmount

      const walletTransaction =
        await DriverWalletTransactionActions.createDriverWalletTransactionRecord({
          createPayload: {
            driverId,
            driverWalletId: wallet.id,
            amount,
            systemGeneratedTransactionReference: randomUUID(),
            providerTransactionReference: null,
            remark: `Online reward — ${window.rewardDate} ${setting.windowStartTime}–${setting.windowEndTime}`,
            typeOfTransaction: 'credit',
            status: 'completed',
          },
          dbTransactionOptions: { useTransaction: true, dbTransaction },
        })

      await DriverOnlineRewardActions.createDriverOnlineRewardRecord({
        createPayload: {
          driverId,
          rewardDate: DateTime.fromISO(window.rewardDate),
          windowStartTime: setting.windowStartTime,
          windowEndTime: setting.windowEndTime,
          onlineMinutes,
          amount,
          driverWalletTransactionId: walletTransaction.id,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      wallet.useTransaction(dbTransaction)
      wallet.balance = Number(wallet.balance) + amount
      wallet.totalInflowFunds = Number(wallet.totalInflowFunds) + amount
      await wallet.save()

      await dbTransaction.commit()
      return true
    } catch (creditRewardError) {
      await dbTransaction.rollback()
      const errorCode = (creditRewardError as { code?: string }).code
      if (errorCode === 'ER_DUP_ENTRY' || errorCode === 'SQLITE_CONSTRAINT_UNIQUE') {
        return false
      }
      throw creditRewardError
    }
  }

  /**
   * Evaluates one day's window and pays every eligible driver who has not been paid yet.
   */
  public static async processRewardDate(
    rewardDate: string,
    setting: DriverOnlineRewardSetting,
    now: DateTime
  ): Promise<{ rewardDate: string; rewardedDriverIds: number[] }> {
    const window = this.getRewardWindow(rewardDate, setting)
    const rewardedDriverIds: number[] = []

    if (!this.canEvaluateWindow(window, setting, now)) return { rewardDate, rewardedDriverIds }

    const evaluations = await this.evaluateDrivers(window, setting, now)
    const eligibleEvaluations = evaluations.filter((evaluation) => evaluation.isEligible)
    if (eligibleEvaluations.length === 0) return { rewardDate, rewardedDriverIds }

    const alreadyRewardedDriverIds =
      await DriverOnlineRewardActions.listRewardedDriverIdsForDate(rewardDate)

    const approvedDrivers = await Driver.query()
      .whereIn(
        'id',
        eligibleEvaluations.map((evaluation) => evaluation.driverId)
      )
      .where('status', 'approved')
      .select('id')
    const approvedDriverIds = new Set(approvedDrivers.map((driver) => driver.id))

    for (const evaluation of eligibleEvaluations) {
      if (alreadyRewardedDriverIds.has(evaluation.driverId)) continue
      if (!approvedDriverIds.has(evaluation.driverId)) continue

      try {
        const wasCredited = await this.creditReward({
          driverId: evaluation.driverId,
          window,
          setting,
          onlineMinutes: evaluation.onlineMinutes,
        })
        if (wasCredited) rewardedDriverIds.push(evaluation.driverId)
      } catch (creditRewardError) {
        // One driver's failure (e.g. missing wallet) must not block the others.
        console.log('DriverOnlineRewardService.creditReward error -> ', creditRewardError)
        await logApplicationError(creditRewardError)
      }
    }

    return { rewardDate, rewardedDriverIds }
  }
}
