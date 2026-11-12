import { type HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import DriverOnlineRewardActions from '#model_management/actions/driver_online_reward_actions'
import DriverOnlineRewardSettingActions from '#model_management/actions/driver_online_reward_setting_actions'
import DriverOnlineRewardService, {
  DRIVER_ONLINE_REWARD_TIMEZONE,
} from '#services/driver_online_reward_service'
import ListOnlineRewardsRequestValidator from '#validators/v1/driver/online_rewards/list_online_rewards_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

type TodayStatus = 'upcoming' | 'in-progress' | 'not-eligible' | 'pending-payout' | 'rewarded'

export default class FetchOnlineRewardsController {
  async handle({ auth, request, response }: HttpContext) {
    const { page = 1, limit = 10 } = await request.validateUsing(ListOnlineRewardsRequestValidator)

    try {
      const loggedInDriver = auth.use('driver').user!
      const setting = await DriverOnlineRewardSettingActions.getDriverOnlineRewardSetting()
      const now = DateTime.now().setZone(DRIVER_ONLINE_REWARD_TIMEZONE)

      const { driverOnlineRewardPayload: rewards, paginationMeta } =
        await DriverOnlineRewardActions.listDriverOnlineRewards({
          filterRecordOptionsPayload: { driverId: loggedInDriver.id },
          paginationPayload: { page, limit },
        })

      let today = null
      if (setting.isEnabled) {
        const window = DriverOnlineRewardService.getRewardWindow(now.toISODate()!, setting)
        const [evaluation] = await DriverOnlineRewardService.evaluateDrivers(
          window,
          setting,
          now,
          loggedInDriver.id
        )
        const onlineMinutes = evaluation?.onlineMinutes ?? 0
        const hasMissedRide = evaluation?.hasMissedAssignment ?? false
        const requiredMinutes = Math.max(window.windowMinutes - setting.graceMinutes, 0)

        const { driverOnlineRewardPayload: todaysRewards } =
          await DriverOnlineRewardActions.listDriverOnlineRewards({
            filterRecordOptionsPayload: {
              driverId: loggedInDriver.id,
              rewardDate: window.rewardDate,
            },
          })

        let status: TodayStatus
        if (todaysRewards.length > 0) {
          status = 'rewarded'
        } else if (now < window.windowStart) {
          status = 'upcoming'
        } else if (hasMissedRide) {
          status = 'not-eligible'
        } else if (now < window.windowEnd) {
          // Still possible only if the remaining window time can cover the shortfall.
          const minutesLeft = Math.floor(window.windowEnd.diff(now, 'minutes').minutes)
          status = onlineMinutes + minutesLeft >= requiredMinutes ? 'in-progress' : 'not-eligible'
        } else {
          status = onlineMinutes >= requiredMinutes ? 'pending-payout' : 'not-eligible'
        }

        today = {
          rewardDate: window.rewardDate,
          windowStartTime: setting.windowStartTime,
          windowEndTime: setting.windowEndTime,
          timezone: DRIVER_ONLINE_REWARD_TIMEZONE,
          rewardAmount: setting.rewardAmount,
          requiredOnlineMinutes: requiredMinutes,
          onlineMinutes,
          hasMissedRide,
          status,
        }
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Online rewards fetched successfully.',
        results: {
          isRewardEnabled: setting.isEnabled,
          today,
          rewards: rewards.map((reward) => ({
            identifier: reward.identifier,
            rewardDate: reward.rewardDate.toISODate(),
            windowStartTime: reward.windowStartTime,
            windowEndTime: reward.windowEndTime,
            onlineMinutes: reward.onlineMinutes,
            amount: reward.amount,
            createdAt: reward.createdAt,
          })),
          paginationMeta,
        },
      })
    } catch (FetchOnlineRewardsControllerError) {
      console.log('FetchOnlineRewardsControllerError -> ', FetchOnlineRewardsControllerError)
      await logApplicationError(FetchOnlineRewardsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
