import { HttpContext } from '@adonisjs/core/http'
import DriverDocumentActions from '#model_management/actions/driver_document_actions'
import UpdateDocumentsRequestValidator from '#validators/v1/driver/profile/documents/update_documents_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'
import DriverRegistrationStepActions from '#model_management/actions/driver_registration_step_actions'

export default class UpdateDocumentsController {
  async handle({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(UpdateDocumentsRequestValidator)

    const dbTransaction = await db.transaction()
    try {
      const loggedInDriver = auth.use('driver').user!

      await DriverDocumentActions.updateDriverDocumentRecord({
        identifierOptions: { identifier: loggedInDriver.id, identifierType: 'driverId' },
        updatePayload: payload,
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverRegistrationStepActions.updateDriverRegistrationStepRecord({
        identifierOptions: {
          identifierType: 'driverId',
          identifier: loggedInDriver.id,
        },
        updatePayload: {
          hasProvidedRequiredDocuments: true,
        },
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction,
        },
      })

      await dbTransaction.commit()
      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Documents updated successfully.',
      })
    } catch (UpdateDocumentsControllerError) {
      await dbTransaction.rollback()
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
