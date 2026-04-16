import { HttpContext } from '@adonisjs/core/http'
import DriverPersonalInformationActions from '#model_management/actions/driver_personal_information_actions'
import UpdatePersonalInformationRequestValidator from '#validators/v1/driver/profile/personal_information/update_personal_information_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class UpdatePersonalInformationController {
  async handle({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(UpdatePersonalInformationRequestValidator)

    try {
      const loggedDriver = auth.use('driver').user!

      const personalInformation =
        await DriverPersonalInformationActions.updateDriverPersonalInformationRecord({
          identifierOptions: { identifier: loggedDriver.id, identifierType: 'driverId' },
          updatePayload: payload,
          dbTransactionOptions: { useTransaction: false },
        })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Personal information updated successfully.',
        results: personalInformation,
      })
    } catch (UpdatePersonalInformationControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
