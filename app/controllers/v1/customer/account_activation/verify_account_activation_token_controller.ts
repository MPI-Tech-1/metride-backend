import { type HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import OtpTokenActions from '#model_management/actions/otp_token_actions'
import CustomerRegistrationStepActions from '#model_management/actions/customer_registration_step_actions'
import CustomerVerifyAccountActivationTokenRequestValidator from '#validators/v1/customer/account_activation/customer_verify_account_activation_token_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class VerifyAccountActivationTokenController {
  async handle({ request, response, auth }: HttpContext) {
    const { token } = await request.validateUsing(
      CustomerVerifyAccountActivationTokenRequestValidator
    )

    try {
      const loggedInCustomer = auth.use('customer').user!

      const otpToken = await OtpTokenActions.getOtpTokenByEmailAddress(loggedInCustomer.email)

      if (!otpToken) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'No pending activation token found for this email address.',
        })
      }

      if (otpToken.expiresAt && DateTime.now() > otpToken.expiresAt) {
        await OtpTokenActions.updateOtpTokenRecord({
          identifierOptions: { identifier: otpToken.id, identifierType: 'id' },
          updatePayload: { status: 'expired' },
          dbTransactionOptions: { useTransaction: false },
        })

        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Activation token has expired. Please request a new one.',
        })
      }

      if (otpToken.token !== token) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Invalid activation token.',
        })
      }

      await OtpTokenActions.updateOtpTokenRecord({
        identifierOptions: { identifier: otpToken.id, identifierType: 'id' },
        updatePayload: { status: 'used' },
        dbTransactionOptions: { useTransaction: false },
      })

      await CustomerRegistrationStepActions.updateCustomerRegistrationStepRecord({
        identifierOptions: { identifier: loggedInCustomer.id, identifierType: 'customerId' },
        updatePayload: { hasActivatedAccount: true, deletedAt: DateTime.now() },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Account successfully activated.',
      })
    } catch (VerifyAccountActivationTokenControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
