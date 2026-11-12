import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import { DateTime } from 'luxon'
import DriverOnlineRewardSettingActions from '#model_management/actions/driver_online_reward_setting_actions'
import DriverOnlineRewardService, {
  DRIVER_ONLINE_REWARD_TIMEZONE,
} from '#services/driver_online_reward_service'
import logApplicationError from '#common/helper_functions/log_application_error'

export interface ProcessDriverOnlineRewardsJobPayload {
  /** Optional ISO date (Lagos) to process. Defaults to today and yesterday. */
  rewardDate?: string
}

/**
 * Runs every 15 minutes (see start/scheduler.ts). Pays drivers who were online for the
 * whole daily window without missing a ride. Safe to run repeatedly: a driver can only
 * be rewarded once per date.
 */
export default class ProcessDriverOnlineRewardsJob extends Job<ProcessDriverOnlineRewardsJobPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    const setting = await DriverOnlineRewardSettingActions.getDriverOnlineRewardSetting()

    if (!setting.isEnabled || setting.rewardAmount <= 0) return

    const now = DateTime.now().setZone(DRIVER_ONLINE_REWARD_TIMEZONE)
    const rewardDates = this.payload?.rewardDate
      ? [this.payload.rewardDate]
      : [now.minus({ days: 1 }).toISODate()!, now.toISODate()!]

    for (const rewardDate of rewardDates) {
      const { rewardedDriverIds } = await DriverOnlineRewardService.processRewardDate(
        rewardDate,
        setting,
        now
      )
      if (rewardedDriverIds.length > 0) {
        console.log(
          `ProcessDriverOnlineRewardsJob: rewarded ${rewardedDriverIds.length} driver(s) for ${rewardDate}`
        )
      }
    }
  }

  async failed(error: Error) {
    console.error('ProcessDriverOnlineRewardsJob failed:', error.message)
    await logApplicationError(error)
  }
}
