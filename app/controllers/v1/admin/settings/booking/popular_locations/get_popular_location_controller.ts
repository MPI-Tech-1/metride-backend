import { HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import PopularLocationActions from '#model_management/actions/popular_location_actions'

export default class GetPopularLocationController {
  async handle({ response, params }: HttpContext) {
    const { identifier } = params

    try {
      const popularLocation = await PopularLocationActions.getPopularLocation({
        identifier,
        identifierType: 'identifier',
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
        message: 'Popular location fetched successfully',
        results: popularLocation,
      })
    } catch (GetPopularLocationControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
