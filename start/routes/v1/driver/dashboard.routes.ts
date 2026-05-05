import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const FetchBookingsMetricsController = () =>
  import('#controllers/v1/driver/dashboard/fetch_bookings_metrics_controller')

router
  .group(() => {
    router.get('/dashboard/bookings-metrics', [FetchBookingsMetricsController])
  })
  .use(middleware.auth({ guards: ['driver'] }))
  .as('driver.dashboard')
  .prefix('api/v1/driver')
