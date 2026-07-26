import { test } from '@japa/runner'
import Promotion from '#models/promotion'
import PromotionService from '#services/promotion_service'

function makePromotion(
  discountType: 'percentage' | 'fixed',
  discountValue: number,
  maximumDiscountAmount: number | null = null
) {
  const promotion = new Promotion()
  promotion.discountType = discountType
  promotion.discountValue = discountValue
  promotion.maximumDiscountAmount = maximumDiscountAmount
  return promotion
}

test.group('PromotionService.calculateDiscount', () => {
  test('calculates a percentage discount in minor units', ({ assert }) => {
    const promotion = makePromotion('percentage', 10)
    assert.equal(PromotionService.calculateDiscount(promotion, 150_000), 15_000)
  })

  test('caps a percentage discount', ({ assert }) => {
    const promotion = makePromotion('percentage', 25, 20_000)
    assert.equal(PromotionService.calculateDiscount(promotion, 100_000), 20_000)
  })

  test('never discounts more than the booking amount', ({ assert }) => {
    const promotion = makePromotion('fixed', 200_000)
    assert.equal(PromotionService.calculateDiscount(promotion, 75_000), 75_000)
  })
})
