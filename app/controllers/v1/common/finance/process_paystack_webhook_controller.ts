import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG } from '#common/messages/system_messages'
import cardPaymentConfig from '#config/card_payment_config'
import BackgroundDispatchClient from '#infrastructure_providers/internals/background_dispatch_client'
import type { HttpContext } from '@adonisjs/core/http'
import crypto from 'node:crypto'

export default class ProcessPaystackWebhookController {
  public async handle({ request, response }: HttpContext) {
    try {
      const secret = cardPaymentConfig.paystack.secretKey

      const signature = request.header('x-paystack-signature')

      const rawBody = request.raw()

      const computedSignature = crypto
        .createHmac('sha512', secret)
        .update(rawBody || '')
        .digest('hex')

      if (!signature || signature !== computedSignature) {
        return response.unauthorized({ message: 'Invalid signature' })
      }

      const { event, data } = request.body()

      if (event !== 'charge.success') {
        return
      }

      const { reference } = data

      await BackgroundDispatchClient.processBookingPaymentJob({
        paymentProviderReference: reference,
      })
    } catch (ProcessPaystackWebhookControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status: ERROR,
        statusCode: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
