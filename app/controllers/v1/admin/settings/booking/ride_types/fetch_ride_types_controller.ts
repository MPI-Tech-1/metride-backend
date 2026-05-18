import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import RideTypeActions from '#model_management/actions/ride_type_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class FetchRideTypesController {
  async handle({ response }: HttpContext) {
    try {
      const { rideTypePayload } = await RideTypeActions.listRideTypes({
        filterRecordOptionsPayload: {},
      })

      const mutatedRideTypePayload = rideTypePayload.map((rideType) => ({
        identifier: rideType.identifier,
        name: rideType.name,
        description: rideType.description,
        numberOfSeats: rideType.numberOfSeats,
        pricePerKilometer: rideType.pricePerKilometer,
        basePrice: rideType.basePrice,
        minimumPrice: rideType.minimumPrice,
        isActive: rideType.isActive,
      }))

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Fetched list of ride types successfully',
        results: {
          rideTypes: mutatedRideTypePayload,
        },
      })
    } catch (FetchRideTypesControllerError) {
      console.log('FetchRideTypesControllerError -> ', FetchRideTypesControllerError)
      await logApplicationError(FetchRideTypesControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
