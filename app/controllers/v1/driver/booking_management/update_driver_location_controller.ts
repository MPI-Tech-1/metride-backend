import { type HttpContext } from '@adonisjs/core/http'
import DriverLocationActions from '#model_management/actions/driver_location_actions'
import UpdateDriverLocationRequestValidator from '#validators/v1/driver/booking_management/update_driver_location_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class UpdateDriverLocationController {
  async handle({ request, auth, response }: HttpContext) {
    const { latitude, longitude } = await request.validateUsing(
      UpdateDriverLocationRequestValidator
    )

    try {
      const loggedInDriver = auth.use('driver').user!

      const driverLocation = await DriverLocationActions.createDriverLocationRecord({
        createPayload: {
          driverId: loggedInDriver.id,
          latitude,
          longitude,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Driver location updated successfully.',
        results: {
          identifier: driverLocation.identifier,
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          createdAt: driverLocation.createdAt,
        },
      })
    } catch (UpdateDriverLocationControllerError) {
      console.log('UpdateDriverLocationControllerError -> ', UpdateDriverLocationControllerError)
      await logApplicationError(UpdateDriverLocationControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
