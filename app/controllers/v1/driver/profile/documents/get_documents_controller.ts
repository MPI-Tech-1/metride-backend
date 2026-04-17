import { HttpContext } from '@adonisjs/core/http'
import DriverDocumentActions from '#model_management/actions/driver_document_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class GetDocumentsController {
  async handle({ response, auth }: HttpContext) {
    try {
      const loggedInDriver = auth.use('driver').user!

      const document = await DriverDocumentActions.getDriverDocument({
        identifier: loggedInDriver.id,
        identifierType: 'driverId',
      })

      const responsePayload = {
        identifier: document?.identifier,

        driverLicenceUrl: document?.driverLicenceUrl,

        passportPhotographUrl: document?.passportPhotographUrl,

        vehiclePaperUrl: document?.vehiclePaperUrl,

        vehiclePhotoUrl: document?.vehiclePhotoUrl,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Documents retrieved successfully.',
        results: responsePayload,
      })
    } catch (GetDocumentsControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
