import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import CityActions from '#model_management/actions/city_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class GetCityController {
  async handle({ response, request }: HttpContext) {
    const { identifier } = request.params()

    try {
      const city = await CityActions.getCity({
        identifier,
        identifierType: 'identifier',
      })

      if (!city) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'City not found',
        })
      }

      const mutatedCity = {
        identifier: city.identifier,
        name: city.name,
        longitude: city.longitude,
        latitude: city.latitude,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'City fetched successfully',
        results: mutatedCity,
      })
    } catch (GetCityControllerError) {
      console.log('GetCityControllerError -> ', GetCityControllerError)
      await logApplicationError(GetCityControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
