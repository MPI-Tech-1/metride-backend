import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import PopularLocationActions from '#model_management/actions/popular_location_actions'
import CityActions from '#model_management/actions/city_actions'
import UpdatePopularLocationRequestValidator from '#validators/v1/admin/settings/booking/popular_locations/update_popular_location_request_validator'

export default class UpdatePopularLocationController {
  async handle({ request, response, params }: HttpContext) {
    const { identifier } = params
    const { cityIdentifier, ...payload } = await request.validateUsing(
      UpdatePopularLocationRequestValidator
    )

    try {
      let cityId: number | undefined

      if (cityIdentifier) {
        const city = await CityActions.getCity({
          identifier: cityIdentifier,
          identifierType: 'identifier',
        })
        cityId = city!.id
      }

      const popularLocation = await PopularLocationActions.updatePopularLocationRecord({
        identifierOptions: { identifier, identifierType: 'identifier' },
        updatePayload: {
          ...payload,
          ...(cityId && { cityId }),
        },
        dbTransactionOptions: { useTransaction: false },
      })

      if (!popularLocation) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Popular location not found',
        })
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Popular location updated successfully',
        results: popularLocation,
      })
    } catch (UpdatePopularLocationControllerError) {
      console.log('UpdatePopularLocationControllerError -> ', UpdatePopularLocationControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
