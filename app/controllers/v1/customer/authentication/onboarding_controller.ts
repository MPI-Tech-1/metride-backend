import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import CustomerActions from '#model_management/actions/customer_actions'
import CustomerOnboardingRequestValidator from '#validators/v1/customer/authentication/customer_onboarding_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import {
  ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES,
  ERROR,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from '#common/messages/system_messages'
import Customer from '#models/customer'

export default class OnboardingController {
  async handle({ request, response }: HttpContext) {
    try {
      const { firstName, lastName, mobileNumber, password, fcmToken } = await request.validateUsing(
        CustomerOnboardingRequestValidator
      )

      const customer = await CustomerActions.createCustomerRecord({
        createPayload: {
          firstName,
          lastName,
          mobileNumber,
          password: await hash.make(password),
          fcmToken,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      const accessCredentials = await Customer.accessTokens.create(customer, ['*'], {
        expiresIn: `${ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES} minutes`,
      })

      const mutatedCustomerPayload = {
        identifier: customer.identifier,
        firstName: customer.firstName,
        lastName: customer.lastName,
        mobileNumber: customer.mobileNumber,
        accessCredentials,
      }

      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Welcome to metride',
        results: mutatedCustomerPayload,
      })
    } catch (OnboardingControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
