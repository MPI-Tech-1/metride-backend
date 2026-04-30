import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import DriverActions from '#model_management/actions/driver_actions'
import DriverApprovalStepActions from '#model_management/actions/driver_approval_step_actions'
import RejectDriverRequestValidator from '#validators/v1/admin/driver_management/reject_driver_request_validator'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'

export default class RejectDriverController {
  async handle({ request, response }: HttpContext) {
    const { identifier } = request.params()

    const { reason } = await request.validateUsing(RejectDriverRequestValidator)

    const trx = await db.transaction()

    try {
      const driver = await DriverActions.getDriver({
        identifierType: 'identifier',
        identifier,
      })

      if (!driver) {
        await trx.rollback()
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Driver not found.',
        })
      }

      await DriverActions.updateDriverRecord({
        identifierOptions: {
          identifierType: 'id',
          identifier: driver.id,
        },
        updatePayload: {
          status: 'rejected',
        },
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction: trx,
        },
      })

      await DriverApprovalStepActions.createDriverApprovalStepRecord({
        createPayload: {
          driverId: driver.id,
          status: 'rejected',
          reason: reason,
        },
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction: trx,
        },
      })

      await trx.commit()

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver rejected successfully.',
      })
    } catch (RejectDriverControllerError) {
      await trx.rollback()
      console.log('RejectDriverControllerError -> ', RejectDriverControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
