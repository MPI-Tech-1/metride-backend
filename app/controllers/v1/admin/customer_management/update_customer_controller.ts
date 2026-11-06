import { type HttpContext } from '@adonisjs/core/http'
import CustomerActions from '#model_management/actions/customer_actions'
import UpdateCustomerRequestValidator from '#validators/v1/admin/customer_management/update_customer_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'
import type Customer from '#models/customer'

export default class UpdateCustomerController {
  async handle({ request, response }: HttpContext) {
    const { identifier } = request.params()

    const { firstName, lastName, email, mobileNumber } = await request.validateUsing(
      UpdateCustomerRequestValidator,
      { meta: { customerIdentifier: identifier } }
    )

    const updatePayload: Partial<
      Pick<Customer, 'firstName' | 'lastName' | 'email' | 'mobileNumber'>
    > = {}
    if (firstName !== undefined) updatePayload.firstName = firstName
    if (lastName !== undefined) updatePayload.lastName = lastName
    if (email !== undefined) updatePayload.email = email
    if (mobileNumber !== undefined) updatePayload.mobileNumber = mobileNumber

    if (Object.keys(updatePayload).length === 0) {
      return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
        status_code: HttpStatusCodesEnum.BAD_REQUEST,
        status: ERROR,
        message: 'Please provide at least one field to update.',
      })
    }

    try {
      const customer = await CustomerActions.updateCustomerRecord({
        identifierOptions: { identifierType: 'identifier', identifier },
        updatePayload,
        dbTransactionOptions: { useTransaction: false },
      })

      if (!customer) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Customer not found.',
        })
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Customer information updated successfully.',
        results: {
          identifier: customer.identifier,
          firstName: customer.firstName,
          lastName: customer.lastName,
          fullName: customer.fullName,
          email: customer.email,
          mobileNumber: customer.mobileNumber,
          lastLoggedInAt: customer.lastLoggedInAt,
          updatedAt: customer.updatedAt,
        },
      })
    } catch (UpdateCustomerControllerError) {
      console.log('UpdateCustomerControllerError -> ', UpdateCustomerControllerError)
      await logApplicationError(UpdateCustomerControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
