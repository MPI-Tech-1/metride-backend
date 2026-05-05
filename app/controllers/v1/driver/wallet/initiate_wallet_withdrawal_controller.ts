import { type HttpContext } from '@adonisjs/core/http'
import DriverWalletActions from '#model_management/actions/driver_wallet_actions'
import DriverWalletWithdrawalRequestActions from '#model_management/actions/driver_wallet_withdrawal_request_actions'
import InitiateWalletWithdrawalRequestValidator from '#validators/v1/driver/wallet/initiate_wallet_withdrawal_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'

export default class InitiateWalletWithdrawalController {
  async handle({ request, auth, response }: HttpContext) {
    const { amount } = await request.validateUsing(InitiateWalletWithdrawalRequestValidator)

    const dbTransaction = await db.transaction()

    try {
      const loggedInDriver = auth.use('driver').user!

      const wallet = await DriverWalletActions.getDriverWallet({
        identifierType: 'driverId',
        identifier: loggedInDriver.id,
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      if (!wallet) {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Wallet not found.',
        })
      }

      if (amount > wallet.balance) {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Withdrawal amount exceeds wallet balance.',
        })
      }

      const withdrawalRequest =
        await DriverWalletWithdrawalRequestActions.createDriverWalletWithdrawalRequestRecord({
          createPayload: {
            driverId: loggedInDriver.id,
            driverWalletId: wallet.id,
            amount,
            status: 'pending',
          },
          dbTransactionOptions: { useTransaction: true, dbTransaction },
        })

      await dbTransaction.commit()

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Wallet withdrawal request submitted successfully.',
        results: {
          withdrawalRequest: {
            identifier: withdrawalRequest.identifier,
            amount: withdrawalRequest.amount,
            status: withdrawalRequest.status,
          },
          wallet: {
            identifier: wallet.identifier,
            balance: wallet.balance,
          },
        },
      })
    } catch (InitiateWalletWithdrawalControllerError) {
      await dbTransaction.rollback()
      console.log(
        'InitiateWalletWithdrawalControllerError -> ',
        InitiateWalletWithdrawalControllerError
      )
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
