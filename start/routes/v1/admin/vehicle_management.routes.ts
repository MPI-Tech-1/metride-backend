import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AddVehiclePhotoController = () =>
  import('#controllers/v1/admin/vehicle_management/vehicle_photos/add_vehicle_photo_controller')
const FetchVehiclePhotosController = () =>
  import(
    '#controllers/v1/admin/vehicle_management/vehicle_photos/fetch_vehicle_photos_controller'
  )
const DeleteVehiclePhotoController = () =>
  import(
    '#controllers/v1/admin/vehicle_management/vehicle_photos/delete_vehicle_photo_controller'
  )

router
  .group(() => {
    router.post('/vehicle-photos', [AddVehiclePhotoController])
    router.get('/vehicle-photos', [FetchVehiclePhotosController])
    router.delete('/vehicle-photos/:photoIdentifier', [DeleteVehiclePhotoController])
  })
  .prefix('/api/v1/admins/vehicle-management')
  .as('admin.vehicle_management')
  .use(middleware.auth({ guards: ['admin'] }))
