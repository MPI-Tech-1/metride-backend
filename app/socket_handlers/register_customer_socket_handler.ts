import { CACHE_DATA_DOES_NOT_EXIST } from '#common/messages/system_messages'
import CacheClient from '#infrastructure_providers/internals/cache_client'
import type { Socket } from 'socket.io'

export async function registerCustomerSocketHandler(socket: Socket) {
  let registeredCacheKey: string = ''

  socket.on('customer:register', async (bookingId: string) => {
    const cacheKey = `customer-websocket:${bookingId}`

    const cachedData = await CacheClient.fetchData(cacheKey)

    if (cachedData === CACHE_DATA_DOES_NOT_EXIST) {
      await CacheClient.saveToCache({
        cacheKey,
        cacheData: socket.id,
      })
    }

    console.log('Customer Registered => ', { bookingId, socketId: cachedData })

    registeredCacheKey = cacheKey
  })

  socket.on('disconnect', async () => {
    if (registeredCacheKey) {
      await CacheClient.removeSingleRecord(registeredCacheKey)
      console.log('Customer Disconnected => ', { socketId: socket.id })
    }
  })
}
