import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import InvestorActions from '#model_management/actions/investor_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class GetInvestorController {
  async handle({ response, request }: HttpContext) {
    const { identifier } = request.params()

    try {
      const investor = await InvestorActions.getInvestor({
        identifier,
        identifierType: 'identifier',
      })

      if (!investor) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Investor not found',
        })
      }

      const mutatedInvestor = {
        identifier: investor.identifier,
        firstName: investor.firstName,
        lastName: investor.lastName,
        fullName: investor.fullName,
        email: investor.email,
        mobileNumber: investor.mobileNumber,
        address: investor.address,
        createdAt: investor.createdAt,
        updatedAt: investor.updatedAt,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Investor fetched successfully',
        results: mutatedInvestor,
      })
    } catch (GetInvestorControllerError) {
      console.log('GetInvestorControllerError -> ', GetInvestorControllerError)
      await logApplicationError(GetInvestorControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
