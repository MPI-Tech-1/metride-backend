import { type HttpContext } from '@adonisjs/core/http'
import CustomerActions from '#model_management/actions/customer_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchCustomerMetricsController {
  async handle({ response }: HttpContext) {
    try {
      const {
        totalCustomerCount,
        totalActiveCustomerForTheMonth,
        totalNewCustomerForTheMonth,
        totalInActiveCustomer,
      } = await CustomerActions.getCustomerMetrics()

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Customer metrics fetched successfully.',
        results: {
          totalCustomerCount,
          totalActiveCustomerForTheMonth,
          totalNewCustomerForTheMonth,
          totalInActiveCustomer,
        },
      })
    } catch (FetchCustomerMetricsControllerError) {
      console.log('FetchCustomerMetricsControllerError -> ', FetchCustomerMetricsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
