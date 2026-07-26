import vine from '@vinejs/vine'

export default vine.compile(vine.object({ code: vine.string().trim().minLength(2).maxLength(50) }))
