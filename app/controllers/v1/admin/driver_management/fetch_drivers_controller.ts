import { type HttpContext } from '@adonisjs/core/http'
import DriverActions from '#model_management/actions/driver_actions'
import ListDriversRequestValidator from '#validators/v1/admin/driver_management/list_drivers_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchDriversController {
  async handle({ request, response }: HttpContext) {
    const { page, limit, searchQuery } = await request.validateUsing(ListDriversRequestValidator)

    try {
      const { driverPayload, paginationMeta } = await DriverActions.listDrivers({
        filterRecordOptionsPayload: {
          searchQuery,
        },
        paginationPayload: {
          page: page || 1,
          limit: limit || 10,
        },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Drivers fetched successfully.',
        results: {
          data: driverPayload,
          meta: paginationMeta,
        },
      })
    } catch (FetchDriversControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
