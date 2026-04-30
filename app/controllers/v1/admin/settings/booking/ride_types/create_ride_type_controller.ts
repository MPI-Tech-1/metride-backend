import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import RideTypeActions from '#model_management/actions/ride_type_actions'
import CreateRideTypeRequestValidator from '#validators/v1/admin/settings/booking/ride_types/create_ride_type_request_validator'

export default class CreateRideTypeController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(CreateRideTypeRequestValidator)

    try {
      const rideType = await RideTypeActions.createRideTypeRecord({
        createPayload: payload,
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Ride type created successfully',
        results: rideType,
      })
    } catch (CreateRideTypeControllerError) {
      console.log('CreateRideTypeControllerError -> ', CreateRideTypeControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
