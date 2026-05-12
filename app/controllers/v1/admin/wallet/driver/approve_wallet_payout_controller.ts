import { type HttpContext } from '@adonisjs/core/http'
import DriverWalletActions from '#model_management/actions/driver_wallet_actions'
import DriverWalletWithdrawalRequestActions from '#model_management/actions/driver_wallet_withdrawal_request_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'
import logApplicationError from '#common/helper_functions/log_application_error'
import DriverBankAccountActions from '#model_management/actions/driver_bank_account_actions'
import configurePayoutProvider from '#infrastructure_providers/helpers/configure_payout_provider'

export default class ApproveWalletPayoutController {
  async handle({ params, response }: HttpContext) {
    const { withdrawalRequestIdentifier } = params

    const dbTransaction = await db.transaction()

    try {
      const withdrawalRequest =
        await DriverWalletWithdrawalRequestActions.getDriverWalletWithdrawalRequest({
          identifierType: 'identifier',
          identifier: withdrawalRequestIdentifier,
          dbTransactionOptions: { useTransaction: true, dbTransaction },
        })

      if (!withdrawalRequest) {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Withdrawal request not found.',
        })
      }

      if (withdrawalRequest.status !== 'pending') {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Only pending withdrawal requests can be approved.',
        })
      }

      const wallet = await DriverWalletActions.getDriverWallet({
        identifierType: 'id',
        identifier: withdrawalRequest.driverWalletId,
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      if (!wallet) {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Driver wallet not found.',
        })
      }

      if (wallet.balance < withdrawalRequest.amount) {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Insufficient wallet balance to process this payout.',
        })
      }

      const driverBankAccount = await DriverBankAccountActions.getDriverBankAccount({
        identifierType: 'driverId',
        identifier: wallet.driverId,
      })

      if (driverBankAccount === null || driverBankAccount.payoutProviderIdentifier === null) {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Driver bank account not found or does not support payout provider.',
        })
      }

      const payoutProvider = configurePayoutProvider()

      const { initiatedPayoutTransactionInformation } =
        await payoutProvider.initiatePayoutTransaction({
          amount: withdrawalRequest.amount,
          recipient: driverBankAccount.payoutProviderIdentifier,
          reference: withdrawalRequest.identifier,
          reason: `Payout request for withdrawal request ${withdrawalRequest.identifier}`,
        })

      if (!initiatedPayoutTransactionInformation) {
        throw new Error('Failed to initiate payout transaction')
      }

      await DriverWalletWithdrawalRequestActions.updateDriverWalletWithdrawalRequestRecord({
        identifierOptions: { identifierType: 'id', identifier: withdrawalRequest.id },
        updatePayload: { status: 'processing' },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await dbTransaction.commit()

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Wallet payout is processing successfully.',
        results: {
          identifier: withdrawalRequest.identifier,
          amount: withdrawalRequest.amount,
          status: 'processing',
        },
      })
    } catch (ApproveWalletPayoutControllerError) {
      await dbTransaction.rollback()
      console.log('ApproveWalletPayoutControllerError -> ', ApproveWalletPayoutControllerError)
      await logApplicationError(ApproveWalletPayoutControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
