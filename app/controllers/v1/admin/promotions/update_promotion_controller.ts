import type { HttpContext } from '@adonisjs/core/http'
import Promotion from '#models/promotion'
import UpdatePromotionRequestValidator from '#validators/v1/admin/promotions/update_promotion_request_validator'

export default class UpdatePromotionController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(UpdatePromotionRequestValidator)
    const promotion = await Promotion.query()
      .where('identifier', request.param('identifier'))
      .first()
    if (!promotion)
      return response.notFound({
        status: 'error',
        status_code: 404,
        message: 'Promotion not found.',
      })
    if (
      promotion.discountType === 'percentage' &&
      payload.discountValue &&
      payload.discountValue > 100
    ) {
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: 'Percentage cannot exceed 100.',
      })
    }
    promotion.merge({
      ...payload,
      startsAt: payload.startsAt === undefined ? promotion.startsAt : payload.startsAt,
      endsAt: payload.endsAt === undefined ? promotion.endsAt : payload.endsAt,
    })
    await promotion.save()
    return response.ok({
      status: 'success',
      status_code: 200,
      message: 'Promotion updated successfully.',
      results: promotion,
    })
  }
}
