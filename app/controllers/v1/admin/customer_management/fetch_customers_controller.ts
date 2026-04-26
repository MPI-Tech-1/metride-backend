import { HttpContext } from '@adonisjs/core/http'
import CustomerActions from '#model_management/actions/customer_actions'
import ListCustomersRequestValidator from '#validators/v1/admin/customer_management/list_customers_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchCustomersController {
  async handle({ request, response }: HttpContext) {
    const { page, limit, searchQuery } = await request.validateUsing(ListCustomersRequestValidator)

    try {
      const { customerPayload, paginationMeta } = await CustomerActions.listCustomers({
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
        message: 'Customers fetched successfully.',
        results: {
          data: customerPayload,
          meta: paginationMeta,
        },
      })
    } catch (FetchCustomersControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
