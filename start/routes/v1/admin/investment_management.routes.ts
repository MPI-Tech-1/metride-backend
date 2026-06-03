import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CreateInvestorController = () =>
  import('#controllers/v1/admin/investment_management/investors/create_investor_controller')
const UpdateInvestorController = () =>
  import('#controllers/v1/admin/investment_management/investors/update_investor_controller')
const FetchInvestorsController = () =>
  import('#controllers/v1/admin/investment_management/investors/fetch_investors_controller')
const GetInvestorController = () =>
  import('#controllers/v1/admin/investment_management/investors/get_investor_controller')

const CreateInvestorVehicleController = () =>
  import('#controllers/v1/admin/investment_management/investor_vehicles/create_investor_vehicle_controller')
const UpdateInvestorVehicleController = () =>
  import('#controllers/v1/admin/investment_management/investor_vehicles/update_investor_vehicle_controller')
const FetchInvestorVehiclesController = () =>
  import('#controllers/v1/admin/investment_management/investor_vehicles/fetch_investor_vehicles_controller')
const GetInvestorVehicleController = () =>
  import('#controllers/v1/admin/investment_management/investor_vehicles/get_investor_vehicle_controller')
const DeleteInvestorVehicleController = () =>
  import('#controllers/v1/admin/investment_management/investor_vehicles/delete_investor_vehicle_controller')

const FetchInvestorVehicleEarningsController = () =>
  import('#controllers/v1/admin/investment_management/investor_vehicle_earnings/fetch_investor_vehicle_earnings_controller')
const GetInvestorVehicleEarningController = () =>
  import('#controllers/v1/admin/investment_management/investor_vehicle_earnings/get_investor_vehicle_earning_controller')
const PayoutInvestorVehicleEarningController = () =>
  import('#controllers/v1/admin/investment_management/investor_vehicle_earnings/payout_investor_vehicle_earning_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('/', [CreateInvestorController])
        router.patch('/:identifier', [UpdateInvestorController])
        router.get('/', [FetchInvestorsController])
        router.get('/:identifier', [GetInvestorController])
      })
      .prefix('/investors')

    router
      .group(() => {
        router.post('/', [CreateInvestorVehicleController])
        router.patch('/:identifier', [UpdateInvestorVehicleController])
        router.get('/', [FetchInvestorVehiclesController])
        router.get('/:identifier', [GetInvestorVehicleController])
        router.delete('/:identifier', [DeleteInvestorVehicleController])
      })
      .prefix('/investor-vehicles')

    router
      .group(() => {
        router.get('/', [FetchInvestorVehicleEarningsController])
        router.get('/:identifier', [GetInvestorVehicleEarningController])
        router.post('/:identifier/payout', [PayoutInvestorVehicleEarningController])
      })
      .prefix('/investor-vehicle-earnings')
  })
  .prefix('/api/v1/admins/investment-management')
  .as('admin.investment_management')
  .use(middleware.auth({ guards: ['admin'] }))
