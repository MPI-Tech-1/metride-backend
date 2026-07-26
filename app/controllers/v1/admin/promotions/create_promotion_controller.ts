import type { HttpContext } from '@adonisjs/core/http'
import Promotion from '#models/promotion'
import CreatePromotionRequestValidator from '#validators/v1/admin/promotions/create_promotion_request_validator'

export default class CreatePromotionController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(CreatePromotionRequestValidator)
    const code = payload.code.toUpperCase()
    if (payload.discountType === 'percentage' && payload.discountValue > 100) {
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: 'Percentage cannot exceed 100.',
      })
    }
    if (payload.endsAt && payload.startsAt && payload.endsAt <= payload.startsAt) {
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: 'End date must be after start date.',
      })
    }
    if (await Promotion.query().where('code', code).first()) {
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: 'Promotion code already exists.',
      })
    }
    const promotion = await Promotion.create({
      ...payload,
      code,
      startsAt: payload.startsAt ?? null,
      endsAt: payload.endsAt ?? null,
    })
    return response.created({
      status: 'success',
      status_code: 201,
      message: 'Promotion created successfully.',
      results: promotion,
    })
  }
}
