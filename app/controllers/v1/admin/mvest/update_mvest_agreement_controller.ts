import type { HttpContext } from '@adonisjs/core/http'
import MvestVehicleAgreement from '#models/mvest_vehicle_agreement'
import DriverVehicle from '#models/driver_vehicle'
import DriverSetting from '#models/driver_setting'
import vine from '@vinejs/vine'

const validator = vine.compile(
  vine.object({
    commissionPercentage: vine.number().min(0).max(100).optional(),
    endsAt: vine
      .date({ formats: ['iso8601'] })
      .nullable()
      .optional(),
    isActive: vine.boolean().optional(),
  })
)

export default class UpdateMvestAgreementController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(validator)
    const agreement = await MvestVehicleAgreement.query()
      .where('identifier', request.param('identifier'))
      .first()
    if (!agreement)
      return response.notFound({
        status: 'error',
        status_code: 404,
        message: 'MVest agreement not found.',
      })
    if (payload.commissionPercentage !== undefined) {
      const vehicle = await DriverVehicle.query().where('id', agreement.driverVehicleId).first()
      const driverSetting = vehicle
        ? await DriverSetting.query()
            .where('driver_id', vehicle.driverId)
            .orderBy('created_at', 'desc')
            .first()
        : null
      if (Number(driverSetting?.commissionPercentage ?? 0) + payload.commissionPercentage > 100) {
        return response.badRequest({
          status: 'error',
          status_code: 400,
          message: 'Driver and owner commissions cannot exceed 100%.',
        })
      }
    }
    agreement.merge({
      ...payload,
      endsAt: payload.endsAt === undefined ? agreement.endsAt : payload.endsAt,
    })
    await agreement.save()
    return response.ok({
      status: 'success',
      status_code: 200,
      message: 'MVest agreement updated successfully.',
      results: agreement,
    })
  }
}
