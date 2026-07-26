import type { HttpContext } from '@adonisjs/core/http'
import MvestOwner from '#models/mvest_owner'
import vine from '@vinejs/vine'

const validator = vine.compile(
  vine.object({
    status: vine.enum(['pending', 'active', 'suspended']),
  })
)

export default class UpdateMvestOwnerController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(validator)
    const owner = await MvestOwner.query().where('identifier', request.param('identifier')).first()
    if (!owner) {
      return response.notFound({
        status: 'error',
        status_code: 404,
        message: 'MVest owner not found.',
      })
    }
    owner.status = payload.status
    await owner.save()
    return response.ok({
      status: 'success',
      status_code: 200,
      message: 'MVest owner updated successfully.',
      results: owner,
    })
  }
}
