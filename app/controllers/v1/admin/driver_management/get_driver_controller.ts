import { type HttpContext } from '@adonisjs/core/http'
import DriverActions from '#model_management/actions/driver_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class GetDriverController {
  async handle({ params, response }: HttpContext) {
    const { identifier } = params

    try {
      const driver = await DriverActions.getDriver({
        identifierType: 'identifier',
        identifier,
      })

      if (!driver) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Driver not found.',
        })
      }

      const mutatedResponsePayload = {
        identifier: driver.identifier,
        firstName: driver.firstName,
        lastName: driver.lastName,
        email: driver.email,
        mobileNumber: driver.mobileNumber,
        fcmToken: driver.fcmToken,
        lastLoggedInAt: driver.lastLoggedInAt,
        status: driver.status,
        createdAt: driver.createdAt,
        updatedAt: driver.updatedAt,
        driverPersonalInformation: {
          identifier: driver.driverPersonalInformation?.identifier,
          dateOfBirth: driver.driverPersonalInformation?.dateOfBirth,
          gender: driver.driverPersonalInformation?.gender,
          homeAddress: driver.driverPersonalInformation?.homeAddress,
          cityId: driver.driverPersonalInformation?.cityId,
          nationalIdentificationNumber:
            driver.driverPersonalInformation?.nationalIdentificationNumber,
          createdAt: driver.driverPersonalInformation?.createdAt,
          updatedAt: driver.driverPersonalInformation?.updatedAt,
        },
        driverRegistrationStep: {
          identifier: driver.driverRegistrationStep?.identifier,
          hasActivatedAccount: driver.driverRegistrationStep?.hasActivatedAccount,
          hasProvidedPersonalInformation:
            driver.driverRegistrationStep?.hasProvidedPersonalInformation,
          hasProvidedVehicleInformation:
            driver.driverRegistrationStep?.hasProvidedVehicleInformation,
          hasProvidedRequiredDocuments: driver.driverRegistrationStep?.hasProvidedRequiredDocuments,
          hasProvidedBankAccount: driver.driverRegistrationStep?.hasProvidedBankAccount,
        },
        driverBankAccount: {
          identifier: driver.driverBankAccount?.identifier,
          bank: driver.driverBankAccount.bank
            ? {
                identifier: driver.driverBankAccount.bank.identifier,
                name: driver.driverBankAccount.bank.name,
              }
            : null,
          accountName: driver.driverBankAccount?.accountName,
          accountNumber: driver.driverBankAccount?.accountNumber,
          createdAt: driver.driverBankAccount?.createdAt,
          updatedAt: driver.driverBankAccount?.updatedAt,
        },
        driverDocument: {
          identifier: driver.driverDocument?.identifier,
          passportPhotographUrl: driver.driverDocument?.passportPhotographUrl,
          driverLicenceUrl: driver.driverDocument?.driverLicenceUrl,
          vehiclePaperUrl: driver.driverDocument?.vehiclePaperUrl,
          vehiclePhotoUrl: driver.driverDocument?.vehiclePhotoUrl,
          createdAt: driver.driverDocument?.createdAt,
          updatedAt: driver.driverDocument?.updatedAt,
        },
        driverApprovalSteps: driver.driverApprovalSteps.map((driverApprovalStep) => {
          return {
            identifier: driverApprovalStep.identifier,
            status: driverApprovalStep.status,
            reason: driverApprovalStep.reason,
            createdAt: driverApprovalStep.createdAt,
            updatedAt: driverApprovalStep.updatedAt,
          }
        }),
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver fetched successfully.',
        results: mutatedResponsePayload,
      })
    } catch (GetDriverControllerError) {
      console.log('GetDriverControllerError -> ', GetDriverControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
