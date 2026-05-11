function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

function hasEventShape(message: unknown): message is Record<string, unknown> {
  return Boolean(message && typeof message === 'object' && 'eventType' in message && 'booking' in message)
}

export default function formatBookingSlackMessage(
  message: unknown,
  environment: string
): { text: string; blocks: Record<string, unknown>[] } {
  const timestamp = new Date().toISOString()

  if (!hasEventShape(message)) {
    return {
      text: `[${environment}] MET Ride Booking Update`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*MET Ride Booking Update*`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `\`\`\`\n${JSON.stringify(message, null, 2).replace(/```/g, '` ` `')}\n\`\`\``,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Environment: ${environment} | Timestamp: ${timestamp}`,
            },
          ],
        },
      ],
    }
  }

  const booking = (message.booking as Record<string, unknown>) || {}
  const customer = (message.customer as Record<string, unknown>) || {}
  const driver = (message.driver as Record<string, unknown>) || {}
  const payment = (message.payment as Record<string, unknown>) || {}
  const metadata = (message.metadata as Record<string, unknown>) || {}

  const metadataEntries = Object.entries(metadata).filter(([, value]) => value !== null && value !== undefined)

  const blocks: Record<string, unknown>[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${normalizeValue(message.eventTitle)} | ${normalizeValue(booking.identifier)}`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: normalizeValue(message.summary),
      },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Customer*\n${normalizeValue(customer.name)}` },
        { type: 'mrkdwn', text: `*Phone*\n${normalizeValue(customer.phoneNumber)}` },
        { type: 'mrkdwn', text: `*Booking Status*\n${normalizeValue(booking.status)}` },
        { type: 'mrkdwn', text: `*Trip Progress*\n${normalizeValue(booking.tripProgress)}` },
        { type: 'mrkdwn', text: `*Pickup*\n${normalizeValue(booking.departureLocationName)}` },
        { type: 'mrkdwn', text: `*Dropoff*\n${normalizeValue(booking.destinationLocationName)}` },
      ],
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Ride Type*\n${normalizeValue(booking.rideTypeName)}` },
        { type: 'mrkdwn', text: `*Booking Type*\n${normalizeValue(booking.typeOfBooking)}` },
        { type: 'mrkdwn', text: `*Payment Status*\n${normalizeValue(payment.paymentStatus)}` },
        { type: 'mrkdwn', text: `*Amount Paid*\n${normalizeValue(payment.amountPaid)}` },
        { type: 'mrkdwn', text: `*Base Price*\n${normalizeValue(payment.basePrice)}` },
        { type: 'mrkdwn', text: `*Discount*\n${normalizeValue(payment.discountAmount)}` },
      ],
    },
  ]

  if (driver.name || driver.phoneNumber) {
    blocks.push({
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Driver*\n${normalizeValue(driver.name)}` },
        { type: 'mrkdwn', text: `*Driver Phone*\n${normalizeValue(driver.phoneNumber)}` },
      ],
    })
  }

  if (metadataEntries.length > 0) {
    const metadataText = metadataEntries
      .map(([key, value]) => `• *${key}:* ${normalizeValue(value)}`)
      .join('\n')

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Additional Details*\n${metadataText}`,
      },
    })
  }

  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Environment: ${environment} | Event: ${normalizeValue(message.eventType)} | Timestamp: ${timestamp}`,
      },
    ],
  })

  return {
    text: `[${environment}] ${normalizeValue(message.eventTitle)} - ${normalizeValue(booking.identifier)}`,
    blocks,
  }
}
