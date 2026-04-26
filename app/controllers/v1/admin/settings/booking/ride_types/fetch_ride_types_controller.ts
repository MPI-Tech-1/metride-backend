import { HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import RideTypeActions from '#model_management/actions/ride_type_actions'

export default class FetchRideTypesController {
  async handle({ request, response }: HttpContext) {
    const { page, limit, searchQuery } = request.qs()

    try {
      const { rideTypePayload, paginationMeta } = await RideTypeActions.listRideTypes({
        filterRecordOptionsPayload: { searchQuery },
        paginationPayload: page ? { page: Number(page), limit: Number(limit || 10) } : undefined,
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Fetched list of ride types successfully',
        results: {
          data: rideTypePayload,
          meta: paginationMeta,
        },
      })
    } catch (FetchRideTypesControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
