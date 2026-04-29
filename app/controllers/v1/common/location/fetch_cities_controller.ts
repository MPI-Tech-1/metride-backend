import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import CityActions from '#model_management/actions/city_actions'

export default class FetchCitiesController {
  async handle({ response }: HttpContext) {
    try {
      const { cityPayload: cities } = await CityActions.listCities({})

      const mutatedPayload = cities.map((city) => {
        return {
          identifier: city.identifier,
          name: city.name,
        }
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Fetched list of cities successfully',
        results: mutatedPayload,
      })
    } catch (FetchCitiesControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
