import { type HttpContext } from '@adonisjs/core/http'
import CustomerActions from '#model_management/actions/customer_actions'
import UpdateCustomerProfileRequestValidator from '#validators/v1/customer/profile/update_customer_profile_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import db from '@adonisjs/lucid/services/db'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class UpdateCustomerProfileController {
  async handle({ request, response, auth }: HttpContext) {
    const { firstName, lastName, mobileNumber } = await request.validateUsing(
      UpdateCustomerProfileRequestValidator
    )

    try {
      const loggedInCustomer = auth.use('customer').user!

      const mobileTaken = await db
        .from('customers')
        .whereNull('deleted_at')
        .where('mobile_number', mobileNumber)
        .whereNot('id', loggedInCustomer.id)
        .first()

      if (mobileTaken) {
        return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
          status_code: HttpStatusCodesEnum.BAD_REQUEST,
          status: ERROR,
          message: 'This phone number is already in use by another account.',
        })
      }

      const updated = await CustomerActions.updateCustomerRecord({
        identifierOptions: { identifier: loggedInCustomer.id, identifierType: 'id' },
        updatePayload: {
          firstName,
          lastName,
          mobileNumber,
        },
        dbTransactionOptions: { useTransaction: false },
      })

      if (!updated) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Customer not found.',
        })
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Profile updated successfully.',
        results: {
          identifier: updated.identifier,
          firstName: updated.firstName,
          lastName: updated.lastName,
          email: updated.email,
          mobileNumber: updated.mobileNumber,
        },
      })
    } catch (UpdateCustomerProfileControllerError) {
      console.log('UpdateCustomerProfileControllerError -> ', UpdateCustomerProfileControllerError)
      await logApplicationError(UpdateCustomerProfileControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
