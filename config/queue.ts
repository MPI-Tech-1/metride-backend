// import {
//   SEND_ACCOUNT_ACTIVATION_NOTIFICATION_JOB,
//   SEND_RESET_PASSWORD_NOTIFICATION_JOB,
// } from '#jobs/job_queue_names'
import env from '#start/env'
import { defineConfig, drivers } from '@adonisjs/queue'

export default defineConfig({
  default: env.get('QUEUE_DRIVER', 'redis'),

  adapters: {
    redis: drivers.redis({
      connectionName: 'main',
    }),
    sync: drivers.sync(),
  },
  // queues: {
  //   [SEND_ACCOUNT_ACTIVATION_NOTIFICATION_JOB]: {
  //     retry: { maxRetries: 3 },
  //     defaultJobOptions: {
  //       name: SEND_ACCOUNT_ACTIVATION_NOTIFICATION_JOB,
  //       queue: SEND_ACCOUNT_ACTIVATION_NOTIFICATION_JOB,
  //     },
  //   },
  //   [SEND_RESET_PASSWORD_NOTIFICATION_JOB]: {
  //     retry: { maxRetries: 3 },
  //   },
  // },
  worker: {
    concurrency: 5,
    idleDelay: '2s',
    // queues: [SEND_ACCOUNT_ACTIVATION_NOTIFICATION_JOB, SEND_RESET_PASSWORD_NOTIFICATION_JOB],
  },

  locations: ['./app/jobs/**/*.{ts,js}'],
})
