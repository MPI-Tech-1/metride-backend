import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class FetchAvailableMvestVehiclesController {
  async handle({ request, response }: HttpContext) {
    const page = Math.max(Number(request.input('page', 1)), 1)
    const limit = Math.min(Math.max(Number(request.input('limit', 20)), 1), 100)
    const search = String(request.input('search', '')).trim()

    const query = db
      .from('driver_vehicles as dv')
      .join('drivers as d', 'd.id', 'dv.driver_id')
      .leftJoin('vehicle_makes as vm', 'vm.id', 'dv.vehicle_make_id')
      .leftJoin('vehicle_models as vmo', 'vmo.id', 'dv.vehicle_model_id')
      .leftJoin('ride_types as rt', 'rt.id', 'dv.ride_type_id')
      .whereNull('dv.deleted_at')
      .whereNull('d.deleted_at')
      .where('d.status', 'approved')
      .whereNotExists((subquery) => {
        subquery
          .from('mvest_vehicle_agreements as mva')
          .select('mva.id')
          .whereRaw('mva.driver_vehicle_id = dv.id')
          .where('mva.is_active', true)
          .whereNull('mva.deleted_at')
      })

    if (search) {
      query.where((searchQuery) => {
        searchQuery
          .whereLike('dv.plate_number', `%${search}%`)
          .orWhereLike('d.first_name', `%${search}%`)
          .orWhereLike('d.last_name', `%${search}%`)
          .orWhereLike('d.email', `%${search}%`)
      })
    }

    const [vehicles, countRow] = await Promise.all([
      query
        .clone()
        .select(
          'dv.identifier as driver_vehicle_identifier',
          'dv.plate_number',
          'dv.color_of_vehicle',
          'dv.seat_capacity',
          'vm.name as vehicle_make',
          'vmo.name as vehicle_model',
          'rt.name as ride_type',
          'd.identifier as driver_identifier',
          'd.first_name as driver_first_name',
          'd.last_name as driver_last_name',
          'd.email as driver_email'
        )
        .orderBy('dv.created_at', 'desc')
        .limit(limit)
        .offset((page - 1) * limit),
      query.clone().count('* as total').first(),
    ])

    return response.ok({
      status: 'success',
      status_code: 200,
      message: 'Available MVest vehicles fetched successfully.',
      results: vehicles,
      meta: {
        total: Number(countRow?.total ?? 0),
        page,
        perPage: limit,
        lastPage: Math.max(Math.ceil(Number(countRow?.total ?? 0) / limit), 1),
      },
    })
  }
}
