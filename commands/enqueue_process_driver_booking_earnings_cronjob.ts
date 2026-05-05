import enqueueProcessDriverBookingEarningsCronjob from '#cronjobs/enqueue_process_driver_booking_earnings_cronjob'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class EnqueueProcessDriverBookingEarningsCronjob extends BaseCommand {
  static commandName = 'enqueue:process-driver-booking-earnings-cronjob'
  static description = ''

  static options: CommandOptions = {
    keepAlive: true,
  }

  async run() {
    this.logger.info('Hello world from "EnqueueProcessDriverBookingEarningsCronjob"')

    await enqueueProcessDriverBookingEarningsCronjob()
  }
}
