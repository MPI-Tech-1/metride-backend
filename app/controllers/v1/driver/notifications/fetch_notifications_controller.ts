import { type HttpContext } from '@adonisjs/core/http'
import DriverNotificationActions from '#model_management/actions/driver_notification_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class FetchNotificationsController {
  async handle({ request, response, auth }: HttpContext) {
    const { page = 1, limit = 10 } = request.qs()

    try {
      const loggedInDriver = auth.use('driver').user!

      const { driverNotificationPayload: notifications, paginationMeta } =
        await DriverNotificationActions.listDriverNotifications({
          filterRecordOptionsPayload: {
            driverId: loggedInDriver.id,
          },
          paginationPayload: {
            page: Number(page),
            limit: Number(limit),
          },
        })

      const mutatedResponsePayload = notifications.map((notification) => ({
        identifier: notification.identifier,
        content: notification.content,
        payload: notification.payload,
        notificationType: notification.notificationType,
        isNotificationRead: notification.isNotificationRead,
        createdAt: notification.createdAt,
      }))

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Notifications fetched successfully.',
        results: {
          notifications: mutatedResponsePayload,
          meta: paginationMeta,
        },
      })
    } catch (FetchNotificationsControllerError) {
      console.log('FetchNotificationsControllerError -> ', FetchNotificationsControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
