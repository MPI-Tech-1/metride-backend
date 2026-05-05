import { type HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import DriverActions from '#model_management/actions/driver_actions'
import DriverOnboardingRequestValidator from '#validators/v1/driver/authentication/driver_onboarding_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import {
  ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES,
  ERROR,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from '#common/messages/system_messages'
import Driver from '#models/driver'
import db from '@adonisjs/lucid/services/db'
import DriverRegistrationStepActions from '#model_management/actions/driver_registration_step_actions'
import DriverPersonalInformationActions from '#model_management/actions/driver_personal_information_actions'
import DriverVehicleActions from '#model_management/actions/driver_vehicle_actions'
import DriverDocumentActions from '#model_management/actions/driver_document_actions'
import DriverBankAccountActions from '#model_management/actions/driver_bank_account_actions'
import DriverApprovalStepActions from '#model_management/actions/driver_approval_step_actions'
import DriverWalletActions from '#model_management/actions/driver_wallet_actions'

export default class OnboardingController {
  async handle({ request, response }: HttpContext) {
    const { firstName, lastName, mobileNumber, password, fcmToken, email } =
      await request.validateUsing(DriverOnboardingRequestValidator)

    const dbTransaction = await db.transaction()

    try {
      const driver = await DriverActions.createDriverRecord({
        createPayload: {
          firstName,
          lastName,
          email,
          mobileNumber,
          password: await hash.make(password),
          fcmToken,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverRegistrationStepActions.createDriverRegistrationStepRecord({
        createPayload: {
          driverId: driver.id,
          hasActivatedAccount: false,
          hasProvidedPersonalInformation: false,
          hasProvidedVehicleInformation: false,
          hasProvidedRequiredDocuments: false,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverPersonalInformationActions.createDriverPersonalInformationRecord({
        createPayload: {
          driverId: driver.id,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverVehicleActions.createDriverVehicleRecord({
        createPayload: {
          driverId: driver.id,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverDocumentActions.createDriverDocumentRecord({
        createPayload: {
          driverId: driver.id,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverBankAccountActions.createDriverBankAccountRecord({
        createPayload: {
          driverId: driver.id,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverApprovalStepActions.createDriverApprovalStepRecord({
        createPayload: {
          driverId: driver.id,
          status: 'pending',
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      await DriverWalletActions.createDriverWalletRecord({
        createPayload: {
          driverId: driver.id,
        },
        dbTransactionOptions: { useTransaction: true, dbTransaction },
      })

      const accessCredentials = await Driver.accessTokens.create(driver, ['*'], {
        expiresIn: `${ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES} minutes`,
      })

      const mutatedDriverPayload = {
        identifier: driver.identifier,
        firstName: driver.firstName,
        lastName: driver.lastName,
        mobileNumber: driver.mobileNumber,
        registrationSteps: {
          hasVerifiedAccount: false,
          hasProvidedPersonalInformation: false,
          hasProvidedVehicleInformation: false,
          hasProvidedRequiredDocuments: false,
        },
        accessCredentials,
      }

      await dbTransaction.commit()
      return response.status(HttpStatusCodesEnum.CREATED).send({
        status_code: HttpStatusCodesEnum.CREATED,
        status: SUCCESS,
        message: 'Welcome to metride',
        results: mutatedDriverPayload,
      })
    } catch (OnboardingControllerError) {
      await dbTransaction.rollback()
      console.log('OnboardingControllerError -> ', OnboardingControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
