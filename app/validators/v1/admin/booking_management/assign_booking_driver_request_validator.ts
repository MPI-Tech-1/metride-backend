import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const assignBookingDriverRequestSchema = vine.object({
  driverIdentifier: vine
    .string()
    .trim()
    .exists(async (db, value) => {
      const driver = await db.from('drivers').select('*').where('identifier', value).first()

      return driver ? true : false
    }),
})

const messages = {
  'driverIdentifier.required': 'Driver identifier is required.',
}

const AssignBookingDriverRequestValidator = vine.compile(assignBookingDriverRequestSchema)

AssignBookingDriverRequestValidator.messagesProvider = new SimpleMessagesProvider(messages)

export default AssignBookingDriverRequestValidator
