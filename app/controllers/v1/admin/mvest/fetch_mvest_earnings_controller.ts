import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class FetchMvestEarningsController {
  async handle({ request, response }: HttpContext) {
    const page = Math.max(Number(request.input('page', 1)), 1)
    const limit = Math.min(Math.max(Number(request.input('limit', 20)), 1), 100)
    const ownerIdentifier = String(request.input('ownerIdentifier', '')).trim()
    const status = String(request.input('status', '')).trim()

    const query = db
      .from('mvest_earnings as me')
      .join('mvest_owners as mo', 'mo.id', 'me.mvest_owner_id')
      .join('mvest_vehicle_agreements as mva', 'mva.id', 'me.mvest_vehicle_agreement_id')
      .join('driver_vehicles as dv', 'dv.id', 'me.driver_vehicle_id')
      .join('bookings as b', 'b.id', 'me.booking_id')
      .leftJoin('drivers as d', 'd.id', 'dv.driver_id')
      .leftJoin('vehicle_makes as vm', 'vm.id', 'dv.vehicle_make_id')
      .leftJoin('vehicle_models as vmo', 'vmo.id', 'dv.vehicle_model_id')
      .leftJoin('ride_types as rt', 'rt.id', 'dv.ride_type_id')
      .whereNull('me.deleted_at')
      .whereNull('mo.deleted_at')

    if (ownerIdentifier) query.where('mo.identifier', ownerIdentifier)
    if (status) query.where('me.status', status)

    const [records, countRow, summaryRow] = await Promise.all([
      query
        .clone()
        .select(
          'me.identifier',
          'me.eligible_amount',
          'me.commission_percentage',
          'me.commission_amount',
          'me.status',
          'me.paid_at',
          'me.created_at',
          'mo.identifier as owner_identifier',
          'mo.first_name as owner_first_name',
          'mo.last_name as owner_last_name',
          'mo.email as owner_email',
          'mo.mobile_number as owner_mobile_number',
          'mo.status as owner_status',
          'mva.identifier as agreement_identifier',
          'dv.identifier as vehicle_identifier',
          'dv.plate_number',
          'dv.color_of_vehicle',
          'vm.name as vehicle_make',
          'vmo.name as vehicle_model',
          'rt.name as ride_type',
          'd.identifier as driver_identifier',
          'd.first_name as driver_first_name',
          'd.last_name as driver_last_name',
          'b.identifier as booking_identifier',
          'b.type_of_booking',
          'b.status as booking_status',
          'b.date_of_ride',
          'b.departure_location_name',
          'b.destination_location_name'
        )
        .orderBy('me.created_at', 'desc')
        .limit(limit)
        .offset((page - 1) * limit),
      query.clone().count('* as total').first(),
      query
        .clone()
        .select(
          db.raw('COALESCE(SUM(me.eligible_amount), 0) as total_eligible_amount'),
          db.raw('COALESCE(SUM(me.commission_amount), 0) as total_commission_amount'),
          db.raw(
            "COALESCE(SUM(CASE WHEN me.status != 'paid' THEN me.commission_amount ELSE 0 END), 0) as pending_amount"
          ),
          db.raw(
            "COALESCE(SUM(CASE WHEN me.status = 'paid' THEN me.commission_amount ELSE 0 END), 0) as paid_amount"
          )
        )
        .first(),
    ])

    const results = records.map((record) => ({
      identifier: record.identifier,
      eligibleAmount: Number(record.eligible_amount),
      commissionPercentage: Number(record.commission_percentage),
      commissionAmount: Number(record.commission_amount),
      status: record.status,
      paidAt: record.paid_at,
      createdAt: record.created_at,
      owner: {
        identifier: record.owner_identifier,
        firstName: record.owner_first_name,
        lastName: record.owner_last_name,
        email: record.owner_email,
        mobileNumber: record.owner_mobile_number,
        status: record.owner_status,
      },
      agreement: {
        identifier: record.agreement_identifier,
      },
      vehicle: {
        identifier: record.vehicle_identifier,
        plateNumber: record.plate_number,
        color: record.color_of_vehicle,
        make: record.vehicle_make,
        model: record.vehicle_model,
        rideType: record.ride_type,
      },
      driver: record.driver_identifier
        ? {
            identifier: record.driver_identifier,
            firstName: record.driver_first_name,
            lastName: record.driver_last_name,
          }
        : null,
      booking: {
        identifier: record.booking_identifier,
        type: record.type_of_booking,
        status: record.booking_status,
        dateOfRide: record.date_of_ride,
        departureLocationName: record.departure_location_name,
        destinationLocationName: record.destination_location_name,
      },
    }))

    const total = Number(countRow?.total ?? 0)
    return response.ok({
      status: 'success',
      status_code: 200,
      message: 'MVest earnings fetched successfully.',
      results,
      summary: {
        totalRecords: total,
        totalEligibleAmount: Number(summaryRow?.total_eligible_amount ?? 0),
        totalCommissionAmount: Number(summaryRow?.total_commission_amount ?? 0),
        pendingAmount: Number(summaryRow?.pending_amount ?? 0),
        paidAmount: Number(summaryRow?.paid_amount ?? 0),
      },
      meta: {
        total,
        page,
        perPage: limit,
        lastPage: Math.max(Math.ceil(total / limit), 1),
      },
    })
  }
}
