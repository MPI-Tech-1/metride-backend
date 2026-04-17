import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import OtpTokenActions from '#model_management/actions/otp_token_actions'
import CustomerActions from '#model_management/actions/customer_actions'
import CustomerRequestResetPasswordOtpTokenRequestValidator from '#validators/v1/customer/password_management/customer_request_reset_password_otp_token_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class RequestResetPasswordOtpTokenController {
  async handle({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(
      CustomerRequestResetPasswordOtpTokenRequestValidator
    )

    try {
      const customer = await CustomerActions.getCustomer({
        identifier: email,
        identifierType: 'email',
      })

      if (customer === null) {
        return response.status(HttpStatusCodesEnum.OK).send({
          status_code: HttpStatusCodesEnum.OK,
          status: SUCCESS,
          message: `An OTP token has been sent to ${email}.`,
        })
      }

      await OtpTokenActions.updateOtpTokenRecord({
        identifierOptions: { identifier: email, identifierType: 'email' },
        updatePayload: { status: 'used' },
        dbTransactionOptions: { useTransaction: false },
      })

      const token = Math.floor(100000 + Math.random() * 900000).toString()

      await OtpTokenActions.createOtpTokenRecord({
        createPayload: {
          email: email,
          token,
          purpose: 'password-reset',
          status: 'pending',
          expiresAt: DateTime.now().plus({ minutes: 15 }),
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: `An OTP token has been sent to ${email}.`,
      })
    } catch (RequestResetPasswordOtpTokenControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
