import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const FetchNotificationsController = () =>
  import('#controllers/v1/driver/notifications/fetch_notifications_controller')
const MarkNotificationAsReadController = () =>
  import('#controllers/v1/driver/notifications/mark_notification_as_read_controller')

router
  .group(() => {
    router.get('/notifications', [FetchNotificationsController])
    router.patch('/notifications/:notificationIdentifier/read', [MarkNotificationAsReadController])
  })
  .use(middleware.auth({ guards: ['driver'] }))
  .as('driver.notifications')
  .prefix('api/v1/driver')
