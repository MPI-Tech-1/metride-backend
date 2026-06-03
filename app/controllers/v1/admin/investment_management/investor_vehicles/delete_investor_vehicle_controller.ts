import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import InvestorVehicleActions from '#model_management/actions/investor_vehicle_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class DeleteInvestorVehicleController {
  async handle({ request, response }: HttpContext) {
    const { identifier } = request.params()

    try {
      const deleted = await InvestorVehicleActions.deleteInvestorVehicleRecord({
        identifier,
        identifierType: 'identifier',
      })

      if (!deleted) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Investor vehicle not found',
        })
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Investor vehicle deleted successfully',
      })
    } catch (DeleteInvestorVehicleControllerError) {
      console.log(
        'DeleteInvestorVehicleControllerError -> ',
        DeleteInvestorVehicleControllerError
      )
      await logApplicationError(DeleteInvestorVehicleControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
