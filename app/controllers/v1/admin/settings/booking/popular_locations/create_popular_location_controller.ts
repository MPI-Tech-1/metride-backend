import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import PopularLocationActions from '#model_management/actions/popular_location_actions'
import CityActions from '#model_management/actions/city_actions'
import CreatePopularLocationRequestValidator from '#validators/v1/admin/settings/booking/popular_locations/create_popular_location_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class CreatePopularLocationController {
  async handle({ request, response }: HttpContext) {
    const { cityIdentifier, name, gpsCoordinates, typeOfLocation } = await request.validateUsing(
      CreatePopularLocationRequestValidator
    )

    try {
      const city = await CityActions.getCity({
        identifier: cityIdentifier,
        identifierType: 'identifier',
      })

      await PopularLocationActions.createPopularLocationRecord({
        createPayload: {
          name,
          gpsCoordinates,
          typeOfLocation,
          cityId: city?.id,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Popular location created successfully',
      })
    } catch (CreatePopularLocationControllerError) {
      console.log('CreatePopularLocationControllerError -> ', CreatePopularLocationControllerError)
      await logApplicationError(CreatePopularLocationControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
