import type { HttpContext } from '@adonisjs/core/http'
import PromotionService from '#services/promotion_service'

export default class RemoveBookingPromotionController {
  async handle({ request, auth, response }: HttpContext) {
    try {
      const results = await PromotionService.remove(
        request.param('bookingIdentifier'),
        auth.use('customer').user!.id
      )
      return response.ok({
        status: 'success',
        status_code: 200,
        message: 'Promotion removed successfully.',
        results,
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: error instanceof Error ? error.message : 'Unable to remove promotion.',
      })
    }
  }
}
