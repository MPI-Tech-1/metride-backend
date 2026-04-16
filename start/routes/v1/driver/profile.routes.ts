import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const GetPersonalInformationController = () =>
  import('#controllers/v1/driver/profile/personal_information/get_personal_information_controller')

const UpdatePersonalInformationController = () =>
  import(
    '#controllers/v1/driver/profile/personal_information/update_personal_information_controller'
  )

const GetVehicleInformationController = () =>
  import('#controllers/v1/driver/profile/vehicle_information/get_vehicle_information_controller')

const UpdateVehicleInformationController = () =>
  import(
    '#controllers/v1/driver/profile/vehicle_information/update_vehicle_information_controller'
  )

const GetBankAccountController = () =>
  import('#controllers/v1/driver/profile/bank_account/get_bank_account_controller')

const UpdateBankAccountController = () =>
  import('#controllers/v1/driver/profile/bank_account/update_bank_account_controller')

const GetDocumentsController = () =>
  import('#controllers/v1/driver/profile/documents/get_documents_controller')

const UpdateDocumentsController = () =>
  import('#controllers/v1/driver/profile/documents/update_documents_controller')

router
  .group(() => {
    router.get('/personal-information', [GetPersonalInformationController])
    router.patch('/personal-information', [UpdatePersonalInformationController])

    router.get('/vehicle-information', [GetVehicleInformationController])
    router.patch('/vehicle-information', [UpdateVehicleInformationController])

    router.get('/bank-account', [GetBankAccountController])
    router.patch('/bank-account', [UpdateBankAccountController])

    router.get('/documents', [GetDocumentsController])
    router.patch('/documents', [UpdateDocumentsController])
  })
  .prefix('/v1/drivers/profile')
  .as('driver.profile')
  .use(middleware.auth({ guards: ['driver'] }))
