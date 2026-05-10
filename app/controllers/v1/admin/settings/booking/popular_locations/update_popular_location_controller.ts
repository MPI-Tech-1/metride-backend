import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import PopularLocationActions from '#model_management/actions/popular_location_actions'
import CityActions from '#model_management/actions/city_actions'
import UpdatePopularLocationRequestValidator from '#validators/v1/admin/settings/booking/popular_locations/update_popular_location_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class UpdatePopularLocationController {
  async handle({ request, response, params }: HttpContext) {
    const { identifier } = params

    const { cityIdentifier, name, gpsCoordinates, typeOfLocation } = await request.validateUsing(
      UpdatePopularLocationRequestValidator
    )

    try {
      const popularLocation = await PopularLocationActions.getPopularLocation({
        identifierType: 'identifier',
        identifier,
      })

      if (!popularLocation) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Popular location not found',
        })
      }

      const city = await CityActions.getCity({
        identifier: cityIdentifier,
        identifierType: 'identifier',
      })

      await PopularLocationActions.updatePopularLocationRecord({
        identifierOptions: { identifier, identifierType: 'identifier' },
        updatePayload: {
          name,
          gpsCoordinates,
          typeOfLocation,
          cityId: city?.id,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Popular location updated successfully',
      })
    } catch (UpdatePopularLocationControllerError) {
      console.log('UpdatePopularLocationControllerError -> ', UpdatePopularLocationControllerError)
      await logApplicationError(UpdatePopularLocationControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
