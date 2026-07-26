import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class FetchMvestOwnerEarningsController {
  async handle({ request, auth, response }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Math.min(Number(request.input('limit', 20)), 100)
    const query = db
      .from('mvest_earnings as me')
      .join('bookings as b', 'b.id', 'me.booking_id')
      .join('driver_vehicles as dv', 'dv.id', 'me.driver_vehicle_id')
      .where('me.mvest_owner_id', auth.use('mvestOwner').user!.id)
      .whereNull('me.deleted_at')
      .select(
        'me.identifier',
        'b.identifier as booking_identifier',
        'dv.identifier as vehicle_identifier',
        'dv.plate_number',
        'me.eligible_amount',
        'me.commission_percentage',
        'me.commission_amount',
        'me.status',
        'me.paid_at',
        'me.created_at'
      )
      .orderBy('me.created_at', 'desc')
    if (request.input('status')) query.where('me.status', request.input('status'))
    if (request.input('vehicleIdentifier'))
      query.where('dv.identifier', request.input('vehicleIdentifier'))
    const offset = (page - 1) * limit
    const [records, countRow] = await Promise.all([
      query.clone().limit(limit).offset(offset),
      query.clone().clearSelect().clearOrder().count('* as total').first(),
    ])
    return response.ok({
      status: 'success',
      status_code: 200,
      results: records,
      meta: { total: Number(countRow?.total ?? 0), page, perPage: limit },
    })
  }
}
