import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'
import DriverActions from '#model_management/actions/driver_actions'

export default class EnableRideAcceptanceStatus {
  async handle({ auth, response }: HttpContext) {
    try {
      const loggedInDriver = auth.use('driver').user!

      await DriverActions.updateDriverRecord({
        identifierOptions: {
          identifierType: 'id',
          identifier: loggedInDriver.id,
        },
        updatePayload: {
          isDriverActiveForTrip: true,
        },
        dbTransactionOptions: {
          useTransaction: false,
        },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'You can now accept rides',
      })
    } catch (EnableRideAcceptanceStatusError) {
      console.log('EnableRideAcceptanceStatusError -> ', EnableRideAcceptanceStatusError)
      await logApplicationError(EnableRideAcceptanceStatusError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
