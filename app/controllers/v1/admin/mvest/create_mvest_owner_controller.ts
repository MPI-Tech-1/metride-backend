import type { HttpContext } from '@adonisjs/core/http'
import CreateMvestOwnerRequestValidator from '#validators/v1/admin/mvest/create_mvest_owner_request_validator'
import MvestOwner from '#models/mvest_owner'
import hash from '@adonisjs/core/services/hash'

export default class CreateMvestOwnerController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(CreateMvestOwnerRequestValidator)
    if (await MvestOwner.query().where('email', payload.email).first()) {
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: 'Email address already exists.',
      })
    }
    const owner = await MvestOwner.create({
      ...payload,
      password: await hash.make(payload.password),
    })
    return response.created({
      status: 'success',
      status_code: 201,
      message: 'MVest owner created successfully.',
      results: owner,
    })
  }
}
