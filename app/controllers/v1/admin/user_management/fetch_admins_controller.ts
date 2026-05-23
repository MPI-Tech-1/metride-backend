import { type HttpContext } from '@adonisjs/core/http'
import AdminActions from '#model_management/actions/admin_actions'
import FetchAdminsRequestValidator from '#validators/v1/admin/user_management/fetch_admins_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class FetchAdminsController {
  async handle({ request, response }: HttpContext) {
    const { page = 1, limit = 10, searchQuery } = await request.validateUsing(
      FetchAdminsRequestValidator
    )

    try {
      const { adminPayload: admins, paginationMeta } = await AdminActions.listAdmins({
        filterRecordOptionsPayload: { searchQuery },
        paginationPayload: { page, limit },
      })

      const mutatedResponsePayload = admins.map((admin) => ({
        identifier: admin.identifier,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      }))

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Admins fetched successfully.',
        results: {
          admins: mutatedResponsePayload,
          paginationMeta,
        },
      })
    } catch (FetchAdminsControllerError) {
      console.log('FetchAdminsControllerError -> ', FetchAdminsControllerError)
      await logApplicationError(FetchAdminsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
