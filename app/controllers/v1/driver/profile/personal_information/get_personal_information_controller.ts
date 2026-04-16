import { HttpContext } from '@adonisjs/core/http'
import DriverPersonalInformationActions from '#model_management/actions/driver_personal_information_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class GetPersonalInformationController {
  async handle({ response, auth }: HttpContext) {
    try {
      const loggedDriver = auth.use('driver').user!

      const personalInformation =
        await DriverPersonalInformationActions.getDriverPersonalInformation({
          identifier: loggedDriver.id,
          identifierType: 'driverId',
        })

      const mutatedResponse = {
        identifier: personalInformation?.identifier,
        cityId: personalInformation?.cityId,
        dateOfBirth: personalInformation?.dateOfBirth,
        gender: personalInformation?.gender,
        homeAddress: personalInformation?.homeAddress,
        nationalIdentificationNumber: personalInformation?.nationalIdentificationNumber,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Personal information retrieved successfully.',
        results: mutatedResponse,
      })
    } catch (GetPersonalInformationControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
