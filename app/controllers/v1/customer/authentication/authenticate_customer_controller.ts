import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import Customer from '#models/customer'
import CustomerAuthenticateRequestValidator from '#validators/v1/customer/authentication/customer_authenticate_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import {
  ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES,
  ERROR,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from '#common/messages/system_messages'
import CustomerActions from '#model_management/actions/customer_actions'

export default class AuthenticateCustomerController {
  async handle({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(CustomerAuthenticateRequestValidator)

    try {
      const customer = await CustomerActions.getCustomer({
        identifierType: 'email',
        identifier: email,
      })

      if (customer === null) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Invalid credentials.',
        })
      }

      const isPasswordValid = await hash.verify(customer.password!, password)

      if (!isPasswordValid) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'Invalid credentials.',
        })
      }

      const accessCredentials = await Customer.accessTokens.create(customer, ['*'], {
        expiresIn: `${ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES} minutes`,
      })

      const mutatedCustomerPayload = {
        identifier: customer.identifier,
        firstName: customer.firstName,
        lastName: customer.lastName,
        mobileNumber: customer.mobileNumber,
        registrationSteps: {
          hasVerifiedAccount: customer.customerRegistrationStep.hasActivatedAccount,
        },
        accessCredentials,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Authentication successful.',
        results: mutatedCustomerPayload,
      })
    } catch (AuthenticateCustomerControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
