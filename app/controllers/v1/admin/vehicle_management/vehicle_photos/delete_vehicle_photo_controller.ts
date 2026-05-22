import { type HttpContext } from '@adonisjs/core/http'
import DriverVehiclePhotoActions from '#model_management/actions/driver_vehicle_photo_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class DeleteVehiclePhotoController {
  async handle({ request, response }: HttpContext) {
    const { photoIdentifier } = request.params()

    try {
      const vehiclePhoto = await DriverVehiclePhotoActions.getDriverVehiclePhoto({
        identifierType: 'identifier',
        identifier: photoIdentifier,
      })

      if (!vehiclePhoto) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Vehicle photo not found.',
        })
      }

      await DriverVehiclePhotoActions.deleteDriverVehiclePhotoRecord({
        identifierOptions: {
          identifierType: 'id',
          identifier: vehiclePhoto.id,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Vehicle photo deleted successfully.',
      })
    } catch (DeleteVehiclePhotoControllerError) {
      console.log('DeleteVehiclePhotoControllerError -> ', DeleteVehiclePhotoControllerError)
      await logApplicationError(DeleteVehiclePhotoControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
