import type { HttpContext } from '@adonisjs/core/http'
import Promotion from '#models/promotion'

export default class FetchPromotionsController {
  async handle({ request, response }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Math.min(Number(request.input('limit', 20)), 100)
    const records = await Promotion.query().orderBy('created_at', 'desc').paginate(page, limit)
    return response.ok({
      status: 'success',
      status_code: 200,
      results: records.all(),
      meta: records.getMeta(),
    })
  }
}
