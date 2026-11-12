import { type HttpContext } from '@adonisjs/core/http'
import DriverActions from '#model_management/actions/driver_actions'
import DriverOnlineRewardActions from '#model_management/actions/driver_online_reward_actions'
import ListDriverOnlineRewardsRequestValidator from '#validators/v1/admin/driver_management/list_driver_online_rewards_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class FetchDriverOnlineRewardsController {
  async handle({ request, response }: HttpContext) {
    const {
      page = 1,
      limit = 10,
      date,
      driverIdentifier,
    } = await request.validateUsing(ListDriverOnlineRewardsRequestValidator)

    try {
      let driverId: number | undefined
      if (driverIdentifier) {
        const driver = await DriverActions.getDriver({
          identifierType: 'identifier',
          identifier: driverIdentifier,
        })
        if (!driver) {
          return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
            status_code: HttpStatusCodesEnum.NOT_FOUND,
            status: ERROR,
            message: 'Driver not found.',
          })
        }
        driverId = driver.id
      }

      const { driverOnlineRewardPayload: rewards, paginationMeta } =
        await DriverOnlineRewardActions.listDriverOnlineRewards({
          filterRecordOptionsPayload: { driverId, rewardDate: date },
          paginationPayload: { page, limit },
        })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver online rewards fetched successfully.',
        results: {
          rewards: rewards.map((reward) => ({
            identifier: reward.identifier,
            rewardDate: reward.rewardDate.toISODate(),
            windowStartTime: reward.windowStartTime,
            windowEndTime: reward.windowEndTime,
            onlineMinutes: reward.onlineMinutes,
            amount: reward.amount,
            driver: reward.driver
              ? {
                  identifier: reward.driver.identifier,
                  fullName: reward.driver.fullName,
                  email: reward.driver.email,
                  mobileNumber: reward.driver.mobileNumber,
                }
              : null,
            createdAt: reward.createdAt,
          })),
          paginationMeta,
        },
      })
    } catch (FetchDriverOnlineRewardsControllerError) {
      console.log(
        'FetchDriverOnlineRewardsControllerError -> ',
        FetchDriverOnlineRewardsControllerError
      )
      await logApplicationError(FetchDriverOnlineRewardsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
