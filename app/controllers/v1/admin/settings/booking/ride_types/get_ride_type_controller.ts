import { HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import RideTypeActions from '#model_management/actions/ride_type_actions'

export default class GetRideTypeController {
  async handle({ response, params }: HttpContext) {
    const { identifier } = params

    try {
      const rideType = await RideTypeActions.getRideType({
        identifier,
        identifierType: 'identifier',
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
        message: 'Ride type fetched successfully',
        results: rideType,
      })
    } catch (GetRideTypeControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
