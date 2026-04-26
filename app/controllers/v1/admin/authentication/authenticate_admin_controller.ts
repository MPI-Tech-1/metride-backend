import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import Admin from '#models/admin'
import AdminAuthenticateRequestValidator from '#validators/v1/admin/authentication/admin_authenticate_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import {
  ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES,
  ERROR,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from '#common/messages/system_messages'
import AdminActions from '#model_management/actions/admin_actions'

export default class AuthenticateAdminController {
  async handle({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(AdminAuthenticateRequestValidator)

    try {
      const admin = await AdminActions.getAdmin({
        identifierType: 'email',
        identifier: email,
      })

      if (admin === null) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Invalid credentials.',
        })
      }

      const isPasswordValid = await hash.verify(admin.password!, password)

      if (!isPasswordValid) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Invalid credentials.',
        })
      }

      const accessCredentials = await Admin.accessTokens.create(admin, ['*'], {
        expiresIn: `${ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES} minutes`,
      })

      const mutatedAdminPayload = {
        identifier: admin.identifier,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        accessCredentials,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Authentication successful.',
        results: mutatedAdminPayload,
      })
    } catch (AuthenticateAdminControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
