/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

await import('#start/routes/index')

router.get('/', () => {
  return { message: 'Welcome to the MET Ride API' }
})
