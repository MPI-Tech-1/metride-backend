import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import PopularLocationActions from '#model_management/actions/popular_location_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class FetchPopularLocationsController {
  async handle({ request, response }: HttpContext) {
    const { page, limit, searchQuery, cityId, isActive, typeOfLocation } = request.qs()

    try {
      const { popularLocationPayload: popularLocations, paginationMeta } =
        await PopularLocationActions.listPopularLocations({
          filterRecordOptionsPayload: {
            searchQuery,
            cityId: cityId ? Number(cityId) : undefined,
            isActive: isActive !== undefined ? isActive === 'true' || isActive === '1' : undefined,
            typeOfLocation,
          },
          paginationPayload: page ? { page: Number(page), limit: Number(limit || 10) } : undefined,
        })

      const mutatedPopularLocationPayload = popularLocations.map((location) => ({
        identifier: location.identifier,
        city: {
          identifier: location.city.identifier,
          name: location.city.name,
          longitude: location.city.longitude,
          latitude: location.city.latitude,
        },
        name: location.name,
        gpsCoordinates: location.gpsCoordinates,
        typeOfLocation: location.typeOfLocation,
        isActive: location.isActive,
      }))
      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Fetched list of popular locations successfully',
        results: {
          popularLocationPayload: mutatedPopularLocationPayload,
          paginationMeta,
        },
      })
    } catch (FetchPopularLocationsControllerError) {
      console.log('FetchPopularLocationsControllerError -> ', FetchPopularLocationsControllerError)
      await logApplicationError(FetchPopularLocationsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
