import type { HttpContext } from '@adonisjs/core/http'
import PromotionService from '#services/promotion_service'
import ApplyPromotionRequestValidator from '#validators/v1/customer/booking/apply_promotion_request_validator'

export default class ValidatePromotionController {
  async handle({ request, auth, response }: HttpContext) {
    const { code } = await request.validateUsing(ApplyPromotionRequestValidator)

    try {
      const results = await PromotionService.validateCode(auth.use('customer').user!.id, code)

      return response.ok({
        status: 'success',
        status_code: 200,
        message: 'Promotion code is valid.',
        results,
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: error instanceof Error ? error.message : 'Unable to validate promotion.',
      })
    }
  }
}
