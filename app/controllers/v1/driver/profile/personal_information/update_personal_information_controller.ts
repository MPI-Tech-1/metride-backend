import { HttpContext } from '@adonisjs/core/http'
import DriverPersonalInformationActions from '#model_management/actions/driver_personal_information_actions'
import UpdatePersonalInformationRequestValidator from '#validators/v1/driver/profile/personal_information/update_personal_information_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'
import DriverRegistrationStepActions from '#model_management/actions/driver_registration_step_actions'
import CityActions from '#model_management/actions/city_actions'

export default class UpdatePersonalInformationController {
  async handle({ request, response, auth }: HttpContext) {
    const { cityIdentifier, nationalIdentificationNumber, dateOfBirth, homeAddress, gender } =
      await request.validateUsing(UpdatePersonalInformationRequestValidator)

    const dbTransaction = await db.transaction()
    try {
      const loggedInDriver = auth.use('driver').user!

      const city = await CityActions.getCity({
        identifierType: 'identifier',
        identifier: cityIdentifier,
      })

      await DriverPersonalInformationActions.updateDriverPersonalInformationRecord({
        identifierOptions: { identifier: loggedInDriver.id, identifierType: 'driverId' },
        updatePayload: {
          nationalIdentificationNumber,
          cityId: city?.id,
          homeAddress,
          gender,
          dateOfBirth,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverRegistrationStepActions.updateDriverRegistrationStepRecord({
        identifierOptions: { identifier: loggedInDriver.id, identifierType: 'driverId' },
        updatePayload: {
          hasProvidedPersonalInformation: true,
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
        message: 'Personal information updated successfully.',
      })
    } catch (UpdatePersonalInformationControllerError) {
      await dbTransaction.rollback()
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
