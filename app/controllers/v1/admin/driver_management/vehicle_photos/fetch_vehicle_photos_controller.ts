import { type HttpContext } from '@adonisjs/core/http'
import DriverActions from '#model_management/actions/driver_actions'
import DriverVehiclePhotoActions from '#model_management/actions/driver_vehicle_photo_actions'
import ListVehiclePhotosRequestValidator from '#validators/v1/admin/driver_management/vehicle_photos/list_vehicle_photos_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class FetchVehiclePhotosController {
  async handle({ request, response }: HttpContext) {
    const { identifier } = request.params()

    const { page = 1, limit = 10 } = await request.validateUsing(ListVehiclePhotosRequestValidator)

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

      const { driverVehiclePhotoPayload: photos, paginationMeta } =
        await DriverVehiclePhotoActions.listDriverVehiclePhotos({
          filterRecordOptionsPayload: { driverId: driver.id },
          paginationPayload: { page, limit },
        })

      const mutatedPhotos = photos.map((photo) => ({
        identifier: photo.identifier,
        section: photo.section,
        photoUrl: photo.photoUrl,
        createdAt: photo.createdAt,
      }))

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Vehicle photos fetched successfully.',
        results: {
          photos: mutatedPhotos,
          paginationMeta,
        },
      })
    } catch (FetchVehiclePhotosControllerError) {
      console.log('FetchVehiclePhotosControllerError -> ', FetchVehiclePhotosControllerError)
      await logApplicationError(FetchVehiclePhotosControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
