import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import InvestorActions from '#model_management/actions/investor_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class FetchInvestorsController {
  async handle({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const searchQuery = request.input('search', '')

      const { investorPayload: investors, paginationMeta } = await InvestorActions.listInvestors({
        filterRecordOptionsPayload: {
          searchQuery: searchQuery || undefined,
        },
        paginationPayload: { page, limit },
      })

      const mutatedInvestors = investors.map((investor) => ({
        identifier: investor.identifier,
        firstName: investor.firstName,
        lastName: investor.lastName,
        fullName: investor.fullName,
        email: investor.email,
        mobileNumber: investor.mobileNumber,
        address: investor.address,
        createdAt: investor.createdAt,
      }))

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Investors fetched successfully',
        results: {
          investors: mutatedInvestors,
          paginationMeta,
        },
      })
    } catch (FetchInvestorsControllerError) {
      console.log('FetchInvestorsControllerError -> ', FetchInvestorsControllerError)
      await logApplicationError(FetchInvestorsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
