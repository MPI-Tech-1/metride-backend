import { type HttpContext } from '@adonisjs/core/http'
import CustomerActions from '#model_management/actions/customer_actions'
import ListCustomersRequestValidator from '#validators/v1/admin/customer_management/list_customers_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchCustomersController {
  async handle({ request, response }: HttpContext) {
    const {
      page = 1,
      limit = 10,
      searchQuery,
    } = await request.validateUsing(ListCustomersRequestValidator)

    try {
      const { customerPayload: customers, paginationMeta } = await CustomerActions.listCustomers({
        filterRecordOptionsPayload: {
          searchQuery,
        },
        paginationPayload: {
          page,
          limit,
        },
      })

      const mutatedResponsePayload = customers.map((customer) => ({
        identifier: customer.identifier,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        mobileNumber: customer.mobileNumber,
        lastLoggedInAt: customer.lastLoggedInAt,
      }))

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Customers fetched successfully.',
        results: {
          customers: mutatedResponsePayload,
          paginationMeta,
        },
      })
    } catch (FetchCustomersControllerError) {
      console.log('FetchCustomersControllerError -> ', FetchCustomersControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
