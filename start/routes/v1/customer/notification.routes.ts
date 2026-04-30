import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const FetchNotificationsController = () =>
  import('#controllers/v1/customer/notifications/fetch_notifications_controller')
const MarkNotificationAsReadController = () =>
  import('#controllers/v1/customer/notifications/mark_notification_as_read_controller')

router
  .group(() => {
    router.get('/notifications', [FetchNotificationsController])
    router.patch('/notifications/:notificationIdentifier/read', [MarkNotificationAsReadController])
  })
  .use(middleware.auth({ guards: ['customer'] }))
  .prefix('api/v1/customer')
