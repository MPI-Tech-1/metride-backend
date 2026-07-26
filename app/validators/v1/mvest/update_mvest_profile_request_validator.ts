import vine from '@vinejs/vine'

export default vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).optional(),
    lastName: vine.string().trim().minLength(2).optional(),
    mobileNumber: vine.string().trim().optional(),
    bankName: vine.string().trim().nullable().optional(),
    accountName: vine.string().trim().nullable().optional(),
    accountNumber: vine.string().trim().nullable().optional(),
  })
)
