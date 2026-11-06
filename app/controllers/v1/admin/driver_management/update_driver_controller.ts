import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import DriverActions from '#model_management/actions/driver_actions'
import DriverPersonalInformationActions from '#model_management/actions/driver_personal_information_actions'
import CityActions from '#model_management/actions/city_actions'
import UpdateDriverRequestValidator from '#validators/v1/admin/driver_management/update_driver_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import logApplicationError from '#common/helper_functions/log_application_error'
import type Driver from '#models/driver'
import type DriverPersonalInformation from '#models/driver_personal_information'

export default class UpdateDriverController {
  async handle({ request, response }: HttpContext) {
    const { identifier } = request.params()

    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      cityIdentifier,
      dateOfBirth,
      gender,
      homeAddress,
      nationalIdentificationNumber,
    } = await request.validateUsing(UpdateDriverRequestValidator, {
      meta: { driverIdentifier: identifier },
    })

    const driverUpdatePayload: Partial<
      Pick<Driver, 'firstName' | 'lastName' | 'email' | 'mobileNumber'>
    > = {}
    if (firstName !== undefined) driverUpdatePayload.firstName = firstName
    if (lastName !== undefined) driverUpdatePayload.lastName = lastName
    if (email !== undefined) driverUpdatePayload.email = email
    if (mobileNumber !== undefined) driverUpdatePayload.mobileNumber = mobileNumber

    const personalInformationUpdatePayload: Partial<
      Pick<
        DriverPersonalInformation,
        'cityId' | 'dateOfBirth' | 'gender' | 'homeAddress' | 'nationalIdentificationNumber'
      >
    > = {}
    if (dateOfBirth !== undefined) {
      personalInformationUpdatePayload.dateOfBirth = dateOfBirth
    }
    if (gender !== undefined) personalInformationUpdatePayload.gender = gender
    if (homeAddress !== undefined) personalInformationUpdatePayload.homeAddress = homeAddress
    if (nationalIdentificationNumber !== undefined) {
      personalInformationUpdatePayload.nationalIdentificationNumber = nationalIdentificationNumber
    }

    if (
      Object.keys(driverUpdatePayload).length === 0 &&
      Object.keys(personalInformationUpdatePayload).length === 0 &&
      cityIdentifier === undefined
    ) {
      return response.status(HttpStatusCodesEnum.BAD_REQUEST).send({
        status_code: HttpStatusCodesEnum.BAD_REQUEST,
        status: ERROR,
        message: 'Please provide at least one field to update.',
      })
    }

    const dbTransaction = await db.transaction()
    try {
      const driver = await DriverActions.getDriver({
        identifierType: 'identifier',
        identifier,
      })

      if (!driver) {
        await dbTransaction.rollback()
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Driver not found.',
        })
      }

      if (cityIdentifier !== undefined) {
        const city = await CityActions.getCity({
          identifierType: 'identifier',
          identifier: cityIdentifier,
        })
        personalInformationUpdatePayload.cityId = city!.id
      }

      if (Object.keys(driverUpdatePayload).length > 0) {
        await DriverActions.updateDriverRecord({
          identifierOptions: { identifierType: 'id', identifier: driver.id },
          updatePayload: driverUpdatePayload,
          dbTransactionOptions: { useTransaction: true, dbTransaction },
        })
      }

      if (Object.keys(personalInformationUpdatePayload).length > 0) {
        const existingPersonalInformation =
          await DriverPersonalInformationActions.getDriverPersonalInformation({
            identifierType: 'driverId',
            identifier: driver.id,
          })

        if (existingPersonalInformation) {
          await DriverPersonalInformationActions.updateDriverPersonalInformationRecord({
            identifierOptions: { identifierType: 'id', identifier: existingPersonalInformation.id },
            updatePayload: personalInformationUpdatePayload,
            dbTransactionOptions: { useTransaction: true, dbTransaction },
          })
        } else {
          await DriverPersonalInformationActions.createDriverPersonalInformationRecord({
            createPayload: { driverId: driver.id, ...personalInformationUpdatePayload },
            dbTransactionOptions: { useTransaction: true, dbTransaction },
          })
        }
      }

      await dbTransaction.commit()

      const updatedDriver = await DriverActions.getDriver({
        identifierType: 'id',
        identifier: driver.id,
      })
      const updatedPersonalInformation =
        await DriverPersonalInformationActions.getDriverPersonalInformation({
          identifierType: 'driverId',
          identifier: driver.id,
        })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver information updated successfully.',
        results: {
          identifier: updatedDriver!.identifier,
          firstName: updatedDriver!.firstName,
          lastName: updatedDriver!.lastName,
          fullName: updatedDriver!.fullName,
          email: updatedDriver!.email,
          mobileNumber: updatedDriver!.mobileNumber,
          status: updatedDriver!.status,
          updatedAt: updatedDriver!.updatedAt,
          driverPersonalInformation: updatedPersonalInformation
            ? {
                identifier: updatedPersonalInformation.identifier,
                dateOfBirth: updatedPersonalInformation.dateOfBirth,
                gender: updatedPersonalInformation.gender,
                homeAddress: updatedPersonalInformation.homeAddress,
                nationalIdentificationNumber:
                  updatedPersonalInformation.nationalIdentificationNumber,
                city: updatedPersonalInformation.city
                  ? {
                      identifier: updatedPersonalInformation.city.identifier,
                      name: updatedPersonalInformation.city.name,
                    }
                  : null,
                updatedAt: updatedPersonalInformation.updatedAt,
              }
            : null,
        },
      })
    } catch (UpdateDriverControllerError) {
      await dbTransaction.rollback()
      console.log('UpdateDriverControllerError -> ', UpdateDriverControllerError)
      await logApplicationError(UpdateDriverControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
