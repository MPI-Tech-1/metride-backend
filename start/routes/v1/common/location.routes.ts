import router from '@adonisjs/core/services/router'

const FetchCitiesController = () =>
  import('#controllers/v1/common/location/fetch_cities_controller')

router
  .group(() => {
    router.get('/cities', [FetchCitiesController])
  })
  .prefix('/api/v1/common/location')
  .as('common.location')
