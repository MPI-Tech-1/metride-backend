import vine from '@vinejs/vine'

export default vine.compile(
  vine.object({
    email: vine.string().trim().toLowerCase(),
    password: vine.string(),
  })
)
