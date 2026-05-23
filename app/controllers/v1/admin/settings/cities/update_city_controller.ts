import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import CityActions from '#model_management/actions/city_actions'
import UpdateCityRequestValidator from '#validators/v1/admin/settings/cities/update_city_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class UpdateCityController {
  async handle({ request, response }: HttpContext) {
    const { identifier } = request.params()
    const { latitude, longitude, name } = await request.validateUsing(UpdateCityRequestValidator)

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

      await CityActions.updateCityRecord({
        identifierOptions: { identifier, identifierType: 'identifier' },
        updatePayload: { latitude, longitude, name },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'City updated successfully',
      })
    } catch (UpdateCityControllerError) {
      console.log('UpdateCityControllerError -> ', UpdateCityControllerError)
      await logApplicationError(UpdateCityControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
