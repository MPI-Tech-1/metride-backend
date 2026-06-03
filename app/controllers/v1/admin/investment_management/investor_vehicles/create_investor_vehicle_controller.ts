import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import InvestorVehicleActions from '#model_management/actions/investor_vehicle_actions'
import CreateInvestorVehicleRequestValidator from '#validators/v1/admin/investment_management/create_investor_vehicle_request_validator'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class CreateInvestorVehicleController {
  async handle({ request, response }: HttpContext) {
    const { investorId, vehicleName, vehicleType, plateNumber, investmentAmount, percentageShare } =
      await request.validateUsing(CreateInvestorVehicleRequestValidator)

    try {
      await InvestorVehicleActions.createInvestorVehicleRecord({
        createPayload: {
          investorId,
          vehicleName,
          vehicleType,
          plateNumber: plateNumber ?? null,
          investmentAmount,
          percentageShare,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Investor vehicle created successfully',
      })
    } catch (CreateInvestorVehicleControllerError) {
      console.log('CreateInvestorVehicleControllerError -> ', CreateInvestorVehicleControllerError)
      await logApplicationError(CreateInvestorVehicleControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
