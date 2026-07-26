import Booking from '#models/booking'
import Promotion from '#models/promotion'
import PromotionRedemption from '#models/promotion_redemption'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class PromotionService {
  static calculateDiscount(promotion: Promotion, baseAmount: number): number {
    const rawDiscount =
      promotion.discountType === 'percentage'
        ? Math.floor((baseAmount * promotion.discountValue) / 100)
        : promotion.discountValue
    const cappedDiscount =
      promotion.maximumDiscountAmount === null
        ? rawDiscount
        : Math.min(rawDiscount, promotion.maximumDiscountAmount)
    return Math.max(0, Math.min(baseAmount, cappedDiscount))
  }

  static async validateCode(customerId: number, rawCode: string) {
    const code = rawCode.trim().toUpperCase()
    const promotion = await Promotion.query().where('code', code).where('is_active', true).first()

    if (!promotion) throw new Error('Promotion code is invalid or inactive.')

    const now = DateTime.now()
    if (promotion.startsAt && promotion.startsAt > now) {
      throw new Error('Promotion has not started.')
    }
    if (promotion.endsAt && promotion.endsAt < now) {
      throw new Error('Promotion has expired.')
    }

    const customerUsageRow = await PromotionRedemption.query()
      .where('promotion_id', promotion.id)
      .where('customer_id', customerId)
      .whereIn('status', ['reserved', 'redeemed'])
      .count('* as total')
      .first()
    if (Number(customerUsageRow?.$extras.total ?? 0) >= promotion.usageLimitPerCustomer) {
      throw new Error('You have reached the usage limit for this promotion.')
    }

    if (promotion.globalUsageLimit !== null) {
      const globalUsageRow = await PromotionRedemption.query()
        .where('promotion_id', promotion.id)
        .whereIn('status', ['reserved', 'redeemed'])
        .count('* as total')
        .first()
      if (Number(globalUsageRow?.$extras.total ?? 0) >= promotion.globalUsageLimit) {
        throw new Error('Promotion usage limit has been reached.')
      }
    }

    return {
      valid: true,
      code: promotion.code,
      name: promotion.name,
      description: promotion.description,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      maximumDiscountAmount: promotion.maximumDiscountAmount,
      minimumBookingAmount: promotion.minimumBookingAmount,
      applicableBookingType: promotion.applicableBookingType,
      startsAt: promotion.startsAt,
      endsAt: promotion.endsAt,
    }
  }

  static async apply(bookingIdentifier: string, customerId: number, rawCode: string) {
    const trx = await db.transaction()
    try {
      const booking = await Booking.query({ client: trx })
        .preload('bookingPayment')
        .where('identifier', bookingIdentifier)
        .where('customer_id', customerId)
        .forUpdate()
        .first()
      if (!booking) throw new Error('Booking not found.')
      const payment = booking.bookingPayment
      if (payment.paymentStatus !== 'pending' || payment.paymentProviderReference) {
        throw new Error('A promotion can only be changed before checkout starts.')
      }

      const code = rawCode.trim().toUpperCase()
      const promotion = await Promotion.query({ client: trx })
        .where('code', code)
        .where('is_active', true)
        .forUpdate()
        .first()
      if (!promotion) throw new Error('Promotion code is invalid or inactive.')

      const now = DateTime.now()
      if (promotion.startsAt && promotion.startsAt > now)
        throw new Error('Promotion has not started.')
      if (promotion.endsAt && promotion.endsAt < now) throw new Error('Promotion has expired.')
      if (
        promotion.applicableBookingType !== 'all' &&
        promotion.applicableBookingType !== booking.typeOfBooking
      ) {
        throw new Error('Promotion does not apply to this booking type.')
      }
      if (payment.basePrice < promotion.minimumBookingAmount) {
        throw new Error('Booking amount is below the promotion minimum.')
      }

      const existing = await PromotionRedemption.query({ client: trx })
        .where('booking_id', booking.id)
        .whereIn('status', ['reserved', 'redeemed'])
        .first()
      if (existing) throw new Error('A promotion is already applied to this booking.')

      const customerUsageRow = await PromotionRedemption.query({ client: trx })
        .where('promotion_id', promotion.id)
        .where('customer_id', customerId)
        .whereIn('status', ['reserved', 'redeemed'])
        .count('* as total')
        .first()
      if (Number(customerUsageRow?.$extras.total ?? 0) >= promotion.usageLimitPerCustomer) {
        throw new Error('You have reached the usage limit for this promotion.')
      }

      if (promotion.globalUsageLimit !== null) {
        const globalUsageRow = await PromotionRedemption.query({ client: trx })
          .where('promotion_id', promotion.id)
          .whereIn('status', ['reserved', 'redeemed'])
          .count('* as total')
          .first()
        if (Number(globalUsageRow?.$extras.total ?? 0) >= promotion.globalUsageLimit) {
          throw new Error('Promotion usage limit has been reached.')
        }
      }

      const discountAmount = this.calculateDiscount(promotion, payment.basePrice)
      if (discountAmount <= 0) throw new Error('Promotion does not provide a discount.')

      const redemption = new PromotionRedemption()
      redemption.useTransaction(trx)
      redemption.merge({
        promotionId: promotion.id,
        customerId,
        bookingId: booking.id,
        bookingPaymentId: payment.id,
        baseAmount: payment.basePrice,
        discountAmount,
        status: 'reserved',
      })
      await redemption.save()

      payment.useTransaction(trx)
      payment.merge({
        promotionId: promotion.id,
        promotionCode: promotion.code,
        discountAmount,
        amountDue: payment.basePrice - discountAmount,
      })
      await payment.save()
      await trx.commit()

      return {
        code: promotion.code,
        basePrice: payment.basePrice,
        discountAmount,
        amountDue: payment.basePrice - discountAmount,
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  static async remove(bookingIdentifier: string, customerId: number) {
    const trx = await db.transaction()
    try {
      const booking = await Booking.query({ client: trx })
        .preload('bookingPayment')
        .where('identifier', bookingIdentifier)
        .where('customer_id', customerId)
        .forUpdate()
        .first()
      if (!booking) throw new Error('Booking not found.')
      const payment = booking.bookingPayment
      if (payment.paymentStatus !== 'pending' || payment.paymentProviderReference) {
        throw new Error('A promotion can only be changed before checkout starts.')
      }
      const redemption = await PromotionRedemption.query({ client: trx })
        .where('booking_id', booking.id)
        .where('status', 'reserved')
        .forUpdate()
        .first()
      if (!redemption) throw new Error('No promotion is applied to this booking.')

      redemption.useTransaction(trx)
      redemption.status = 'released'
      redemption.releasedAt = DateTime.now()
      await redemption.save()

      payment.useTransaction(trx)
      payment.merge({
        promotionId: null,
        promotionCode: null,
        discountAmount: 0,
        amountDue: payment.basePrice,
      })
      await payment.save()
      await trx.commit()
      return { basePrice: payment.basePrice, discountAmount: 0, amountDue: payment.basePrice }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
