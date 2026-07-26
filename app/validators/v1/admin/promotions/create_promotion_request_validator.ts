import vine from '@vinejs/vine'

export default vine.compile(
  vine.object({
    code: vine.string().trim().minLength(2).maxLength(50),
    name: vine.string().trim().minLength(2).maxLength(100),
    description: vine.string().trim().optional(),
    discountType: vine.enum(['percentage', 'fixed']),
    discountValue: vine.number().positive(),
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
