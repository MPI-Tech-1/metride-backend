import type { HttpContext } from '@adonisjs/core/http'
import CreateMvestAgreementRequestValidator from '#validators/v1/admin/mvest/create_mvest_agreement_request_validator'
import MvestOwner from '#models/mvest_owner'
import DriverVehicle from '#models/driver_vehicle'
import DriverSetting from '#models/driver_setting'
import MvestVehicleAgreement from '#models/mvest_vehicle_agreement'

export default class CreateMvestAgreementController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(CreateMvestAgreementRequestValidator)
    const owner = await MvestOwner.query().where('identifier', payload.ownerIdentifier).first()
    if (!owner)
      return response.notFound({
        status: 'error',
        status_code: 404,
        message: 'MVest owner not found.',
      })
    if (owner.status !== 'active') {
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: 'MVest owner must be active before creating an agreement.',
      })
    }
    const vehicle = await DriverVehicle.query()
      .where('identifier', payload.driverVehicleIdentifier)
      .first()
    if (!vehicle)
      return response.notFound({
        status: 'error',
        status_code: 404,
        message: 'Driver vehicle not found.',
      })
    const existing = await MvestVehicleAgreement.query()
      .where('driver_vehicle_id', vehicle.id)
      .where('is_active', true)
      .first()
    if (existing)
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: 'Vehicle already has an active MVest agreement.',
      })
    const driverSetting = await DriverSetting.query()
      .where('driver_id', vehicle.driverId)
      .orderBy('created_at', 'desc')
      .first()
    if (Number(driverSetting?.commissionPercentage ?? 0) + payload.commissionPercentage > 100) {
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: 'Driver and owner commissions cannot exceed 100%.',
      })
    }
    if (payload.endsAt && payload.endsAt <= payload.startsAt) {
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: 'End date must be after start date.',
      })
    }
    const agreement = await MvestVehicleAgreement.create({
      mvestOwnerId: owner.id,
      driverVehicleId: vehicle.id,
      commissionPercentage: payload.commissionPercentage,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt ?? null,
      isActive: true,
    })
    return response.created({
      status: 'success',
      status_code: 201,
      message: 'MVest agreement created successfully.',
      results: agreement,
    })
  }
}
