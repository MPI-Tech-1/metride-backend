import { type HttpContext } from '@adonisjs/core/http'
import OtpTokenActions from '#model_management/actions/otp_token_actions'
import CustomerActions from '#model_management/actions/customer_actions'
import CustomerRequestResetPasswordOtpTokenRequestValidator from '#validators/v1/customer/password_management/customer_request_reset_password_otp_token_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import {
  ERROR,
  OTP_TOKEN_EXPIRATION_TIMEFRAME_IN_MINUTES,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from '#common/messages/system_messages'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import generateFutureDateTime from '#common/helper_functions/generate_future_date_time'

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

      const createdOtpToken = await OtpTokenActions.createOtpTokenRecord({
        createPayload: {
          email: email,
          token: OtpTokenActions.generateOtpToken(),
          purpose: 'password-reset',
          status: 'pending',
          expiresAt: generateFutureDateTime({
            timeComponent: 'minutes',
            futureTimeDuration: OTP_TOKEN_EXPIRATION_TIMEFRAME_IN_MINUTES,
          }),
        },
        dbTransactionOptions: { useTransaction: false },
      })

      await NotificationDispatchClient.sendResetPasswordNotificationJob({
        email: customer.email,
        name: customer.firstName,
        otpToken: createdOtpToken.token,
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: `An OTP token has been sent to ${email}.`,
      })
    } catch (RequestResetPasswordOtpTokenControllerError) {
      console.log(
        'RequestResetPasswordOtpTokenControllerError -> ',
        RequestResetPasswordOtpTokenControllerError
      )
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
