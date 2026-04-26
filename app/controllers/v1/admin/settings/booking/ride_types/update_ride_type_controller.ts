import { HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import RideTypeActions from '#model_management/actions/ride_type_actions'
import UpdateRideTypeRequestValidator from '#validators/v1/admin/settings/booking/ride_types/update_ride_type_request_validator'

export default class UpdateRideTypeController {
  async handle({ request, response, params }: HttpContext) {
    const { identifier } = params
    const payload = await request.validateUsing(UpdateRideTypeRequestValidator)

    try {
      const rideType = await RideTypeActions.updateRideTypeRecord({
        identifierOptions: { identifier, identifierType: 'identifier' },
        updatePayload: payload,
        dbTransactionOptions: { useTransaction: false },
      })

      if (!rideType) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Ride type not found',
        })
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Ride type updated successfully',
        results: rideType,
      })
    } catch (UpdateRideTypeControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
