import type { HttpContext } from '@adonisjs/core/http'
import MvestEarning from '#models/mvest_earning'
import { DateTime } from 'luxon'

export default class MarkMvestEarningPaidController {
  async handle({ request, response }: HttpContext) {
    const earning = await MvestEarning.query()
      .where('identifier', request.param('identifier'))
      .first()
    if (!earning)
      return response.notFound({
        status: 'error',
        status_code: 404,
        message: 'MVest earning not found.',
      })
    if (earning.status === 'paid')
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: 'Earning has already been paid.',
      })
    earning.status = 'paid'
    earning.paidAt = DateTime.now()
    await earning.save()
    return response.ok({
      status: 'success',
      status_code: 200,
      message: 'MVest earning marked as paid.',
      results: earning,
    })
  }
}
