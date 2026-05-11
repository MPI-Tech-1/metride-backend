import formatKoboToNairaDisplay from '#common/helper_functions/format_kobo_to_naira_display'

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

function hasEventShape(message: unknown): message is Record<string, unknown> {
  return Boolean(message && typeof message === 'object' && 'eventType' in message && 'booking' in message)
}

const eventTypeEmoji: Record<string, string> = {
  booking_created: '📝',
  driver_assigned: '🚗',
  driver_accepted: '✅',
  driver_cancelled: '🚫',
  booking_rejected: '❌',
  trip_progress_updated: '📍',
  payment_failed: '💳',
  payment_completed: '💰',
  booking_completed: '🎉',
}

function eventEmojiFor(message: Record<string, unknown>): string {
  const key = typeof message.eventType === 'string' ? message.eventType : ''
  return eventTypeEmoji[key] ?? '📋'
}

function formatMetadataValue(key: string, value: unknown): string {
  if (typeof value === 'number' && /amount|price|paid|total/i.test(key)) {
    return formatKoboToNairaDisplay(value)
  }
  return normalizeValue(value)
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

  const emoji = eventEmojiFor(message)
  const headerPlain = `${emoji} ${normalizeValue(message.eventTitle)} | ${normalizeValue(booking.identifier)}`.slice(
    0,
    150
  )

  const blocks: Record<string, unknown>[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: headerPlain,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${emoji} ${normalizeValue(message.summary)}`,
      },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `👤 *Customer*\n${normalizeValue(customer.name)}` },
        { type: 'mrkdwn', text: `📱 *Phone*\n${normalizeValue(customer.phoneNumber)}` },
        { type: 'mrkdwn', text: `📊 *Booking status*\n${normalizeValue(booking.status)}` },
        { type: 'mrkdwn', text: `🛣️ *Trip progress*\n${normalizeValue(booking.tripProgress)}` },
        { type: 'mrkdwn', text: `📍 *Pickup*\n${normalizeValue(booking.departureLocationName)}` },
        { type: 'mrkdwn', text: `🏁 *Dropoff*\n${normalizeValue(booking.destinationLocationName)}` },
      ],
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `🚙 *Ride type*\n${normalizeValue(booking.rideTypeName)}` },
        { type: 'mrkdwn', text: `📅 *Booking type*\n${normalizeValue(booking.typeOfBooking)}` },
        { type: 'mrkdwn', text: `💳 *Payment status*\n${normalizeValue(payment.paymentStatus)}` },
        {
          type: 'mrkdwn',
          text: `💰 *Amount paid*\n${formatKoboToNairaDisplay(payment.amountPaid)}`,
        },
        {
          type: 'mrkdwn',
          text: `🏷️ *Base price*\n${formatKoboToNairaDisplay(payment.basePrice)}`,
        },
        {
          type: 'mrkdwn',
          text: `✂️ *Discount*\n${formatKoboToNairaDisplay(payment.discountAmount)}`,
        },
      ],
    },
  ]

  if (driver.name || driver.phoneNumber) {
    blocks.push({
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `🧑‍✈️ *Driver*\n${normalizeValue(driver.name)}` },
        { type: 'mrkdwn', text: `📱 *Driver phone*\n${normalizeValue(driver.phoneNumber)}` },
      ],
    })
  }

  if (metadataEntries.length > 0) {
    const metadataText = metadataEntries
      .map(([key, value]) => `▸ *${key}:* ${formatMetadataValue(key, value)}`)
      .join('\n')

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `📎 *Additional details*\n${metadataText}`,
      },
    })
  }

  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `🌐 *${environment}* · 🏷️ *${normalizeValue(message.eventType)}* · 🕐 ${timestamp}`,
      },
    ],
  })

  return {
    text: `[${environment}] ${normalizeValue(message.eventTitle)} - ${normalizeValue(booking.identifier)}`,
    blocks,
  }
}
