import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import BankActions from '#model_management/actions/bank_actions'

export default class FetchBanksController {
  async handle({ response }: HttpContext) {
    try {
      const { bankPayload: banks } = await BankActions.listBanks({})

      const mutatedPayload = banks.map((bank) => {
        return {
          identifier: bank.identifier,
          name: bank.name,
        }
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Fetched list of banks successfully',
        results: mutatedPayload,
      })
    } catch (FetchBanksControllerError) {
      console.log('FetchBanksControllerError -> ', FetchBanksControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
