import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import RideTypeActions from '#model_management/actions/ride_type_actions'

export default class FetchRideTypesController {
  async handle({ response }: HttpContext) {
    try {
      const { rideTypePayload: rideTypes } = await RideTypeActions.listRideTypes({})

      const mutatedPayload = rideTypes.map((rideType) => {
        return {
          identifier: rideType.identifier,
          name: rideType.name,
          description: rideType.description,
          numberOfSeats: rideType.numberOfSeats,
          pricePerKilometer: rideType.pricePerKilometer,
          basePrice: rideType.basePrice,
          minimumPrice: rideType.minimumPrice,
        }
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Fetched list of ride types successfully',
        results: mutatedPayload,
      })
    } catch (FetchRideTypesControllerError) {
      console.log('FetchRideTypesControllerError -> ', FetchRideTypesControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
