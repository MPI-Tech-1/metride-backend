import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import PopularLocationActions from '#model_management/actions/popular_location_actions'

export default class FetchPopularLocationsController {
  async handle({ request, response }: HttpContext) {
    const { page, limit, searchQuery, cityId, isActive, typeOfLocation } = request.qs()

    try {
      const { popularLocationPayload, paginationMeta } =
        await PopularLocationActions.listPopularLocations({
          filterRecordOptionsPayload: {
            searchQuery,
            cityId: cityId ? Number(cityId) : undefined,
            isActive: isActive !== undefined ? isActive === 'true' || isActive === '1' : undefined,
            typeOfLocation,
          },
          paginationPayload: page ? { page: Number(page), limit: Number(limit || 10) } : undefined,
        })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Fetched list of popular locations successfully',
        results: {
          data: popularLocationPayload,
          meta: paginationMeta,
        },
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
