import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import CityActions from '#model_management/actions/city_actions'
import CreateCityRequestValidator from '#validators/v1/admin/settings/cities/create_city_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class CreateCityController {
  async handle({ request, response }: HttpContext) {
    const { name, latitude, longitude } = await request.validateUsing(CreateCityRequestValidator)

    try {
      await CityActions.createCityRecord({
        createPayload: {
          name,
          latitude,
          longitude,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'City created successfully',
      })
    } catch (CreateCityControllerError) {
      console.log('CreateCityControllerError -> ', CreateCityControllerError)
      await logApplicationError(CreateCityControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
