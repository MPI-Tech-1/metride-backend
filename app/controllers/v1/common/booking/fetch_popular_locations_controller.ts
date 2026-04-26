import { HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import PopularLocationActions from '#model_management/actions/popular_location_actions'
import CityActions from '#model_management/actions/city_actions'
import FetchPopularLocationsRequestValidator from '#validators/v1/common/booking/fetch_popular_locations_request_validator'

export default class FetchPopularLocationsController {
  async handle({ request, response }: HttpContext) {
    const { cityIdentifier } = await request.validateUsing(FetchPopularLocationsRequestValidator)

    try {
      const city = await CityActions.getCity({
        identifier: cityIdentifier ?? '',
        identifierType: 'identifier',
      })
      const { popularLocationPayload: popularLocations } =
        await PopularLocationActions.listPopularLocations({
          filterRecordOptionsPayload: {
            cityId: city?.id,
            isActive: true,
          },
        })

      const mutatedPayload = popularLocations.map((location) => {
        return {
          identifier: location.identifier,
          name: location.name,
          gpsCoordinates: location.gpsCoordinates,
          typeOfLocation: location.typeOfLocation,
        }
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Fetched list of popular locations successfully',
        results: mutatedPayload,
      })
    } catch (FetchPopularLocationsControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
