import loggerConfig from '#config/booking_update_logger'
import env from '#start/env'
import type BookingUpdateLoggerInterface from '#infrastructure_providers/type_checkings/booking_update_logger/booking_update_logger_interface'
import HttpClient from '#infrastructure_providers/internals/http_client'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class SlackBookingUpdateLoggerProvider implements BookingUpdateLoggerInterface {
  private webhookUrl: string = loggerConfig.slack.bookingUpdateWebhookUrl
  private environment = env.get('NODE_ENV')

  public async logError(error: Error): Promise<void> {
    try {
      const timestamp: string = new Date().toISOString()

      const stackTrace: string = (error.stack || 'No stack trace available.').replace(
        /```/g,
        '` ` `'
      )

      const messageBlocks = [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*🚨 [${this.environment}] MET Ride Error Alert*`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:* ${error.message}\n*Stack Trace:*\n\`\`\`\n${stackTrace}\n\`\`\``,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*Timestamp:* ${timestamp}`,
            },
          ],
        },
      ]

      if (this.hasResponse(error)) {
        let responseJson: string
        try {
          responseJson = JSON.stringify(error.response.data, null, 2)
        } catch {
          responseJson = 'Unable to parse response data'
        }

        messageBlocks.splice(2, 0, {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*HTTP Error Response Data:*\n\`\`\`\n${responseJson.replace(/```/g, '` ` `')}\n\`\`\``,
          },
        })
      }

      const payload = {
        text: `🚨 [${this.environment}] MET Ride Error Alert`,
        blocks: messageBlocks,
      }

      await HttpClient.post({
        endpointUrl: this.webhookUrl,
        dataPayload: payload,
      })
    } catch (logErrorException) {
      console.log('SlackLoggerProvider.logError -> ', logErrorException)
      await logApplicationError(logErrorException)
    }
  }

  private hasResponse(error: any): error is { response: { data: any } } {
    return error && typeof error === 'object' && 'response' in error && 'data' in error.response
  }

  public async logPayload(message: any): Promise<void> {
    try {
      const timestamp: string = new Date().toISOString()

      const payload = {
        text: `🚨 [${this.environment}] MET Ride`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*🚨 [${this.environment}] MET Ride Payload Log*`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Message:* \n\`\`\`\n${JSON.stringify(message)}\n\`\`\``,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `*Timestamp:* ${timestamp}`,
              },
            ],
          },
        ],
      }

      await HttpClient.post({
        endpointUrl: this.webhookUrl,
        dataPayload: payload,
      })
    } catch (logPayload) {
      console.log('SlackLoggerProvider.logPayloadError -> ', logPayload)
      await logApplicationError(logPayload)
    }
  }
}
