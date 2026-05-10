import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import DriverActions from '#model_management/actions/driver_actions'
import DriverApprovalStepActions from '#model_management/actions/driver_approval_step_actions'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import NotificationDispatchClient from '#infrastructure_providers/internals/notification_dispatch_client'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class ApproveDriverController {
  async handle({ request, auth, response }: HttpContext) {
    const { identifier } = request.params()

    const dbTransaction = await db.transaction()

    try {
      const loggedInAdmin = auth.use('admin').user!

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

      await DriverActions.updateDriverRecord({
        identifierOptions: {
          identifierType: 'id',
          identifier: driver.id,
        },
        updatePayload: {
          status: 'approved',
        },
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction: dbTransaction,
        },
      })

      await DriverApprovalStepActions.createDriverApprovalStepRecord({
        createPayload: {
          driverId: driver.id,
          performedByAdminId: loggedInAdmin.id,
          status: 'approved',
          reason: 'Information Sufficient',
        },
        dbTransactionOptions: {
          useTransaction: true,
          dbTransaction: dbTransaction,
        },
      })

      await dbTransaction.commit()

      await NotificationDispatchClient.sendDriverAccountApprovedNotificationJob({
        driverId: driver.id,
      })
      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Driver approved successfully.',
      })
    } catch (ApproveDriverControllerError) {
      await dbTransaction.rollback()
      console.log('ApproveDriverControllerError -> ', ApproveDriverControllerError)
      await logApplicationError(ApproveDriverControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
