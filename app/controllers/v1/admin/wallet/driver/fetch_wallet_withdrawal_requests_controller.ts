import { type HttpContext } from '@adonisjs/core/http'
import DriverActions from '#model_management/actions/driver_actions'
import DriverWalletWithdrawalRequestActions from '#model_management/actions/driver_wallet_withdrawal_request_actions'
import FetchDriverWalletWithdrawalRequestsRequestValidator from '#validators/v1/admin/wallet/driver/fetch_driver_wallet_withdrawal_requests_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchWalletWithdrawalRequestsController {
  async handle({ request, response }: HttpContext) {
    const {
      driverIdentifier,
      page = 1,
      limit = 10,
      status,
    } = await request.validateUsing(FetchDriverWalletWithdrawalRequestsRequestValidator)

    try {
      const driver = driverIdentifier
        ? await DriverActions.getDriver({
            identifierType: 'identifier',
            identifier: driverIdentifier,
          })
        : null

      const { driverWalletWithdrawalRequestPayload: withdrawalRequests, paginationMeta } =
        await DriverWalletWithdrawalRequestActions.listDriverWalletWithdrawalRequests({
          filterRecordOptionsPayload: {
            driverId: driver?.id,
            status,
          },
          paginationPayload: {
            page,
            limit,
          },
        })

      const mutatedResponsePayload = withdrawalRequests.map((withdrawalRequest) => ({
        identifier: withdrawalRequest.identifier,
        amount: withdrawalRequest.amount,
        status: withdrawalRequest.status,
        createdAt: withdrawalRequest.createdAt,
      }))

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver wallet withdrawal requests fetched successfully.',
        results: {
          driverWalletWithdrawalRequests: mutatedResponsePayload,
          paginationMeta,
        },
      })
    } catch (FetchWalletWithdrawalRequestsControllerError) {
      console.log(
        'FetchWalletWithdrawalRequestsControllerError -> ',
        FetchWalletWithdrawalRequestsControllerError
      )
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
