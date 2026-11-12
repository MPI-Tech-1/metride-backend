import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const FetchOnlineRewardsController = () =>
  import('#controllers/v1/driver/online_rewards/fetch_online_rewards_controller')

router
  .group(() => {
    router.get('/online-rewards', [FetchOnlineRewardsController])
  })
  .use(middleware.auth({ guards: ['driver'] }))
  .as('driver.online_rewards')
  .prefix('api/v1/driver')
