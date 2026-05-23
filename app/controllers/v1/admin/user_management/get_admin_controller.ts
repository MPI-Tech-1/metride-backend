import { type HttpContext } from '@adonisjs/core/http'
import AdminActions from '#model_management/actions/admin_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class GetAdminController {
  async handle({ params, response }: HttpContext) {
    const { identifier } = params

    try {
      const admin = await AdminActions.getAdmin({
        identifierType: 'identifier',
        identifier,
      })

      if (!admin) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Admin not found.',
        })
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Admin fetched successfully.',
        results: {
          identifier: admin.identifier,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
          createdAt: admin.createdAt,
        },
      })
    } catch (GetAdminControllerError) {
      console.log('GetAdminControllerError -> ', GetAdminControllerError)
      await logApplicationError(GetAdminControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
