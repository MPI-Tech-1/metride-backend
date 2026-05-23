import { type HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import AdminActions from '#model_management/actions/admin_actions'
import OtpTokenActions from '#model_management/actions/otp_token_actions'
import AdminResetPasswordRequestValidator from '#validators/v1/admin/authentication/admin_reset_password_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class ResetAdminPasswordController {
  async handle({ request, response }: HttpContext) {
    const { email, otpToken, newPassword } = await request.validateUsing(
      AdminResetPasswordRequestValidator
    )

    try {
      const admin = await AdminActions.getAdmin({
        identifier: email,
        identifierType: 'email',
      })

      if (admin === null) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'No account found with this email address.',
        })
      }

      const otpTokenRecord = await OtpTokenActions.getOtpTokenByEmailAddress(email)

      if (!otpTokenRecord || otpTokenRecord.purpose !== 'password-reset') {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'No pending password reset token found for this email address.',
        })
      }

      if (otpTokenRecord.expiresAt && DateTime.now() > otpTokenRecord.expiresAt) {
        await OtpTokenActions.updateOtpTokenRecord({
          identifierOptions: { identifier: otpTokenRecord.id, identifierType: 'id' },
          updatePayload: { status: 'expired' },
          dbTransactionOptions: { useTransaction: false },
        })

        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Password reset token has expired. Please request a new one.',
        })
      }

      if (otpTokenRecord.token !== otpToken) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Invalid OTP token.',
        })
      }

      await OtpTokenActions.updateOtpTokenRecord({
        identifierOptions: { identifier: otpTokenRecord.id, identifierType: 'id' },
        updatePayload: { status: 'used' },
        dbTransactionOptions: { useTransaction: false },
      })

      await AdminActions.updateAdminRecord({
        identifierOptions: { identifier: email, identifierType: 'email' },
        updatePayload: { password: await hash.make(newPassword) },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Password reset successfully.',
      })
    } catch (ResetAdminPasswordControllerError) {
      console.log('ResetAdminPasswordControllerError -> ', ResetAdminPasswordControllerError)
      await logApplicationError(ResetAdminPasswordControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
