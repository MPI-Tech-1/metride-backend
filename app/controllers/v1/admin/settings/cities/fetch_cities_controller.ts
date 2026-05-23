import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import CityActions from '#model_management/actions/city_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class FetchCitiesController {
  async handle({ response }: HttpContext) {
    try {
      const { cityPayload: cities, paginationMeta } = await CityActions.listCities({
        filterRecordOptionsPayload: {},
      })

      const mutatedCities = cities.map((city) => ({
        identifier: city.identifier,
        name: city.name,
        longitude: city.longitude,
        latitude: city.latitude,
      }))
      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Fetched list of cities successfully',
        results: {
          cities: mutatedCities,
          paginationMeta,
        },
      })
    } catch (FetchCitiesControllerError) {
      console.log('FetchCitiesControllerError -> ', FetchCitiesControllerError)
      await logApplicationError(FetchCitiesControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
