import vine from '@vinejs/vine'

export default vine.compile(
  vine.object({
    ownerIdentifier: vine.string().trim(),
    driverVehicleIdentifier: vine.string().trim(),
    commissionPercentage: vine.number().min(0).max(100),
    startsAt: vine.date({ formats: ['iso8601'] }),
    endsAt: vine
      .date({ formats: ['iso8601'] })
      .nullable()
      .optional(),
  })
)
