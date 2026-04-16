import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import OtpTokenActions from '#model_management/actions/otp_token_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class RequestAccountActivationTokenController {
  async handle({ response, auth }: HttpContext) {
    try {
      const loggedDriver = auth.use('driver').user!

      await OtpTokenActions.updateOtpTokenRecord({
        identifierOptions: { identifier: loggedDriver.email!, identifierType: 'email' },
        updatePayload: { status: 'used' },
        dbTransactionOptions: { useTransaction: false },
      })

      const token = Math.floor(100000 + Math.random() * 900000).toString()

      await OtpTokenActions.createOtpTokenRecord({
        createPayload: {
          email: loggedDriver.email,
          token,
          purpose: 'account-activation',
          status: 'pending',
          expiresAt: DateTime.now().plus({ minutes: 15 }),
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: `An activation token has been sent to ${loggedDriver.email}.`,
      })
    } catch (RequestAccountActivationTokenControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
