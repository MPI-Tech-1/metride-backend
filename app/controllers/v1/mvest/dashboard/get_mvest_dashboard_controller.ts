import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class GetMvestDashboardController {
  async handle({ auth, response }: HttpContext) {
    const ownerId = auth.use('mvestOwner').user!.id
    const [vehicles, earnings] = await Promise.all([
      db
        .from('mvest_vehicle_agreements')
        .where('mvest_owner_id', ownerId)
        .whereNull('deleted_at')
        .countDistinct('driver_vehicle_id as total')
        .sum({ active: db.raw('CASE WHEN is_active = 1 THEN 1 ELSE 0 END') })
        .first(),
      db
        .from('mvest_earnings')
        .where('mvest_owner_id', ownerId)
        .whereNull('deleted_at')
        .count('* as trips')
        .sum('commission_amount as total')
        .sum({ pending: db.raw("CASE WHEN status != 'paid' THEN commission_amount ELSE 0 END") })
        .sum({ paid: db.raw("CASE WHEN status = 'paid' THEN commission_amount ELSE 0 END") })
        .sum({
          current_month: db.raw('CASE WHEN created_at >= ? THEN commission_amount ELSE 0 END', [
            DateTime.now().startOf('month').toSQL(),
          ]),
        })
        .first(),
    ])
    return response.ok({
      status: 'success',
      status_code: 200,
      results: {
        totalVehicles: Number(vehicles?.total ?? 0),
        activeVehicles: Number(vehicles?.active ?? 0),
        totalTrips: Number(earnings?.trips ?? 0),
        totalEarnings: Number(earnings?.total ?? 0),
        pendingEarnings: Number(earnings?.pending ?? 0),
        paidEarnings: Number(earnings?.paid ?? 0),
        currentMonthEarnings: Number(earnings?.current_month ?? 0),
      },
    })
  }
}
