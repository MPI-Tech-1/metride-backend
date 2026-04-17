import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import Driver from '#models/driver'
import DriverAuthenticateRequestValidator from '#validators/v1/driver/authentication/driver_authenticate_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import {
  ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES,
  ERROR,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from '#common/messages/system_messages'
import DriverActions from '#model_management/actions/driver_actions'

export default class AuthenticateDriverController {
  async handle({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(DriverAuthenticateRequestValidator)

    try {
      const driver = await DriverActions.getDriver({
        identifierType: 'email',
        identifier: email,
      })

      if (driver === null) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Invalid credentials.',
        })
      }

      const isPasswordValid = await hash.verify(driver.password!, password)

      if (!isPasswordValid) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Invalid credentials.',
        })
      }

      const accessCredentials = await Driver.accessTokens.create(driver, ['*'], {
        expiresIn: `${ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES} minutes`,
      })

      const mutatedDriverPayload = {
        identifier: driver.identifier,
        firstName: driver.firstName,
        lastName: driver.lastName,
        mobileNumber: driver.mobileNumber,
        registrationSteps: {
          hasVerifiedAccount: driver.driverRegistrationStep.hasActivatedAccount,
          hasProvidedPersonalInformation:
            driver.driverRegistrationStep.hasProvidedPersonalInformation,
          hasProvidedVehicleInformation:
            driver.driverRegistrationStep.hasProvidedVehicleInformation,
          hasProvidedRequiredDocuments: driver.driverRegistrationStep.hasProvidedRequiredDocuments,
        },
        accessCredentials,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Authentication successful.',
        results: mutatedDriverPayload,
      })
    } catch (AuthenticateDriverControllerError) {
      console.log(AuthenticateDriverControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
