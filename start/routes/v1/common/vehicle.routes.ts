const FetchVehicleMakesControllers = () =>
  import('#controllers/v1/common/vehicle/fetch_vehicle_makes_controller')
const FetchVehicleModelsController = () =>
  import('#controllers/v1/common/vehicle/fetch_vehicle_models_controller')
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/vehicle-models', [FetchVehicleModelsController])
    router.get('/vehicle-makes', [FetchVehicleMakesControllers])
  })
  .prefix('/api/v1/common/vehicle')
  .as('common.vehicle')
