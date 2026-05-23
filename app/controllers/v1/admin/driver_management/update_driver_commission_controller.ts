import { type HttpContext } from '@adonisjs/core/http'
import DriverActions from '#model_management/actions/driver_actions'
import DriverSettingActions from '#model_management/actions/driver_setting_actions'
import UpdateDriverCommissionRequestValidator from '#validators/v1/admin/driver_management/update_driver_commission_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class UpdateDriverCommissionController {
  async handle({ request, response }: HttpContext) {
    const { identifier } = request.params()

    const { commissionPercentage } = await request.validateUsing(
      UpdateDriverCommissionRequestValidator
    )

    try {
      const driver = await DriverActions.getDriver({
        identifierType: 'identifier',
        identifier,
      })

      if (!driver) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Driver not found.',
        })
      }

      const existingDriverSetting = await DriverSettingActions.getDriverSetting({
        identifierType: 'driverId',
        identifier: driver.id,
      })

      if (existingDriverSetting) {
        await DriverSettingActions.updateDriverSettingRecord({
          identifierOptions: {
            identifierType: 'id',
            identifier: existingDriverSetting.id,
          },
          updatePayload: { commissionPercentage },
          dbTransactionOptions: { useTransaction: false },
        })
      } else {
        await DriverSettingActions.createDriverSettingRecord({
          createPayload: {
            driverId: driver.id,
            commissionPercentage,
          },
          dbTransactionOptions: { useTransaction: false },
        })
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver commission updated successfully.',
        results: {
          driverIdentifier: driver.identifier,
          commissionPercentage,
        },
      })
    } catch (UpdateDriverCommissionControllerError) {
      console.log(
        'UpdateDriverCommissionControllerError -> ',
        UpdateDriverCommissionControllerError
      )
      await logApplicationError(UpdateDriverCommissionControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
