/*
|--------------------------------------------------------------------------
| Scheduler
|--------------------------------------------------------------------------
|
| This file is used to define scheduled jobs. You can schedule jobs to run
| at specific intervals using cron expressions or duration strings.
|
| Schedules are upserted by id, so re-running this file on every boot does
| not create duplicates. The worker (`node ace queue:work`) executes them.
|
*/

import ProcessDriverOnlineRewardsJob from '#jobs/background_processing/driver/process_driver_online_rewards_job'
import logApplicationError from '#common/helper_functions/log_application_error'

try {
  await ProcessDriverOnlineRewardsJob.schedule({})
    .id('driver-online-rewards')
    .every('15m')
    .timezone('Africa/Lagos')
    .run()
} catch (schedulerError) {
  console.log('Scheduler error -> ', schedulerError)
  await logApplicationError(schedulerError)
}
