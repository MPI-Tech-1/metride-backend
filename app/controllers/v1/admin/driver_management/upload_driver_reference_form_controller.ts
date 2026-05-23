import { type HttpContext } from '@adonisjs/core/http'
import DriverActions from '#model_management/actions/driver_actions'
import DriverDocumentActions from '#model_management/actions/driver_document_actions'
import UploadDriverReferenceFormRequestValidator from '#validators/v1/admin/driver_management/upload_driver_reference_form_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class UploadDriverReferenceFormController {
  async handle({ request, response }: HttpContext) {
    const { identifier: driverIdentifier } = request.params()

    const { referenceFormUrl } = await request.validateUsing(
      UploadDriverReferenceFormRequestValidator
    )

    try {
      const driver = await DriverActions.getDriver({
        identifierType: 'identifier',
        identifier: driverIdentifier,
      })

      if (!driver) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Driver not found.',
        })
      }

      const driverDocument = await DriverDocumentActions.getDriverDocument({
        identifierType: 'driverId',
        identifier: driver.id,
      })

      if (!driverDocument) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Driver document record not found.',
        })
      }

      await DriverDocumentActions.updateDriverDocumentRecord({
        identifierOptions: {
          identifierType: 'id',
          identifier: driverDocument.id,
        },
        updatePayload: {
          referencePhotoUrl: referenceFormUrl,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver reference form uploaded successfully.',
        results: {
          driverIdentifier: driver.identifier,
          referenceFormUrl,
        },
      })
    } catch (UploadDriverReferenceFormControllerError) {
      console.log(
        'UploadDriverReferenceFormControllerError -> ',
        UploadDriverReferenceFormControllerError
      )
      await logApplicationError(UploadDriverReferenceFormControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
