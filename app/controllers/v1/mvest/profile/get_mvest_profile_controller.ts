import type { HttpContext } from '@adonisjs/core/http'

export default class GetMvestProfileController {
  async handle({ auth, response }: HttpContext) {
    return response.ok({
      status: 'success',
      status_code: 200,
      results: auth.use('mvestOwner').user!,
    })
  }
}
