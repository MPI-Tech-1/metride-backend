import vine from '@vinejs/vine'

export default vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2),
    lastName: vine.string().trim().minLength(2),
    email: vine.string().trim().toLowerCase(),
    mobileNumber: vine.string().trim(),
    password: vine.string().minLength(8),
    status: vine.enum(['pending', 'active', 'suspended']).optional(),
    bankName: vine.string().trim().nullable().optional(),
    accountName: vine.string().trim().nullable().optional(),
    accountNumber: vine.string().trim().nullable().optional(),
  })
)
