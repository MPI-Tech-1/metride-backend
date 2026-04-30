import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const checkoutBookingRequestSchema = vine.object({
  amountPaid: vine.number().min(1),
})

const messages = {
  'amountPaid.required': 'Amount paid is required',
  'amountPaid.min': 'Amount paid must be greater than 0',
}

const CheckoutBookingRequestValidator = vine.compile(checkoutBookingRequestSchema)

CheckoutBookingRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default CheckoutBookingRequestValidator
