import { type HttpContext } from '@adonisjs/core/http'
import DriverWalletActions from '#model_management/actions/driver_wallet_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class GetWalletController {
  async handle({ auth, response }: HttpContext) {
    try {
      const loggedInDriver = auth.use('driver').user!

      const wallet = await DriverWalletActions.getDriverWallet({
        identifierType: 'driverId',
        identifier: loggedInDriver.id,
      })

      if (!wallet) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Wallet not found.',
        })
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Wallet fetched successfully.',
        results: {
          identifier: wallet.identifier,
          balance: wallet.balance,
          totalInflowFunds: wallet.totalInflowFunds,
          totalOutflowFunds: wallet.totalOutflowFunds,
          createdAt: wallet.createdAt,
        },
      })
    } catch (GetWalletControllerError) {
      console.log('GetWalletControllerError -> ', GetWalletControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
