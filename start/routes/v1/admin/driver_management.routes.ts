import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FetchDriversController = () =>
  import('#controllers/v1/admin/driver_management/fetch_drivers_controller')
const GetDriverController = () =>
  import('#controllers/v1/admin/driver_management/get_driver_controller')
const ApproveDriverController = () =>
  import('#controllers/v1/admin/driver_management/approve_driver_controller')
const RejectDriverController = () =>
  import('#controllers/v1/admin/driver_management/reject_driver_controller')

router
  .group(() => {
    router.get('/', [FetchDriversController])
    router.get('/:identifier', [GetDriverController])
    router.post('/:identifier/approve', [ApproveDriverController])
    router.post('/:identifier/reject', [RejectDriverController])
  })
  .prefix('/api/v1/admins/driver-management/drivers')
  .as('admin.driver_management')
  .use(middleware.auth({ guards: ['admin'] }))
