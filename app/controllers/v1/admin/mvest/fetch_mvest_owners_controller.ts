import type { HttpContext } from '@adonisjs/core/http'
import MvestOwner from '#models/mvest_owner'

export default class FetchMvestOwnersController {
  async handle({ request, response }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Math.min(Number(request.input('limit', 20)), 100)
    const query = MvestOwner.query()
    if (request.input('status')) query.where('status', request.input('status'))
    const search = String(request.input('search', '')).trim()
    if (search) {
      query.where((searchQuery) => {
        searchQuery
          .whereILike('first_name', `%${search}%`)
          .orWhereILike('last_name', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
          .orWhereILike('mobile_number', `%${search}%`)
      })
    }
    const records = await query.orderBy('created_at', 'desc').paginate(page, limit)
    return response.ok({
      status: 'success',
      status_code: 200,
      results: records.all(),
      meta: records.getMeta(),
    })
  }
}
