import { type HttpContext } from '@adonisjs/core/http'
import CustomerNotificationActions from '#model_management/actions/customer_notification_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class MarkNotificationAsReadController {
  async handle({ params, response, auth }: HttpContext) {
    const { notificationIdentifier } = params

    try {
      const loggedInCustomer = auth.use('customer').user!

      const notification = await CustomerNotificationActions.getCustomerNotification({
        identifierType: 'identifier',
        identifier: notificationIdentifier,
      })

      if (!notification || notification.customerId !== loggedInCustomer.id) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Notification not found.',
        })
      }

      await CustomerNotificationActions.updateCustomerNotificationRecord({
        identifierOptions: {
          identifierType: 'identifier',
          identifier: notificationIdentifier,
        },
        updatePayload: {
          isNotificationRead: true,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Notification marked as read.',
      })
    } catch (MarkNotificationAsReadControllerError) {
      console.log(
        'MarkNotificationAsReadControllerError -> ',
        MarkNotificationAsReadControllerError
      )
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
