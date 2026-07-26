import vine from '@vinejs/vine'

export default vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    description: vine.string().trim().nullable().optional(),
    discountValue: vine.number().positive().optional(),
    maximumDiscountAmount: vine.number().min(0).nullable().optional(),
    minimumBookingAmount: vine.number().min(0).optional(),
    globalUsageLimit: vine.number().min(1).nullable().optional(),
    usageLimitPerCustomer: vine.number().min(1).optional(),
    applicableBookingType: vine.enum(['all', 'instant', 'shuttle']).optional(),
    startsAt: vine
      .date({ formats: ['iso8601'] })
      .nullable()
      .optional(),
    endsAt: vine
      .date({ formats: ['iso8601'] })
      .nullable()
      .optional(),
    isActive: vine.boolean().optional(),
  })
)
