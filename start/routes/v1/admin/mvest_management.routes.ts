import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AdminRoleEnum from '#common/enums/admin_role_enum'

const CreateOwner = () => import('#controllers/v1/admin/mvest/create_mvest_owner_controller')
const FetchOwners = () => import('#controllers/v1/admin/mvest/fetch_mvest_owners_controller')
const UpdateOwner = () => import('#controllers/v1/admin/mvest/update_mvest_owner_controller')
const FetchAvailableVehicles = () =>
  import('#controllers/v1/admin/mvest/fetch_available_mvest_vehicles_controller')
const CreateAgreement = () =>
  import('#controllers/v1/admin/mvest/create_mvest_agreement_controller')
const UpdateAgreement = () =>
  import('#controllers/v1/admin/mvest/update_mvest_agreement_controller')
const FetchEarnings = () => import('#controllers/v1/admin/mvest/fetch_mvest_earnings_controller')
const MarkPaid = () => import('#controllers/v1/admin/mvest/mark_mvest_earning_paid_controller')

router
  .group(() => {
    router.post('/owners', [CreateOwner])
    router.get('/owners', [FetchOwners])
    router.patch('/owners/:identifier', [UpdateOwner])
    router.get('/available-vehicles', [FetchAvailableVehicles])
    router.post('/agreements', [CreateAgreement])
    router.patch('/agreements/:identifier', [UpdateAgreement])
    router.get('/earnings', [FetchEarnings])
    router.post('/earnings/:identifier/mark-paid', [MarkPaid])
  })
  .prefix('/api/v1/admins/mvest')
  .as('admin.mvest')
  .use(middleware.auth({ guards: ['admin'] }))
  .use(
    middleware.adminRole({
      roles: [AdminRoleEnum.ADMIN, AdminRoleEnum.FINANCE, AdminRoleEnum.OPERATIONS],
    })
  )
