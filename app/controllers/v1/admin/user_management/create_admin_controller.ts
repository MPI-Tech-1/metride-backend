import { type HttpContext } from '@adonisjs/core/http'
import crypto from 'node:crypto'
import hash from '@adonisjs/core/services/hash'
import AdminActions from '#model_management/actions/admin_actions'
import CreateAdminRequestValidator from '#validators/v1/admin/user_management/create_admin_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class CreateAdminController {
  async handle({ request, response }: HttpContext) {
    const { firstName, lastName, email, role } = await request.validateUsing(
      CreateAdminRequestValidator
    )

    try {
      const tempPassword = crypto.randomBytes(8).toString('hex')

      const admin = await AdminActions.createAdminRecord({
        createPayload: {
          firstName,
          lastName,
          email,
          role,
          password: await hash.make(tempPassword),
        },
        dbTransactionOptions: { useTransaction: false },
      })

      await NotificationDispatchClient.sendAdminAccountCreatedNotificationJob({
        email: admin.email,
        name: admin.firstName,
        tempPassword,
        role: admin.role,
      })

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Admin account created successfully. Login credentials have been sent via email.',
        results: {
          identifier: admin.identifier,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
        },
      })
    } catch (CreateAdminControllerError) {
      console.log('CreateAdminControllerError -> ', CreateAdminControllerError)
      await logApplicationError(CreateAdminControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
