import { type HttpContext } from '@adonisjs/core/http'
import DriverOnlineRewardSettingActions from '#model_management/actions/driver_online_reward_setting_actions'
import UpdateDriverOnlineRewardSettingRequestValidator from '#validators/v1/admin/settings/driver_online_reward/update_driver_online_reward_setting_request_validator'
import serializeDriverOnlineRewardSetting from '#services/serialize_driver_online_reward_setting'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class UpdateDriverOnlineRewardSettingController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(UpdateDriverOnlineRewardSettingRequestValidator)

    // "HH:mm" strings compare correctly as text.
    if (payload.windowEndTime <= payload.windowStartTime) {
      return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
        status_code: HttpStatusCodesEnum.BAD_REQUEST,
        status: ERROR,
        message:
          'Window end time must be later than the start time. Windows cannot cross midnight.',
      })
    }

    if (payload.isEnabled && payload.rewardAmount <= 0) {
      return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
        status_code: HttpStatusCodesEnum.BAD_REQUEST,
        status: ERROR,
        message: 'Set a reward amount greater than 0 before enabling the reward.',
      })
    }

    try {
      const setting = await DriverOnlineRewardSettingActions.updateDriverOnlineRewardSettingRecord({
        updatePayload: payload,
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver online reward settings updated successfully.',
        results: serializeDriverOnlineRewardSetting(setting),
      })
    } catch (UpdateDriverOnlineRewardSettingControllerError) {
      console.log(
        'UpdateDriverOnlineRewardSettingControllerError -> ',
        UpdateDriverOnlineRewardSettingControllerError
      )
      await logApplicationError(UpdateDriverOnlineRewardSettingControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
