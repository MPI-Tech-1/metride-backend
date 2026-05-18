import { type HttpContext } from '@adonisjs/core/http'
import DriverActions from '#model_management/actions/driver_actions'
import DriverVehiclePhotoActions from '#model_management/actions/driver_vehicle_photo_actions'
import AddVehiclePhotoRequestValidator from '#validators/v1/admin/driver_management/vehicle_photos/add_vehicle_photo_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class AddVehiclePhotoController {
  async handle({ request, response }: HttpContext) {
    const { identifier } = request.params()

    const { section, photoUrl } = await request.validateUsing(AddVehiclePhotoRequestValidator)

    try {
      const driver = await DriverActions.getDriver({
        identifierType: 'identifier',
        identifier,
      })

      if (!driver) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Driver not found.',
        })
      }

      const vehiclePhoto = await DriverVehiclePhotoActions.createDriverVehiclePhotoRecord({
        createPayload: {
          driverId: driver.id,
          section,
          photoUrl,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Vehicle photo added successfully.',
        results: {
          identifier: vehiclePhoto.identifier,
          section: vehiclePhoto.section,
          photoUrl: vehiclePhoto.photoUrl,
          createdAt: vehiclePhoto.createdAt,
        },
      })
    } catch (AddVehiclePhotoControllerError) {
      console.log('AddVehiclePhotoControllerError -> ', AddVehiclePhotoControllerError)
      await logApplicationError(AddVehiclePhotoControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
