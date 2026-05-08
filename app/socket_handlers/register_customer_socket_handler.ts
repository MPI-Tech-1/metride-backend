import { CACHE_DATA_DOES_NOT_EXIST } from '#common/messages/system_messages'
import CacheClient from '#infrastructure_providers/internals/cache_client'
import logApplicationError from '#common/helper_functions/log_application_error'
import type { Socket } from 'socket.io'

export async function registerCustomerSocketHandler(socket: Socket) {
  let registeredCacheKey: string = ''

  socket.on('customer:register', async (bookingId: string) => {
    try {
      if (!bookingId || typeof bookingId !== 'string') {
        console.error('[customer:register] Invalid bookingId =>', bookingId)
        return
      }

      const cacheKey = `customer-websocket:${bookingId}`
      const cachedData = await CacheClient.fetchData(cacheKey)

      if (cachedData === CACHE_DATA_DOES_NOT_EXIST) {
        await CacheClient.saveToCache({
          cacheKey,
          cacheData: socket.id,
        })
      }

      console.log('Customer Registered =>', { bookingId, socketId: socket.id })
      registeredCacheKey = cacheKey
    } catch (error) {
      console.error('[customer:register] Error =>', error)
      await logApplicationError(error)
    }
  })

  socket.on('disconnect', async (reason) => {
    try {
      console.log('[customer:disconnect] Reason =>', reason, '| SocketId =>', socket.id)

      if (registeredCacheKey) {
        await CacheClient.removeSingleRecord(registeredCacheKey)
        console.log('[customer:disconnect] Cache cleared =>', registeredCacheKey)
      }
    } catch (error) {
      console.error('[customer:disconnect] Error clearing cache =>', error)
      await logApplicationError(error)
    }
  })
}
