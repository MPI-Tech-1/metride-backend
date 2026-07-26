import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class FetchMvestVehiclesController {
  async handle({ auth, response }: HttpContext) {
    const records = await db
      .from('mvest_vehicle_agreements as mva')
      .join('driver_vehicles as dv', 'dv.id', 'mva.driver_vehicle_id')
      .leftJoin('vehicle_makes as vm', 'vm.id', 'dv.vehicle_make_id')
      .leftJoin('vehicle_models as vmo', 'vmo.id', 'dv.vehicle_model_id')
      .leftJoin('drivers as d', 'd.id', 'dv.driver_id')
      .where('mva.mvest_owner_id', auth.use('mvestOwner').user!.id)
      .whereNull('mva.deleted_at')
      .select(
        'dv.identifier',
        'dv.plate_number',
        'dv.color_of_vehicle',
        'vm.name as make',
        'vmo.name as model',
        'mva.commission_percentage',
        'mva.is_active',
        'd.first_name as driver_first_name',
        'd.last_name as driver_last_name'
      )
      .orderBy('mva.created_at', 'desc')
    return response.ok({ status: 'success', status_code: 200, results: records })
  }
}
