import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const FetchCustomersController = () =>
  import('#controllers/v1/admin/customer_management/fetch_customers_controller')
const GetCustomerController = () =>
  import('#controllers/v1/admin/customer_management/get_customer_controller')

router
  .group(() => {
    router.get('/', [FetchCustomersController])
    router.get('/:identifier', [GetCustomerController])
  })
  .prefix('/api/v1/admins/customer-management/customers')
  .as('admin.customer_management.customers')
  .use(middleware.auth({ guards: ['admin'] }))
