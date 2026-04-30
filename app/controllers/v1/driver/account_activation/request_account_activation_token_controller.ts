import { type HttpContext } from '@adonisjs/core/http'
import OtpTokenActions from '#model_management/actions/otp_token_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import {
  ERROR,
  OTP_TOKEN_EXPIRATION_TIMEFRAME_IN_MINUTES,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from '#common/messages/system_messages'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import generateFutureDateTime from '#common/helper_functions/generate_future_date_time'

export default class RequestAccountActivationTokenController {
  async handle({ response, auth }: HttpContext) {
    try {
      const loggedInDriver = auth.use('driver').user!

      await OtpTokenActions.updateOtpTokenRecord({
        identifierOptions: { identifier: loggedInDriver.email!, identifierType: 'email' },
        updatePayload: { status: 'used' },
        dbTransactionOptions: { useTransaction: false },
      })

      const createdOtpToken = await OtpTokenActions.createOtpTokenRecord({
        createPayload: {
          email: loggedInDriver.email,
          token: OtpTokenActions.generateOtpToken(),
          purpose: 'account-activation',
          status: 'pending',
          expiresAt: generateFutureDateTime({
            timeComponent: 'minutes',
            futureTimeDuration: OTP_TOKEN_EXPIRATION_TIMEFRAME_IN_MINUTES,
          }),
        },
        dbTransactionOptions: { useTransaction: false },
      })

      await NotificationDispatchClient.sendAccountActivationNotificationJob({
        name: loggedInDriver.firstName,
        email: loggedInDriver.email,
        otpToken: createdOtpToken.token,
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: `An activation token has been sent to ${loggedInDriver.email}.`,
      })
    } catch (RequestAccountActivationTokenControllerError) {
      console.log('RequestAccountActivationTokenControllerError -> ', RequestAccountActivationTokenControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
