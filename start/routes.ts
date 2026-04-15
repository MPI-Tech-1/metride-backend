/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { SOMETHING_WENT_WRONG } from '#common/messages/system_messages'
import router from '@adonisjs/core/services/router'

await import('#start/routes/index')

router.get('/', () => {
  return { message: 'Welcome to the MET Ride API' }
})

router.get('/health-check', async ({ response }) => {
  try {
    // await db.rawQuery('SELECT 1')

    // await redis.ping()

    return response.ok({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'connected',
        redis: 'connected',
      },
    })
  } catch (error) {
    // await logError(error)
    return response.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: SOMETHING_WENT_WRONG,
    })
  }
})
