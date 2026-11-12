import { type HttpContext } from '@adonisjs/core/http'
import DriverOnlineRewardSettingActions from '#model_management/actions/driver_online_reward_setting_actions'
import serializeDriverOnlineRewardSetting from '#services/serialize_driver_online_reward_setting'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class GetDriverOnlineRewardSettingController {
  async handle({ response }: HttpContext) {
    try {
      const setting = await DriverOnlineRewardSettingActions.getDriverOnlineRewardSetting()

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver online reward settings fetched successfully.',
        results: serializeDriverOnlineRewardSetting(setting),
      })
    } catch (GetDriverOnlineRewardSettingControllerError) {
      console.log(
        'GetDriverOnlineRewardSettingControllerError -> ',
        GetDriverOnlineRewardSettingControllerError
      )
      await logApplicationError(GetDriverOnlineRewardSettingControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
