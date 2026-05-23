import { type HttpContext } from '@adonisjs/core/http'
import Admin from '#models/admin'
import AdminActions from '#model_management/actions/admin_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class DeleteAdminController {
  async handle({ params, auth, response }: HttpContext) {
    const { identifier } = params
    const authenticatedAdmin = auth.user as Admin

    try {
      if (authenticatedAdmin.identifier === identifier) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'You cannot delete your own account.',
        })
      }

      const admin = await AdminActions.deleteAdminRecord({
        identifierType: 'identifier',
        identifier,
      })

      if (admin === null) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Admin not found.',
        })
      }

      await AdminActions.deleteAdminAuthenticationToken(admin.id)

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Admin account deleted successfully.',
      })
    } catch (DeleteAdminControllerError) {
      console.log('DeleteAdminControllerError -> ', DeleteAdminControllerError)
      await logApplicationError(DeleteAdminControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
